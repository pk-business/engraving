import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useUser } from '../../hooks/useUser';
import { ROUTES } from '../../constants';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import './Header.css';

const Header: React.FC = () => {
  const { cart } = useCart();
  const { user, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setIsAccountDropdownOpen(false);
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="logo">
          <span className="logo-text">CustomCraft</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <Link 
            to={ROUTES.HOME} 
            className={`nav-link ${isActive(ROUTES.HOME) ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to={ROUTES.PRODUCTS} 
            className={`nav-link ${isActive(ROUTES.PRODUCTS) ? 'active' : ''}`}
          >
            Products
          </Link>
          <Link 
            to={ROUTES.BLOG} 
            className={`nav-link ${isActive(ROUTES.BLOG) ? 'active' : ''}`}
          >
            Blog
          </Link>
        </nav>

        {/* Right Section */}
        <div className="header-right">
          <div
            className="account-dropdown"
            onMouseEnter={() => setIsAccountDropdownOpen(true)}
            onMouseLeave={() => setIsAccountDropdownOpen(false)}
          >
            <button
              type="button"
              className="account-icon"
              aria-haspopup="true"
              aria-expanded={isAccountDropdownOpen}
              onClick={() => setIsAccountDropdownOpen((s) => !s)}
            >
              <FiUser size={22} />
            </button>

            {isAccountDropdownOpen && (
              <div className="account-dropdown-menu">
                {user ? (
                  <>
                    <div className="dropdown-user-info">
                      <p className="dropdown-username">{user.username}</p>
                    </div>
                    <button onClick={handleLogout} className="dropdown-logout-btn">
                      <FiLogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to={ROUTES.LOGIN}
                    className="dropdown-login-link"
                    onClick={() => setIsAccountDropdownOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
          
          <Link to={ROUTES.CHECKOUT} className="cart-icon">
            <FiShoppingCart size={22} />
            {cart.totalItems > 0 && (
              <span className="cart-badge">{cart.totalItems}</span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="nav-mobile">
          <Link
            to={ROUTES.HOME}
            className={`nav-link-mobile ${isActive(ROUTES.HOME) ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to={ROUTES.PRODUCTS}
            className={`nav-link-mobile ${isActive(ROUTES.PRODUCTS) ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            to={ROUTES.BLOG}
            className={`nav-link-mobile ${isActive(ROUTES.BLOG) ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blog
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
