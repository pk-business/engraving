#!/usr/bin/env node
// Simple import script to seed Strapi from the local `db.json` file.
// Usage: set STRAPI_API_TOKEN and optionally STRAPI_API_URL, then run:
//   npm run import:strapi

import fs from 'fs/promises';

const { STRAPI_API_TOKEN, STRAPI_API_URL = 'http://localhost:1337' } = process.env;

if (!STRAPI_API_TOKEN) {
  console.error('ERROR: STRAPI_API_TOKEN not set. Export it or use a .env loader before running this script.');
  console.error('See scripts/README.md for details.');
  process.exit(1);
}

let fetchFn = global.fetch;
if (!fetchFn) {
  try {
    const mod = await import('node-fetch');
    fetchFn = mod.default;
  } catch (err) {
    console.error('Global `fetch` is not available in this Node runtime.');
    console.error('Install node-fetch: `npm install node-fetch` and try again.');
    process.exit(1);
  }
}

const headers = {
  Authorization: `Bearer ${STRAPI_API_TOKEN}`,
  'Content-Type': 'application/json',
};

async function get(path) {
  const res = await fetchFn(`${STRAPI_API_URL}${path}`, { headers });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`GET ${path} failed: ${res.status} ${txt}`);
  }
  return res.json();
}

async function post(path, body) {
  const res = await fetchFn(`${STRAPI_API_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`POST ${path} failed: ${res.status} ${txt}`);
  }
  return res.json();
}

async function ensureEntry(collection, name) {
  // Try to find existing entry by name
  const filterPath = `/api/${collection}?filters[name][$eq]=${encodeURIComponent(name)}`;
  const found = await get(filterPath);
  const data = found?.data || [];
  if (data.length > 0) return data[0].id;

  // Create new entry
  const created = await post(`/api/${collection}`, { data: { name } });
  return created?.data?.id;
}

async function importAll() {
  const raw = await fs.readFile(new URL('../db.json', import.meta.url), 'utf-8');
  const db = JSON.parse(raw);
  const products = db.products || [];

  console.log(`Seeding ${products.length} products to Strapi at ${STRAPI_API_URL}`);

  // Cache maps
  const categoryMap = new Map();
  const occasionMap = new Map();
  const materialMap = new Map();

  for (const p of products) {
    // Ensure material
    if (p.material) {
      if (!materialMap.has(p.material)) {
        const id = await ensureEntry('materials', p.material);
        materialMap.set(p.material, id);
        console.log(`Material: ${p.material} -> ${id}`);
      }
    }

    // Ensure categories
    if (Array.isArray(p.categories)) {
      for (const c of p.categories) {
        if (!categoryMap.has(c)) {
          const id = await ensureEntry('categories', c);
          categoryMap.set(c, id);
          console.log(`Category: ${c} -> ${id}`);
        }
      }
    }

    // Ensure occasions
    if (Array.isArray(p.occasions)) {
      for (const o of p.occasions) {
        if (!occasionMap.has(o)) {
          const id = await ensureEntry('occasions', o);
          occasionMap.set(o, id);
          console.log(`Occasion: ${o} -> ${id}`);
        }
      }
    }
  }

  // Now create products
  for (const p of products) {
    const categories = (p.categories || []).map((c) => categoryMap.get(c)).filter(Boolean);
    const occasions = (p.occasions || []).map((o) => occasionMap.get(o)).filter(Boolean);
    const material = p.material ? materialMap.get(p.material) : undefined;

    const productPayload = {
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        images: p.images || [],
        customizable: !!p.customizable,
        sizes: p.sizes || [],
        inStock: p.inStock !== undefined ? p.inStock : true,
        rating: p.rating || 0,
        reviewCount: p.reviewCount || 0,
      },
    };

    if (categories.length) productPayload.data.categories = categories;
    if (occasions.length) productPayload.data.occasions = occasions;
    if (material) productPayload.data.material = material;

    try {
      const created = await post('/api/products', productPayload);
      console.log(`Created product: ${p.name} (id=${created?.data?.id})`);
    } catch (err) {
      console.error(`Failed to create product ${p.name}:`, err.message || err);
    }
  }

  console.log('Import complete.');
}

importAll().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
