import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import './Footer.css';

const Footer: React.FC = () => {
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Row 1: Top Navigation Links */}
        <nav className="footer-nav">
          <Link to={ROUTES.HOME}>Home</Link>
          <Link to={ROUTES.PRODUCTS}>Products</Link>
          <Link to={ROUTES.BLOG}>Blog</Link>
        </nav>

        {/* Row 2: Company Logo */}
        <div className="footer-logo">
          <h2>CustomCraft</h2>
        </div>

        {/* Row 3: Newsletter Signup */}
        <div className="footer-newsletter">
          <p className="newsletter-text">Yes, make me first to get the deals and updates</p>
          <div className="newsletter-form">
            <input type="email" placeholder="youremail@example.com" />
            <button type="button">Subscribe</button>
          </div>
        </div>

        {/* Row 4: Customer Service Dropdown */}
        <div className="footer-customer-service">
          <button
            className="customer-service-toggle"
            onClick={() => setIsCustomerServiceOpen(!isCustomerServiceOpen)}
            aria-expanded={isCustomerServiceOpen}
          >
            <span>Customer Service</span>
            {isCustomerServiceOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {isCustomerServiceOpen && (
            <ul className="customer-service-links">
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">Shipping & Delivery</a>
              </li>
              <li>
                <a href="#">Returns & Refunds</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          )}
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
            <a href="#">Terms</a>
            <span className="separator">•</span>
            <a href="#">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#">CA Supply Chain</a>
            <span className="separator">•</span>
            <a href="#">CA Privacy Rights</a>
            <span className="separator">•</span>
            <a href="#" className="privacy-choices">
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
            </a>
          </div>
          <p>© 2025 CustomCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
