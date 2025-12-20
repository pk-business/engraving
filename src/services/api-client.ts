import axios from 'axios';

// Default to the deployed Render service; override with `VITE_STRAPI_URL` in `.env.local` for other environments
const STRAPI_URL = (import.meta.env.VITE_STRAPI_URL as string) || 'https://pk-engrave-service.onrender.com';

export const api = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple request/response logging for debugging network and populate issues.
// You can remove or disable this in production.
api.interceptors.request.use((cfg) => {
  try {
    const url = `${cfg.baseURL || ''}${cfg.url}`;
    console.info('[API] Request:', url, cfg.method, cfg.params ?? {});
  } catch {
    // ignore logging errors
  }
  return cfg;
});

api.interceptors.response.use(
  (res) => {
    try {
      const url = `${res.config.baseURL || ''}${res.config.url}`;
      const body = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
      const truncated = body.length > 2000 ? body.slice(0, 2000) + '...[truncated]' : body;
      console.info('[API] Response:', res.status, url, truncated);
    } catch {
      // ignore
    }
    return res;
  },
  (err) => {
    try {
      const cfg = err.config || {};
      const url = `${cfg.baseURL || ''}${cfg.url || ''}`;
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.warn('[API] Error:', status, url, data);
    } catch {
      // ignore
    }
    return Promise.reject(err);
  }
);

type AuthHeaders = {
  headers?: {
    Authorization: string;
  };
};

/**
 * Return authorization headers for server-side or proxy calls.
 * NOTE: Do not put a Strapi token into a VITE_ variable for client-side use.
 */
export function withAuth(token?: string | null): AuthHeaders {
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export default api;
