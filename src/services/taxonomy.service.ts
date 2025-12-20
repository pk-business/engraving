import api from './api-client';

const USE_PROXY = (import.meta.env.VITE_USE_PROXY as string) === 'true';

function apiPath(path: string) {
  if (USE_PROXY) return `/proxy${path}`;
  return `/api${path}`;
}

export type TaxonomyItem = {
  id: number | string;
  name: string;
  slug?: string | null;
};

function mapStrapiTaxonomy(item: any): TaxonomyItem {
  // Support both Strapi nested attributes and flattened items
  const attrs = item?.attributes || item || {};
  const id = item?.id ?? attrs?.id ?? null;
  return {
    id,
    name: attrs.name || attrs.title || '',
    slug: attrs.slug ?? null,
  };
}

async function fetchTaxonomy(collection: string): Promise<TaxonomyItem[]> {
  try {
    const res = await api.get(apiPath(`/${collection}`));
    const payload = res.data;
    const raw = payload?.data || [];
    return raw.map((r: any) => mapStrapiTaxonomy(r));
  } catch (err: any) {
    console.error(`Error fetching ${collection}:`, err?.response?.status, err?.response?.data || err?.message);
    return [];
  }
}

export async function getCategories(): Promise<TaxonomyItem[]> {
  if (_cachedCategories) return _cachedCategories;
  const { categories } = await getAllTaxonomies();
  return categories;
}

export async function getMaterials(): Promise<TaxonomyItem[]> {
  if (_cachedMaterials) return _cachedMaterials;
  const { materials } = await getAllTaxonomies();
  return materials;
}

export async function getOccasions(): Promise<TaxonomyItem[]> {
  if (_cachedOccasions) return _cachedOccasions;
  const { occasions } = await getAllTaxonomies();
  return occasions;
}

// Simple in-memory cache so each taxonomy is fetched only once per session.
let _cachedMaterials: TaxonomyItem[] | null = null;
let _cachedOccasions: TaxonomyItem[] | null = null;
let _cachedCategories: TaxonomyItem[] | null = null;

export async function getAllTaxonomies(): Promise<{
  materials: TaxonomyItem[];
  occasions: TaxonomyItem[];
  categories: TaxonomyItem[];
}> {
  // 1) In-memory cache (fast, per-page)
  if (_cachedMaterials && _cachedOccasions && _cachedCategories) {
    return {
      materials: _cachedMaterials,
      occasions: _cachedOccasions,
      categories: _cachedCategories,
    };
  }

  // 2) Try persisted cache in localStorage
  try {
    const key = 'taxonomies:v1';
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as {
        ts: number;
        materials: TaxonomyItem[];
        occasions: TaxonomyItem[];
        categories: TaxonomyItem[];
      };
      const TTL = parseInt((import.meta.env.VITE_TAXONOMY_TTL_SECONDS as string) || '86400', 10) * 1000; // default 24h
      if (parsed && parsed.ts && Date.now() - parsed.ts < TTL) {
        _cachedMaterials = parsed.materials;
        _cachedOccasions = parsed.occasions;
        _cachedCategories = parsed.categories;
        return { materials: _cachedMaterials, occasions: _cachedOccasions, categories: _cachedCategories };
      }
    }
  } catch (e) {
    // ignore localStorage errors
  }

  // 3) Network fallback — fetch and persist
  const [materials, occasions, categories] = await Promise.all([
    _cachedMaterials ? Promise.resolve(_cachedMaterials) : fetchTaxonomy('materials'),
    _cachedOccasions ? Promise.resolve(_cachedOccasions) : fetchTaxonomy('occasions'),
    _cachedCategories ? Promise.resolve(_cachedCategories) : fetchTaxonomy('categories'),
  ]);

  _cachedMaterials = materials;
  _cachedOccasions = occasions;
  _cachedCategories = categories;

  // persist to localStorage
  try {
    const key = 'taxonomies:v1';
    const payload = { ts: Date.now(), materials, occasions, categories };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (e) {
    // ignore storage failures
  }

  return { materials, occasions, categories };
}

// Optional: allow manual cache invalidation if you update taxonomies server-side
export function invalidateTaxonomyCache() {
  _cachedMaterials = null;
  _cachedOccasions = null;
  _cachedCategories = null;
}

// Also clear persisted cache
export function invalidatePersistedTaxonomyCache() {
  invalidateTaxonomyCache();
  try {
    localStorage.removeItem('taxonomies:v1');
  } catch (e) {
    // ignore
  }
}

export default {
  getCategories,
  getMaterials,
  getOccasions,
};
