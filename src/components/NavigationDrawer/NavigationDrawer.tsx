import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { getAllTaxonomies, type TaxonomyItem } from '../../services/taxonomy.service';
import { ROUTES } from '../../constants';
import './NavigationDrawer.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NavigationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveRef = useRef<Element | null>(null);
  
  const [categories, setCategories] = useState<TaxonomyItem[]>([]);
  const [occasions, setOccasions] = useState<TaxonomyItem[]>([]);
  const [materials, setMaterials] = useState<TaxonomyItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['products']));

  useEffect(() => {
    if (isOpen) {
      previousActiveRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeBtnRef.current?.focus(), 50);
      
      // Load taxonomies
      let mounted = true;
      async function load() {
        setLoading(true);
        const { categories: cats, occasions: occs, materials: mats } = await getAllTaxonomies();
        if (!mounted) return;
        setCategories(cats);
        setOccasions(occs);
        setMaterials(mats);
        setLoading(false);
      }
      load();
      return () => {
        mounted = false;
      };
    } else {
      document.body.style.overflow = '';
      if (previousActiveRef.current && (previousActiveRef.current as HTMLElement).focus) {
        (previousActiveRef.current as HTMLElement).focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
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
  }, [isOpen, onClose]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handleNavigation = (type: 'categories' | 'occasions' | 'materials', value: string) => {
    const params = new URLSearchParams();
    params.set(type, value);
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
        <div className="navigation-drawer-header">
          <h2 id="nav-title">Menu</h2>
          <button 
            ref={closeBtnRef} 
            className="drawer-close-btn" 
            onClick={onClose} 
            aria-label="Close navigation menu"
          >
            ×
          </button>
        </div>

        <div className="navigation-drawer-body">
          {loading ? (
            <div className="nav-loading">Loading...</div>
          ) : (
            <>
              {/* Products Section */}
              <div className="nav-section">
                <button
                  className="nav-section-header"
                  onClick={() => toggleSection('products')}
                  aria-expanded={expandedSections.has('products')}
                >
                  <span className="nav-section-title">Products</span>
                  <FiChevronRight 
                    className={`nav-chevron ${expandedSections.has('products') ? 'expanded' : ''}`}
                  />
                </button>
                {expandedSections.has('products') && (
                  <div className="nav-items">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        className="nav-item"
                        onClick={() => handleNavigation('categories', cat.slug || cat.name)}
                      >
                        <span>{cat.name}</span>
                        <FiChevronRight className="nav-item-chevron" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Occasion Section */}
              <div className="nav-section">
                <button
                  className="nav-section-header"
                  onClick={() => toggleSection('occasion')}
                  aria-expanded={expandedSections.has('occasion')}
                >
                  <span className="nav-section-title">Occasion</span>
                  <FiChevronRight 
                    className={`nav-chevron ${expandedSections.has('occasion') ? 'expanded' : ''}`}
                  />
                </button>
                {expandedSections.has('occasion') && (
                  <div className="nav-items">
                    {occasions.map((occ) => (
                      <button
                        key={occ.id}
                        className="nav-item"
                        onClick={() => handleNavigation('occasions', occ.name)}
                      >
                        <span>{occ.name}</span>
                        <FiChevronRight className="nav-item-chevron" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Material Section */}
              <div className="nav-section">
                <button
                  className="nav-section-header"
                  onClick={() => toggleSection('material')}
                  aria-expanded={expandedSections.has('material')}
                >
                  <span className="nav-section-title">Material</span>
                  <FiChevronRight 
                    className={`nav-chevron ${expandedSections.has('material') ? 'expanded' : ''}`}
                  />
                </button>
                {expandedSections.has('material') && (
                  <div className="nav-items">
                    {materials.map((mat) => (
                      <button
                        key={mat.id}
                        className="nav-item"
                        onClick={() => handleNavigation('materials', mat.name)}
                      >
                        <span>{mat.name}</span>
                        <FiChevronRight className="nav-item-chevron" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </aside>
    </div>,
    document.body
  );
};

export default NavigationDrawer;
