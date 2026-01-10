import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsFetching } from '@tanstack/react-query';
import { useTaxonomies } from '../../hooks/useTaxonomies';

const normalizeList = (values: string[]) => Array.from(new Set(values)).sort();
const arraysEqual = (a: string[], b: string[]) => a.length === b.length && a.every((val, idx) => val === b[idx]);

interface Props {
  selectedMaterials: string[];
  onToggleMaterial: (m: string) => void;
  selectedOccasions: string[];
  onToggleOccasion: (o: string) => void;
  selectedProductCategory: string | null;
  onToggleProductCategory: (k: string) => void;
  priceRange: string;
  setPriceRange: (v: string) => void;
  clearFilters: () => void;
  onApply?: () => void;
  showApply?: boolean;
  showClearButton?: boolean;
}

const FiltersSidebar: React.FC<Props> = ({
  selectedMaterials,
  onToggleMaterial,
  selectedOccasions,
  onToggleOccasion,
  selectedProductCategory,
  onToggleProductCategory,
  priceRange,
  setPriceRange,
  clearFilters,
  onApply,
  showApply = true,
  showClearButton = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { materials, occasions, productCategories, loading } = useTaxonomies();
  const pendingProducts = useIsFetching({ queryKey: ['products'] });
  const isApplying = pendingProducts > 0;
  const appliedFilters = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      materials: normalizeList(params.getAll('materials')),
      occasions: normalizeList(params.getAll('occasions')),
      productCategory: params.getAll('productCategories')[0] || null,
      priceRange: params.get('priceRange') || '',
    };
  }, [location.search]);
  const hasPendingChanges = useMemo(() => {
    if (!showApply) return false;
    const materialsMatch = arraysEqual(normalizeList(selectedMaterials), appliedFilters.materials);
    const occasionsMatch = arraysEqual(normalizeList(selectedOccasions), appliedFilters.occasions);
    const productCategoryMatch = (selectedProductCategory || null) === appliedFilters.productCategory;
    const priceMatch = (priceRange || '') === appliedFilters.priceRange;
    return !(materialsMatch && occasionsMatch && productCategoryMatch && priceMatch);
  }, [appliedFilters, priceRange, selectedProductCategory, selectedMaterials, selectedOccasions, showApply]);

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
        <h3>Product Category</h3>
        <div className="filter-options">
          {loading ? (
            <div>Loading…</div>
          ) : (
            productCategories.map((c) => {
              const key = c.slug || c.name;
              return (
                <label key={key} className="filter-option">
                  <input
                    type="radio"
                    name="productCategory"
                    checked={selectedProductCategory === key}
                    // onClick handles the case of clicking the already-selected radio
                    // (HTML radio inputs don't fire onChange when clicking the checked item).
                    onClick={() => {
                      if (selectedProductCategory === key) {
                        onToggleProductCategory(String(key));
                      }
                    }}
                    // onChange handles normal selection of a different radio option
                    onChange={() => onToggleProductCategory(String(key))}
                  />
                  <span>{c.name}</span>
                </label>
              );
            })
          )}
        </div>
      </div>

      <div className="filter-section">
        <h3>Price</h3>
        <div className="filter-options">
          <label htmlFor="price-under-20" className="filter-option">
            <input
              id="price-under-20"
              type="radio"
              name="priceRange"
              checked={priceRange === 'under-20'}
              onChange={() => setPriceRange(priceRange === 'under-20' ? '' : 'under-20')}
            />
            <span>Under $20</span>
          </label>
          <label htmlFor="price-20-50" className="filter-option">
            <input
              id="price-20-50"
              type="radio"
              name="priceRange"
              checked={priceRange === '20-50'}
              onChange={() => setPriceRange(priceRange === '20-50' ? '' : '20-50')}
            />
            <span>$20 - $50</span>
          </label>
          <label htmlFor="price-50-100" className="filter-option">
            <input
              id="price-50-100"
              type="radio"
              name="priceRange"
              checked={priceRange === '50-100'}
              onChange={() => setPriceRange(priceRange === '50-100' ? '' : '50-100')}
            />
            <span>$50 - $100</span>
          </label>
          <label htmlFor="price-100-500" className="filter-option">
            <input
              id="price-100-500"
              type="radio"
              name="priceRange"
              checked={priceRange === '100-500'}
              onChange={() => setPriceRange(priceRange === '100-500' ? '' : '100-500')}
            />
            <span>$100 - $500</span>
          </label>
          <label htmlFor="price-over-500" className="filter-option">
            <input
              id="price-over-500"
              type="radio"
              name="priceRange"
              checked={priceRange === 'over-500'}
              onChange={() => setPriceRange(priceRange === 'over-500' ? '' : 'over-500')}
            />
            <span>Over $500</span>
          </label>
        </div>
      </div>

      {(showApply || showClearButton) && (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8, marginTop: 12 }}>
          {showApply && (
            <button
              className={`btn btn-primary apply-filters${hasPendingChanges ? ' dirty' : ''}`}
              onClick={() => {
                if (onApply) return onApply();
                // default behaviour: update URL
                const params = new URLSearchParams(location.search);
                params.delete('materials');
                params.delete('occasions');
                params.delete('productCategories');
                params.delete('page');
                params.delete('priceRange');
                // append current selections
                selectedMaterials.forEach((m) => params.append('materials', m));
                selectedOccasions.forEach((o) => params.append('occasions', o));
                if (selectedProductCategory) params.append('productCategories', selectedProductCategory);
                if (priceRange) params.set('priceRange', priceRange);
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
          {showClearButton && (
            <button className="btn btn-secondary clear-filters" onClick={clearFilters}>
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </aside>
  );
};

export default FiltersSidebar;
