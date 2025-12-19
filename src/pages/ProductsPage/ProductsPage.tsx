import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MaterialType, OccasionType, type Product } from '../../types/product.types';
import ProductService from '../../services/product.service';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import FiltersSidebar from '../../components/Filters/FiltersSidebar';
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
      const valid = occasionsToSet.filter((v) =>
        Object.values(OccasionType).includes(v as OccasionType)
      ) as OccasionType[];
      setSelectedOccasions(valid);
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
      // MaterialType is an enum of strings; coerce any matching values
      const matValues = Object.values(MaterialType);
      const mats = materialsParams.filter((m) => matValues.includes(m)) as MaterialType[];
      setSelectedMaterials(mats);
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

  const toggleMaterial = (material: MaterialType) => {
    setSelectedMaterials((prev) =>
      prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]
    );
  };

  const toggleOccasion = (occasion: OccasionType) => {
    setSelectedOccasions((prev) =>
      prev.includes(occasion) ? prev.filter((o) => o !== occasion) : [...prev, occasion]
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

  const selectedCategoryLabel = categoryOptions.find((c) => c.key === selectedCategory)?.label || null;

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
        categoryOptions={categoryOptions}
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
