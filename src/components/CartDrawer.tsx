"use client";

import React from 'react';
import { CartItem } from '../services/cartService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  onRemoveItem?: (id: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  onRemoveItem,
}) => {
  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-500 ${
        isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      }`}
      aria-modal="true" 
      role="dialog" 
      aria-label="Shopping Bag"
    >
      <div className="absolute inset-0 overflow-hidden">
        
        {/* Dark Backdrop Overlay */}
        <div 
          onClick={onClose}
          className={`absolute inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Close Shopping Bag Overlay"
        />

        {/* Slide-over Panel */}
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div 
            className={`pointer-events-auto w-screen max-w-md transform bg-brand-offwhite-light shadow-2xl transition-transform duration-500 ease-in-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex h-full flex-col overflow-y-scroll py-6 bg-brand-offwhite-light">
              
              {/* Drawer Header */}
              <div className="px-4 sm:px-6 flex items-center justify-between border-b border-brand-charcoal/10 pb-5">
                <h2 className="font-serif text-lg font-bold text-brand-navy tracking-wide">
                  Shopping Bag
                </h2>
                <button
                  onClick={onClose}
                  className="text-brand-charcoal hover:text-black transition-colors duration-200"
                  aria-label="Close Shopping Bag"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 px-4 sm:px-6 py-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <svg className="h-16 w-16 text-brand-charcoal/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="font-sans text-sm text-brand-charcoal/60">
                      Your bag is empty.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex py-4 border-b border-brand-charcoal/5">
                        <div className="flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between font-serif text-sm font-medium text-brand-charcoal">
                              <h3>{item.name}</h3>
                              <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-xs text-brand-charcoal/50">
                              {item.color} | {item.size}
                            </p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-xs mt-2">
                            <p className="text-brand-charcoal/60 font-sans">
                              Qty {item.quantity}
                            </p>
                            {onRemoveItem && (
                              <button 
                                onClick={() => onRemoveItem(item.id)}
                                type="button" 
                                className="font-sans font-semibold text-[#8B6E4A] hover:text-[#5E482D] transition-colors duration-200"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer and Checkout Button */}
              {items.length > 0 && (
                <div className="border-t border-brand-charcoal/10 px-4 py-6 sm:px-6 bg-brand-offwhite">
                  <div className="flex justify-between font-serif text-base font-bold text-brand-navy mb-4">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-brand-charcoal/50 mb-6 font-sans">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <button className="w-full py-4 bg-brand-navy text-brand-offwhite font-sans text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all duration-300">
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
