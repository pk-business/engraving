const truthy = new Set(['true', '1', 'yes', 'on']);
const falsy = new Set(['false', '0', 'no', 'off']);

const normalize = (value?: string | null): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim().toLowerCase();
  return trimmed.length === 0 ? null : trimmed;
};

const parseBoolean = (value?: string | null): boolean | null => {
  const normalized = normalize(value);
  if (!normalized) return null;
  if (truthy.has(normalized)) return true;
  if (falsy.has(normalized)) return false;
  return null;
};

export const isMockDataEnabled = (): boolean => {
  const envFlag = parseBoolean(import.meta.env.VITE_USE_MOCK_DATA as string | undefined);
  let useMock = envFlag ?? false;

  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      const paramValue = parseBoolean(params.get('mock'));
      if (paramValue !== null) {
        useMock = paramValue;
      }
    } catch {
      // ignore URL parsing issues
    }
  }

  return useMock;
};
