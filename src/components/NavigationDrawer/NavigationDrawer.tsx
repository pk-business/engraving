import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { BULK_ORDER_CATEGORIES } from '../../constants';
import { useTaxonomies } from '../../hooks/useTaxonomies';
import { navigateToProducts, navigateToBulkProducts } from '../../utils/navigationHelpers';
import './NavigationDrawer.css';

// ============================================
// Types
// ============================================

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type SubMenuType = 'occasion' | 'recipient' | 'product' | 'bulk' | null;

// ============================================
// Component
// ============================================

/**
 * NavigationDrawer - Mobile slide-in navigation with submenu support
 * Features:
 * - Accessibility: Focus management, keyboard navigation, ARIA attributes
 * - Nested menus: Main menu -> Submenus for occasions, recipients, products, bulk orders
 * - Portal rendering: Rendered outside main DOM tree for proper z-index layering
 */
const NavigationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveRef = useRef<Element | null>(null);

  const { occasions, recipientLists, productCategories, loading } = useTaxonomies({ loadOnOpen: isOpen });

  const [activeSubMenu, setActiveSubMenu] = useState<SubMenuType>(null);

  // ============================================
  // Effect: Manage body scroll and focus
  // ============================================

  useEffect(() => {
    if (isOpen) {
      previousActiveRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      setActiveSubMenu(null);
      if (previousActiveRef.current && (previousActiveRef.current as HTMLElement).focus) {
        (previousActiveRef.current as HTMLElement).focus();
      }
    }
  }, [isOpen]);

  // ============================================
  // Effect: Keyboard navigation
  // ============================================

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Escape key: Close submenu or drawer
      if (e.key === 'Escape') {
        if (activeSubMenu) {
          setActiveSubMenu(null);
        } else {
          onClose();
        }
      }

      // Tab key: Trap focus within drawer
      // Tab key: Trap focus within drawer
      if (e.key === 'Tab') {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, activeSubMenu]);

  // ============================================
  // Event Handlers
  // ============================================

  const openSubMenu = (type: SubMenuType) => {
    setActiveSubMenu(type);
  };

  const closeSubMenu = () => {
    setActiveSubMenu(null);
  };

  const handleItemClick = (type: 'occasions' | 'recipientLists' | 'productCategories', value: string) => {
    navigateToProducts(navigate, type, value, onClose);
  };

  const handleBulkCategoryClick = (categorySlug: string) => {
    navigateToBulkProducts(navigate, categorySlug, onClose);
  };

  // ============================================
  // Render
  // ============================================

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="navigation-drawer-root" aria-hidden={!isOpen}>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside
        id="mobile-navigation-drawer"
        className="navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nav-title"
        ref={panelRef}
      >
        {/* Main Menu */}
        <div className={`main-menu ${activeSubMenu ? 'slide-out' : ''}`}>
          <div className="navigation-drawer-header">
            <h2 id="nav-title">Shop By</h2>
            <button ref={closeBtnRef} className="drawer-close-btn" onClick={onClose} aria-label="Close navigation menu">
              ×
            </button>
          </div>

          <div className="navigation-drawer-body">
            {loading ? (
              <div className="nav-loading">Loading...</div>
            ) : (
              <nav className="main-nav-list">
                <button
                  className="main-nav-item"
                  onClick={() => openSubMenu('occasion')}
                  aria-label="Browse by occasion"
                >
                  <span className="main-nav-label">By Occasion</span>
                  <FiChevronRight className="main-nav-icon" />
                </button>

                <button
                  className="main-nav-item"
                  onClick={() => openSubMenu('recipient')}
                  aria-label="Browse by recipient"
                >
                  <span className="main-nav-label">By Recipient</span>
                  <FiChevronRight className="main-nav-icon" />
                </button>

                <button
                  className="main-nav-item"
                  onClick={() => openSubMenu('product')}
                  aria-label="Browse by product category"
                >
                  <span className="main-nav-label">By Product</span>
                  <FiChevronRight className="main-nav-icon" />
                </button>

                <button
                  className="main-nav-item"
                  onClick={() => openSubMenu('bulk')}
                  aria-label="View bulk order options"
                >
                  <span className="main-nav-label">Bulk Orders</span>
                  <FiChevronRight className="main-nav-icon" />
                </button>
              </nav>
            )}
          </div>
        </div>

        {/* Sub Menus */}
        {activeSubMenu === 'occasion' && (
          <div className="sub-menu slide-in">
            <div className="navigation-drawer-header">
              <button className="back-btn" onClick={closeSubMenu} aria-label="Back to main menu">
                <FiChevronLeft className="back-icon" />
                <span>By Occasion</span>
              </button>
              <button className="drawer-close-btn" onClick={onClose} aria-label="Close navigation menu">
                ×
              </button>
            </div>
            <div className="navigation-drawer-body">
              <nav className="sub-nav-list">
                {occasions.map((item) => (
                  <button
                    key={item.id}
                    className="sub-nav-item"
                    onClick={() => handleItemClick('occasions', item.slug || item.name)}
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {activeSubMenu === 'recipient' && (
          <div className="sub-menu slide-in">
            <div className="navigation-drawer-header">
              <button className="back-btn" onClick={closeSubMenu} aria-label="Back to main menu">
                <FiChevronLeft className="back-icon" />
                <span>By Recipient</span>
              </button>
              <button className="drawer-close-btn" onClick={onClose} aria-label="Close navigation menu">
                ×
              </button>
            </div>
            <div className="navigation-drawer-body">
              <nav className="sub-nav-list">
                {recipientLists.map((item) => (
                  <button
                    key={item.id}
                    className="sub-nav-item"
                    onClick={() => handleItemClick('recipientLists', item.slug || item.name)}
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {activeSubMenu === 'product' && (
          <div className="sub-menu slide-in">
            <div className="navigation-drawer-header">
              <button className="back-btn" onClick={closeSubMenu} aria-label="Back to main menu">
                <FiChevronLeft className="back-icon" />
                <span>By Product</span>
              </button>
              <button className="drawer-close-btn" onClick={onClose} aria-label="Close navigation menu">
                ×
              </button>
            </div>
            <div className="navigation-drawer-body">
              <nav className="sub-nav-list">
                {productCategories.map((item) => (
                  <button
                    key={item.id}
                    className="sub-nav-item"
                    onClick={() => handleItemClick('productCategories', item.slug || item.name)}
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {activeSubMenu === 'bulk' && (
          <div className="sub-menu slide-in">
            <div className="navigation-drawer-header">
              <button className="back-btn" onClick={closeSubMenu} aria-label="Back to main menu">
                <FiChevronLeft className="back-icon" />
                <span>Bulk Orders</span>
              </button>
              <button className="drawer-close-btn" onClick={onClose} aria-label="Close navigation menu">
                ×
              </button>
            </div>
            <div className="navigation-drawer-body">
              <nav className="sub-nav-list">
                {BULK_ORDER_CATEGORIES.map((item) => (
                  <button key={item.id} className="sub-nav-item" onClick={() => handleBulkCategoryClick(item.slug)}>
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}
      </aside>
    </div>,
    document.body
  );
};

export default NavigationDrawer;
