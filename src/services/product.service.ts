import type { Product, ProductFilter, ProductListResponse } from '../types/product.types';
import { PAGINATION } from '../constants';
import api from './api-client';
import { isMockDataEnabled } from '../utils/runtimeFlags';

const USE_PROXY = (import.meta.env.VITE_USE_PROXY as string) === 'true';
const USE_MOCK_DATA = isMockDataEnabled();
const STRAPI_BASE = (import.meta.env.VITE_STRAPI_URL as string) || (api.defaults.baseURL as string) || '';
const rawApiPrefix = (import.meta.env.VITE_API_PREFIX as string) ?? '/api';
const API_PREFIX =
  !rawApiPrefix || rawApiPrefix === '/' ? '' : rawApiPrefix.startsWith('/') ? rawApiPrefix : `/${rawApiPrefix}`;
const IS_STRAPI_API = !USE_MOCK_DATA && API_PREFIX !== '';
const PRODUCTS_RESOURCE = USE_MOCK_DATA ? '/data' : '/products';
const DEFAULT_PAGE_SIZE = PAGINATION.PRODUCTS_PER_PAGE ?? 12;
const STRAPI_LIST_FIELDS = ['name', 'description', 'price', 'slug', 'imageAlt', 'rating', 'reviewCount'];
const STRAPI_POPULATE_PARAMS = {
  featuredImage: { populate: '*' },
  gallery: { populate: '*' },
  material: { populate: '*' },
  occasions: { fields: ['name', 'slug'] },
  categories: { fields: ['name', 'slug'] },
} as const;

type UnknownRecord = Record<string, unknown>;

function buildMediaUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (STRAPI_BASE) return `${STRAPI_BASE.replace(/\/$/, '')}${path}`;
  return path;
}

const toStringValue = (value: unknown, fallback = ''): string => (typeof value === 'string' ? value : fallback);
const toNumberValue = (value: unknown, fallback = 0): number => (typeof value === 'number' ? value : fallback);

const extractNameList = (input: unknown): string[] => {
  if (!input) return [];
  if (typeof input === 'string') return [input];
  const normalize = (entry: unknown): string | null => {
    if (typeof entry === 'string') return entry;
    if (entry && typeof entry === 'object') {
      const record = entry as UnknownRecord;
      const direct = record.name;
      if (typeof direct === 'string') return direct;
      const attrs = record.attributes as UnknownRecord | undefined;
      const attrName = attrs?.name;
      return typeof attrName === 'string' ? attrName : null;
    }
    return null;
  };

  if (Array.isArray(input)) {
    return input.map(normalize).filter((v): v is string => Boolean(v));
  }

  const relationData = (input as { data?: unknown[] | UnknownRecord | null })?.data;
  if (Array.isArray(relationData)) {
    return relationData.map(normalize).filter((v): v is string => Boolean(v));
  }
  if (relationData && typeof relationData === 'object') {
    const single = normalize(relationData);
    return single ? [single] : [];
  }
  return [];
};

const extractMediaUrl = (media: unknown): { url: string | null; alt: string | null } => {
  if (!media || typeof media !== 'object') return { url: null, alt: null };
  const record = media as UnknownRecord;
  const attrs = record.attributes as UnknownRecord | undefined;
  const nestedData = record.data as UnknownRecord | undefined;
  const nestedAttrs = nestedData?.attributes as UnknownRecord | undefined;
  const urlCandidate = record.url ?? attrs?.url ?? nestedAttrs?.url;
  const altCandidate =
    record.alternativeText ?? attrs?.alternativeText ?? nestedAttrs?.alternativeText ?? attrs?.alt ?? nestedAttrs?.alt;
  return {
    url: typeof urlCandidate === 'string' ? urlCandidate : null,
    alt: typeof altCandidate === 'string' ? altCandidate : null,
  };
};

const normalizeGalleryList = (gallery: unknown): Array<string | UnknownRecord> => {
  if (!gallery) return [];
  const result: Array<string | UnknownRecord> = [];
  const pushItem = (entry: unknown) => {
    if (typeof entry === 'string') {
      result.push(entry);
    } else if (entry && typeof entry === 'object') {
      result.push(entry as UnknownRecord);
    }
  };
  if (Array.isArray(gallery)) {
    gallery.forEach(pushItem);
    return result;
  }
  const data = (gallery as { data?: unknown[] | null })?.data;
  if (Array.isArray(data)) {
    data.forEach(pushItem);
  }
  return result;
};

const extractMaterialName = (material: unknown): string => {
  if (!material) return '';
  if (typeof material === 'string') return material;
  if (typeof material === 'object') {
    const record = material as {
      name?: unknown;
      data?: { attributes?: { name?: unknown } | null } | null;
    };
    const direct = record.name;
    if (typeof direct === 'string') return direct;
    const related = record.data?.attributes?.name;
    if (typeof related === 'string') return related;
  }
  return '';
};

export function mapStrapiToProduct(item: UnknownRecord): Product {
  const attrs = (item.attributes as UnknownRecord) ?? item;
  const rawId = item.id ?? attrs.id ?? '';
  const id = String(rawId);

  // Prefer `featuredImage` if present (newer API shape). Otherwise fall back to
  // gallery first item, top-level `imageUrl`, or other images. Support both
  // nested Strapi shapes (`data.attributes.url`) and flattened objects
  // (`featuredImage.url` or `featuredImage.attributes.url`). Keep a
  // `mainImageMeta` so we can include alt text if available and ensure the
  // featured image is present in the `images` array.
  let imageUrl = '';
  let mainImageAlt = '';
  let mainImageUrl: string | null = null;
  const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';

  const fi = (attrs.featuredImage ?? item.featuredImage) as unknown;
  if (fi) {
    const mediaDetails = typeof fi === 'string' ? { url: fi, alt: null } : extractMediaUrl(fi);
    if (mediaDetails.url) {
      const resolvedUrl = buildMediaUrl(mediaDetails.url) ?? mediaDetails.url;
      if (resolvedUrl) {
        mainImageUrl = resolvedUrl;
        imageUrl = resolvedUrl;
      }
      mainImageAlt =
        mediaDetails.alt || (typeof attrs.imageAlt === 'string' ? attrs.imageAlt : '') || toStringValue(attrs.alt);
    }
  }

  const images: string[] = [];
  const galleryRecords = normalizeGalleryList(attrs.gallery);
  galleryRecords.forEach((mediaRecord) => {
    if (typeof mediaRecord === 'string') {
      const built = buildMediaUrl(mediaRecord);
      images.push(built ?? mediaRecord);
      return;
    }
    const media = extractMediaUrl(mediaRecord);
    if (media.url) {
      const built = buildMediaUrl(media.url);
      images.push(built ?? media.url);
    }
  });

  if (Array.isArray(attrs.images)) {
    attrs.images.filter(Boolean).forEach((u) => {
      if (typeof u === 'string') {
        const built = buildMediaUrl(u);
        images.push(built ?? u);
      }
    });
  }
  if (mainImageUrl && !images.includes(mainImageUrl)) images.unshift(mainImageUrl);
  if (typeof item.featuredImage === 'string') {
    const built = buildMediaUrl(item.featuredImage);
    images.push(built ?? item.featuredImage);
  }
  if (typeof item.imageUrl === 'string') {
    const built = buildMediaUrl(item.imageUrl);
    images.push(built ?? item.imageUrl);
  }

  // Ensure imageUrl.main is always a valid URL or a placeholder
  if (!imageUrl || imageUrl === 'Tumbler' || imageUrl === attrs.name) {
    imageUrl =
      images.find((u) => typeof u === 'string' && (u.startsWith('http://') || u.startsWith('https://'))) ||
      PLACEHOLDER_IMAGE;
  }

  const normalizedOccasions = extractNameList(attrs.occasions);
  const normalizedCategories = extractNameList(attrs.categories);
  const categoryList = normalizedCategories.length > 0 ? normalizedCategories : extractNameList(attrs.category);

  return {
    id,
    name: toStringValue(attrs.name, ''),
    description: toStringValue(attrs.description, ''),
    price: toNumberValue(attrs.price, 0),
    imageUrl: {
      main: imageUrl,
      alt:
        mainImageAlt ||
        images.find((u) => u && u !== imageUrl) ||
        toStringValue(attrs.imageAlt) ||
        toStringValue(attrs.alt) ||
        '',
    },
    images,
    material: extractMaterialName(attrs.material),
    occasions: normalizedOccasions,
    categories: categoryList,
    category: categoryList[0] ?? '',
    customizable: !!attrs.customizable,
    sizes: attrs.sizes || [],
    inStock: attrs.inStock !== undefined ? attrs.inStock : true,
    rating: toNumberValue(attrs.rating, 0),
    reviewCount: toNumberValue(attrs.reviewCount, 0),
  } as Product;
}

function apiPath(path: string) {
  if (USE_MOCK_DATA) return path;
  if (USE_PROXY) return `/proxy${path}`;
  if (IS_STRAPI_API) return `${API_PREFIX}${path}`;
  return path;
}

class ProductService {
  async getProducts(filters?: ProductFilter): Promise<ProductListResponse> {
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const pageSize = filters?.pageSize && filters.pageSize > 0 ? filters.pageSize : DEFAULT_PAGE_SIZE;

    if (!IS_STRAPI_API) {
      try {
        const res = await api.get(apiPath(PRODUCTS_RESOURCE));
        const payload = res.data;
        const raw = (Array.isArray(payload) ? payload : payload?.data || []) as UnknownRecord[];
        let products: Product[] = raw.map((p) => mapStrapiToProduct(p));
        products = applyLocalFilters(products, filters);

        const total = products.length;
        const start = (page - 1) * pageSize;
        const paginated = products.slice(start, start + pageSize);
        const pageCount = Math.max(1, Math.ceil(total / pageSize || 1));

        return {
          items: paginated,
          total,
          page,
          pageSize,
          pageCount,
        };
      } catch (err) {
        console.error('Error fetching products (local API):', err);
        return { items: [], page, pageSize, total: 0, pageCount: 1 };
      }
    }

    try {
      const params: Record<string, unknown> = {};
      params['pagination[page]'] = page;
      params['pagination[pageSize]'] = pageSize;
      params.populate = STRAPI_POPULATE_PARAMS;
      STRAPI_LIST_FIELDS.forEach((field, idx) => {
        params[`fields[${idx}]`] = field;
      });

      if (filters) {
        if (filters.minPrice !== undefined) params['filters[price][$gte]'] = filters.minPrice;
        if (filters.maxPrice !== undefined) params['filters[price][$lte]'] = filters.maxPrice;
        if (filters.priceRange) {
          params['filters[price][$gte]'] = filters.priceRange.min;
          params['filters[price][$lte]'] = filters.priceRange.max;
        }
        if (filters.searchQuery) {
          const search = filters.searchQuery;
          params['filters[$or]'] = `name:contains:${search},description:contains:${search}`;
        }
        let andIndex = 0;
        if (filters.materials && filters.materials.length > 0) {
          const cleanMaterials = filters.materials.map((m: string) => (m || '').toString().trim()).filter(Boolean);
          if (cleanMaterials.length === 1) {
            params['filters[material][name][$eq]'] = cleanMaterials[0];
          } else if (cleanMaterials.length > 1) {
            cleanMaterials.forEach((mat: string, idx: number) => {
              params[`filters[$or][${idx}][material][name][$eq]`] = mat;
            });
          }
        }
        if (filters.occasions && filters.occasions.length > 0) {
          const cleanOccasions = filters.occasions.map((o: string) => (o || '').toString().trim()).filter(Boolean);
          if (cleanOccasions.length === 1) {
            params['filters[occasions][name][$eq]'] = cleanOccasions[0];
          } else if (cleanOccasions.length > 1) {
            cleanOccasions.forEach((occ: string, idx: number) => {
              params[`filters[$or][${idx}][occasions][name][$eq]`] = occ;
            });
          }
        }
        if (filters.categories && filters.categories.length > 0) {
          if (filters.categories.length === 1) {
            params['filters[categories][name][$eq]'] = filters.categories[0];
          } else {
            filters.categories.forEach((c) => {
              params[`filters[$and][${andIndex}][categories][name][$eq]`] = c;
              andIndex += 1;
            });
          }
        }
      }

      let res;
      try {
        res = await api.get(apiPath(PRODUCTS_RESOURCE), { params });
      } catch (err) {
        const status = (err as { response?: { status?: number } }).response?.status;
        if (status === 400 && params.populate) {
          delete params.populate;
          res = await api.get(apiPath(PRODUCTS_RESOURCE), { params });
        } else {
          throw err;
        }
      }

      const payload = res.data;
      const raw = (Array.isArray(payload) ? payload : payload?.data || []) as UnknownRecord[];
      let products: Product[] = raw.map((p) => mapStrapiToProduct(p));
      let usedFallbackMerge = false;

      try {
        if ((filters?.materials || []).length > 1 && products.length === 0) {
          const cleanMaterials = (filters!.materials || [])
            .map((m: string) => (m || '').toString().trim())
            .filter(Boolean);
          if (cleanMaterials.length > 0) {
            const perRequests = await Promise.all(
              cleanMaterials.map((mat) => {
                const p: Record<string, unknown> = {};
                p['filters[material][name][$eq]'] = mat;
                if (filters?.minPrice !== undefined) p['filters[price][$gte]'] = filters.minPrice;
                if (filters?.maxPrice !== undefined) p['filters[price][$lte]'] = filters.maxPrice;
                if (filters?.searchQuery)
                  p[
                    'filters[$or]'
                  ] = `name:contains:${filters.searchQuery},description:contains:${filters.searchQuery}`;
                return api
                  .get(apiPath(PRODUCTS_RESOURCE), { params: p })
                  .then((r) => ((r.data?.data || r.data || []) as UnknownRecord[]));
              })
            );
            const mergedRaw: UnknownRecord[] = [];
            const seen = new Set<string>();
            perRequests.flat().forEach((item: UnknownRecord) => {
              const record = (item ?? {}) as UnknownRecord;
              const attrsRecord = record.attributes as UnknownRecord | undefined;
              const idValue = record.id ?? attrsRecord?.id ?? '';
              const id = String(idValue);
              if (!seen.has(id)) {
                seen.add(id);
                mergedRaw.push(record);
              }
            });
            products = mergedRaw.map((p) => mapStrapiToProduct(p as UnknownRecord));
            usedFallbackMerge = true;
          }
        }
      } catch (fallbackErr) {
        console.info('Materials $in fallback request failed:', fallbackErr);
      }

      try {
        if ((filters?.occasions || []).length > 1 && products.length === 0) {
          const cleanOccasions = (filters!.occasions || [])
            .map((o: string) => (o || '').toString().trim())
            .filter(Boolean);
          if (cleanOccasions.length > 0) {
            const perRequests = await Promise.all(
              cleanOccasions.map((occ) => {
                const p: Record<string, unknown> = {};
                p['filters[occasions][name][$eq]'] = occ;
                if (filters?.minPrice !== undefined) p['filters[price][$gte]'] = filters.minPrice;
                if (filters?.maxPrice !== undefined) p['filters[price][$lte]'] = filters.maxPrice;
                if (filters?.searchQuery)
                  p[
                    'filters[$or]'
                  ] = `name:contains:${filters.searchQuery},description:contains:${filters.searchQuery}`;
                return api
                  .get(apiPath(PRODUCTS_RESOURCE), { params: p })
                  .then((r) => ((r.data?.data || r.data || []) as UnknownRecord[]));
              })
            );
            const mergedRaw: UnknownRecord[] = [];
            const seen = new Set<string>();
            perRequests.flat().forEach((item: UnknownRecord) => {
              const record = (item ?? {}) as UnknownRecord;
              const attrsRecord = record.attributes as UnknownRecord | undefined;
              const idValue = record.id ?? attrsRecord?.id ?? '';
              const id = String(idValue);
              if (!seen.has(id)) {
                seen.add(id);
                mergedRaw.push(record);
              }
            });
            products = mergedRaw.map((p) => mapStrapiToProduct(p as UnknownRecord));
            usedFallbackMerge = true;
          }
        }
      } catch (fallbackErr) {
        console.info('Occasions $in fallback request failed:', fallbackErr);
      }

      if (filters && filters.searchQuery) {
        const q = (filters.searchQuery || '').toLowerCase();
        products = products.filter(
          (p) => (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
        );
      }

      const payloadMeta = Array.isArray(payload) ? null : payload?.meta?.pagination;
      const total = payloadMeta?.total ?? products.length;
      const currentPage = payloadMeta?.page ?? page;
      const currentPageSize = payloadMeta?.pageSize ?? pageSize;
      const pageCount = payloadMeta?.pageCount ?? Math.max(1, Math.ceil(total / (currentPageSize || 1)));

      if (usedFallbackMerge) {
        return {
          items: products,
          total: products.length,
          page: 1,
          pageSize: products.length || pageSize,
          pageCount: 1,
        };
      }

      return {
        items: products,
        total,
        page: currentPage,
        pageSize: currentPageSize || pageSize,
        pageCount,
      };
    } catch (err) {
      console.error('Error fetching products:', err);
      const fallbackPageSize = filters?.pageSize && filters.pageSize > 0 ? filters.pageSize : DEFAULT_PAGE_SIZE;
      return { items: [], page: filters?.page ?? 1, pageSize: fallbackPageSize, total: 0, pageCount: 1 };
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      // Use wildcard populate for Strapi; json-server ignores this because we strip for flat APIs.
      const params: Record<string, unknown> = IS_STRAPI_API ? { populate: '*' } : {};

      let res;
      try {
        res = await api.get(apiPath(`${PRODUCTS_RESOURCE}/${id}`), { params });
      } catch (err) {
        const status = (err as { response?: { status?: number } }).response?.status;
        // If the product doesn't exist, return null instead of throwing.
        if (status === 404) {
          console.info(`Product ${id} not found (404)`);
          return null;
        }
        // retry with deep populate, then without populate as fallback
        if (status === 400 && IS_STRAPI_API) {
          try {
            // Try wildcard populate (*) which some Strapi deployments support
            params.populate = '*';
            res = await api.get(apiPath(`${PRODUCTS_RESOURCE}/${id}`), { params });
          } catch (err2) {
            const err2Status = (err2 as { response?: { status?: number } }).response?.status;
            if (err2Status === 400) {
              // Fallback to no populate (flattened shape)
              delete params.populate;
              res = await api.get(apiPath(`${PRODUCTS_RESOURCE}/${id}`), { params });
            } else {
              throw err2;
            }
          }
        } else {
          throw err;
        }
      }

      const payload = res.data;
      const raw = payload?.data || payload || null;
      if (!raw) return null;
      return mapStrapiToProduct(raw);
    } catch (err) {
      console.error('Error fetching product:', err);
      return null;
    }
  }

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    try {
      const params: Record<string, unknown> = {};
      if (IS_STRAPI_API) {
        params['pagination[pageSize]'] = limit;
        params.sort = 'createdAt:desc';
        params.populate = STRAPI_POPULATE_PARAMS;
      } else {
        params._limit = limit;
        params._sort = 'createdAt';
        params._order = 'desc';
      }

      const res = await api.get(apiPath(PRODUCTS_RESOURCE), { params });

      const payload = res.data;
      const raw = (Array.isArray(payload) ? payload : payload?.data || []) as UnknownRecord[];
      return raw.map((p) => mapStrapiToProduct(p));
    } catch (err) {
      console.error('Error fetching featured products:', err);
      return [];
    }
  }
}

export default new ProductService();

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

function applyLocalFilters(products: Product[], filters?: ProductFilter): Product[] {
  if (!filters) return products;

  const normalizeList = (values?: string[]) =>
    values?.map((value) => slugify((value || '').toString())).filter((v) => v && v.length > 0);

  const materialFilters = normalizeList(filters.materials);
  const occasionFilters = normalizeList(filters.occasions);
  const categoryFilters = normalizeList(filters.categories);
  const minPrice = filters.priceRange?.min ?? filters.minPrice;
  const maxPrice = filters.priceRange?.max ?? filters.maxPrice;
  const searchQuery = (filters.searchQuery || '').toLowerCase().trim();

  return products.filter((product) => {
    if (materialFilters && materialFilters.length > 0) {
      const productMaterial = slugify((product.material || '').toString());
      if (!productMaterial || !materialFilters.includes(productMaterial)) {
        return false;
      }
    }

    if (occasionFilters && occasionFilters.length > 0) {
      const productOccasions = (product.occasions || [])
        .map((occ) => slugify((occ || '').toString()))
        .filter(Boolean);
      if (!productOccasions.some((occ) => occasionFilters.includes(occ))) {
        return false;
      }
    }

    if (categoryFilters && categoryFilters.length > 0) {
      const productCategories = (product.categories || [])
        .map((cat) => slugify((cat || '').toString()))
        .filter(Boolean);
      const primaryCategory = slugify((product.category || '').toString());
      const matches =
        productCategories.some((cat) => categoryFilters.includes(cat)) ||
        (!!primaryCategory && categoryFilters.includes(primaryCategory));
      if (!matches) {
        return false;
      }
    }

    if (typeof minPrice === 'number' && product.price < minPrice) {
      return false;
    }

    if (typeof maxPrice === 'number' && product.price > maxPrice) {
      return false;
    }

    if (searchQuery && searchQuery.length > 0) {
      const name = (product.name || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      if (!name.includes(searchQuery) && !description.includes(searchQuery)) {
        return false;
      }
    }

    return true;
  });
}

export { applyLocalFilters };
