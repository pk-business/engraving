import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FiUpload } from 'react-icons/fi';
import { MdShoppingCart } from 'react-icons/md';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import ProductService from '../../services/product.service';
import { useCart } from '../../hooks/useCart';
import { useAnnouncement } from '../../contexts/AnnouncementContext';
import type { Product } from '../../types/product.types';
import './ProductDetailPage.css';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const { announce } = useAnnouncement();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [customText, setCustomText] = useState('');
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const fetchProduct = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await ProductService.getProductById(id!);
      setProduct(data);
      if (data?.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomImage(e.target.files[0]);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(
        product,
        quantity,
        {
          productId: product.id,
          customText: customText || undefined,
          customImage: customImage || undefined,
          selectedSize: selectedSize || undefined,
        }
      );
      announce(`Added ${quantity} ${product.name} to cart`);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<BsStarFill key={`full-${i}`} />);
    }
    if (hasHalfStar) {
      stars.push(<BsStarHalf key="half" />);
    }
    return stars;
  };

  if (loading) {
    return <div className="product-detail-page"><div className="loading-state">Loading product...</div></div>;
  }

  if (!product) {
    return <div className="product-detail-page"><div className="loading-state">Product not found</div></div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-container">
        {/* Image Gallery */}
        <div className="image-section">
          <div className="main-image">
            <img src={[product.imageUrl.main, product.imageUrl.alt, ...product.images][selectedImageIndex]} alt={product.name} />
          </div>
          <div className="thumbnail-strip">
            {[product.imageUrl.main, product.imageUrl.alt, ...product.images].map((img, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                onClick={() => setSelectedImageIndex(index)}
                style={{ backgroundImage: `url(${img})` }}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="product-rating">
            <span className="stars">
              {renderStars(product.rating || 0)}
            </span>
            <span className="review-count">({product.reviewCount || 0} reviews)</span>
          </div>
          <div className="product-price">${product.price.toFixed(2)}</div>
          <p className="product-description">{product.description}</p>

          <div className="product-meta">
            <p><strong>Material:</strong> {product.material.charAt(0).toUpperCase() + product.material.slice(1)}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Stock:</strong> {product.inStock ? 'In Stock' : 'Out of Stock'}</p>
          </div>

          {/* Material & Occasion Tags */}
          <div className="product-tags">
            <span className="tag">{product.material.charAt(0).toUpperCase() + product.material.slice(1)}</span>
            {product.occasions.map((occasion) => (
              <span key={occasion} className="tag">
                {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
              </span>
            ))}
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="product-option">
              <label>Size:</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="size-select"
              >
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity */}
          <div className="product-option">
            <label>Quantity:</label>
            <div className="quantity-control">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <AiOutlineMinus />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>
                <AiOutlinePlus />
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button className="action-btn add-to-cart-btn" onClick={handleAddToCart} disabled={!product.inStock}>
              <MdShoppingCart size={20} /> {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
              className="action-btn go-to-cart-btn"
              onClick={() => navigate(ROUTES.CHECKOUT)}
              disabled={cart.totalItems < 1}
              aria-disabled={cart.totalItems < 1}
              title={cart.totalItems < 1 ? 'Add items to cart first' : 'Go to checkout'}
            >
              Go to Cart
            </button>
          </div>

          <button className="continue-shopping-btn" onClick={() => navigate(ROUTES.PRODUCTS)}>
            <FiArrowLeft /> Continue Shopping
          </button>
        </div>

        {/* Customization Section */}
        {product.customizable && (
          <div className="customization-section">
            <h2>Customize Your Product</h2>

            {/* Text Customization */}
            <div className="customization-option">
              <label>Custom Text:</label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter your custom text here..."
                maxLength={100}
                rows={3}
              />
              <small>{customText.length}/100 characters</small>
            </div>

            {/* Image Upload */}
            <div className="customization-option">
              <label>Upload Custom Image:</label>
              <div className="file-input-wrapper">
                <FiUpload className="upload-icon" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
              </div>
              {customImage && (
                <p className="file-name">Selected: {customImage.name}</p>
              )}
            </div>

            {/* Live Preview */}
            <div className="preview-section">
              <h3>Live Preview</h3>
              <div className="preview-box">
                {customText && <p className="preview-text">{customText}</p>}
                {customImage && (
                  <p className="preview-image-info">
                    Image: {customImage.name}
                  </p>
                )}
                {!customText && !customImage && (
                  <p className="preview-placeholder">
                    Your customization will appear here
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Details Tabs */}
      <div className="product-tabs">
        <div className="tab active">Description</div>
        <div className="tab">Specifications</div>
        <div className="tab">Reviews ({product.reviewCount || 0})</div>
      </div>

      <div className="tab-content">
        <h3>Product Description</h3>
        <p>{product.description}</p>
        <br />
        <h4>Features:</h4>
        <ul>
          <li>High-quality {product.material} material</li>
          <li>Perfect for: {product.occasions.join(', ')}</li>
          {product.customizable && <li>Fully customizable with text and images</li>}
          {product.sizes && product.sizes.length > 0 && (
            <li>Available sizes: {product.sizes.join(', ')}</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProductDetailPage;
