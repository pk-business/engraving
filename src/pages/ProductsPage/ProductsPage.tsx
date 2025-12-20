import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Product } from '../../types/product.types';
import ProductService from '../../services/product.service';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import FiltersSidebar from '../../components/Filters/FiltersSidebar';
import { getCategories, type TaxonomyItem } from '../../services/taxonomy.service';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<TaxonomyItem[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState('featured');

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

    // handle occasions: support single 'occasion' or multiple 'occasions='
    const occasionsToSet = occasionParam.length > 0 ? occasionParam : occasionSingle ? [occasionSingle] : [];
    if (occasionsToSet.length > 0) {
      setSelectedOccasions(occasionsToSet);
    }

    // handle categories: support singular 'category' or plural 'categories'
    const categoriesToUse = categoriesParams.length > 0 ? categoriesParams : categoryParam ? [categoryParam] : [];
    if (categoriesToUse.length > 0) {
      // if multiple categories provided, just pick the first for the radio-style category selection
      const firstCat = categoriesToUse[0];
      const mapped = categoryMap[firstCat];
      setSelectedCategory(firstCat);
      if (mapped && mapped.length > 0) setSelectedOccasions(mapped);
    }

    // materials (from drawer) -> map to MaterialType if possible
    if (materialsParams.length > 0) {
      setSelectedMaterials(materialsParams);
    }
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

  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        materials: selectedMaterials.length > 0 ? selectedMaterials : undefined,
        occasions: selectedOccasions.length > 0 ? selectedOccasions : undefined,
        categories: selectedCategory ? [selectedCategory] : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      };
      const data = await ProductService.getProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedMaterials, selectedOccasions, selectedCategory, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products
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
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) => (prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]));
  };

  const toggleOccasion = (occasion: string) => {
    setSelectedOccasions((prev) => (prev.includes(occasion) ? prev.filter((o) => o !== occasion) : [...prev, occasion]));
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

  const selectedCategoryLabel = (categories.find((c) => (c.slug || c.name) === selectedCategory)?.name) || null;

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
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : (
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Link to={`/products/${product.id}`} key={product.id} className="product-card">
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
          <button className="pagination-btn">
            <FiChevronLeft /> Previous
          </button>
          <span className="pagination-info">Page 1 of 1</span>
          <button className="pagination-btn">
            Next <FiChevronRight />
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;
