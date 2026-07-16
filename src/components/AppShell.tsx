"use client";

import React from 'react';
import { Header } from './Header';
import { CartDrawer } from './CartDrawer';
import { useCart } from './CartContext';
import { FloatingButtons } from './FloatingButtons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cart, isDrawerOpen, openDrawer, closeDrawer, removeFromCart, subtotal } = useCart();
  const pathname = usePathname();
  const isAdminPage = pathname?.includes('/admin') || false;

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-brand-offwhite">
      {/* Header */}
      {!isAdminPage && <Header cartCount={cartCount} onCartClick={openDrawer} />}

      {/* Main Content */}
      <div className="flex-grow">
        {children}
      </div>

      {/* Footer */}
      {!isAdminPage && (
        <footer className="bg-black text-brand-offwhite py-16 border-t border-brand-charcoal/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Column 1: About Us */}
            <div className="flex flex-col space-y-4">
              <h4 className="font-sans text-[11px] font-bold tracking-[0.2em] text-white uppercase">ABOUT US</h4>
              <ul className="space-y-2.5 font-sans text-xs text-brand-offwhite/70">
                <li><Link href="/pages/about-us" className="hover:text-brand-gold transition-colors duration-200">About Aristino</Link></li>
                <li><Link href="/pages/store-locator" className="hover:text-brand-gold transition-colors duration-200">Store Locator</Link></li>
                <li><Link href="/pages/corporate-portal" className="hover:text-brand-gold transition-colors duration-200">K&G Corporate Portal</Link></li>
                <li><Link href="/pages/careers" className="hover:text-brand-gold transition-colors duration-200">Careers</Link></li>
                <li><Link href="/pages/wear-care-share" className="hover:text-brand-gold transition-colors duration-200">Wear-Care-Share</Link></li>
                <li><Link href="/pages/news" className="hover:text-brand-gold transition-colors duration-200">News & Editorial</Link></li>
                <li><Link href="/pages/plants" className="hover:text-brand-gold transition-colors duration-200">Our Manufacturing Plants</Link></li>
              </ul>
            </div>

            {/* Column 2: Policies & Terms */}
            <div className="flex flex-col space-y-4">
              <h4 className="font-sans text-[11px] font-bold tracking-[0.2em] text-white uppercase">POLICIES & TERMS</h4>
              <ul className="space-y-2.5 font-sans text-xs text-brand-offwhite/70">
                <li><Link href="/pages/membership-policy" className="hover:text-brand-gold transition-colors duration-200">Membership Program Policy</Link></li>
                <li><Link href="/pages/shipping-policy" className="hover:text-brand-gold transition-colors duration-200">Shipping & Delivery Policy</Link></li>
                <li><Link href="/pages/return-policy" className="hover:text-brand-gold transition-colors duration-200">Return & Exchange Policy</Link></li>
                <li><Link href="/pages/warranty-policy" className="hover:text-brand-gold transition-colors duration-200">Warranty Policy</Link></li>
                <li><Link href="/pages/privacy-policy" className="hover:text-brand-gold transition-colors duration-200">Privacy Policy</Link></li>
                <li><Link href="/pages/terms-of-service" className="hover:text-brand-gold transition-colors duration-200">Terms of Service</Link></li>
                <li><Link href="/pages/how-to-shop" className="hover:text-brand-gold transition-colors duration-200">How to Shop</Link></li>
              </ul>
            </div>

            {/* Column 3: Manufacture */}
            <div className="flex flex-col space-y-4">
              <h4 className="font-sans text-[11px] font-bold tracking-[0.2em] text-white uppercase">MANUFACTURE</h4>
              <ul className="space-y-2.5 font-sans text-xs text-brand-offwhite/70">
                <li><Link href="/pages/amazon-store" className="hover:text-brand-gold transition-colors duration-200">Amazon Store</Link></li>
                <li><Link href="/pages/oem-odm" className="hover:text-brand-gold transition-colors duration-200">OEM/ODM Services</Link></li>
              </ul>
            </div>

            {/* Column 4: Customer Service */}
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-4">
                <h4 className="font-sans text-[11px] font-bold tracking-[0.2em] text-white uppercase">CUSTOMER SERVICE</h4>
                <ul className="space-y-2.5 font-sans text-xs text-brand-offwhite/70">
                  <li><Link href="/pages/track-order" className="hover:text-brand-gold transition-colors duration-200">Track Your Order</Link></li>
                  <li><Link href="/pages/faqs" className="hover:text-brand-gold transition-colors duration-200">FAQs</Link></li>
                  <li className="pt-2.5 text-white font-bold">HOTLINE: <a href="tel:18006226" className="hover:underline text-brand-offwhite font-normal">1800 6226</a></li>
                </ul>
              </div>

              {/* Payment Methods Section matching design */}
              <div className="flex flex-col space-y-3">
                <h4 className="font-sans text-[11px] font-bold tracking-[0.2em] text-white uppercase">PAYMENT</h4>
                <div className="flex flex-row flex-nowrap gap-1.5">
                  {/* COD badge */}
                  <div className="flex items-center justify-center gap-1.5 w-[84px] h-[36px] bg-[#2E2E2E] rounded-[4px] border border-white/5 cursor-pointer hover:bg-neutral-700 transition-colors duration-200">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125a1.125 1.125 0 0 0 1.125-1.125V9.75M3.82 5.06l.5-1A2.25 2.25 0 0 1 6.29 2.75h9.42a2.25 2.25 0 0 1 1.97 1.31l.5 1m-14.36 0H18.75m-14.93 0A2.25 2.25 0 0 1 6 3.75h12a2.25 2.25 0 0 1 2.18 1.31l.5 1m-14.68 0v9.19c0 .72.58 1.31 1.3 1.31h12.56c.72 0 1.3-.59 1.3-1.31V5.06" />
                    </svg>
                    <span className="font-sans text-[10px] font-bold text-white tracking-wide">COD</span>
                  </div>

                  {/* Visa badge */}
                  <div className="flex items-center justify-center w-[84px] h-[36px] bg-[#2E2E2E] rounded-[4px] border border-white/5 cursor-pointer hover:bg-neutral-700 transition-colors duration-200">
                    <span className="font-sans text-[11px] font-black italic tracking-wide text-white flex items-center">
                      <span className="text-[#FF9900]">V</span>ISA
                    </span>
                  </div>

                  {/* Mastercard badge */}
                  <div className="flex items-center justify-center w-[84px] h-[36px] bg-[#2E2E2E] rounded-[4px] border border-white/5 cursor-pointer hover:bg-neutral-700 transition-colors duration-200">
                    <div className="flex items-center justify-center relative w-10 h-6">
                      <span className="absolute left-1 w-4 h-4 rounded-full bg-[#EB001B] opacity-95"></span>
                      <span className="absolute right-1 w-4 h-4 rounded-full bg-[#F79E1B] opacity-95"></span>
                      <span className="absolute inset-0 flex items-center justify-center text-[7px] font-sans font-bold text-white tracking-tighter">mc</span>
                    </div>
                  </div>

                  {/* E-Wallet badge */}
                  <div className="flex items-center justify-center w-[84px] h-[36px] bg-[#2E2E2E] rounded-[4px] border border-white/5 cursor-pointer hover:bg-neutral-700 transition-colors duration-200">
                    <span className="font-sans text-[8px] font-bold text-white tracking-wider uppercase">E-WALLET</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 5: Newsletter */}
            <div className="flex flex-col space-y-4 lg:col-span-1">
              <h4 className="font-sans text-[11px] font-bold tracking-[0.2em] text-white uppercase">THE ARISTINO REGISTRY</h4>
              <p className="font-sans text-xs text-brand-offwhite/70 leading-relaxed">
                Subscribe to receive early access to new collections, private invitations, and seasonal styling editorials. Elevate your wardrobe, one curatorial guide at a time.
              </p>
              <form className="flex flex-col space-y-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="px-4 py-2.5 bg-brand-navy-light text-brand-offwhite border border-brand-charcoal/40 text-xs focus:border-brand-gold focus:outline-none placeholder-brand-offwhite/40"
                  required
                />
                <button 
                  type="submit" 
                  className="py-2.5 bg-white text-black hover:bg-brand-offwhite font-sans text-xs font-bold tracking-widest transition-all duration-300"
                >
                  SUBMIT
                </button>
              </form>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-brand-charcoal/20 flex flex-col sm:flex-row items-center justify-between font-sans text-[11px] text-brand-offwhite/50 space-y-4 sm:space-y-0">
            <div>
              <p>K&G VIETNAM INVESTMENT JOINT STOCK COMPANY</p>
              <p className="mt-1">Headquarters: 11th Floor, Block A, Song Da Building, Pham Hung Road, Hanoi, Vietnam</p>
              <p className="mt-0.5">Tax Code: 0105911105 | Hotline: 1800 6226</p>
            </div>
            <div className="text-right sm:text-left">
              <p>© 2026 KGVIETNAM. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
      )}

      {/* Floating Buttons (Contact + Back to Top) */}
      {!isAdminPage && <FloatingButtons />}

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isDrawerOpen} 
        onClose={closeDrawer} 
        items={cart} 
        subtotal={subtotal} 
        onRemoveItem={removeFromCart}
      />
    </div>
  );
};
