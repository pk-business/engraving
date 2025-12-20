# Scripts

## import-to-strapi

This repository includes a helper script `scripts/import-to-strapi.js` to seed a Strapi (v4) instance from the local `db.json`.

Important notes:

- The script requires a Strapi API token with permissions to create entries (`STRAPI_API_TOKEN`).
- Do NOT put that token into a `VITE_` variable — that would expose it to the browser. Use `STRAPI_API_TOKEN` (server-side only).

Usage (local):

1. Copy the example env and edit (do not commit real secrets):

```bash
cp .env.local.example .env.local
# then edit .env.local and add STRAPI_API_TOKEN and STRAPI_API_URL (if needed)
```

2. Or export the token in your shell for the session:

```bash
export STRAPI_API_TOKEN="your_token_here"
export STRAPI_API_URL="http://localhost:1337"
```

3. Install `node-fetch` if your Node runtime lacks global `fetch`:

```bash
npm install node-fetch
```

4. Run the import script:

```bash
npm run import:strapi
```

Behavior:

- The script will create `materials`, `categories`, and `occasions` entries (if missing) and then create `products` linking to those relations.
- It assumes your Strapi content types have the expected fields (`name` for taxonomy types; `products` fields matching the keys in `db.json`). Adjust the script if your schema differs.

If you want a safer, repeatable migration you can also create Strapi fixtures or use the Strapi CLI/Content Type Builder to define content-types first.
