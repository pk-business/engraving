import api from './api-client';
import { isMockDataEnabled } from '../utils/runtimeFlags';

// ============================================
// Configuration
// ============================================

const USE_PROXY = (import.meta.env.VITE_USE_PROXY as string) === 'true';
const rawApiPrefix = (import.meta.env.VITE_API_PREFIX as string) ?? '/api';
const API_PREFIX =
  !rawApiPrefix || rawApiPrefix === '/' ? '' : rawApiPrefix.startsWith('/') ? rawApiPrefix : `/${rawApiPrefix}`;
const USE_MOCK_DATA = isMockDataEnabled();
const IS_STRAPI_API = !USE_MOCK_DATA && API_PREFIX !== '';
const CACHE_TTL_MS = parseInt((import.meta.env.VITE_TAXONOMY_TTL_SECONDS as string) || '86400', 10) * 1000; // default 24h
const CACHE_KEY = 'taxonomies:v1';

// ============================================
// Types
// ============================================

type UnknownRecord = Record<string, unknown>;

export type TaxonomyItem = {
  id: number | string;
  name: string;
  slug?: string | null;
};

// ============================================
// In-Memory Cache
// ============================================

let _cachedMaterials: TaxonomyItem[] | null = null;
let _cachedOccasions: TaxonomyItem[] | null = null;
let _cachedProductCategories: TaxonomyItem[] | null = null;
let _cachedRecipientLists: TaxonomyItem[] | null = null;

// ============================================
// Helper Functions
// ============================================

/**
 * Normalize path to ensure it starts with a forward slash
 */
function normalizePath(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Build the full API path based on environment configuration
 */
function apiPath(path: string) {
  if (USE_MOCK_DATA) return normalizePath(path);
  const normalizedPath = normalizePath(path);
  if (USE_PROXY) return `/proxy${normalizedPath}`;
  if (!IS_STRAPI_API) return normalizedPath;
  return `${API_PREFIX}${normalizedPath}`;
}

/**
 * Map Strapi v5 flat structure to TaxonomyItem
 * Note: Strapi v5 uses flat structure (no nested attributes object)
 */
function mapStrapiTaxonomy(item: unknown): TaxonomyItem {
  const record = (item ?? {}) as UnknownRecord;
  const idValue = record.id ?? record.documentId;
  const normalizedId = typeof idValue === 'number' || typeof idValue === 'string' ? idValue : String(idValue ?? '');
  const nameValue = record.name ?? record.title ?? '';
  const slugValue = record.slug ?? null;
  
  return {
    id: normalizedId,
    name: typeof nameValue === 'string' ? nameValue : '',
    slug: typeof slugValue === 'string' ? slugValue : null,
  };
}

/**
 * Fetch a single taxonomy collection from the API
 */
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

// ============================================
// Public API - Individual Getters
// ============================================

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

// ============================================
// Public API - Bulk Getter with Multi-Tier Caching
// ============================================

/**
 * Get all taxonomies with three-tier caching:
 * 1. In-memory cache (fastest, per-page session)
 * 2. localStorage cache (persists across page reloads)
 * 3. Network fetch (fallback when cache is empty or expired)
 */

/**
 * Get all taxonomies with three-tier caching:
 * 1. In-memory cache (fastest, per-page session)
 * 2. localStorage cache (persists across page reloads)
 * 3. Network fetch (fallback when cache is empty or expired)
 */
export async function getAllTaxonomies(): Promise<{
  materials: TaxonomyItem[];
  occasions: TaxonomyItem[];
  productCategories: TaxonomyItem[];
  recipientLists: TaxonomyItem[];
}> {
  // Tier 1: In-memory cache check
  if (_cachedMaterials && _cachedOccasions && _cachedProductCategories && _cachedRecipientLists) {
    return {
      materials: _cachedMaterials,
      occasions: _cachedOccasions,
      productCategories: _cachedProductCategories,
      recipientLists: _cachedRecipientLists,
    };
  }

  // Tier 2: Try persisted cache in localStorage
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as {
        ts: number;
        materials: TaxonomyItem[];
        occasions: TaxonomyItem[];
        productCategories: TaxonomyItem[];
        recipientLists: TaxonomyItem[];
      };

      // Validate cache has data and is not expired
      const hasValidData =
        parsed.occasions?.length > 0 ||
        parsed.recipientLists?.length > 0 ||
        parsed.productCategories?.length > 0 ||
        parsed.materials?.length > 0;

      const isNotExpired = parsed.ts && Date.now() - parsed.ts < CACHE_TTL_MS;

      if (hasValidData && isNotExpired) {
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
      // Cache is invalid or expired, remove it
      localStorage.removeItem(CACHE_KEY);
    }
  } catch {
    // Ignore localStorage errors (e.g., quota exceeded, privacy mode)
  }

  // Tier 3: Network fetch
  const [materials, occasions, productCategories, recipientLists] = await Promise.all([
    _cachedMaterials ? Promise.resolve(_cachedMaterials) : fetchTaxonomy('materials'),
    _cachedOccasions ? Promise.resolve(_cachedOccasions) : fetchTaxonomy('occasions'),
    _cachedProductCategories ? Promise.resolve(_cachedProductCategories) : fetchTaxonomy('product-categories'),
    _cachedRecipientLists ? Promise.resolve(_cachedRecipientLists) : fetchTaxonomy('recipient-lists'),
  ]);

  // Update in-memory cache
  _cachedMaterials = materials;
  _cachedOccasions = occasions;
  _cachedProductCategories = productCategories;
  _cachedRecipientLists = recipientLists;

  // Persist to localStorage for next session
  try {
    const payload = { ts: Date.now(), materials, occasions, productCategories, recipientLists };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage failures
  }

  return { materials, occasions, productCategories, recipientLists };
}

// ============================================
// Cache Management
// ============================================

/**
 * Clear in-memory taxonomy cache
 * Use when taxonomies are updated server-side
 */
export function invalidateTaxonomyCache() {
  _cachedMaterials = null;
  _cachedOccasions = null;
  _cachedProductCategories = null;
  _cachedRecipientLists = null;
}

/**
 * Clear both in-memory and localStorage taxonomy cache
 * Use for complete cache reset
 */
export function invalidatePersistedTaxonomyCache() {
  invalidateTaxonomyCache();
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore localStorage errors
  }
}

// ============================================
// Default Export
// ============================================

export default {
  getProductCategories,
  getRecipientLists,
  getMaterials,
  getOccasions,
};
