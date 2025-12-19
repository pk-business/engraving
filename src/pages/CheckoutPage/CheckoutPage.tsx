import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { PaymentMethod } from '../../types/cart.types';
import { FaCreditCard, FaPaypal, FaApplePay } from 'react-icons/fa';
import { MdLocalShipping, MdPayment } from 'react-icons/md';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FiTrash2 } from 'react-icons/fi';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import './CheckoutPage.css';
import { useAnnouncement } from '../../contexts/announcement.core';

const CheckoutPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { announce } = useAnnouncement();
  const [isSummaryVisible, setIsSummaryVisible] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CREDIT_CARD
  );
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Processing order...', { shippingInfo, paymentMethod });
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-container">
        {/* Shipping Information */}
        <div className="checkout-main">
          {/* Mobile toggle to show/hide order summary */}
          <button
            type="button"
            className="summary-toggle-main"
            onClick={() => {
              setIsSummaryVisible((v) => {
                const next = !v;
                announce(next ? 'Order summary shown' : 'Order summary hidden');
                return next;
              });
            }}
            aria-expanded={isSummaryVisible}
            aria-controls="order-summary"
          >
            {isSummaryVisible ? 'Hide order summary' : `View order summary (${cart.items.length})`}
          </button>
          <section className="checkout-section">
            <h2>
              <MdLocalShipping /> Shipping Information
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group full">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <label>Address Line 1 *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={shippingInfo.addressLine1}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <label>Address Line 2</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={shippingInfo.addressLine2}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input type="text" name="city" value={shippingInfo.city} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input type="text" name="state" value={shippingInfo.state} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input type="tel" name="phone" value={shippingInfo.phone} onChange={handleInputChange} required />
                </div>
              </div>
            </form>
          </section>

          {/* Payment Method */}
          <section className="checkout-section">
            <h2>
              <MdPayment /> Payment Method
            </h2>
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value={PaymentMethod.CREDIT_CARD}
                  checked={paymentMethod === PaymentMethod.CREDIT_CARD}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                />
                <FaCreditCard className="payment-icon" />
                <span>Credit Card</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value={PaymentMethod.PAYPAL}
                  checked={paymentMethod === PaymentMethod.PAYPAL}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                />
                <FaPaypal className="payment-icon" />
                <span>PayPal</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value={PaymentMethod.APPLE_PAY}
                  checked={paymentMethod === PaymentMethod.APPLE_PAY}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                />
                <FaApplePay className="payment-icon" />
                <span>Apple Pay</span>
              </label>
            </div>

            {paymentMethod === PaymentMethod.CREDIT_CARD && (
              <div className="credit-card-form">
                <div className="form-group full">
                  <label>Card Number *</label>
                  <input type="text" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date *</label>
                    <input type="text" placeholder="MM/YY" />
                  </div>
                  <div className="form-group">
                    <label>CVV *</label>
                    <input type="text" placeholder="123" />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Order Summary */}
        <aside
          id="order-summary"
          className={`order-summary ${isSummaryVisible ? '' : 'collapsed'}`}
          aria-hidden={!isSummaryVisible}
        >
          <div className="order-summary-header">
            <h2>Order Summary</h2>
            <button
              type="button"
              className="summary-toggle-aside"
              onClick={() => {
                setIsSummaryVisible(false);
                announce('Order summary hidden');
              }}
              aria-label="Collapse order summary"
            >
              Hide
            </button>
          </div>

          <div className="summary-items">
            {cart.items.length === 0 ? (
              <p className="empty-cart">Your cart is empty</p>
            ) : (
              cart.items.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="summary-top">
                    <div className="item-left">
                      <img className="item-thumb" src={item.product.imageUrl.main} alt={item.product.name} />
                      <div className="item-info">
                        <span className="item-name">{item.product.name}</span>
                      </div>
                    </div>
                    <div className="item-price">${item.totalPrice.toFixed(2)}</div>
                  </div>

                  <div className="summary-bottom">
                    <div className="item-controls">
                      <span className="qty-control">
                        <select
                          value={item.quantity}
                          onChange={(e) => {
                            const val = Math.max(1, parseInt(e.target.value) || 1);
                            updateQuantity(item.id, val);
                            announce(`Quantity for ${item.product.name} changed to ${val}`);
                          }}
                          className="qty-select"
                          aria-label={`Quantity for ${item.product.name}`}
                        >
                          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </span>

                      <span className="delete-control">
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => {
                            removeFromCart(item.id);
                            announce(`${item.product.name} removed from cart`);
                          }}
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <FiTrash2 />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="summary-calculations">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${cart.tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>${cart.shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>

          <button className="place-order-btn" onClick={handleSubmit} disabled={cart.items.length === 0}>
            <BsCheckCircleFill /> Place Order
          </button>
          <button type="button" className="continue-shopping-btn checkout" onClick={() => navigate(ROUTES.PRODUCTS)}>
            <FiArrowLeft /> Continue Shopping
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
