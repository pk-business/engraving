import type { Product, ProductFilter } from '../types/product.types';
import api from './api-client';

const USE_PROXY = (import.meta.env.VITE_USE_PROXY as string) === 'true';
const STRAPI_BASE = (import.meta.env.VITE_STRAPI_URL as string) || (api.defaults.baseURL as string) || '';

function buildMediaUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (STRAPI_BASE) return `${STRAPI_BASE.replace(/\/$/, '')}${path}`;
  return path;
}

export function mapStrapiToProduct(item: any): Product {
  const attrs = item?.attributes ?? item ?? {};
  const id = String(item?.id ?? attrs?.id ?? '');

  // Prefer `featuredImage` if present (newer API shape). Otherwise fall back to
  // gallery first item, top-level `imageUrl`, or other images. Support both
  // nested Strapi shapes (`data.attributes.url`) and flattened objects
  // (`featuredImage.url` or `featuredImage.attributes.url`). Keep a
  // `mainImageMeta` so we can include alt text if available and ensure the
  // featured image is present in the `images` array.
  let imageUrl = '';
  let mainImageAlt = '';
  let mainImageUrl: string | null = null;

  const fi = attrs.featuredImage ?? item?.featuredImage;
  if (fi) {
    const url = fi?.data?.attributes?.url || fi?.attributes?.url || fi?.url || (typeof fi === 'string' ? fi : null);
    const alt = fi?.data?.attributes?.alternativeText || fi?.attributes?.alternativeText || fi?.alternativeText || attrs.imageAlt || attrs.alt || '';
    if (url) {
      mainImageUrl = buildMediaUrl(url) as string;
      imageUrl = mainImageUrl || '';
      mainImageAlt = alt || '';
    }
  }

  const images: string[] = [];
  // Collect gallery images first (preferred for secondary images)
  if (attrs.gallery?.data) {
    attrs.gallery.data.forEach((m: any) => {
      const url = m?.attributes?.url || m?.url;
      if (url) images.push(buildMediaUrl(url) as string);
    });
  } else if (Array.isArray(attrs.gallery)) {
    // flattened gallery array (strings or objects)
    attrs.gallery.forEach((g: any) => {
      if (!g) return;
      if (typeof g === 'string') images.push(buildMediaUrl(g) || g);
      else if (g?.url) images.push(buildMediaUrl(g.url) as string);
      else if (g?.attributes?.url) images.push(buildMediaUrl(g.attributes.url) as string);
    });
  }

  // include any simple images array
  if (Array.isArray(attrs.images)) images.push(...attrs.images.filter(Boolean).map((u: string) => buildMediaUrl(u) || u));
  // ensure featuredImage (object or string) is included in images
  if (mainImageUrl && !images.includes(mainImageUrl)) images.unshift(mainImageUrl);
  // include top-level string featured/imageUrl fallbacks
  if (item?.featuredImage && typeof item.featuredImage === 'string') images.push(buildMediaUrl(item.featuredImage) || item.featuredImage);
  if (item?.imageUrl && typeof item.imageUrl === 'string') images.push(buildMediaUrl(item.imageUrl) || item.imageUrl);

  return {
    id,
    name: attrs.name || '',
    description: attrs.description || '',
    price: attrs.price ?? 0,
    imageUrl: {
      main: imageUrl || (images[0] ?? ''),
      // alt image: prefer explicit featured image alt, otherwise the first
      // gallery image that isn't the main, then fallback to provided alt fields
      alt: mainImageAlt || (images.find((u) => u && u !== (imageUrl || (images[0] ?? ''))) as string) || attrs.imageAlt || attrs.alt || '',
    },
    images,
    material: attrs.material?.data?.attributes?.name ?? attrs.material?.name ?? attrs.material ?? '',
    occasions: attrs.occasions
      ? Array.isArray(attrs.occasions)
        ? attrs.occasions.map((o: any) => o?.attributes?.name || o?.name || o)
        : (attrs.occasions.data || []).map((o: any) => o.attributes?.name || o)
      : [],
    categories: attrs.categories
      ? Array.isArray(attrs.categories)
        ? attrs.categories.map((c: any) => c?.attributes?.name || c?.name || c)
        : (attrs.categories.data || []).map((c: any) => c.attributes?.name || c)
      : attrs.categories || [],
    category:
      (attrs.categories
        ? (attrs.categories.data || []).map((c: any) => c.attributes?.name || c)[0]
        : Array.isArray(attrs.categories)
        ? attrs.categories[0]
        : attrs.category) || '',
    customizable: !!attrs.customizable,
    sizes: attrs.sizes || [],
    inStock: attrs.inStock !== undefined ? attrs.inStock : true,
    rating: attrs.rating ?? 0,
    reviewCount: attrs.reviewCount ?? 0,
  } as Product;
}

function apiPath(path: string) {
  if (USE_PROXY) return `/proxy${path}`;
  return `/api${path}`;
}

class ProductService {
  async getProducts(filters?: ProductFilter): Promise<Product[]> {
    try {
      // Avoid sending a `populate` list by default for list endpoints —
      // some deployments reject unknown populate keys and return 400.
      // The flattened response contains the fields we need for listing.
      const params: Record<string, any> = {};

      // Request relation population by default so list endpoints include
      // images (featuredImage/gallery). Some Strapi deployments reject
      // unknown populate keys and return 400; we catch that and retry
      // without populate below.
      params.populate = '*';

      if (filters) {
        if (filters.minPrice !== undefined) params['filters[price][$gte]'] = filters.minPrice;
        if (filters.maxPrice !== undefined) params['filters[price][$lte]'] = filters.maxPrice;
        if (filters.priceRange) {
          params['filters[price][$gte]'] = filters.priceRange.min;
          params['filters[price][$lte]'] = filters.priceRange.max;
        }
        if (filters.searchQuery)
          params['filters[$or]'] = `name:contains:${filters.searchQuery},description:contains:${filters.searchQuery}`;
        // Materials: products have a single material, so multiple selections should
        // be treated as OR (match any selected material). Use $in for that.
        let andIndex = 0;
        if (filters.materials && filters.materials.length > 0) {
          // Trim and remove empty entries to avoid trailing commas or empty values
          const cleanMaterials = filters.materials.map((m: string) => (m || '').toString().trim()).filter(Boolean);
          if (cleanMaterials.length === 1) {
            params['filters[material][name][$eq]'] = cleanMaterials[0];
          } else if (cleanMaterials.length > 1) {
            // Use a single request with $or for nested relation matching to avoid
            // servers that don't accept $in on relation paths and to keep one API call.
            cleanMaterials.forEach((mat: string, idx: number) => {
              params[`filters[$or][${idx}][material][name][$eq]`] = mat;
            });
          }
        }
        if (filters.occasions && filters.occasions.length > 0) {
          // Clean values to avoid empty entries/trailing commas
          const cleanOccasions = filters.occasions.map((o: string) => (o || '').toString().trim()).filter(Boolean);
          if (cleanOccasions.length === 1) {
            params['filters[occasions][name][$eq]'] = cleanOccasions[0];
          } else if (cleanOccasions.length > 1) {
            // Use $or to match any of the selected occasions in a single request.
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
        res = await api.get(apiPath('/products'), { params });
      } catch (err: any) {
        const status = err?.response?.status;
        // Some Strapi deployments validate populate keys differently and return 400
        // if unknown relation keys are passed. Log server response for debugging and
        // retry without populate as a fallback.
        if (err?.response?.data) {
          console.info('Products list error response body:', err.response.data);
        }
        if (status === 400 && params.populate) {
          // remove populate and retry
          delete params.populate;
          try {
            res = await api.get(apiPath('/products'), { params });
          } catch (err2) {
            throw err2;
          }
        } else {
          throw err;
        }
      }
      const payload = res.data;
      const raw = payload?.data || [];
      let products: Product[] = raw.map((p: any) => mapStrapiToProduct(p));

      // If an `$in` request for multiple materials returned no results, fall back
      // to requesting each material individually and merging unique results. This
      // is a defensive measure for deployments that don't handle `$in` on nested
      // relations consistently.
      try {
        if ((filters?.materials || []).length > 1 && products.length === 0) {
          const cleanMaterials = (filters!.materials || [])
            .map((m: string) => (m || '').toString().trim())
            .filter(Boolean);
          if (cleanMaterials.length > 0) {
            const perRequests = await Promise.all(
              cleanMaterials.map((mat) => {
                const p: Record<string, any> = {};
                p['filters[material][name][$eq]'] = mat;
                // preserve other filters (price/search) where sensible
                if (filters?.minPrice !== undefined) p['filters[price][$gte]'] = filters.minPrice;
                if (filters?.maxPrice !== undefined) p['filters[price][$lte]'] = filters.maxPrice;
                if (filters?.searchQuery)
                  p[
                    'filters[$or]'
                  ] = `name:contains:${filters.searchQuery},description:contains:${filters.searchQuery}`;
                return api.get(apiPath('/products'), { params: p }).then((r) => r.data?.data || []);
              })
            );
            // flatten and dedupe by id
            const mergedRaw: any[] = [];
            const seen = new Set<string>();
            perRequests.flat().forEach((item: any) => {
              const id = String(item?.id ?? item?.attributes?.id ?? '');
              if (!seen.has(id)) {
                seen.add(id);
                mergedRaw.push(item);
              }
            });
            products = mergedRaw.map((p: any) => mapStrapiToProduct(p));
          }
        }
      } catch (fallbackErr) {
        // If fallback fails, just continue returning the original (possibly empty) set
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
                const p: Record<string, any> = {};
                p['filters[occasions][name][$eq]'] = occ;
                if (filters?.minPrice !== undefined) p['filters[price][$gte]'] = filters.minPrice;
                if (filters?.maxPrice !== undefined) p['filters[price][$lte]'] = filters.maxPrice;
                if (filters?.searchQuery)
                  p[
                    'filters[$or]'
                  ] = `name:contains:${filters.searchQuery},description:contains:${filters.searchQuery}`;
                return api.get(apiPath('/products'), { params: p }).then((r) => r.data?.data || []);
              })
            );
            const mergedRaw: any[] = [];
            const seen = new Set<string>();
            perRequests.flat().forEach((item: any) => {
              const id = String(item?.id ?? item?.attributes?.id ?? '');
              if (!seen.has(id)) {
                seen.add(id);
                mergedRaw.push(item);
              }
            });
            products = mergedRaw.map((p: any) => mapStrapiToProduct(p));
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

      return products;
    } catch (err) {
      console.error('Error fetching products:', err);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      // Use wildcard populate for compatibility with the deployed Strapi instance.
      const params: Record<string, any> = { populate: '*' };

      let res;
      try {
        res = await api.get(apiPath(`/products/${id}`), { params });
      } catch (err: any) {
        const status = err?.response?.status;
        // If the product doesn't exist, return null instead of throwing.
        if (status === 404) {
          console.info(`Product ${id} not found (404)`);
          return null;
        }
        // retry with deep populate, then without populate as fallback
        if (status === 400) {
          try {
            // Try wildcard populate (*) which some Strapi deployments support
            params.populate = '*';
            res = await api.get(apiPath(`/products/${id}`), { params });
          } catch (err2: any) {
            if (err2?.response?.status === 400) {
              // Fallback to no populate (flattened shape)
              delete params.populate;
              res = await api.get(apiPath(`/products/${id}`), { params });
            } else {
              throw err2;
            }
          }
        } else {
          throw err;
        }
      }

      const payload = res.data;
      const raw = payload?.data;
      if (!raw) return null;
      return mapStrapiToProduct(raw);
    } catch (err) {
      console.error('Error fetching product:', err);
      return null;
    }
  }

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    try {
      const params: Record<string, any> = {
        'pagination[pageSize]': limit,
        sort: 'createdAt:desc',
        // prefer wildcard populate; explicit relation keys can cause 400 on some deployments
        populate: '*',
      };

      let res;
      try {
        res = await api.get(apiPath('/products'), { params });
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 400) {
          try {
            // Try wildcard populate (*) before falling back to no-populate
            params.populate = '*';
            res = await api.get(apiPath('/products'), { params });
          } catch (err2: any) {
            if (err2?.response?.status === 400) {
              delete params.populate;
              res = await api.get(apiPath('/products'), { params });
            } else {
              throw err2;
            }
          }
        } else {
          throw err;
        }
      }

      const payload = res.data;
      const raw = payload?.data || [];
      return raw.map((p: any) => mapStrapiToProduct(p));
    } catch (err) {
      console.error('Error fetching featured products:', err);
      return [];
    }
  }
}

export default new ProductService();
