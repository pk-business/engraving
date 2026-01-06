import api from './api-client';
import { isMockDataEnabled } from '../utils/runtimeFlags';

const USE_PROXY = (import.meta.env.VITE_USE_PROXY as string) === 'true';
const rawApiPrefix = (import.meta.env.VITE_API_PREFIX as string) ?? '/api';
const API_PREFIX =
  !rawApiPrefix || rawApiPrefix === '/' ? '' : rawApiPrefix.startsWith('/') ? rawApiPrefix : `/${rawApiPrefix}`;
const USE_MOCK_DATA = isMockDataEnabled();
const IS_STRAPI_API = !USE_MOCK_DATA && API_PREFIX !== '';

type UnknownRecord = Record<string, unknown>;

function normalizePath(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

function apiPath(path: string) {
  if (USE_MOCK_DATA) return normalizePath(path);
  const normalizedPath = normalizePath(path);
  if (USE_PROXY) return `/proxy${normalizedPath}`;
  if (!IS_STRAPI_API) return normalizedPath;
  return `${API_PREFIX}${normalizedPath}`;
}

export type TaxonomyItem = {
  id: number | string;
  name: string;
  slug?: string | null;
};

function mapStrapiTaxonomy(item: unknown): TaxonomyItem {
  const record = (item ?? {}) as UnknownRecord;
  const attrs = (record.attributes as UnknownRecord) ?? record;
  const idValue = record.id ?? attrs.id;
  const normalizedId = typeof idValue === 'number' || typeof idValue === 'string' ? idValue : String(idValue ?? '');
  const nameValue = attrs.name ?? attrs.title ?? '';
  const slugValue = attrs.slug ?? null;
  return {
    id: normalizedId,
    name: typeof nameValue === 'string' ? nameValue : '',
    slug: typeof slugValue === 'string' ? slugValue : null,
  };
}

async function fetchTaxonomy(collection: string): Promise<TaxonomyItem[]> {
  try {
    const res = await api.get(apiPath(`/${collection}`));
    const payload = res.data;
    const raw = (Array.isArray(payload) ? payload : payload?.data || []) as UnknownRecord[];
    return raw.map((r) => mapStrapiTaxonomy(r));
  } catch (err) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    const data = (err as { response?: { data?: unknown } })?.response?.data;
    const message = err instanceof Error ? err.message : undefined;
    console.error(`Error fetching ${collection}:`, status, data || message);
    return [];
  }
}

export async function getProductCategories(): Promise<TaxonomyItem[]> {
  if (_cachedProductCategories) return _cachedProductCategories;
  const { productCategories } = await getAllTaxonomies();
  return productCategories;
}

export async function getRecipientLists(): Promise<TaxonomyItem[]> {
  if (_cachedRecipientLists) return _cachedRecipientLists;
  const { recipientLists } = await getAllTaxonomies();
  return recipientLists;
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
let _cachedProductCategories: TaxonomyItem[] | null = null;
let _cachedRecipientLists: TaxonomyItem[] | null = null;

export async function getAllTaxonomies(): Promise<{
  materials: TaxonomyItem[];
  occasions: TaxonomyItem[];
  productCategories: TaxonomyItem[];
  recipientLists: TaxonomyItem[];
}> {
  // 1) In-memory cache (fast, per-page)
  if (_cachedMaterials && _cachedOccasions && _cachedProductCategories && _cachedRecipientLists) {
    return {
      materials: _cachedMaterials,
      occasions: _cachedOccasions,
      productCategories: _cachedProductCategories,
      recipientLists: _cachedRecipientLists,
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
        productCategories: TaxonomyItem[];
        recipientLists: TaxonomyItem[];
      };
      const TTL = parseInt((import.meta.env.VITE_TAXONOMY_TTL_SECONDS as string) || '86400', 10) * 1000; // default 24h
      if (parsed && parsed.ts && Date.now() - parsed.ts < TTL) {
        _cachedMaterials = parsed.materials;
        _cachedOccasions = parsed.occasions;
        _cachedProductCategories = parsed.productCategories;
        _cachedRecipientLists = parsed.recipientLists;
        return {
          materials: _cachedMaterials,
          occasions: _cachedOccasions,
          productCategories: _cachedProductCategories,
          recipientLists: _cachedRecipientLists,
        };
      }
    }
  } catch {
    // ignore localStorage errors
  }

  // 3) Network fallback — fetch and persist
  const [materials, occasions, productCategories, recipientLists] = await Promise.all([
    _cachedMaterials ? Promise.resolve(_cachedMaterials) : fetchTaxonomy('materials'),
    _cachedOccasions ? Promise.resolve(_cachedOccasions) : fetchTaxonomy('occasions'),
    _cachedProductCategories ? Promise.resolve(_cachedProductCategories) : fetchTaxonomy('product-categories'),
    _cachedRecipientLists ? Promise.resolve(_cachedRecipientLists) : fetchTaxonomy('recipient-lists'),
  ]);

  _cachedMaterials = materials;
  _cachedOccasions = occasions;
  _cachedProductCategories = productCategories;
  _cachedRecipientLists = recipientLists;

  // persist to localStorage
  try {
    const key = 'taxonomies:v1';
    const payload = { ts: Date.now(), materials, occasions, productCategories, recipientLists };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // ignore storage failures
  }

  return { materials, occasions, productCategories, recipientLists };
}

// Optional: allow manual cache invalidation if you update taxonomies server-side
export function invalidateTaxonomyCache() {
  _cachedMaterials = null;
  _cachedOccasions = null;
  _cachedProductCategories = null;
  _cachedRecipientLists = null;
}

// Also clear persisted cache
export function invalidatePersistedTaxonomyCache() {
  invalidateTaxonomyCache();
  try {
    localStorage.removeItem('taxonomies:v1');
  } catch {
    // ignore
  }
}

export default {
  getProductCategories,
  getRecipientLists,
  getMaterials,
  getOccasions,
};
