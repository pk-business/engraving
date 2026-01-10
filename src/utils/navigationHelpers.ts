import type { NavigateFunction } from 'react-router-dom';
import { ROUTES } from '../constants';

/**
 * Builds URL search parameters for product navigation
 * @param type - The type of filter (occasions, recipientLists, or productCategories)
 * @param value - The value to filter by
 * @returns URLSearchParams object
 */
export function buildProductSearchParams(
  type: 'occasions' | 'recipientLists' | 'productCategories',
  value: string
): URLSearchParams {
  const params = new URLSearchParams();
  params.set(type, value);
  return params;
}

/**
 * Builds URL search parameters for bulk order navigation
 * @param categorySlug - The product category slug to filter by
 * @returns URLSearchParams object with bulkEligible=true
 */
export function buildBulkOrderSearchParams(categorySlug: string): URLSearchParams {
  const params = new URLSearchParams();
  params.set('bulkEligible', 'true');
  params.set('productCategories', categorySlug);
  return params;
}

/**
 * Navigates to products page with taxonomy filter
 * @param navigate - React Router navigate function
 * @param type - The type of filter
 * @param value - The value to filter by
 * @param onComplete - Optional callback to run after navigation
 */
export function navigateToProducts(
  navigate: NavigateFunction,
  type: 'occasions' | 'recipientLists' | 'productCategories',
  value: string,
  onComplete?: () => void
): void {
  const params = buildProductSearchParams(type, value);
  navigate(`${ROUTES.PRODUCTS}?${params.toString()}`);
  onComplete?.();
}

/**
 * Navigates to products page with bulk order filter
 * @param navigate - React Router navigate function
 * @param categorySlug - The product category slug
 * @param onComplete - Optional callback to run after navigation
 */
export function navigateToBulkProducts(
  navigate: NavigateFunction,
  categorySlug: string,
  onComplete?: () => void
): void {
  const params = buildBulkOrderSearchParams(categorySlug);
  navigate(`${ROUTES.PRODUCTS}?${params.toString()}`);
  onComplete?.();
}

/**
 * Maps navigation type to corresponding URL parameter key
 * @param type - The dropdown/navigation type
 * @returns The corresponding URL parameter key
 */
export function getNavigationParamKey(
  type: 'occasion' | 'recipient' | 'product'
): 'occasions' | 'recipientLists' | 'productCategories' {
  switch (type) {
    case 'occasion':
      return 'occasions';
    case 'recipient':
      return 'recipientLists';
    case 'product':
      return 'productCategories';
  }
}

/**
 * Parses URL search parameters to extract filter values
 * @param searchParams - URLSearchParams object
 * @returns Object containing filter values
 */
export function parseProductFilters(searchParams: URLSearchParams) {
  return {
    materials: searchParams.getAll('materials'),
    occasions: searchParams.getAll('occasions'),
    productCategories: searchParams.getAll('productCategories'),
    recipientLists: searchParams.getAll('recipientLists'),
    productCategory: searchParams.get('productCategory'),
    priceRange: searchParams.get('priceRange') || '',
    bulkEligible: searchParams.get('bulkEligible') === 'true',
    page: parseInt(searchParams.get('page') || '1', 10),
  };
}

/**
 * Builds complete filter URL parameters from filter state
 * @param filters - Filter values
 * @returns URLSearchParams object
 */
export function buildFilterSearchParams(filters: {
  materials?: string[];
  occasions?: string[];
  productCategories?: string[];
  recipientLists?: string[];
  productCategory?: string | null;
  priceRange?: string;
  bulkEligible?: boolean;
  page?: number;
}): URLSearchParams {
  const params = new URLSearchParams();

  filters.materials?.forEach((m) => params.append('materials', m));
  filters.occasions?.forEach((o) => params.append('occasions', o));
  filters.productCategories?.forEach((c) => params.append('productCategories', c));
  filters.recipientLists?.forEach((r) => params.append('recipientLists', r));
  
  if (filters.productCategory) {
    params.set('productCategory', filters.productCategory);
  }
  
  if (filters.priceRange) {
    params.set('priceRange', filters.priceRange);
  }
  
  if (filters.bulkEligible) {
    params.set('bulkEligible', 'true');
  }
  
  if (filters.page && filters.page > 1) {
    params.set('page', filters.page.toString());
  }

  return params;
}
