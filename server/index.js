import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

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

const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, () => {
  console.log(`Strapi proxy listening on http://localhost:${PORT}`);
  console.log(`Forwarding to Strapi at: ${STRAPI_URL}`);
});
