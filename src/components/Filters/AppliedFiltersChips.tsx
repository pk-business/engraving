import React from 'react';
import './AppliedFiltersChips.css';

interface AppliedFiltersChipsProps {
  filters: {
    materials?: string[];
    occasions?: string[];
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    searchQuery?: string;
  };
  onRemove: (type: string, value: string | number) => void;
  onClearAll: () => void;
}

const labelMap: Record<string, string> = {
  materials: 'Material',
  occasions: 'Occasion',
  categories: 'Category',
  minPrice: 'Min Price',
  maxPrice: 'Max Price',
  searchQuery: 'Search',
};

const AppliedFiltersChips: React.FC<AppliedFiltersChipsProps> = ({ filters, onRemove, onClearAll }) => {
  const chips: Array<{ type: string; value: string | number }> = [];
  Object.entries(filters).forEach(([type, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => chips.push({ type, value: v }));
    } else if (typeof value === 'string' && value) {
      chips.push({ type, value });
    } else if (typeof value === 'number' && !isNaN(value)) {
      chips.push({ type, value });
    }
  });
  if (chips.length === 0) return null;
  return (
    <div className="applied-filters-chips-row">
      {chips.map((chip, idx) => (
        <span className="applied-filter-chip" key={chip.type + chip.value + idx}>
          {labelMap[chip.type] || chip.type}: {chip.value}
          <button className="chip-remove-btn" onClick={() => onRemove(chip.type, chip.value)} aria-label={`Remove ${chip.value}`}>
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
