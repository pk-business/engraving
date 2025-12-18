import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MaterialType, OccasionType, type Product } from '../../types/product.types';
import ProductService from '../../services/product.service';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdFilterList } from 'react-icons/md';
import { FaStar } from 'react-icons/fa';
import './ProductsPage.css';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialType[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<OccasionType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState('featured');

  // Apply URL query parameters on mount
  // Category => OccasionType mapping used both for URL params and UI selection
  const categoryMap: Record<string, OccasionType[]> = {
    'personal-milestones': [OccasionType.BIRTHDAY, OccasionType.ANNIVERSARY, OccasionType.GRADUATION],
    'celebrations-holidays': [OccasionType.CHRISTMAS],
    'love-relationships': [OccasionType.WEDDING, OccasionType.ANNIVERSARY],
    'corporate-professional': [OccasionType.CORPORATE],
    'hobbies-interests': [],
    'home-living': [],
  };

  useEffect(() => {
    const occasionParam = searchParams.get('occasion');
    const categoryParam = searchParams.get('category');

    if (occasionParam && Object.values(OccasionType).includes(occasionParam as OccasionType)) {
      setSelectedOccasions([occasionParam as OccasionType]);
      setSelectedCategory(null);
      return;
    }

    if (categoryParam) {
      const mapped = categoryMap[categoryParam];
      setSelectedCategory(categoryParam);
      if (mapped && mapped.length > 0) {
        setSelectedOccasions(mapped);
      } else {
        setSelectedOccasions([]);
      }
    }
  }, [searchParams]);

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
  }, [selectedMaterials, selectedOccasions, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products
    .filter((product) =>
      searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
    )
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


  const toggleMaterial = (material: MaterialType) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  const toggleOccasion = (occasion: OccasionType) => {
    setSelectedOccasions((prev) =>
      prev.includes(occasion)
        ? prev.filter((o) => o !== occasion)
        : [...prev, occasion]
    );
  };

  const categoryOptions: { key: string; label: string }[] = [
    { key: 'personal-milestones', label: 'Personal Milestones' },
    { key: 'celebrations-holidays', label: 'Celebrations & Holidays' },
    { key: 'love-relationships', label: 'Love & Relationships' },
    { key: 'corporate-professional', label: 'Corporate & Professional' },
    { key: 'hobbies-interests', label: 'Hobbies & Interests' },
    { key: 'home-living', label: 'Home & Living' },
  ];

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

  const selectedCategoryLabel = categoryOptions.find(c => c.key === selectedCategory)?.label || null;

  return (
    <div className="products-page">
      {/* Filters Sidebar */}
      <aside className="filters-sidebar">
        <div className="filter-section">
          <h3>Material Type</h3>
          <div className="filter-options">
            {Object.values(MaterialType).map((material) => (
              <label key={material} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(material)}
                  onChange={() => toggleMaterial(material)}
                />
                <span>{material.charAt(0).toUpperCase() + material.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Occasion</h3>
          <div className="filter-options">
            {Object.values(OccasionType).map((occasion) => (
              <label key={occasion} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedOccasions.includes(occasion)}
                  onChange={() => toggleOccasion(occasion)}
                />
                <span>{occasion.charAt(0).toUpperCase() + occasion.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Category</h3>
          <div className="filter-options">
            {categoryOptions.map((c) => (
              <label key={c.key} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === c.key}
                  onChange={() => toggleCategory(c.key)}
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Price Range</h3>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              className="price-input"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              className="price-input"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <button className="clear-filters" onClick={clearFilters}>
          <MdFilterList /> Clear All Filters
        </button>
      </aside>

      {/* Products Grid */}
      <main className="products-main">
        <div className="products-header">
          <h1>{selectedCategoryLabel || 'Our Products'}</h1>
          <div className="products-controls">
            <div className="search-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="search"
                placeholder="Search products..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
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
                <Link
                  to={`/products/${product.id}`}
                  key={product.id}
                  className="product-card"
                >
                  <div className="product-image-container">
                    <div className="product-image product-image-main" style={{ backgroundImage: `url(${product.imageUrl.main})` }} />
                    <div className="product-image product-image-alt" style={{ backgroundImage: `url(${product.imageUrl.alt})` }} />
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
              <p className="no-products">
                No products found matching your filters.
              </p>
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
