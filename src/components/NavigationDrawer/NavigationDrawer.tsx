import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { getAllTaxonomies, type TaxonomyItem } from '../../services/taxonomy.service';
import { ROUTES } from '../../constants';
import './NavigationDrawer.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type SubMenuType = 'occasion' | 'recipient' | 'product' | 'bulk' | null;

const BULK_ORDER_CATEGORIES = [
  { id: 'drinkware', name: 'Drinkware', slug: 'drinkware' },
  { id: 'coasters', name: 'Coasters', slug: 'coasters' },
  { id: 'plaques', name: 'Plaques', slug: 'plaques' },
  { id: 'accessories', name: 'Accessories', slug: 'accessories' },
];

const NavigationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveRef = useRef<Element | null>(null);

  const [productCategories, setProductCategories] = useState<TaxonomyItem[]>([]);
  const [recipientLists, setRecipientLists] = useState<TaxonomyItem[]>([]);
  const [occasions, setOccasions] = useState<TaxonomyItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeSubMenu, setActiveSubMenu] = useState<SubMenuType>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeBtnRef.current?.focus(), 50);

      // Load taxonomies
      let mounted = true;
      async function load() {
        setLoading(true);
        const { productCategories: cats, recipientLists: recs, occasions: occs } = await getAllTaxonomies();
        if (!mounted) return;
        setProductCategories(cats);
        setRecipientLists(recs);
        setOccasions(occs);
        setLoading(false);
      }
      load();
      return () => {
        mounted = false;
      };
    } else {
      document.body.style.overflow = '';
      setActiveSubMenu(null);
      if (previousActiveRef.current && (previousActiveRef.current as HTMLElement).focus) {
        (previousActiveRef.current as HTMLElement).focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (activeSubMenu) {
          setActiveSubMenu(null);
        } else {
          onClose();
        }
      }
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

  const openSubMenu = (type: SubMenuType) => {
    setActiveSubMenu(type);
  };

  const closeSubMenu = () => {
    setActiveSubMenu(null);
  };

  const handleItemClick = (type: 'occasions' | 'recipientLists' | 'productCategories', value: string) => {
    const params = new URLSearchParams();
    params.set(type, value);
    navigate({ pathname: ROUTES.PRODUCTS, search: params.toString() });
    onClose();
  };

  const handleBulkCategoryClick = (categorySlug: string) => {
    const params = new URLSearchParams();
    params.set('bulkEligible', 'true');
    params.set('productCategories', categorySlug);
    navigate({ pathname: ROUTES.PRODUCTS, search: params.toString() });
    onClose();
  };

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
