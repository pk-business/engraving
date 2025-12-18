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
} as const;

export const TAX_RATE = 0.08; // 8% tax
export const SHIPPING_COST = 9.99;
export const FREE_SHIPPING_THRESHOLD = 100;

export const PAGINATION = {
  PRODUCTS_PER_PAGE: 12,
  BLOG_POSTS_PER_PAGE: 9,
} as const;
