"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
}

const MENU_ITEMS = [
  {
    label: 'NEW ARRIVALS',
    href: '/collections/new-arrivals',
    subCategories: [
      { label: 'All New Arrivals', href: '/collections/new-arrivals' },
      { label: 'Polos & Tees', href: '/collections/tops' },
      { label: 'Luxury Suits', href: '/collections/suits-blazers' },
      { label: 'New Accessories', href: '/collections/accessories' }
    ]
  },
  {
    label: 'Tops',
    href: '/collections/tops',
    subCategories: [
      { label: 'Polo Shirts', href: '/collections/tops' },
      { label: 'Casual Shirts', href: '/collections/shirts' },
      { label: 'Formal Shirts', href: '/collections/formal-shirts' },
      { label: 'Blazers & Jackets', href: '/collections/suits-blazers' }
    ]
  },
  {
    label: 'Bottoms',
    href: '/collections/bottoms',
    subCategories: [
      { label: 'Trousers', href: '/collections/trousers' },
      { label: 'Chino Pants', href: '/collections/chino-pants' },
      { label: 'Casual Shorts', href: '/collections/shorts' },
      { label: 'Loungewear & Underwear', href: '/collections/underwear-loungewear' }
    ]
  },
  {
    label: 'Accessories',
    href: '/collections/accessories',
    subCategories: [
      { label: 'Leather Belts', href: '/collections/accessories' },
      { label: 'Premium Wallets', href: '/collections/accessories' },
      { label: 'Ties & Pocket Squares', href: '/collections/accessories' },
      { label: 'Socks & Essentials', href: '/collections/accessories' }
    ]
  },
  {
    label: 'SALE',
    href: '/collections/sale',
    subCategories: [
      { label: 'Polos Special Offer', href: '/collections/sale' },
      { label: 'Blazers Markdown', href: '/collections/sale' },
      { label: 'Clearance Sale', href: '/collections/sale' }
    ]
  }
];

export const Header: React.FC<HeaderProps> = ({ cartCount = 0, onCartClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 1. Promotional Banner */}
      {showPromo && (
        <div className="sticky top-0 z-50 w-full bg-black text-white text-[11px] font-bold py-2.5 px-4 flex justify-between items-center tracking-widest">
          <div className="flex-grow text-center text-xs uppercase font-sans tracking-[0.2em] pl-6">
            THE MORE YOU BUY - THE GREATER THE DEALS
          </div>
          <button
            onClick={() => setShowPromo(false)}
            className="text-white/70 hover:text-white transition-colors duration-200"
            aria-label="Close Announcement"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* 2. Utility Announcement Bar */}
      <div className="bg-black text-white text-[10px] font-semibold py-2 px-4 sm:px-6 lg:px-8 border-t border-brand-charcoal/10">
        <div className="w-full flex justify-between items-center tracking-widest font-sans">
          {/* Left */}
          <div className="flex items-center space-x-3">
            <span className="text-[10px]">INHERIT THE LEGEND</span>
            <span className="text-white/30 text-xs">|</span>
            <Link href="/pages/shop-now" className="hover:text-white/80 transition-colors duration-200 font-bold text-[10px]">
              SHOP NOW
            </Link>
          </div>
          {/* Right */}
          <div className="flex items-center space-x-3">
            <Link href="/pages/store-locator" className="flex items-center space-x-1 hover:text-white/80 transition-colors duration-200 text-[10px]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>STORE LOCATOR</span>
            </Link>
            <span className="text-white/30 text-xs">|</span>
            <a href="tel:18006226" className="hover:text-white/80 transition-colors duration-200 text-[10px]">
              CALL NOW
            </a>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar (Single row for category navigation) */}
      <div className={`sticky relative z-40 w-full transition-all duration-300 bg-white ${showPromo ? 'top-[36px]' : 'top-0'} ${isScrolled ? 'shadow-md border-b border-brand-charcoal/10' : ''}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Row 1: Left Menu | Logo | Right Actions */}
          <div className="flex items-center justify-between py-4">

            {/* Mobile menu trigger */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-brand-charcoal hover:opacity-70 transition-opacity duration-200"
                aria-label="Open Navigation Menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Row 1 Left Navigation with Hover Dropdowns (Desktop Mega-Menu) */}
            <nav className="hidden lg:flex space-x-8 items-center static">
              {MENU_ITEMS.map((item) => (
                <div key={item.label} className="group py-2 flex items-center static">
                  <Link
                    href={item.href}
                    className="font-sans text-[13px] font-bold tracking-widest text-brand-charcoal/70 hover:text-black transition-colors duration-200 uppercase"
                  >
                    {item.label}
                  </Link>
                  {/* Mega-menu / Full Width Dropdown Panel */}
                  <div className="absolute left-0 right-0 top-full bg-white shadow-xl border-y border-neutral-100 py-8 px-16 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1.5 group-hover:translate-y-0 before:content-[''] before:absolute before:left-0 before:right-0 before:top-[-24px] before:h-[24px] before:bg-transparent">
                    <div className="max-w-7xl mx-auto grid grid-cols-5 gap-8">
                      {item.subCategories.map((sub, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                          <Link
                            href={sub.href}
                            className="font-sans text-[13px] font-extrabold text-neutral-500 hover:text-black transition-colors duration-150 uppercase border-b border-neutral-100 pb-1.5"
                          >
                            {sub.label}
                          </Link>
                          <div className="flex flex-col space-y-2">
                            <Link href={sub.href} className="font-sans text-[12px] text-neutral-400 hover:text-black transition-colors">New Styles</Link>
                            <Link href={sub.href} className="font-sans text-[12px] text-neutral-400 hover:text-black transition-colors">Special Discount</Link>
                            <Link href={sub.href} className="font-sans text-[12px] text-neutral-400 hover:text-black transition-colors">Best Sellers</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>

            {/* Centered Logo */}
            <div className="flex justify-center lg:absolute lg:left-1/2 lg:-translate-x-1/2">
              <Link href="/" className="font-serif text-2xl font-bold tracking-widest text-brand-navy">
                ARISTINO
              </Link>
            </div>

            {/* Right actions */}
            <div className="flex items-center space-x-6 text-brand-charcoal">
              {/* Search */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="relative py-1 group transition-colors duration-200" 
                aria-label="Search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-charcoal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>

              {/* Account */}
              <Link href="/account" className="relative py-1 group transition-colors duration-200" aria-label="Account">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-charcoal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>

              {/* Wishlist (Heart icon) */}
              <Link href="/wishlist" className="relative py-1 group transition-colors duration-200" aria-label="Wishlist">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="absolute -top-1 -right-1.5 bg-black text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-charcoal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>

              {/* Shopping Bag */}
              <button
                onClick={onCartClick}
                className="relative py-1 group transition-colors duration-200"
                aria-label="Shopping Bag"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -top-1 -right-1.5 bg-black text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-charcoal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 4. Slide-down Search Bar Panel */}
      <div 
        className={`w-full bg-[#FAF9F6] border-b border-neutral-200 transition-all duration-300 ease-in-out overflow-hidden z-30 relative ${
          isSearchOpen ? 'max-h-16 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-grow max-w-lg">
            <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search products, collections, brands..."
              className="w-full bg-transparent border-none outline-none text-sm text-neutral-800 placeholder-neutral-400 font-sans"
              autoFocus={isSearchOpen}
            />
          </div>
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="text-neutral-500 hover:text-black transition-colors"
            aria-label="Close Search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Left Sidebar) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}
      >
        {/* Backdrop overlay */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Sidebar content container */}
        <div
          className={`absolute inset-y-0 left-0 w-80 max-w-xs bg-brand-navy p-6 shadow-2xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Header of Drawer */}
          <div className="flex items-center justify-between pb-6 border-b border-brand-charcoal/30">
            <span className="font-serif text-xl font-bold tracking-widest text-brand-offwhite">
              ARISTINO
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-brand-offwhite hover:text-brand-offwhite/75 transition-colors duration-200"
              aria-label="Close Navigation Menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links inside Drawer */}
          <nav className="mt-8 space-y-6 overflow-y-auto max-h-[calc(100vh-100px)] pr-2">
            <div className="text-brand-offwhite/50 text-[10px] font-bold uppercase tracking-wider mb-3">SHOP</div>
            {MENU_ITEMS.map((item) => (
              <div key={item.label} className="space-y-2">
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block font-sans text-xs font-bold tracking-wider text-brand-offwhite hover:text-[#C5A880] transition-colors duration-200 uppercase"
                >
                  {item.label}
                </Link>
                {/* Indented Sub-categories on Mobile */}
                <div className="pl-3.5 space-y-1.5 border-l border-brand-charcoal/30">
                  {item.subCategories.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block font-sans text-[11px] text-brand-offwhite/60 hover:text-brand-offwhite transition-colors duration-200"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};
