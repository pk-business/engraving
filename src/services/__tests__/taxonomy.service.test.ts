import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as taxonomy from '../taxonomy.service';
import api from '../api-client';

vi.mock('../api-client', () => ({
  default: {
    get: vi.fn(),
  },
}));

beforeEach(() => {
  // clear caches and localStorage
  taxonomy.invalidateTaxonomyCache();
  try {
    localStorage.removeItem('taxonomies:v1');
  } catch (e) {}
  (api.get as any).mockReset();
});

describe('getAllTaxonomies', () => {
  it('fetches and persists taxonomies, and uses cache on subsequent calls', async () => {
    // mock API responses for materials/occasions/categories
    (api.get as any)
      .mockResolvedValueOnce({ data: { data: [{ id: 1, attributes: { name: 'Wood' } }] } })
      .mockResolvedValueOnce({ data: { data: [{ id: 2, attributes: { name: 'Birthday' } }] } })
      .mockResolvedValueOnce({ data: { data: [{ id: 3, attributes: { name: 'Gifts' } }] } });

    const first = await taxonomy.getAllTaxonomies();
    expect(first.materials[0].name).toBe('Wood');
    expect(first.occasions[0].name).toBe('Birthday');
    expect(first.categories[0].name).toBe('Gifts');

    // API should have been called three times
    expect((api.get as any).mock.calls.length).toBe(3);

    // subsequent call should use in-memory cache and not call API
    (api.get as any).mockReset();
    const second = await taxonomy.getAllTaxonomies();
    expect((api.get as any).mock.calls.length).toBe(0);
    expect(second.materials[0].name).toBe('Wood');

    // persisted value exists
    const raw = JSON.parse(localStorage.getItem('taxonomies:v1')!);
    expect(raw.materials.length).toBeGreaterThan(0);
  });
});
