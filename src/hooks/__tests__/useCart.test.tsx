import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CartProvider } from '../../contexts/CartContext';
import { useCart } from '../useCart';
import type { Product } from '../../types/product.types';

type WrapperProps = {
  children?: React.ReactNode;
};

const wrapper = ({ children }: WrapperProps) => <CartProvider>{children}</CartProvider>;

describe('useCart', () => {
  const sampleProduct = {
    id: 'p1',
    name: 'Test Product',
    description: 'Sample product description',
    price: 10,
    imageUrl: { main: '', alt: '' },
    images: [],
    material: 'wood',
    occasions: [],
    categories: [],
    category: '',
    customizable: false,
    sizes: [],
    inStock: true,
    rating: 0,
    reviewCount: 0,
  } as Product;

  it('adds items and updates totals', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleProduct, 2);
    });

    expect(result.current.cart.totalItems).toBe(2);
    expect(result.current.cart.subtotal).toBe(20);

    // add same product again increases quantity
    act(() => {
      result.current.addToCart(sampleProduct, 1);
    });

    expect(result.current.cart.totalItems).toBe(3);
    expect(result.current.cart.subtotal).toBe(30);
  });

  it('updates quantity and removes items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleProduct, 1);
    });

    const itemId = result.current.cart.items[0].id;
    act(() => {
      result.current.updateQuantity(itemId, 3);
    });

    expect(result.current.cart.totalItems).toBe(3);
    expect(result.current.cart.subtotal).toBe(30);

    act(() => {
      result.current.removeFromCart(itemId);
    });

    expect(result.current.cart.totalItems).toBe(0);
    expect(result.current.cart.items.length).toBe(0);
  });

  it('clears cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleProduct, 2);
    });

    expect(result.current.cart.totalItems).toBe(2);
    act(() => {
      result.current.clearCart();
    });
    expect(result.current.cart.totalItems).toBe(0);
  });
});
