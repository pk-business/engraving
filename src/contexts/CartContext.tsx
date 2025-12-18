import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Cart, CartItem } from '../types/cart.types';
import type { Product, ProductCustomization } from '../types/product.types';
import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '../constants';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity: number, customization?: ProductCustomization) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  });

  const calculateCart = (items: CartItem[]): Cart => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * TAX_RATE;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + tax + shipping;

    return {
      items,
      totalItems,
      subtotal,
      tax,
      shipping,
      total,
    };
  };

  const addToCart = (
    product: Product,
    quantity: number,
    customization?: ProductCustomization
  ) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.product.id === product.id
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        newItems = [...prevCart.items];
        newItems[existingItemIndex].quantity += quantity;
        newItems[existingItemIndex].totalPrice = 
          newItems[existingItemIndex].quantity * product.price;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity,
          customization,
          totalPrice: product.price * quantity,
        };
        newItems = [...prevCart.items, newItem];
      }

      return calculateCart(newItems);
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.id !== itemId);
      return calculateCart(newItems);
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            totalPrice: item.product.price * quantity,
          };
        }
        return item;
      });
      return calculateCart(newItems);
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
