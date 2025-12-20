import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import ProductService from '../product.service';
import api from '../api-client';

vi.mock('../api-client', () => ({
  default: {
    get: vi.fn(),
    defaults: { baseURL: 'https://mock' },
  },
}));

const mockedApiGet = api.get as unknown as Mock;

beforeEach(() => {
  mockedApiGet.mockReset();
  mockedApiGet.mockResolvedValue({ data: { data: [] } });
});

describe('ProductService query building', () => {
  it('builds $or params for multiple materials', async () => {
    await ProductService.getProducts({ materials: ['wood', 'metal'] });
    expect(mockedApiGet.mock.calls.length).toBeGreaterThan(0);
    const callArgs = mockedApiGet.mock.calls[0] as [string, { params: Record<string, unknown> }];
    const params = callArgs[1]?.params as Record<string, unknown>;
    const requestedPage = params['pagination[page]'] ?? params._page;
    const requestedPageSize = params['pagination[pageSize]'] ?? params._limit;
    expect(requestedPage).toBe(1);
    expect(requestedPageSize).toBeGreaterThan(0);
    expect(params['filters[$or][0][material][name][$eq]']).toBe('wood');
    expect(params['filters[$or][1][material][name][$eq]']).toBe('metal');
  });

  it('builds $or params for multiple occasions', async () => {
    await ProductService.getProducts({ occasions: ['birthday', 'wedding'] });
    const callArgs = mockedApiGet.mock.calls[0] as [string, { params: Record<string, unknown> }];
    const params = callArgs[1]?.params as Record<string, unknown>;
    expect(params['filters[$or][0][occasions][name][$eq]']).toBe('birthday');
    expect(params['filters[$or][1][occasions][name][$eq]']).toBe('wedding');
  });

  it('includes price and search filters', async () => {
    await ProductService.getProducts({ minPrice: 5, maxPrice: 15, searchQuery: 'test' });
    const callArgs = mockedApiGet.mock.calls[0] as [string, { params: Record<string, unknown> }];
    const params = callArgs[1]?.params as Record<string, unknown>;
    expect(params['filters[price][$gte]']).toBe(5);
    expect(params['filters[price][$lte]']).toBe(15);
    expect(params['filters[$or]']).toContain('test');
  });
});
