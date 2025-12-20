import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsFetching } from '@tanstack/react-query';
import { getAllTaxonomies, type TaxonomyItem } from '../../services/taxonomy.service';

const normalizeList = (values: string[]) => Array.from(new Set(values)).sort();
const arraysEqual = (a: string[], b: string[]) => a.length === b.length && a.every((val, idx) => val === b[idx]);

interface Props {
  selectedMaterials: string[];
  onToggleMaterial: (m: string) => void;
  selectedOccasions: string[];
  onToggleOccasion: (o: string) => void;
  selectedCategory: string | null;
  onToggleCategory: (k: string) => void;
  minPrice: string;
  maxPrice: string;
  setMinPrice: (v: string) => void;
  setMaxPrice: (v: string) => void;
  clearFilters: () => void;
  onApply?: () => void;
  showApply?: boolean;
  // no longer accept categoryOptions prop; categories are loaded live
}

const FiltersSidebar: React.FC<Props> = ({
  selectedMaterials,
  onToggleMaterial,
  selectedOccasions,
  onToggleOccasion,
  selectedCategory,
  onToggleCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  clearFilters,
  onApply,
  showApply = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [materials, setMaterials] = useState<TaxonomyItem[]>([]);
  const [occasions, setOccasions] = useState<TaxonomyItem[]>([]);
  const [categories, setCategories] = useState<TaxonomyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const pendingProducts = useIsFetching({ queryKey: ['products'] });
  const isApplying = pendingProducts > 0;
  const appliedFilters = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      materials: normalizeList(params.getAll('materials')),
      occasions: normalizeList(params.getAll('occasions')),
      category: params.getAll('categories')[0] || null,
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
    };
  }, [location.search]);
  const hasPendingChanges = useMemo(() => {
    if (!showApply) return false;
    const materialsMatch = arraysEqual(normalizeList(selectedMaterials), appliedFilters.materials);
    const occasionsMatch = arraysEqual(normalizeList(selectedOccasions), appliedFilters.occasions);
    const categoryMatch = (selectedCategory || null) === appliedFilters.category;
    const minMatch = (minPrice || '') === appliedFilters.minPrice;
    const maxMatch = (maxPrice || '') === appliedFilters.maxPrice;
    return !(materialsMatch && occasionsMatch && categoryMatch && minMatch && maxMatch);
  }, [appliedFilters, minPrice, maxPrice, selectedCategory, selectedMaterials, selectedOccasions, showApply]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const { materials: mats, occasions: occs, categories: cats } = await getAllTaxonomies();
      if (!mounted) return;
      setMaterials(mats);
      setOccasions(occs);
      setCategories(cats);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <aside className="filters-sidebar">
      <div className="filter-section">
        <h3>Material Type</h3>
        <div className="filter-options">
          {loading ? (
            <div>Loading…</div>
          ) : (
            materials.map((m) => (
              <label key={m.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(m.name)}
                  onChange={() => onToggleMaterial(m.name)}
                />
                <span>{m.name}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <div className="filter-section">
        <h3>Occasion</h3>
        <div className="filter-options">
          {loading ? (
            <div>Loading…</div>
          ) : (
            occasions.map((o) => (
              <label key={o.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedOccasions.includes(o.name)}
                  onChange={() => onToggleOccasion(o.name)}
                />
                <span>{o.name}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <div className="filter-section">
        <h3>Category</h3>
        <div className="filter-options">
          {loading ? (
            <div>Loading…</div>
          ) : (
            categories.map((c) => {
              const key = c.slug || c.name;
              return (
                <label key={key} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === key}
                    // onClick handles the case of clicking the already-selected radio
                    // (HTML radio inputs don't fire onChange when clicking the checked item).
                    onClick={() => {
                      if (selectedCategory === key) {
                        onToggleCategory(String(key));
                      }
                    }}
                    // onChange handles normal selection of a different radio option
                    onChange={() => onToggleCategory(String(key))}
                  />
                  <span>{c.name}</span>
                </label>
              );
            })
          )}
        </div>
      </div>

      <div className="filter-section">
        <h3>Price Range</h3>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            className="price-input"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            className="price-input"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        {showApply && (
          <button
            className={`apply-filters${hasPendingChanges ? ' dirty' : ''}`}
            onClick={() => {
              if (onApply) return onApply();
              // default behaviour: update URL
              const params = new URLSearchParams(location.search);
              params.delete('materials');
              params.delete('occasions');
              params.delete('categories');
              params.delete('page');
              // append current selections
              selectedMaterials.forEach((m) => params.append('materials', m));
              selectedOccasions.forEach((o) => params.append('occasions', o));
              if (selectedCategory) params.append('categories', selectedCategory);
              if (minPrice) params.set('minPrice', minPrice);
              if (maxPrice) params.set('maxPrice', maxPrice);
              const nextSearch = params.toString();
              const normalizedCurrent = location.search.startsWith('?') ? location.search.slice(1) : location.search;
              if (nextSearch === normalizedCurrent) {
                return;
              }
              navigate({ pathname: location.pathname, search: nextSearch });
            }}
            disabled={isApplying}
          >
            {isApplying ? (
              <>
                <span className="drawer-spinner" aria-hidden="true" /> Applying...
              </>
            ) : (
              'Apply'
            )}
          </button>
        )}
        <button className="clear-filters" onClick={clearFilters}>
          Clear All Filters
        </button>
      </div>
    </aside>
  );
};

export default FiltersSidebar;
