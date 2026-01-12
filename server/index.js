import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const STRAPI_URL = process.env.STRAPI_API_URL || process.env.VITE_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || null;

if (!STRAPI_TOKEN) {
  console.warn('Warning: STRAPI_API_TOKEN not set. Proxy will forward unauthenticated requests.');
}

const forward = async (req, res, targetPath) => {
  try {
    const url = `${STRAPI_URL.replace(/\/$/, '')}${targetPath}`;
    const resp = await axios.request({
      url,
      method: req.method,
      headers: {
        ...(req.headers || {}),
        // override host/connection related headers to avoid issues
        host: undefined,
        connection: undefined,
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      params: req.query,
      data: req.body,
      responseType: 'json',
      validateStatus: () => true,
    });

    res.status(resp.status).set(resp.headers).send(resp.data);
  } catch (err) {
    console.error('Proxy error:', err?.response?.data || err.message || err);
    const status = err?.response?.status || 500;
    res.status(status).json({ error: 'Proxy error', detail: err?.response?.data || err.message });
  }
};

// Specific product routes convenience
app.get('/proxy/products', (req, res) => forward(req, res, '/api/products'));
app.get('/proxy/products/:id', (req, res) => forward(req, res, `/api/products/${req.params.id}`));

// Generic proxy for other Strapi API endpoints (strip leading /proxy)
app.use('/proxy', (req, res) => {
  const targetPath = req.path === '/' ? '/api' : `/api${req.path}`;
  return forward(req, res, targetPath);
});

// Email notification endpoint for new comments
app.post('/api/email/comment-notification', async (req, res) => {
  try {
    const { blogPostId, author, email, content, parentCommentId, adminEmail } = req.body;

    // Validate required fields
    if (!blogPostId || !author || !email || !content || !adminEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch blog post details from Strapi
    let blogPostTitle = 'Unknown Blog Post';
    try {
      const blogPostResponse = await axios.get(`${STRAPI_URL}/api/blog-posts/${blogPostId}`);
      blogPostTitle = blogPostResponse.data.data.title || 'Unknown Blog Post';
    } catch (err) {
      console.error('Error fetching blog post:', err.message);
    }

    // Configure email transporter
    // For development, you can use services like Gmail, SendGrid, or Mailgun
    // Make sure to set these environment variables in your .env file
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // Your email
        pass: process.env.SMTP_PASS, // Your email password or app password
      },
    });

    // Email content
    const commentType = parentCommentId ? 'reply' : 'comment';
    const subject = `New ${commentType} on blog post: ${blogPostTitle}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 10px;">
        <h2 style="color: #2FA4A9; margin-bottom: 20px;">New ${
          commentType.charAt(0).toUpperCase() + commentType.slice(1)
        } Notification</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Blog Post:</h3>
          <p style="color: #555; font-size: 16px;"><strong>${blogPostTitle}</strong></p>
          
          <h3 style="color: #333; margin-top: 20px;">From:</h3>
          <p style="color: #555;"><strong>${author}</strong> (${email})</p>
          
          <h3 style="color: #333; margin-top: 20px;">Comment:</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${content}</p>
          
          ${
            parentCommentId
              ? `<p style="color: #9ca3af; font-size: 14px; margin-top: 15px;"><em>This is a reply to comment #${parentCommentId}</em></p>`
              : ''
          }
        </div>
        
        <div style="background: #e0f2f1; padding: 15px; border-radius: 8px; border-left: 4px solid #2FA4A9;">
          <p style="margin: 0; color: #2FA4A9; font-weight: 600;">
            Please log in to your Strapi admin panel to approve or moderate this ${commentType}.
          </p>
        </div>
        
        <p style="color: #9ca3af; font-size: 12px; margin-top: 20px; text-align: center;">
          This is an automated notification from your blog comment system.
        </p>
      </div>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Blog Comment System" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: subject,
      html: htmlContent,
    });

    console.log('Email sent:', info.messageId);
    res.status(200).json({ success: true, message: 'Email notification sent' });
  } catch (error) {
    console.error('Error sending email notification:', error);
    // Don't fail the request if email fails
    res.status(200).json({
      success: false,
      message: 'Comment saved but email notification failed',
      error: error.message,
    });
  }
});

const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, () => {
  console.log(`Strapi proxy listening on http://localhost:${PORT}`);
  console.log(`Forwarding to Strapi at: ${STRAPI_URL}`);
});
