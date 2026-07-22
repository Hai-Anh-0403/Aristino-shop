"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, getCartFromCookies, addItemToCart, removeItemFromCart, saveCartToCookies } from '../services/cartService';
import { fetchProductsByIds } from '../services/productService';

interface CartContextType {
  cart: CartItem[];
  isDrawerOpen: boolean;
  isLoading: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      const cookieItems = getCartFromCookies();
      if (cookieItems.length === 0) {
        setCart([]);
        return;
      }
      setIsLoading(true);
      try {
        const ids = Array.from(new Set(cookieItems.map((item) => item.id)));
        const products = await fetchProductsByIds(ids);
        const enrichedItems: CartItem[] = cookieItems.map((item) => {
          const prod = products.find((p) => String(p.id) === item.id || (p._id && String(p._id) === item.id));
          const numPrice = prod ? (typeof prod.price === 'number' ? prod.price : parseFloat(String(prod.price).replace(/[^0-9.]/g, '')) || 0) : 0;
          return {
            ...item,
            name: prod ? prod.title : (item.name || 'Premium Selection'),
            price: numPrice,
            imageUrl: prod ? (prod.imageUrl || (prod.images && prod.images[0])) : (item.imageUrl || '/images/shirt-white.png'),
          };
        });
        setCart(enrichedItems);
      } catch (err) {
        console.error('Error loading cart details:', err);
        setCart(cookieItems);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  const isUserLoggedIn = (): boolean => {
    if (typeof window === 'undefined') return false;
    const session = localStorage.getItem('aristino_user');
    return !!session;
  };

  const openDrawer = () => {
    setIsLoading(true);
    if (!isUserLoggedIn()) {
      setTimeout(() => {
        setIsLoading(false);
        router.push('/account/login');
      }, 500);
      return;
    }
    setTimeout(() => {
      setIsLoading(false);
      setIsDrawerOpen(true);
    }, 400);
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setIsLoading(true);
    if (!isUserLoggedIn()) {
      setTimeout(() => {
        setIsLoading(false);
        router.push('/account/login');
      }, 500);
      return;
    }
    setTimeout(() => {
      setCart((prev) => {
        const updated = addItemToCart(prev, newItem);
        return updated;
      });
      setIsLoading(false);
      setIsDrawerOpen(true); // Auto-open drawer when item is added
    }, 600);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = removeItemFromCart(prev, id);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    saveCartToCookies([]);
  };

  const subtotal = cart.reduce((sum, item) => {
    const p = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
    return sum + p * (item.quantity || 1);
  }, 0);

  return (
    <CartContext.Provider value={{
      cart,
      isDrawerOpen,
      isLoading,
      openDrawer,
      closeDrawer,
      addToCart,
      removeFromCart,
      clearCart,
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
