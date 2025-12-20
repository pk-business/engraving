import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductService from '../product.service';
import api from '../api-client';

vi.mock('../api-client', () => ({
  default: {
    get: vi.fn(),
    defaults: { baseURL: 'https://mock' },
  },
}));

beforeEach(() => {
  (api.get as any).mockReset();
  (api.get as any).mockResolvedValue({ data: { data: [] } });
});

describe('ProductService query building', () => {
  it('builds $or params for multiple materials', async () => {
    await ProductService.getProducts({ materials: ['wood', 'metal'] });
    expect((api.get as any).mock.calls.length).toBeGreaterThan(0);
    const callArgs = (api.get as any).mock.calls[0];
    const params = callArgs[1].params;
    expect(params['filters[$or][0][material][name][$eq]']).toBe('wood');
    expect(params['filters[$or][1][material][name][$eq]']).toBe('metal');
  });

  it('builds $or params for multiple occasions', async () => {
    await ProductService.getProducts({ occasions: ['birthday', 'wedding'] });
    const callArgs = (api.get as any).mock.calls[0];
    const params = callArgs[1].params;
    expect(params['filters[$or][0][occasions][name][$eq]']).toBe('birthday');
    expect(params['filters[$or][1][occasions][name][$eq]']).toBe('wedding');
  });

  it('includes price and search filters', async () => {
    await ProductService.getProducts({ minPrice: 5, maxPrice: 15, searchQuery: 'test' });
    const callArgs = (api.get as any).mock.calls[0];
    const params = callArgs[1].params;
    expect(params['filters[price][$gte]']).toBe(5);
    expect(params['filters[price][$lte]']).toBe(15);
    expect(params['filters[$or]']).toContain('test');
  });
});
