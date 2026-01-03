import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import type { Product, ProductFilter, ProductListResponse } from '../../types/product.types';
import ProductService, { applyLocalFilters } from '../../services/product.service';
import { FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import FiltersSidebar from '../../components/Filters/FiltersSidebar';
import FilterDrawer from '../../components/FilterDrawer/FilterDrawer';
import AppliedFiltersChips from '../../components/Filters/AppliedFiltersChips';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { getCategories, type TaxonomyItem } from '../../services/taxonomy.service';
import { PAGINATION } from '../../constants';
import './ProductsPage.css';
const categoryMap: Record<string, string[]> = {
  'personal-milestones': ['birthday', 'anniversary', 'graduation'],
  'celebrations-holidays': ['christmas'],
  'love-relationships': ['wedding', 'anniversary'],
  'corporate-professional': ['corporate'],
  'hobbies-interests': [],
  'home-living': [],
};

const occasionCategoryMap: Record<string, string[]> = Object.entries(categoryMap).reduce(
  (acc, [categoryKey, occasionList]) => {
    occasionList.forEach((occasion) => {
      if (!acc[occasion]) {
        acc[occasion] = [];
      }
      if (!acc[occasion].includes(categoryKey)) {
        acc[occasion].push(categoryKey);
      }
    });
    return acc;
  },
  {} as Record<string, string[]>
);

const deriveCategoriesFromOccasions = (occasionSlugs: string[], limit = 1): string[] => {
  if (!occasionSlugs || occasionSlugs.length === 0) return [];
  const derived: string[] = [];
  for (const slug of occasionSlugs) {
    const match = occasionCategoryMap[slug];
    if (!match || match.length === 0) continue;
    for (const category of match) {
      if (!derived.includes(category)) {
        derived.push(category);
      }
      if (limit > 0 && derived.length >= limit) {
        return derived.slice(0, limit);
      }
    }
  }
  return limit > 0 ? derived.slice(0, limit) : derived;
};

{
  /* Original products grid and loading logic goes here (restored) */
}

{
  /* Original pagination logic goes here (restored) */
}

{
  /* Original filter drawer logic goes here (restored) */
}
const ProductsPage: React.FC = () => {
  // State
  const [searchParams, setSearchParams] = useSearchParams();
  const [appliedFilters, setAppliedFilters] = useState<ProductFilter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<TaxonomyItem[]>([]);
  const [priceRange, setPriceRange] = useState<string>('');
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const pageSize = PAGINATION.PRODUCTS_PER_PAGE;
  const queryClient = useQueryClient();
  const searchEffectInitializedRef = useRef(false);
  const lastSearchQueryRef = useRef<string>('');

  // Utility functions
  const syncPageParam = (value: number) => {
    setSearchParams((prevParams) => {
      const updated = new URLSearchParams(prevParams);
      if (!Number.isFinite(value) || value <= 1) {
        updated.delete('page');
      } else {
        updated.set('page', String(value));
      }
      return updated;
    });
  };

  useEffect(() => {
    const qParam = searchParams.get('q');
    const occasionParam = searchParams.getAll('occasions');
    const occasionSingle = searchParams.get('occasion');
    const categoryParam = searchParams.get('category');
    const categoriesParams = searchParams.getAll('categories');
    const materialsParams = searchParams.getAll('materials');

    if (qParam) {
      setSearchQuery(qParam);
    } else {
      setSearchQuery('');
    }

    const occasionsToSet = occasionParam.length > 0 ? occasionParam : occasionSingle ? [occasionSingle] : [];

    const explicitCategories = categoriesParams.length > 0 ? categoriesParams : categoryParam ? [categoryParam] : [];
    const derivedCategories = explicitCategories.length === 0 ? deriveCategoriesFromOccasions(occasionsToSet, 1) : [];
    const categoriesToUse = explicitCategories.length > 0 ? explicitCategories : derivedCategories;

    if (categoriesToUse.length > 0) {
      const firstCat = categoriesToUse[0];
      setSelectedCategory(firstCat);

      // Only override occasions if URL doesn't have explicit occasions
      if (explicitCategories.length > 0 && occasionsToSet.length === 0) {
        const mapped = categoryMap[firstCat];
        if (mapped && mapped.length > 0) {
          setSelectedOccasions(mapped);
        } else {
          setSelectedOccasions([]);
        }
      } else {
        setSelectedOccasions(occasionsToSet);
      }
    } else {
      setSelectedCategory(null);
      setSelectedOccasions(occasionsToSet);
    }

    setSelectedMaterials(materialsParams.length > 0 ? materialsParams : []);
  }, [searchParams]);

  // When URL search params change, apply those filters immediately by
  // setting `appliedFilters`. The React Query `useQuery` below will react
  // and perform the network request. We avoid dispatching the "done" event
  // here because the query's `onSettled` will handle that.
  useEffect(() => {
    const params = searchParams;
    const filters: ProductFilter = {};
    const q = params.get('q');
    if (q) filters.searchQuery = q;
    const mats = params.getAll('materials');
    if (mats && mats.length > 0) filters.materials = mats;
    const occs = params.getAll('occasions');
    if (occs && occs.length > 0) filters.occasions = occs;
    const categoriesParams = params.getAll('categories');
    const singleCategory = params.get('category');
    let cats = categoriesParams.length > 0 ? categoriesParams : singleCategory ? [singleCategory] : [];
    if ((!cats || cats.length === 0) && occs && occs.length > 0) {
      const derivedCats = deriveCategoriesFromOccasions(occs, 1);
      if (derivedCats.length > 0) {
        cats = derivedCats;
      }
    }
    if (cats && cats.length > 0) {
      filters.categories = cats;
      if ((!filters.occasions || filters.occasions.length === 0) && cats[0]) {
        const mappedOccasions = categoryMap[cats[0]];
        if (mappedOccasions && mappedOccasions.length > 0) {
          filters.occasions = mappedOccasions;
        }
      }
    }
    const minP = params.get('minPrice');
    const maxP = params.get('maxPrice');
    if (minP) filters.minPrice = parseFloat(minP);
    if (maxP) filters.maxPrice = parseFloat(maxP);

    const pageParam = params.get('page');
    if (pageParam) {
      const parsed = parseInt(pageParam, 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        filters.page = parsed;
      }
    }

    applyFilters(filters, { nextPage: filters.page, resetPage: !filters.page, syncPageParam: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // load categories for labels
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cats = await getCategories();
        if (!mounted) return;
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const parsePriceRange = (range: string): { min?: number; max?: number } => {
    if (!range) return {};
    if (range === 'under-20') return { max: 20 };
    if (range === '20-50') return { min: 20, max: 50 };
    if (range === '50-100') return { min: 50, max: 100 };
    if (range === '100-500') return { min: 100, max: 500 };
    if (range === 'over-500') return { min: 500 };
    return {};
  };

  const buildFiltersFromState = (): ProductFilter => {
    const priceValues = parsePriceRange(priceRange);
    // Always set minPrice and maxPrice as top-level properties for chips
    return {
      materials: selectedMaterials.length > 0 ? selectedMaterials : undefined,
      occasions: selectedOccasions.length > 0 ? selectedOccasions : undefined,
      categories: selectedCategory ? [selectedCategory] : undefined,
      minPrice: typeof priceValues.min === 'number' ? priceValues.min : undefined,
      maxPrice: typeof priceValues.max === 'number' ? priceValues.max : undefined,
      searchQuery: searchQuery ? searchQuery : undefined,
    };
  };

  // Helper to apply filters from UI or URL. We store the filters in
  // `appliedFilters` so that the React Query below will manage fetching
  // and caching for us.
  function applyFilters(
    filters?: ProductFilter,
    options: { resetPage?: boolean; nextPage?: number; syncPageParam?: boolean } = {}
  ) {
    const effectiveFilters = filters ?? buildFiltersFromState();

    const normalizedFilters: ProductFilter = { ...effectiveFilters };
    const desiredPage =
      typeof options.nextPage === 'number' && options.nextPage > 0
        ? options.nextPage
        : typeof normalizedFilters.page === 'number' && normalizedFilters.page > 0
        ? normalizedFilters.page
        : options.resetPage
        ? 1
        : page;

    delete normalizedFilters.page;
    delete normalizedFilters.pageSize;

    const shouldSyncPageParam = options.syncPageParam !== false;

    setPage(desiredPage);
    const nextAppliedFilters: ProductFilter = {
      ...normalizedFilters,
      page: desiredPage,
      pageSize,
    };

    queryClient.prefetchQuery({
      queryKey: ['products', nextAppliedFilters],
      queryFn: () => ProductService.getProducts(nextAppliedFilters),
    });

    setAppliedFilters(nextAppliedFilters);

    if (shouldSyncPageParam) {
      syncPageParam(desiredPage);
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    });
  }

  // Debounced search: when `searchQuery` changes, wait before applying the
  // filters so we don't flood the server while the user types.
  useEffect(() => {
    if (!searchEffectInitializedRef.current) {
      searchEffectInitializedRef.current = true;
      lastSearchQueryRef.current = searchQuery;
      return undefined;
    }

    // Only apply filters if searchQuery actually changed in value
    if (lastSearchQueryRef.current === searchQuery) {
      return undefined;
    }

    lastSearchQueryRef.current = searchQuery;

    const id = window.setTimeout(() => {
      applyFilters(undefined, { resetPage: true });
    }, 400);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // React Query: fetch products for the currently applied filters. We enable
  // the query only when `appliedFilters` is not null so initial state is idle
  // until we explicitly apply filters.
  const {
    data: productsResponseRaw,
    isLoading,
    isFetching,
  } = useQuery<ProductListResponse, Error>({
    queryKey: ['products', appliedFilters],
    queryFn: async () => ProductService.getProducts(appliedFilters ?? undefined),
    enabled: appliedFilters !== null,
  });

  const productsResponse = productsResponseRaw as ProductListResponse | undefined;

  const items: Product[] = productsResponse?.items ?? [];
  const appliedFilterSnapshot = appliedFilters ?? undefined;

  // Always apply client-side filtering when we have filters to ensure consistency
  const hasFiltersToApply = Boolean(
    appliedFilterSnapshot &&
      (appliedFilterSnapshot.occasions?.length ||
        appliedFilterSnapshot.categories?.length ||
        appliedFilterSnapshot.materials?.length ||
        appliedFilterSnapshot.minPrice ||
        appliedFilterSnapshot.maxPrice ||
        appliedFilterSnapshot.searchQuery)
  );

  const locallyFilteredItems = hasFiltersToApply ? applyLocalFilters(items, appliedFilterSnapshot) : items;
  const usedClientFilterFallback = hasFiltersToApply && locallyFilteredItems.length !== items.length;

  const filteredProducts: Product[] = locallyFilteredItems
    .filter((product) => (searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true))
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return parseInt(b.id) - parseInt(a.id);
        default:
          return 0;
      }
    });

  const currentPage = usedClientFilterFallback ? 1 : productsResponse?.page ?? page;
  const pageCount = usedClientFilterFallback
    ? 1
    : productsResponse?.pageCount ?? Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const totalItems = usedClientFilterFallback
    ? filteredProducts.length
    : productsResponse?.total ?? filteredProducts.length;
  const effectivePageSize = usedClientFilterFallback
    ? filteredProducts.length || pageSize
    : productsResponse?.pageSize ?? pageSize;
  const firstItemIndex = totalItems === 0 ? 0 : (currentPage - 1) * effectivePageSize + 1;
  const lastItemIndex = totalItems === 0 ? 0 : Math.min(firstItemIndex + effectivePageSize - 1, totalItems);
  const canGoPrev = currentPage > 1 && !isLoading && !isFetching;
  const canGoNext = currentPage < pageCount && !isLoading && !isFetching;

  const goToPage = (nextPageValue: number) => {
    if (!Number.isFinite(nextPageValue) || nextPageValue < 1) return;
    if (nextPageValue === currentPage) return;
    if (productsResponse?.pageCount && nextPageValue > productsResponse.pageCount) return;
    applyFilters(undefined, { nextPage: nextPageValue });
  };

  const handlePrevPage = () => {
    if (!canGoPrev) return;
    goToPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (!canGoNext) return;
    goToPage(currentPage + 1);
  };

  const clearFilters = () => {
    setSelectedMaterials([]);
    setSelectedOccasions([]);
    setSelectedCategory(null);
    setPriceRange('');
    setSearchQuery('');
    setSortBy('featured');
    // clear URL params - this will trigger the URL sync effect which handles the fetch
    setSearchParams({});
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]
    );
  };

  const toggleOccasion = (occasion: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(occasion) ? prev.filter((o) => o !== occasion) : [...prev, occasion]
    );
  };

  // categories are now loaded from the taxonomy API and used in the sidebar

  const toggleCategory = (categoryKey: string) => {
    if (selectedCategory === categoryKey) {
      // clear selection and URL
      setSelectedCategory(null);
      setSelectedOccasions([]);
      setSearchParams({});
      return;
    }

    // set selection and map to occasions where applicable
    setSelectedCategory(categoryKey);
    const mapped = categoryMap[categoryKey];
    if (mapped && mapped.length > 0) {
      setSelectedOccasions(mapped);
    } else {
      setSelectedOccasions([]);
    }

    // sync selection to URL so the Products page can be linked/shared
    setSearchParams({ category: categoryKey });
  };

  const selectedCategoryLabel = categories.find((c) => (c.slug || c.name) === selectedCategory)?.name || null;

  // Memoize display filters for chips
  const displayFilters = React.useMemo(() => {
    if (!appliedFilterSnapshot) return {};
    const { page, pageSize, ...userFilters } = appliedFilterSnapshot;
    // Hide auto-mapped occasions when category is selected and occasions are not explicitly chosen
    const explicitOccasions = searchParams.getAll('occasions');
    const explicitCategories = searchParams.getAll('categories');
    const categoryParam = searchParams.get('category');
    const hasExplicitOccasions = explicitOccasions.length > 0;
    const hasExplicitCategory = explicitCategories.length > 0 || !!categoryParam;
    if (
      hasExplicitCategory &&
      !hasExplicitOccasions &&
      userFilters.categories &&
      userFilters.occasions &&
      userFilters.occasions.length > 0
    ) {
      // Only show category chip, hide auto-mapped occasions
      const { occasions, ...rest } = userFilters;
      return rest as NonNullable<typeof appliedFilterSnapshot>;
    }
    return userFilters as NonNullable<typeof appliedFilterSnapshot>;
  }, [appliedFilterSnapshot, searchParams]);

  // Apply filters whenever filter state changes (category, materials, occasions, price, search)
  useEffect(() => {
    applyFilters(undefined, { resetPage: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedMaterials, selectedOccasions, priceRange, searchQuery]);

  return (
    <div className="products-page">
      {/* Filters Sidebar (re-usable) */}
      <FiltersSidebar
        selectedMaterials={selectedMaterials}
        onToggleMaterial={toggleMaterial}
        selectedOccasions={selectedOccasions}
        onToggleOccasion={toggleOccasion}
        selectedCategory={selectedCategory}
        onToggleCategory={toggleCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        clearFilters={clearFilters}
      />

      {/* Products Grid */}
      <main className="products-main">
        <Breadcrumbs items={[{ label: 'Products' }]} />

        <div className="products-header">
          <h1>{selectedCategoryLabel || 'Our Products'}</h1>
          <div className="products-controls">
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
            <button className="filter-button" onClick={() => setIsFilterModalOpen(true)} aria-label="Open filters">
              <FiFilter /> Filters
            </button>
          </div>

          {/* Applied Filters Chips Row */}
          {hasFiltersToApply && appliedFilterSnapshot && (
            <AppliedFiltersChips
              filters={displayFilters}
              onRemove={(type, value) => {
                // Remove a single filter chip, only update state
                if (type === 'materials') {
                  setSelectedMaterials((prev) => prev.filter((m) => m !== value));
                } else if (type === 'occasions') {
                  setSelectedOccasions((prev) => prev.filter((o) => o !== value));
                } else if (type === 'categories') {
                  setSelectedCategory(null);
                  setSelectedOccasions([]);
                } else if (type === 'priceRange') {
                  // Clear both min and max when removing combined price range chip
                  setPriceRange('');
                } else if (type === 'minPrice') {
                  // Clear only min price, keep max if it exists
                  const currentPriceValues = parsePriceRange(priceRange);
                  if (typeof currentPriceValues.max === 'number') {
                    setPriceRange(`0-${currentPriceValues.max}`);
                  } else {
                    setPriceRange('');
                  }
                } else if (type === 'maxPrice') {
                  // Clear only max price, keep min if it exists
                  const currentPriceValues = parsePriceRange(priceRange);
                  if (typeof currentPriceValues.min === 'number') {
                    setPriceRange(`${currentPriceValues.min}-1000`);
                  } else {
                    setPriceRange('');
                  }
                } else if (type === 'searchQuery') {
                  setSearchQuery('');
                }
              }}
              onClearAll={clearFilters}
            />
          )}

          <div className="results-summary" aria-live="polite">
            {totalItems > 0
              ? `Showing ${firstItemIndex}-${lastItemIndex} of ${totalItems} items`
              : 'No products available in this view'}
          </div>
        </div>

        {isLoading || isFetching ? (
          <div className="loading-state">Loading products...</div>
        ) : (
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Link to={`/products/${product.id}`} state={{ product }} key={product.id} className="product-card">
                  <div className="product-image-container">
                    <div
                      className="product-image product-image-main"
                      style={{ backgroundImage: `url(${product.imageUrl.main})` }}
                    />
                    <div
                      className="product-image product-image-alt"
                      style={{ backgroundImage: `url(${product.imageUrl.alt})` }}
                    />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-price">${product.price.toFixed(2)}</p>
                    <div className="product-rating">
                      <FaStar className="star-icon" />
                      <span>
                        {product.rating} ({product.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="no-products">No products found matching your filters.</p>
            )}
          </div>
        )}

        <div className="pagination">
          <button
            className="pagination-btn btn-primary"
            onClick={handlePrevPage}
            disabled={!canGoPrev}
            aria-label="Previous page"
          >
            <FiChevronLeft /> Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {pageCount} | {totalItems} items
          </span>
          <button
            className="pagination-btn btn-primary"
            onClick={handleNextPage}
            disabled={!canGoNext}
            aria-label="Next page"
          >
            Next <FiChevronRight />
          </button>
        </div>
      </main>

      {/* Filter Drawer (mobile only) - reused for filtering on products page */}
      <FilterDrawer
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedMaterials={selectedMaterials}
        onToggleMaterial={toggleMaterial}
        selectedOccasions={selectedOccasions}
        onToggleOccasion={toggleOccasion}
        selectedCategory={selectedCategory}
        onToggleCategory={toggleCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        onApply={applyFilters}
        onClear={clearFilters}
      />
    </div>
  );
};

export default ProductsPage;
