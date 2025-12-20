import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FiltersSidebar from '../Filters/FiltersSidebar';
import * as taxonomy from '../../services/taxonomy.service';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';

// Mock getAllTaxonomies to return immediate categories
vi.mock('../../services/taxonomy.service', () => ({
  getAllTaxonomies: vi.fn(),
}));

describe('FiltersSidebar category toggle', () => {
  beforeEach(() => {
    (taxonomy.getAllTaxonomies as any).mockResolvedValue({
      materials: [],
      occasions: [],
      categories: [{ id: 'c1', name: 'Gifts', slug: 'gifts' }],
    });
  });

  it('deselects category when clicking the selected radio', async () => {
    const onToggleCategory = vi.fn();

    render(
      <FiltersSidebar
        selectedMaterials={[]}
        onToggleMaterial={() => {}}
        selectedOccasions={[]}
        onToggleOccasion={() => {}}
        selectedCategory={'gifts'}
        onToggleCategory={onToggleCategory}
        minPrice={''}
        maxPrice={''}
        setMinPrice={() => {}}
        setMaxPrice={() => {}}
        clearFilters={() => {}}
      />
    );

    // wait for category to appear
    const label = await screen.findByText('Gifts');
    const radio = label.previousSibling as HTMLInputElement | null;
    expect(radio).not.toBeNull();

    // simulate click on the label to activate radio click
    await userEvent.click(label);
    // onToggleCategory should be called once (deselect)
    expect(onToggleCategory).toHaveBeenCalled();
  });
});

