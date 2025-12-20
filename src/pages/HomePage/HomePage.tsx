import React, { useEffect, useState } from 'react';
import {
  FaCut,
  FaCogs,
  FaPalette,
  FaShippingFast,
  FaRing,
  FaGift,
  FaCalendarAlt,
  FaUsers,
  FaBriefcase,
  FaGamepad,
  FaHome,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import ProductService from '../../services/product.service';
import type { Product } from '../../types/product.types';
import { useQuery } from '@tanstack/react-query';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]); // fallback for SSR or initial

  const {
    data,
    isLoading: loading,
    isError,
    error,
    isFetching,
  } = useQuery<Product[], Error>({
    queryKey: ['featured', 8],
    queryFn: () => ProductService.getFeaturedProducts(8),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (data) {
      setFeaturedProducts(data);
    }
  }, [data]);

  const fetchedFeatured: Product[] = data ?? [];
  const displayFeatured: Product[] = featuredProducts.length > 0 ? featuredProducts : fetchedFeatured;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Create Something Unique</h1>
          <p>Premium laser engraved & CNC cut custom items for every occasion</p>
          <button className="cta-button" onClick={() => navigate('/products')}>
            Shop Now
          </button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {loading || isFetching ? (
            <div className="placeholder-text">
              <div className="spinner" aria-hidden="true" />
              <div style={{ marginTop: 12 }}>Loading products...</div>
            </div>
          ) : isError ? (
            <p className="placeholder-text">Error loading featured products: {error?.message ?? 'Unknown error'}</p>
          ) : featuredProducts.length === 0 && fetchedFeatured.length === 0 ? (
            <p className="placeholder-text">No products available. Start the API server with: npm run api</p>
          ) : (
            displayFeatured.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} state={{ product }} className="product-card">
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
                <div className="product-info-card">
                  <h3>{product.name}</h3>
                  <p className="product-price-card">${product.price.toFixed(2)}</p>
                  {product.rating && (
                    <div className="product-rating-card">
                      ⭐ {product.rating} ({product.reviewCount})
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Occasions Section */}
      <section className="occasions-section">
        <h2>Shop by Occasion</h2>
        <div className="occasions-grid">
          <Link to={`/products?category=personal-milestones`} className="occasion-card personal">
            <FaGift className="occasion-icon" />
            <span>Personal Milestones</span>
          </Link>

          <Link to={`/products?category=celebrations-holidays`} className="occasion-card celebrations">
            <FaCalendarAlt className="occasion-icon" />
            <span>Celebrations & Holidays</span>
          </Link>

          <Link to={`/products?category=love-relationships`} className="occasion-card love">
            <FaUsers className="occasion-icon" />
            <span>Love & Relationships</span>
          </Link>

          <Link to={`/products?category=corporate-professional`} className="occasion-card corporate">
            <FaBriefcase className="occasion-icon" />
            <span>Corporate & Professional</span>
          </Link>

          <Link to={`/products?category=hobbies-interests`} className="occasion-card hobbies">
            <FaGamepad className="occasion-icon" />
            <span>Hobbies & Interests</span>
          </Link>

          <Link to={`/products?category=home-living`} className="occasion-card home">
            <FaHome className="occasion-icon" />
            <span>Home & Living</span>
          </Link>

          <Link to={`/products`} className="occasion-card all">
            <FaRing className="occasion-icon" />
            <span>All Occasions / Custom</span>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <FaPalette className="service-icon" />
            <h3>Laser Engraving</h3>
            <p>Precision engraving on metal, wood, leather, and more</p>
          </div>
          <div className="service-card">
            <FaCut className="service-icon" />
            <h3>CNC Cutting</h3>
            <p>Custom cut designs with perfect accuracy</p>
          </div>
          <div className="service-card">
            <FaCogs className="service-icon" />
            <h3>Custom Designs</h3>
            <p>Upload your own images and text for personalization</p>
          </div>
          <div className="service-card">
            <FaShippingFast className="service-icon" />
            <h3>Fast Delivery</h3>
            <p>Quick turnaround times on all orders</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
