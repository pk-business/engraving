/**
 * URL and routing utilities
 */

/**
 * Build a product filter URL with query parameters
 * @param filters - Object containing filter parameters
 * @returns URL string with query parameters
 */
export const buildProductFilterUrl = (filters: {
  category?: string | null;
  occasions?: string[];
  materials?: string[];
  priceRange?: string;
}): string => {
  const params = new URLSearchParams();

  if (filters.category) {
    params.set('category', filters.category);
  }

  if (filters.occasions && filters.occasions.length > 0) {
    filters.occasions.forEach((occasion) => params.append('occasions', occasion));
  }

  if (filters.materials && filters.materials.length > 0) {
    filters.materials.forEach((material) => params.append('materials', material));
  }

  if (filters.priceRange) {
    params.set('priceRange', filters.priceRange);
  }

  const queryString = params.toString();
  return queryString ? `/products?${queryString}` : '/products';
};

/**
 * Build occasion-based product URL
 * @param categoryKey - Category key
 * @param occasionMap - Map of category keys to occasion arrays
 * @returns URL string with query parameters
 */
export const buildOccasionUrl = (
  categoryKey: string,
  occasionMap: Record<string, string[]>
): string => {
  const occasions = occasionMap[categoryKey] ?? [];
  if (occasions.length === 0) return '/products';

  return buildProductFilterUrl({
    category: categoryKey,
    occasions,
  });
};
