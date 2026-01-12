import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useUser } from '../../hooks/useUser';
import { ROUTES } from '../../constants';
import { FiShoppingCart, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { VscAccount } from 'react-icons/vsc';
import './Header.css';
import SearchBar from '../Search/SearchBar';
import NavigationDrawer from '../NavigationDrawer/NavigationDrawer';
import DesktopNavDropdown from '../DesktopNavDropdown/DesktopNavDropdown';
import blogIcon from '../../assets/images/blog.svg';

const Header: React.FC = () => {
  const { cart } = useCart();
  const { user, logout } = useUser();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState<
    'occasion' | 'recipient' | 'product' | 'teams' | null
  >(null);
  const [dropdownArrowOffset, setDropdownArrowOffset] = useState(0);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    };

    if (isAccountDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isAccountDropdownOpen]);

  const handleDropdownMouseEnter = (
    type: 'occasion' | 'recipient' | 'product' | 'teams',
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    // Calculate arrow offset based on the nav item position
    const wrapper = event.currentTarget;
    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;
    const viewportCenter = window.innerWidth / 2;
    const offset = wrapperCenter - viewportCenter;

    setDropdownArrowOffset(offset);
    setActiveDesktopDropdown(type);
  };

  const handleNavLinkClick = (type: 'occasion' | 'recipient' | 'product' | 'teams') => {
    // Navigate to products page - clicking the main nav link shows all products
    // (Individual dropdown items will filter by specific values)
    if (type === 'teams') {
      navigate('/products?bulkEligible=true');
    } else {
      navigate('/products');
    }
    setActiveDesktopDropdown(null);
  };

  const handleDropdownMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDesktopDropdown(null);
    }, 200);
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
          {/* Hamburger first for mobile */}
          <button
            className="mobile-menu-btn mobile-menu-btn--search"
            onClick={() => setIsNavOpen((s) => !s)}
            aria-expanded={isNavOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
          >
            {isNavOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          {/* Logo */}
          <Link to={ROUTES.HOME} className="logo">
            <span className="logo-text">Custom</span>
          </Link>

          {/* Right Section */}
          <div className="header-right">
            <Link to={ROUTES.BLOG} className="blog-icon" aria-label="Blog">
              <img src={blogIcon} alt="Blog" width="22" height="22" />
            </Link>

            <div className="account-dropdown" ref={accountDropdownRef}>
              <button
                type="button"
                className="account-icon"
                aria-haspopup="true"
                aria-expanded={isAccountDropdownOpen}
                onClick={() => setIsAccountDropdownOpen((s) => !s)}
              >
                <VscAccount size={22} />
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

        {/* Search Bar - inline on desktop, separate row on mobile */}
        <div className="header-search-desktop">
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

        {/* Desktop Navigation (below header-top) */}
        <nav className="nav-desktop">
          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={(e) => handleDropdownMouseEnter('occasion', e)}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <button
              className={`nav-link ${activeDesktopDropdown === 'occasion' ? 'active' : ''}`}
              type="button"
              onClick={() => handleNavLinkClick('occasion')}
            >
              By Occasion
            </button>
            <DesktopNavDropdown
              isOpen={activeDesktopDropdown === 'occasion'}
              onClose={() => setActiveDesktopDropdown(null)}
              type="occasion"
              arrowOffset={dropdownArrowOffset}
            />
          </div>

          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={(e) => handleDropdownMouseEnter('recipient', e)}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <button
              className={`nav-link ${activeDesktopDropdown === 'recipient' ? 'active' : ''}`}
              type="button"
              onClick={() => handleNavLinkClick('recipient')}
            >
              By Recipient
            </button>
            <DesktopNavDropdown
              isOpen={activeDesktopDropdown === 'recipient'}
              onClose={() => setActiveDesktopDropdown(null)}
              type="recipient"
              arrowOffset={dropdownArrowOffset}
            />
          </div>

          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={(e) => handleDropdownMouseEnter('product', e)}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <button
              className={`nav-link ${activeDesktopDropdown === 'product' ? 'active' : ''}`}
              type="button"
              onClick={() => handleNavLinkClick('product')}
            >
              By Product
            </button>
            <DesktopNavDropdown
              isOpen={activeDesktopDropdown === 'product'}
              onClose={() => setActiveDesktopDropdown(null)}
              type="product"
              arrowOffset={dropdownArrowOffset}
            />
          </div>

          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={(e) => handleDropdownMouseEnter('teams', e)}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <button
              className={`nav-link ${activeDesktopDropdown === 'teams' ? 'active' : ''}`}
              type="button"
              onClick={() => handleNavLinkClick('teams')}
            >
              For Teams
            </button>
            <DesktopNavDropdown
              isOpen={activeDesktopDropdown === 'teams'}
              onClose={() => setActiveDesktopDropdown(null)}
              type="teams"
              arrowOffset={dropdownArrowOffset}
            />
          </div>
        </nav>

        {/* Right Section is moved into header-top for mobile/row layout */}
      </div>

      {/* Navigation Drawer (mobile only) */}
      <NavigationDrawer isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      {/* mobile search removed; search is part of header center and visible on small screens */}
    </header>
  );
};

export default Header;
