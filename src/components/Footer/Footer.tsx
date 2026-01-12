import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import subscriberService from '../../services/subscriber.service';
import './Footer.css';

const Footer: React.FC = () => {
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const location = useLocation();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setSubscribeStatus('error');
      setSubscribeMessage('Please enter your email address');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
      return;
    }

    setSubscribeStatus('loading');

    const result = await subscriberService.subscribe(email);

    if (result.success) {
      setSubscribeStatus('success');
      setSubscribeMessage(result.message);
      setEmail(''); // Clear the input
      setTimeout(() => setSubscribeStatus('idle'), 5000);
    } else {
      setSubscribeStatus('error');
      setSubscribeMessage(result.message);
      setTimeout(() => setSubscribeStatus('idle'), 5000);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Row 1: Top Navigation Links */}
        <nav className="footer-nav">
          <Link to={ROUTES.HOME} className={location.pathname === ROUTES.HOME ? 'active' : ''}>
            Home
          </Link>
          <Link to={ROUTES.PRODUCTS} className={location.pathname === ROUTES.PRODUCTS ? 'active' : ''}>
            Products
          </Link>
          <Link to={ROUTES.BLOG} className={location.pathname === ROUTES.BLOG ? 'active' : ''}>
            Blog
          </Link>
        </nav>

        {/* Row 2: Company Logo */}
        <div className="footer-logo">
          {/* TODO: Update business name once decided */}
          <h2>CustomCraft</h2>
        </div>

        {/* Row 3: Newsletter Signup */}
        <div className="footer-newsletter">
          <p className="newsletter-text">Yes, make me first to get the deals and updates</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="youremail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribeStatus === 'loading'}
            />
            <button type="submit" disabled={subscribeStatus === 'loading'}>
              {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {subscribeStatus === 'success' && <p className="newsletter-success">{subscribeMessage}</p>}
          {subscribeStatus === 'error' && <p className="newsletter-error">{subscribeMessage}</p>}
        </div>

        {/* Row 4: Customer Service Dropdown */}
        <div className="footer-customer-service">
          <button
            className="customer-service-toggle"
            onClick={() => setIsCustomerServiceOpen(!isCustomerServiceOpen)}
            aria-expanded={isCustomerServiceOpen}
          >
            <span>Customer Service</span>
            <span className="toggle-icon">{isCustomerServiceOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
          </button>
          <ul className={`customer-service-links ${isCustomerServiceOpen ? 'open' : ''}`}>
            <li>
              <Link to={ROUTES.CONTACT_US}>Contact Us</Link>
            </li>
            <li>
              <Link to={ROUTES.SHIPPING_DELIVERY}>Shipping & Delivery</Link>
            </li>
            <li>
              <Link to={ROUTES.RETURNS_REFUNDS}>Returns & Refunds</Link>
            </li>
            <li>
              <Link to={ROUTES.FAQ}>FAQ</Link>
            </li>
          </ul>
        </div>

        {/* Row 5: Social Media Icons */}
        <div className="footer-social">
          <a href="#" aria-label="Facebook">
            <FaFacebook />
          </a>
          <a href="#" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="#" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="#" aria-label="Pinterest">
            <FaPinterest />
          </a>
          <a href="#" aria-label="TikTok">
            <SiTiktok />
          </a>
        </div>

        {/* Row 6: Copyright */}
        <div className="footer-copyright">
          <div className="footer-legal-links">
            <Link to={ROUTES.TERMS_OF_SERVICE}>Terms of Service</Link>
            <span className="separator">•</span>
            <Link to={ROUTES.PRIVACY_POLICY}>Privacy Policy</Link>
            <span className="separator">•</span>
            <Link to={ROUTES.COOKIE_POLICY}>Cookie Policy</Link>
            <span className="separator">•</span>
            <Link to={ROUTES.DO_NOT_SELL}>Do Not Sell My Info</Link>
            <span className="separator">•</span>
            <Link to={ROUTES.CA_PRIVACY_RIGHTS}>CA Privacy Rights</Link>
            <span className="separator">•</span>
            <Link to={ROUTES.YOUR_PRIVACY_CHOICES} className="privacy-choices">
              Your Privacy Choices
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect width="14" height="14" rx="2" fill="#0B7DA0" />
                <path
                  d="M3.5 7L6 9.5L10.5 4.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.5 9.5L8 7"
                  stroke="#FF6B6B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <span className="separator">•</span>
            <Link to={ROUTES.ACCESSIBILITY}>Accessibility</Link>
            <span className="separator">•</span>
            <Link to={ROUTES.CA_SUPPLY_CHAIN_ACT}>CA Supply Chain Act</Link>
          </div>
          <p>© 2025 CustomCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
