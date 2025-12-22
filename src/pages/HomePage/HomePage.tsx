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
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import ProductService from '../../services/product.service';
import LandingService from '../../services/landing.service';
import type { Product } from '../../types/product.types';
import type { HeroSlide } from '../../types/landing.types';
import { useQuery } from '@tanstack/react-query';
import './HomePage.css';

const OCCASION_FILTERS: Record<string, string[]> = {
  'personal-milestones': ['birthday', 'anniversary', 'graduation'],
  'celebrations-holidays': ['christmas'],
  'love-relationships': ['wedding', 'anniversary'],
  'corporate-professional': ['corporate'],
  'hobbies-interests': ['hobbies'],
  'home-living': ['home'],
};

const buildOccasionUrl = (key: string): string => {
  const occasions = OCCASION_FILTERS[key] ?? [];
  if (occasions.length === 0) return '/products';
  const params = new URLSearchParams();
  occasions.forEach((occasion) => params.append('occasions', occasion));
  params.set('category', key);
  return `/products?${params.toString()}`;
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]); // fallback for SSR or initial
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlideChanging, setIsSlideChanging] = useState(false);

  // Fetch hero slides
  const {
    data: heroSlides,
    isLoading: heroLoading,
    isError: heroError,
  } = useQuery<HeroSlide[], Error>({
    queryKey: ['hero-slides'],
    queryFn: () => LandingService.getLandingPageData(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Fetch featured products
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

  // Auto-advance slides every 8 seconds
  useEffect(() => {
    if (!heroSlides || heroSlides.length <= 1) return;

    const interval = setInterval(() => {
      setIsSlideChanging(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsSlideChanging(false);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, [heroSlides]);

  const handleSlideChange = (index: number) => {
    if (index === currentSlide || isSlideChanging) return;
    setIsSlideChanging(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsSlideChanging(false);
    }, 300);
  };

  const handlePrevSlide = () => {
    if (!heroSlides || isSlideChanging) return;
    handleSlideChange((currentSlide - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    if (!heroSlides || isSlideChanging) return;
    handleSlideChange((currentSlide + 1) % heroSlides.length);
  };

  const handleSlideAction = (slide: HeroSlide) => {
    const filterUrl = LandingService.buildFilterUrl(slide);
    navigate(filterUrl);
  };

  const fetchedFeatured: Product[] = data ?? [];
  const displayFeatured: Product[] = featuredProducts.length > 0 ? featuredProducts : fetchedFeatured;

  const activeSlide = heroSlides?.[currentSlide];
  const backgroundImageUrl = activeSlide ? LandingService.getBackgroundImageUrl(activeSlide) : null;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section 
        key={currentSlide}
        className={`hero-section ${isSlideChanging ? 'fade-out' : 'fade-in'}`}
        style={{
          backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          {heroLoading ? (
            <>
              <h1>Loading...</h1>
              <p>Please wait while we load the latest content</p>
            </>
          ) : heroError || !heroSlides || heroSlides.length === 0 ? (
            <>
              <h1>Create Something Unique</h1>
              <p>Premium laser engraved & CNC cut custom items for every occasion</p>
              <button className="cta-button" onClick={() => navigate('/products')}>
                Shop Now
              </button>
            </>
          ) : (
            <>
              <h1>{activeSlide?.title}</h1>
              <p>{activeSlide?.description}</p>
              <button 
                className="cta-button" 
                onClick={() => activeSlide && handleSlideAction(activeSlide)}
              >
                {activeSlide?.buttonText || 'Shop Now'}
              </button>
            </>
          )}
        </div>

        {/* Slide Navigation */}
        {heroSlides && heroSlides.length > 1 && (
          <>
            <button 
              className="hero-nav-button hero-nav-prev" 
              onClick={handlePrevSlide}
              aria-label="Previous slide"
            >
              <FaChevronLeft />
            </button>
            <button 
              className="hero-nav-button hero-nav-next" 
              onClick={handleNextSlide}
              aria-label="Next slide"
            >
              <FaChevronRight />
            </button>

            {/* Slide Indicators */}
            <div className="hero-indicators">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => handleSlideChange(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
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
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  {product.rating && (
                    <div className="product-rating">
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
          <Link to={buildOccasionUrl('personal-milestones')} className="occasion-card personal">
            <FaGift className="occasion-icon" />
            <span>Personal Milestones</span>
          </Link>

          <Link to={buildOccasionUrl('celebrations-holidays')} className="occasion-card celebrations">
            <FaCalendarAlt className="occasion-icon" />
            <span>Celebrations & Holidays</span>
          </Link>

          <Link to={buildOccasionUrl('love-relationships')} className="occasion-card love">
            <FaUsers className="occasion-icon" />
            <span>Love & Relationships</span>
          </Link>

          <Link to={buildOccasionUrl('corporate-professional')} className="occasion-card corporate">
            <FaBriefcase className="occasion-icon" />
            <span>Corporate & Professional</span>
          </Link>

          <Link to={buildOccasionUrl('hobbies-interests')} className="occasion-card hobbies">
            <FaGamepad className="occasion-icon" />
            <span>Hobbies & Interests</span>
          </Link>

          <Link to={buildOccasionUrl('home-living')} className="occasion-card home">
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
