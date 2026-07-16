"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, getCartFromCookies, saveCartToCookies, addItemToCart, removeItemFromCart } from '../services/cartService';

interface CartContextType {
  cart: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setCart(getCartFromCookies());
  }, []);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const updated = addItemToCart(prev, newItem);
      return updated;
    });
    setIsDrawerOpen(true); // Auto-open drawer when item is added
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = removeItemFromCart(prev, id);
      return updated;
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      addToCart,
      removeFromCart,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
