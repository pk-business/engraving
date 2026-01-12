// TODO: Update business name once decided
export const APP_NAME = 'CustomCraft';
export const APP_DESCRIPTION = 'Premium Laser Engraved & CNC Cut Custom Items';

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CHECKOUT: '/checkout',
  BLOG: '/blog',
  BLOG_POST: '/blog/:id',
  LOGIN: '/login',
  SIGNUP: '/signup',
  // Customer service pages
  CONTACT_US: '/contact-us',
  SHIPPING_DELIVERY: '/shipping-delivery',
  RETURNS_REFUNDS: '/returns-refunds',
  FAQ: '/faq',
  // Legal pages
  TERMS_OF_SERVICE: '/legal/terms-of-service',
  PRIVACY_POLICY: '/legal/privacy-policy',
  COOKIE_POLICY: '/legal/cookie-policy',
  DO_NOT_SELL: '/legal/do-not-sell',
  CA_PRIVACY_RIGHTS: '/legal/ca-privacy-rights',
  YOUR_PRIVACY_CHOICES: '/legal/your-privacy-choices',
  ACCESSIBILITY: '/legal/accessibility',
  CA_SUPPLY_CHAIN_ACT: '/legal/ca-supply-chain-act',
} as const;

export const TAX_RATE = 0.08; // 8% tax
export const SHIPPING_COST = 9.99;
export const FREE_SHIPPING_THRESHOLD = 100;

export const PAGINATION = {
  PRODUCTS_PER_PAGE: 12,
  BLOG_POSTS_PER_PAGE: 9,
} as const;

// Bulk order categories for team/corporate orders
export const BULK_ORDER_CATEGORIES = [
  { id: 'drinkware', name: 'Drinkware', slug: 'drinkware' },
  { id: 'coasters', name: 'Coasters', slug: 'coasters' },
  { id: 'plaques', name: 'Plaques', slug: 'plaques' },
  { id: 'accessories', name: 'Accessories', slug: 'accessories' },
] as const;
