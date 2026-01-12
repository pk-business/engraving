# Blog Features Implementation - Newsletter & Comments

## Features Implemented

### 1. Newsletter Subscription
- **Location**: Footer component
- **Functionality**: 
  - Users can subscribe by entering their email address
  - Email validation before submission
  - Duplicate email detection
  - Success/error feedback messages
  - Data is saved to Strapi `subscribers` content type

### 2. Comment System with Replies
- **Location**: Blog Detail Page
- **Features**:
  - Post comments on blog posts
  - Reply to existing comments (nested replies)
  - Comment approval system (moderation)
  - Only approved comments are displayed to users
  - New comments require approval before appearing

### 3. Email Notifications
- **Location**: Backend server (`server/index.js`)
- **Functionality**:
  - Admin receives email when new comments are posted
  - Email includes:
    - Blog post title
    - Commenter name and email
    - Comment content
    - Indication if it's a reply
  - Emails sent to: `premkarki.business@gmail.com`

## Setup Instructions

### 1. Install Required Dependencies

```bash
npm install nodemailer
```

### 2. Configure Environment Variables

Create or update your `.env` file with the following SMTP configuration:

```env
# Strapi Configuration
STRAPI_API_URL=https://pk-engrave-service.onrender.com
STRAPI_API_TOKEN=your-strapi-api-token-here

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here
```

#### Setting up Gmail App Password:

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Use this password in `SMTP_PASS`

**Alternative Email Services:**
- **SendGrid**: Use their SMTP credentials
- **Mailgun**: Use their SMTP credentials  
- **AWS SES**: Configure with AWS SMTP credentials

### 3. Strapi Content Types Configuration

Ensure the following content types are set up in Strapi:

#### A. Blog-Post Content Type
Already configured with fields: title, slug, description, content, author, category, tags, coverImage

#### B. Comment Content Type
Fields required:
- `content` (Text, Long text)
- `author` (Text)
- `email` (Email)
- `blogPost` (Relation: Many-to-One with blog-post)
- `parentComment` (Relation: Many-to-One with comment - for replies)
- `approved` (Boolean, default: false)

**Permissions:**
- Public role: Create (so users can post comments)
- Public role: Find with filter `approved: true` (only show approved comments)

#### C. Subscriber Content Type
Fields required:
- `email` (Email, unique, required)
- `subscribedAt` (DateTime)

**Permissions:**
- Public role: Create (so users can subscribe)
- Public role: Find with email filter (to check duplicates)

### 4. Start the Development Server

```bash
# Start the backend server (for email notifications)
npm run start:server

# In another terminal, start the frontend
npm run dev
```

## Testing the Features

### Test Newsletter Subscription:
1. Scroll to the footer
2. Enter your email address
3. Click "Subscribe"
4. Check for success message
5. Verify in Strapi admin that the subscriber was created

### Test Comment System:
1. Navigate to any blog post
2. Fill in the comment form (name, email, comment)
3. Click "Post Comment"
4. You should see "Comment submitted successfully! It will appear after approval."
5. Check your email (`premkarki.business@gmail.com`) for the notification
6. Log in to Strapi admin
7. Navigate to Comments content type
8. Find the new comment and set `approved` to true
9. Refresh the blog page - the comment should now appear

### Test Comment Replies:
1. On a blog post with an approved comment
2. Click the "Reply" button on a comment
3. Fill in the reply form
4. Submit the reply
5. Check email notification
6. Approve in Strapi
7. Refresh - reply should appear nested under the parent comment

## Production Deployment

### Environment Variables for Production:
Make sure to set all environment variables in your hosting platform:
- Render, Vercel, Netlify: Add env vars in dashboard
- Update SMTP credentials for production email service
- Ensure STRAPI_API_URL points to production Strapi instance

### Security Considerations:
1. **Never commit** `.env` file to Git
2. Use **app-specific passwords** for Gmail (not your actual password)
3. Consider using a dedicated email service (SendGrid, Mailgun) for production
4. Rate limit the comment endpoint to prevent spam
5. Add CAPTCHA for comment submission (optional enhancement)

## Troubleshooting

### Email Not Sending:
- Check SMTP credentials are correct
- Verify firewall/port settings (port 587 or 465)
- Check email service logs
- For Gmail: Ensure "Less secure app access" is enabled or use app password
- Try with a different email service

### Comments Not Appearing:
- Check if `approved` is set to `true` in Strapi
- Verify public role has Find permission with approved filter
- Check browser console for API errors
- Ensure blogPost relation is properly set

### Newsletter Subscription Failing:
- Check Strapi public role has Create permission for subscribers
- Verify email field is properly configured
- Check for duplicate emails

## Future Enhancements

1. **Email Templates**: Create better HTML templates for notifications
2. **Spam Protection**: Add CAPTCHA or rate limiting
3. **Comment Editing**: Allow users to edit their own comments
4. **Comment Likes**: Add like/upvote functionality
5. **Email Verification**: Verify subscriber emails before adding to list
6. **Unsubscribe Link**: Add unsubscribe functionality in newsletter emails
7. **Rich Text Comments**: Support markdown or basic formatting in comments
8. **Admin Dashboard**: Create a comment moderation interface in the app

## Files Modified/Created

### New Files:
- `src/services/subscriber.service.ts` - Newsletter subscription service
- `BLOG_FEATURES_SETUP.md` - This documentation

### Modified Files:
- `src/types/blog.types.ts` - Added parentComment, approved fields
- `src/services/blog.service.ts` - Added reply and approval support
- `src/components/Footer/Footer.tsx` - Added subscription form
- `src/components/Footer/Footer.css` - Added subscription styling
- `src/pages/BlogDetailPage/BlogDetailPage.tsx` - Added reply functionality
- `src/pages/BlogDetailPage/BlogDetailPage.css` - Added reply styling
- `server/index.js` - Added email notification endpoint

## API Endpoints

### Newsletter Subscription:
```
POST https://pk-engrave-service.onrender.com/api/subscribers
Body: {
  "data": {
    "email": "user@example.com",
    "subscribedAt": "2026-01-12T00:00:00.000Z"
  }
}
```

### Create Comment:
```
POST https://pk-engrave-service.onrender.com/api/comments
Body: {
  "data": {
    "content": "Great post!",
    "author": "John Doe",
    "email": "john@example.com",
    "blogPost": 2,
    "approved": false
  }
}
```

### Create Reply:
```
POST https://pk-engrave-service.onrender.com/api/comments
Body: {
  "data": {
    "content": "Thanks for your comment!",
    "author": "Jane Doe",
    "email": "jane@example.com",
    "blogPost": 2,
    "parentComment": 5,
    "approved": false
  }
}
```

### Email Notification (Internal):
```
POST http://localhost:5000/api/email/comment-notification
Body: {
  "blogPostId": 2,
  "author": "John Doe",
  "email": "john@example.com",
  "content": "Great post!",
  "adminEmail": "premkarki.business@gmail.com"
}
```
