import React from 'react';
import './AppliedFiltersChips.css';

type FilterType =
  | 'materials'
  | 'occasions'
  | 'productCategories'
  | 'minPrice'
  | 'maxPrice'
  | 'searchQuery'
  | 'priceRange';

interface AppliedFiltersChipsProps {
  filters: {
    materials?: string[];
    occasions?: string[];
    productCategories?: string[];
    minPrice?: number;
    maxPrice?: number;
    searchQuery?: string;
  };
  onRemove: (type: FilterType, value: string | number) => void;
  onClearAll: () => void;
}

const labelMap: Record<FilterType, string> = {
  materials: 'Material',
  occasions: 'Occasion',
  productCategories: 'Product Category',
  minPrice: 'Min Price',
  maxPrice: 'Max Price',
  searchQuery: 'Search',
  priceRange: 'Price',
};

const AppliedFiltersChips: React.FC<AppliedFiltersChipsProps> = ({ filters, onRemove, onClearAll }) => {
  const chips: Array<{ type: FilterType; value: string | number; displayValue: string }> = [];
  
  // Handle price range specially - combine min and max into single chip
  const hasMinPrice = typeof filters.minPrice === 'number' && !isNaN(filters.minPrice);
  const hasMaxPrice = typeof filters.maxPrice === 'number' && !isNaN(filters.maxPrice);
  
  if (hasMinPrice && hasMaxPrice) {
    chips.push({
      type: 'priceRange',
      value: `${filters.minPrice}-${filters.maxPrice}`,
      displayValue: `$${filters.minPrice} - $${filters.maxPrice}`,
    });
  } else if (hasMinPrice) {
    chips.push({
      type: 'minPrice',
      value: filters.minPrice!,
      displayValue: `$${filters.minPrice}`,
    });
  } else if (hasMaxPrice) {
    chips.push({
      type: 'maxPrice',
      value: filters.maxPrice!,
      displayValue: `$${filters.maxPrice}`,
    });
  }
  
  // Handle other filters
  Object.entries(filters).forEach(([type, value]) => {
    if (type === 'minPrice' || type === 'maxPrice') {
      // Already handled above
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((v) => chips.push({ type: type as FilterType, value: v, displayValue: String(v) }));
    } else if (typeof value === 'string' && value) {
      chips.push({ type: type as FilterType, value, displayValue: value });
    }
  });
  
  if (chips.length === 0) return null;
  return (
    <div className="applied-filters-chips-row">
      {chips.map((chip) => (
        <span className="applied-filter-chip" key={`${chip.type}-${chip.value}`}>
          {labelMap[chip.type] || chip.type}: {chip.displayValue}
          <button 
            className="chip-remove-btn" 
            onClick={() => onRemove(chip.type, chip.value)} 
            aria-label={`Remove ${chip.displayValue}`}
          >
            ×
          </button>
        </span>
      ))}
      <button className="chip-clear-all-btn" onClick={onClearAll} aria-label="Clear all filters">
        Clear All
      </button>
    </div>
  );
};

export default AppliedFiltersChips;
