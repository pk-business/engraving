import { describe, it, expect } from 'vitest';
import { withAuth, api } from '../api-client';

describe('api-client basic helpers', () => {
  it('withAuth returns empty object when no token', () => {
    expect(withAuth(undefined)).toEqual({});
    expect(withAuth(null)).toEqual({});
  });

  it('withAuth returns Authorization header when token provided', () => {
    const out = withAuth('abc123');
    expect(out).toHaveProperty('headers');
    if ('headers' in out) {
      expect(out.headers.Authorization).toBe('Bearer abc123');
    } else {
      throw new Error('Expected headers to be defined when token is provided');
    }
  });

  it('api instance has baseURL set', () => {
    expect(api.defaults).toHaveProperty('baseURL');
  });
});
