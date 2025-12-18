import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>CustomCraft</h3>
          <p>Premium Laser Engraved & CNC Cut Custom Items</p>
          <p className="copyright">© 2025 CustomCraft. All rights reserved.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to={ROUTES.HOME}>Home</Link>
            </li>
            <li>
              <Link to={ROUTES.PRODUCTS}>Products</Link>
            </li>
            <li>
              <Link to={ROUTES.BLOG}>Blog</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
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
        </div>

        <div className="footer-section">
          <h4>Connect With Us</h4>
          <ul className="social-links">
            <li>
              <a href="#"><FaFacebook /> Facebook</a>
            </li>
            <li>
              <a href="#"><FaInstagram /> Instagram</a>
            </li>
            <li>
              <a href="#"><FaTwitter /> Twitter</a>
            </li>
            <li>
              <a href="#"><FaPinterest /> Pinterest</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Newsletter</h4>
          <p>Subscribe to get special offers and updates</p>
          <div className="newsletter-form">
            <MdEmail className="newsletter-icon" />
            <input type="email" placeholder="Your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
