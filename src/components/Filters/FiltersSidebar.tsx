import React, { useEffect, useState } from 'react';
import { getAllTaxonomies, type TaxonomyItem } from '../../services/taxonomy.service';

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
}) => {
  const [materials, setMaterials] = useState<TaxonomyItem[]>([]);
  const [occasions, setOccasions] = useState<TaxonomyItem[]>([]);
  const [categories, setCategories] = useState<TaxonomyItem[]>([]);
  const [loading, setLoading] = useState(true);

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

      <button className="clear-filters" onClick={clearFilters}>
        Clear All Filters
      </button>
    </aside>
  );
};

export default FiltersSidebar;
