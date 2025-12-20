# Strapi Proxy Server

This small Express server forwards selected calls to your Strapi instance and attaches the `STRAPI_API_TOKEN` server-side, so tokens are not exposed to the browser.

## Environment
- `STRAPI_API_URL` (optional) — Strapi base URL, default `http://localhost:1337`.
- `STRAPI_API_TOKEN` (recommended) — Strapi API token with appropriate scopes for actions the proxy will perform.
- `PORT` (optional) — port to run the proxy on (default `5000`).

## Scripts
Start the proxy:

```bash
# set the token in your shell for the session
export STRAPI_API_TOKEN="your_token_here"
export STRAPI_API_URL="http://localhost:1337"
npm run start:server
```

## Endpoints
- `GET /proxy/products` -> forwards to Strapi `/api/products` (accepts same query params: populate, pagination, filters)
- `GET /proxy/products/:id` -> forwards to `/api/products/:id`
- `ANY /proxy/*` -> generic forward to `/api/*` (use with caution)

## Notes
- This server is minimal and intended for local development and small deployments. For production consider adding rate-limiting, request validation, stricter CORS, and authentication for your frontend clients.
