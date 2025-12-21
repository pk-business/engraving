import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import './FilterDrawer.css';
import FiltersSidebar from '../Filters/FiltersSidebar';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // Optional external state control (for ProductsPage)
  selectedMaterials?: string[];
  onToggleMaterial?: (m: string) => void;
  selectedOccasions?: string[];
  onToggleOccasion?: (o: string) => void;
  selectedCategory?: string | null;
  onToggleCategory?: (c: string) => void;
  priceRange?: string;
  setPriceRange?: (v: string) => void;
  onApply?: () => void;
  onClear?: () => void;
}

const FilterDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedMaterials: externalMaterials,
  onToggleMaterial: externalToggleMaterial,
  selectedOccasions: externalOccasions,
  onToggleOccasion: externalToggleOccasion,
  selectedCategory: externalCategory,
  onToggleCategory: externalToggleCategory,
  priceRange: externalPriceRange,
  setPriceRange: externalSetPriceRange,
  onApply: externalOnApply,
  onClear: externalOnClear,
}) => {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveRef = useRef<Element | null>(null);

  // Internal state (used when external props not provided)
  const [internalMaterials, setInternalMaterials] = useState<string[]>([]);
  const [internalOccasions, setInternalOccasions] = useState<string[]>([]);
  const [internalCategories, setInternalCategories] = useState<string[]>([]);
  const [internalPriceRange, setInternalPriceRange] = useState<string>('');

  // Use external state if provided, otherwise use internal
  const selectedMaterials = externalMaterials ?? internalMaterials;
  const selectedOccasions = externalOccasions ?? internalOccasions;
  const selectedCategories = externalCategory ? [externalCategory] : internalCategories;
  const priceRange = externalPriceRange ?? internalPriceRange;

  useEffect(() => {
    if (isOpen) {
      previousActiveRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeBtnRef.current?.focus(), 50);
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

  const toggleMaterial = (m: string) => {
    if (externalToggleMaterial) {
      externalToggleMaterial(m);
    } else {
      setInternalMaterials((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
    }
  };

  const toggleOccasion = (o: string) => {
    if (externalToggleOccasion) {
      externalToggleOccasion(o);
    } else {
      setInternalOccasions((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]));
    }
  };

  const toggleCategory = (c: string) => {
    if (externalToggleCategory) {
      externalToggleCategory(c);
    } else {
      setInternalCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [c]));
    }
  };

  const applyFilters = () => {
    if (externalOnApply) {
      externalOnApply();
      onClose();
    } else {
      const params = new URLSearchParams();
      selectedMaterials.forEach((m) => params.append('materials', m));
      selectedOccasions.forEach((o) => params.append('occasions', o));
      selectedCategories.forEach((c) => params.append('categories', c));
      if (priceRange) params.set('priceRange', priceRange);
      navigate({ pathname: ROUTES.PRODUCTS, search: params.toString() });
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      });
      onClose();
    }
  };

  const clearFilters = () => {
    if (externalOnClear) {
      externalOnClear();
      onClose();
    } else {
      setInternalMaterials([]);
      setInternalOccasions([]);
      setInternalCategories([]);
      setInternalPriceRange('');
      // Navigate to products page with no filters
      navigate(ROUTES.PRODUCTS);
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="filter-drawer-root" aria-hidden={!isOpen}>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside
        id="mobile-filter-drawer"
        className="filter-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-title"
        ref={panelRef}
      >
        <div className="filter-drawer-header">
          <h2 id="filter-title">Peek your Item...</h2>
          <button ref={closeBtnRef} className="drawer-close-btn" onClick={onClose} aria-label="Close filters">
            ×
          </button>
        </div>

        <div className="filter-drawer-body">
          <FiltersSidebar
            selectedMaterials={selectedMaterials}
            onToggleMaterial={(m) => toggleMaterial(m)}
            selectedOccasions={selectedOccasions}
            onToggleOccasion={(o) => toggleOccasion(o)}
            selectedCategory={selectedCategories[0] || null}
            onToggleCategory={(c) => toggleCategory(c)}
            priceRange={priceRange}
            setPriceRange={externalSetPriceRange || setInternalPriceRange}
            clearFilters={clearFilters}
            showApply={false}
            showClearButton={false}
          />
        </div>

        <div className="filter-drawer-footer">
          <button className="btn btn-primary apply-filters" onClick={applyFilters}>
            Apply
          </button>
          <button className="btn btn-secondary clear-filters" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </aside>
    </div>,
    document.body
  );
};

export default FilterDrawer;
