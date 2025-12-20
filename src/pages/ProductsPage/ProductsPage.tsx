import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import type { Product, ProductFilter, ProductListResponse } from '../../types/product.types';
import ProductService from '../../services/product.service';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import FiltersSidebar from '../../components/Filters/FiltersSidebar';
import { getCategories, type TaxonomyItem } from '../../services/taxonomy.service';
import { PAGINATION } from '../../constants';
import './ProductsPage.css';

// Category => occasion mapping used for URL params and UI selection
const categoryMap: Record<string, string[]> = {
  'personal-milestones': ['birthday', 'anniversary', 'graduation'],
  'celebrations-holidays': ['christmas'],
  'love-relationships': ['wedding', 'anniversary'],
  'corporate-professional': ['corporate'],
  'hobbies-interests': [],
  'home-living': [],
};

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [appliedFilters, setAppliedFilters] = useState<ProductFilter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<TaxonomyItem[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const pageSize = PAGINATION.PRODUCTS_PER_PAGE;
  const queryClient = useQueryClient();

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
    }

    const occasionsToSet = occasionParam.length > 0 ? occasionParam : occasionSingle ? [occasionSingle] : [];
    if (occasionsToSet.length > 0) {
      setSelectedOccasions(occasionsToSet);
    }

    const categoriesToUse = categoriesParams.length > 0 ? categoriesParams : categoryParam ? [categoryParam] : [];
    if (categoriesToUse.length > 0) {
      const firstCat = categoriesToUse[0];
      const mapped = categoryMap[firstCat];
      setSelectedCategory(firstCat);
      if (mapped && mapped.length > 0) setSelectedOccasions(mapped);
    }

    if (materialsParams.length > 0) {
      setSelectedMaterials(materialsParams);
    }
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
    const cats = params.getAll('categories') || (params.get('category') ? [params.get('category') as string] : []);
    if (cats && cats.length > 0) filters.categories = cats;
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

  const buildFiltersFromState = (): ProductFilter => ({
    materials: selectedMaterials.length > 0 ? selectedMaterials : undefined,
    occasions: selectedOccasions.length > 0 ? selectedOccasions : undefined,
    categories: selectedCategory ? [selectedCategory] : undefined,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    searchQuery: searchQuery ? searchQuery : undefined,
  });

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
  }

  // initial load: fetch an unfiltered list
  useEffect(() => {
    applyFilters({}, { resetPage: true, syncPageParam: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search: when `searchQuery` changes, wait before applying the
  // filters so we don't flood the server while the user types.
  useEffect(() => {
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
  const filteredProducts: Product[] = items
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

  const currentPage = productsResponse?.page ?? page;
  const pageCount = productsResponse?.pageCount ?? Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const totalItems = productsResponse?.total ?? filteredProducts.length;
  const effectivePageSize = productsResponse?.pageSize ?? pageSize;
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
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    setSortBy('featured');
    // clear URL params
    setSearchParams({});
    // fetch full list after clearing filters
    applyFilters({}, { resetPage: true, syncPageParam: false });
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
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        clearFilters={clearFilters}
      />

      {/* Products Grid */}
      <main className="products-main">
        <div className="products-header">
          <h1>{selectedCategoryLabel || 'Our Products'}</h1>
          <div className="products-controls">
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
            {/* Apply button moved to mobile FilterDrawer; Apply via URL now triggers fetch */}
          </div>
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
          <button className="pagination-btn" onClick={handlePrevPage} disabled={!canGoPrev} aria-label="Previous page">
            <FiChevronLeft /> Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {pageCount} | {totalItems} items
          </span>
          <button className="pagination-btn" onClick={handleNextPage} disabled={!canGoNext} aria-label="Next page">
            Next <FiChevronRight />
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;
