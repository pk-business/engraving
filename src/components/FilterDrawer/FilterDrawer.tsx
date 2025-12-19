import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import './FilterDrawer.css';
import FiltersSidebar from '../Filters/FiltersSidebar';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CATEGORIES = ['home-living', 'jewelry', 'gifts', 'office'];

const FilterDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveRef = useRef<Element | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

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

  const toggleMaterial = (m: string) =>
    setSelectedMaterials((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  const toggleOccasion = (o: string) =>
    setSelectedOccasions((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]));
  const toggleCategory = (c: string) =>
    setSelectedCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [c]));

  const applyFilters = () => {
    const params = new URLSearchParams(location.search);
    params.delete('materials');
    params.delete('occasions');
    params.delete('categories');
    selectedMaterials.forEach((m) => params.append('materials', m));
    selectedOccasions.forEach((o) => params.append('occasions', o));
    selectedCategories.forEach((c) => params.append('categories', c));
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    navigate({ pathname: location.pathname, search: params.toString() });
    onClose();
  };

  const clearFilters = () => {
    setSelectedMaterials([]);
    setSelectedOccasions([]);
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
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
          <button
            ref={closeBtnRef}
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close filters"
          >
            ×
          </button>
        </div>

        <div className="filter-drawer-body">
          <FiltersSidebar
            selectedMaterials={selectedMaterials as any}
            onToggleMaterial={(m) => toggleMaterial(m)}
            selectedOccasions={selectedOccasions as any}
            onToggleOccasion={(o) => toggleOccasion(o)}
            selectedCategory={selectedCategories[0] || null}
            onToggleCategory={(c) => toggleCategory(c)}
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            clearFilters={clearFilters}
            categoryOptions={DEFAULT_CATEGORIES.map((c) => ({ key: c, label: c }))}
          />
        </div>

        <div className="filter-drawer-footer">
          <button className="btn btn-secondary" onClick={clearFilters}>
            Clear
          </button>
          <button className="btn btn-primary" onClick={applyFilters}>
            Apply
          </button>
        </div>
      </aside>
    </div>,
    document.body
  );
};

export default FilterDrawer;
