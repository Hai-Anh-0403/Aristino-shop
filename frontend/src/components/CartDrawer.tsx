"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem } from '../services/cartService';
import { useCart } from './CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  onRemoveItem?: (id: string) => void;
}

const parseNumericPrice = (val: any): number => {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

const formatCurrency = (val: any): string => {
  const num = parseNumericPrice(val);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  onRemoveItem,
}) => {
  const router = useRouter();
  const { clearCart } = useCart();
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const userSession = typeof window !== 'undefined' ? localStorage.getItem('aristino_user') : null;
      if (!userSession) {
        onClose();
        router.push('/account/login');
      }
    }
  }, [isOpen, onClose, router]);

  const handleCheckout = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const userSession = typeof window !== 'undefined' ? localStorage.getItem('aristino_user') : null;
      let customerName = 'Guest Customer';
      let customerEmail = 'customer@example.com';
      if (userSession) {
        const parsed = JSON.parse(userSession);
        customerEmail = parsed.email || 'customer@example.com';
        customerName = parsed.name || `${parsed.firstName || 'Aristino'} ${parsed.lastName || 'Customer'}`.trim();
      }

      const orderPayload = {
        customerName,
        customerEmail,
        phone: '0901234567',
        shippingAddress: '123 Premium Menswear Blvd, Hanoi, Vietnam',
        paymentMethod: 'COD',
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          imageUrl: item.imageUrl,
        })),
        subtotal,
        shippingFee: 0,
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setCheckoutSuccessOrder(data.data);
        clearCart();
      } else {
        alert(data.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Network error. Failed to proceed to checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isVisible = isOpen || !!checkoutSuccessOrder;

  return (
    <>
      <div 
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-500 ${
          isVisible ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
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
                <div className="px-4 sm:px-6 flex justify-between items-center border-b border-brand-charcoal/10 pb-5">
                  <h2 className="font-serif text-lg font-bold text-brand-navy tracking-widest uppercase">
                    Your Shopping Bag
                  </h2>
                  <button 
                    onClick={onClose}
                    className="p-1 text-brand-charcoal/60 hover:text-brand-navy hover:bg-neutral-100 transition-colors rounded-full"
                    aria-label="Close drawer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Drawer Body */}
                <div className="flex-1 px-4 sm:px-6 py-4">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-center py-20 font-serif select-none">
                      <svg className="h-16 w-16 text-brand-charcoal/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="text-sm font-semibold tracking-wider text-brand-charcoal mb-1">Your bag is empty</span>
                      <span className="text-xs text-brand-charcoal/40 font-sans">Discover our new arrivals to begin filling it.</span>
                    </div>
                  ) : (
                    <div className="divide-y divide-brand-charcoal/10">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 py-4 border-b border-brand-charcoal/10 items-center">
                          {/* Selected Color Image Thumbnail */}
                          <div className="relative w-16 h-20 rounded bg-gray-100 border border-brand-charcoal/10 overflow-hidden flex-shrink-0">
                            <img
                              src={item.imageUrl || '/images/shirt-white.png'}
                              alt={item.name}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between font-serif text-sm font-semibold text-brand-charcoal">
                                <h3 className="line-clamp-1">{item.name}</h3>
                                <p className="ml-3 flex-shrink-0 font-sans font-bold text-brand-navy">
                                  {formatCurrency(item.price)}
                                </p>
                              </div>
                              <div className="mt-1 flex gap-3 text-xs text-brand-charcoal/60 font-sans flex-wrap">
                                {item.color && (
                                  <span className="flex items-center gap-1.5 capitalize">
                                    <span className="font-semibold text-brand-charcoal/80">Color:</span> {item.color}
                                  </span>
                                )}
                                {item.size && (
                                  <span className="flex items-center gap-1.5">
                                    <span className="font-semibold text-brand-charcoal/80">Size:</span> {item.size}
                                  </span>
                                )}
                                <span className="flex items-center gap-1.5">
                                  <span className="font-semibold text-brand-charcoal/80">Qty:</span> {item.quantity}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-1 items-end justify-between text-xs mt-2 font-sans">
                              <p className="text-brand-charcoal/40 text-[10px]">Premium Selections</p>
                              {onRemoveItem && (
                                <button 
                                  onClick={() => onRemoveItem(item.id)}
                                  className="font-semibold text-red-700 hover:text-red-800 transition-colors uppercase tracking-wider text-[10px]"
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
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-brand-charcoal/50 mb-6 font-sans">
                      Shipping and taxes calculated at checkout.
                    </p>
                    <button 
                      onClick={handleCheckout}
                      disabled={isSubmitting}
                      className="w-full py-4 bg-brand-navy text-brand-offwhite font-sans text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'PLACING ORDER...' : 'PROCEED TO CHECKOUT'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Checkout Success Notification Modal */}
      {checkoutSuccessOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-navy/85 backdrop-blur-md">
          <div className="relative bg-white border border-brand-charcoal/15 max-w-md w-full p-8 text-center shadow-2xl rounded animate-in fade-in zoom-in-95 duration-300">
            {/* Elegant Top Badge */}
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <h3 className="font-serif text-xl font-bold tracking-wide text-brand-navy mb-2 uppercase">
              Order Placed Successfully!
            </h3>
            <p className="text-xs text-brand-charcoal/60 font-sans mb-6">
              Thank you for shopping at Aristino. Your premium menswear selections are currently being curated by our styling team.
            </p>

            {/* Order Details Panel */}
            <div className="bg-brand-offwhite border border-brand-charcoal/5 p-4 text-left space-y-2.5 mb-6 text-xs rounded">
              <div className="flex justify-between border-b border-brand-charcoal/5 pb-2">
                <span className="font-medium text-brand-charcoal/60">Order Number:</span>
                <span className="font-bold text-brand-navy font-mono select-all">{checkoutSuccessOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-brand-charcoal/5 pb-2">
                <span className="font-medium text-brand-charcoal/60">Customer Name:</span>
                <span className="font-semibold text-brand-charcoal">{checkoutSuccessOrder.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-brand-charcoal/5 pb-2">
                <span className="font-medium text-brand-charcoal/60">Customer Email:</span>
                <span className="font-semibold text-brand-charcoal">{checkoutSuccessOrder.customerEmail}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-medium text-brand-charcoal/60">Total Amount:</span>
                <span className="font-bold text-brand-gold text-sm">{formatCurrency(checkoutSuccessOrder.totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCheckoutSuccessOrder(null);
                onClose();
              }}
              className="w-full py-3 bg-brand-navy text-brand-offwhite font-sans text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all duration-300 rounded-sm"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      )}
    </>
  );
};
