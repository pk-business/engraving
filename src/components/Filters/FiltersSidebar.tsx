import React from 'react';
import { MaterialType, OccasionType } from '../../types/product.types';

interface Props {
  selectedMaterials: MaterialType[];
  onToggleMaterial: (m: MaterialType) => void;
  selectedOccasions: OccasionType[];
  onToggleOccasion: (o: OccasionType) => void;
  selectedCategory: string | null;
  onToggleCategory: (k: string) => void;
  minPrice: string;
  maxPrice: string;
  setMinPrice: (v: string) => void;
  setMaxPrice: (v: string) => void;
  clearFilters: () => void;
  categoryOptions: { key: string; label: string }[];
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
  categoryOptions,
}) => {
  return (
    <aside className="filters-sidebar">
      <div className="filter-section">
        <h3>Material Type</h3>
        <div className="filter-options">
          {Object.values(MaterialType).map((material) => (
            <label key={material} className="filter-option">
              <input
                type="checkbox"
                checked={selectedMaterials.includes(material)}
                onChange={() => onToggleMaterial(material)}
              />
              <span>{material.charAt(0).toUpperCase() + material.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Occasion</h3>
        <div className="filter-options">
          {Object.values(OccasionType).map((occasion) => (
            <label key={occasion} className="filter-option">
              <input
                type="checkbox"
                checked={selectedOccasions.includes(occasion)}
                onChange={() => onToggleOccasion(occasion)}
              />
              <span>{occasion.charAt(0).toUpperCase() + occasion.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Category</h3>
        <div className="filter-options">
          {categoryOptions.map((c) => (
            <label key={c.key} className="filter-option">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === c.key}
                onChange={() => onToggleCategory(c.key)}
              />
              <span>{c.label}</span>
            </label>
          ))}
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
