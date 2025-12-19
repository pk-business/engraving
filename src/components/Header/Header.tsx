import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useUser } from '../../hooks/useUser';
import { ROUTES } from '../../constants';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import './Header.css';
import SearchBar from '../Search/SearchBar';
import FilterDrawer from '../FilterDrawer/FilterDrawer';

const Header: React.FC = () => {
  const { cart } = useCart();
  const { user, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const isSearchInputFocused = () => {
    try {
      const ae = document.activeElement as HTMLElement | null;
      if (!ae) return false;
      return Boolean(ae.closest && ae.closest('.searchbar'));
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    logout();
    setIsAccountDropdownOpen(false);
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-top">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="logo">
            <span className="logo-text">Custom</span>
          </Link>

          {/* Right Section (moved into top wrapper for mobile row) */}
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
              {cart.totalItems > 0 && <span className="cart-badge">{cart.totalItems}</span>}
            </Link>
          </div>
        </div>

        {/* Center: search above menu on desktop */}
        <div className="header-center">
          <div className="header-search-desktop">
            {/* Mobile hamburger placed to the left of the search on small screens */}
            <button
              className="mobile-menu-btn mobile-menu-btn--search"
              onClick={() => setIsFilterOpen((s) => !s)}
              aria-expanded={isFilterOpen}
              aria-controls="mobile-filter-drawer"
              aria-label={isFilterOpen ? 'Close filters' : 'Open filters'}
            >
              {isFilterOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            <SearchBar
              value={new URLSearchParams(location.search).get('q') || ''}
              onSearch={(q) => {
                // Only navigate if the search input is focused (prevents debounced search
                // from firing when the user clicks other header links)
                if (!isSearchInputFocused()) return;
                // If not on products, navigate to products page with q
                if (!location.pathname.startsWith(ROUTES.PRODUCTS)) {
                  navigate(`${ROUTES.PRODUCTS}?q=${encodeURIComponent(q)}`);
                } else {
                  // update URL while staying on products
                  navigate(
                    `${location.pathname}?${new URLSearchParams({
                      ...Object.fromEntries(new URLSearchParams(location.search)),
                      q,
                    }).toString()}`
                  );
                }
              }}
              placeholder="Search products..."
              debounceMs={250}
              minChars={0}
            />
          </div>

          {/* Desktop Navigation (below search) */}
          <nav className="nav-desktop">
            <Link to={ROUTES.HOME} className={`nav-link ${isActive(ROUTES.HOME) ? 'active' : ''}`}>
              Home
            </Link>
            <Link to={ROUTES.PRODUCTS} className={`nav-link ${isActive(ROUTES.PRODUCTS) ? 'active' : ''}`}>
              Products
            </Link>
            <Link to={ROUTES.BLOG} className={`nav-link ${isActive(ROUTES.BLOG) ? 'active' : ''}`}>
              Blog
            </Link>
          </nav>
        </div>

        {/* Right Section is moved into header-top for mobile/row layout */}
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

      {/* Filter Drawer (mobile only) */}
      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      {/* mobile search removed; search is part of header center and visible on small screens */}
    </header>
  );
};

export default Header;
