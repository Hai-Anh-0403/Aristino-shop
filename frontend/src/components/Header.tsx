"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
}

const MENU_ITEMS = [
  {
    label: 'NEW ARRIVALS',
    href: '/collections/new-arrivals',
    subCategories: []
  },
  {
    label: 'THEMES',
    href: '/collections/themes',
    subCategories: [
      {
        label: 'ANIMALS/PETS',
        href: '/collections/themes?cat=animals-pets',
        items: ['cats', 'dogs', 'birds', 'horses', 'elephant', 'monkey', 'giraffe', 'shark', 'bear']
      },
      {
        label: 'INDOOR HOBBIES',
        href: '/collections/themes?cat=indoor-hobbies',
        items: ['poker', 'stamps', 'video games', 'gamer', 'camera', 'theatre', 'knitting']
      },
      {
        label: 'OBSERVATION HOBBIES',
        href: '/collections/themes?cat=observation-hobbies',
        items: ['fishkeeping', 'learning', 'microscopy', 'reading', 'shortwave listening', 'outdoors']
      },
      {
        label: 'UNSORTED HOBBIES',
        href: '/collections/themes?cat=unsorted-hobbies',
        items: ['aircraft spotting', 'airbrushing', 'airsofting', 'acting', 'aeromodeling', 'amateur astronomy']
      },
      {
        label: 'COMPETITION HOBBIES',
        href: '/collections/themes?cat=competition-hobbies',
        items: ['scuba', 'animal fancy', 'badminton', 'baton twirling', 'billiards', 'bowling']
      },
      {
        label: 'TRADES',
        href: '/collections/themes?cat=trades',
        items: ['engineer', 'teacher', 'electrician', 'doctor', 'dentist', 'carpenter', 'IT']
      },
      {
        label: 'SPORTS',
        href: '/collections/themes?cat=sports',
        items: ['fishing', 'billiards', 'hunting', 'bowling', 'archery', 'water polo', 'volleyball']
      },
      {
        label: 'OUTDOOR REC',
        href: '/collections/themes?cat=outdoor-rec',
        items: ['atv riding', 'atc', 'waverunner', 'dirt bike', 'dune buggy', 'camping']
      },
      {
        label: 'PEOPLE',
        href: '/collections/themes?cat=people',
        items: ['dad', 'pops', 'grandpa', 'mom', 'son', 'daughter', 'papa']
      },
      {
        label: 'SCHOOL',
        href: '/collections/themes?cat=school',
        items: ['science', 'spanish', 'social studies', 'drama', 'math', 'geography']
      },
      {
        label: 'MUSIC',
        href: '/collections/themes?cat=music',
        items: ['heavy metal', 'country', 'rock', 'R&B', 'rap', 'trumpet', 'guitar']
      },
      {
        label: 'HOLIDAYS',
        href: '/collections/themes?cat=holidays',
        items: ['mothers day', 'fathers day', 'halloween', 'christmas', 'easter', 'thanksgiving']
      }
    ]
  },
  {
    label: 'BEST SELLERS',
    href: '/collections/best-sellers',
    subCategories: []
  }
];

export const Header: React.FC<HeaderProps> = ({ cartCount = 0, onCartClick }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const [user, setUser] = useState<{ email: string; firstName: string; lastName: string; provider?: string; avatarUrl?: string } | null>(null);

  useEffect(() => {
    const checkUser = () => {
      const userSession = localStorage.getItem('aristino_user');
      if (userSession) {
        try {
          setUser(JSON.parse(userSession));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    window.addEventListener('storage', checkUser);
    const interval = setInterval(checkUser, 1000);

    return () => {
      window.removeEventListener('storage', checkUser);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('aristino_user');
    setUser(null);
    router.push('/account/login');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/products?search=${encodeURIComponent(debouncedQuery)}&limit=5`);
        const data = await res.json();
        if (data.success && data.data) {
          setSuggestions(data.data);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/collections/all?search=${encodeURIComponent(searchQuery.trim())}`);
      handleCloseSearch();
    }
  };

  const handleSuggestionClick = (product: any) => {
    const target = product?.slug || product?.id || product?._id;
    if (target) {
      router.push(`/product/${encodeURIComponent(String(target))}`);
      handleCloseSearch();
    }
  };

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
            <Link href="/collections/new-arrivals" className="hover:text-white/80 transition-colors duration-200 font-bold text-[10px]">
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
                className="text-brand-navy hover:opacity-70 transition-opacity duration-200"
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
                  {item.subCategories && item.subCategories.length > 0 && (
                    <div className="absolute left-0 right-0 top-full bg-white shadow-xl border-y border-neutral-100 py-8 px-16 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1.5 group-hover:translate-y-0 before:content-[''] before:absolute before:left-0 before:right-0 before:top-[-24px] before:h-[24px] before:bg-transparent">
                      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-x-8 gap-y-6 max-h-[70vh] overflow-y-auto pr-2">
                        {item.subCategories.map((sub: any, i) => (
                          <div key={i} className="flex flex-col space-y-2">
                            <Link
                              href={sub.href}
                              className="font-sans text-[12px] font-extrabold text-neutral-800 hover:text-black transition-colors duration-150 uppercase border-b border-neutral-100 pb-1.5"
                            >
                              {sub.label}
                            </Link>
                            {sub.items && sub.items.length > 0 && (
                              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-0.5">
                                {sub.items.map((niche: string, j: number) => (
                                  <Link
                                    key={j}
                                    href={`/collections/themes?sub=${niche.toLowerCase().replace('/', '-').replace(' ', '-')}`}
                                    className="font-sans text-[11px] text-neutral-400 hover:text-black transition-colors hover:translate-x-0.5 transform duration-150 capitalize truncate"
                                    title={niche}
                                  >
                                    {niche}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
            <div className="flex items-center space-x-6 text-brand-navy">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="relative py-1 group transition-colors duration-200"
                aria-label="Search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>

              {/* Account / Circular User Avatar */}
              {user ? (
                <div className="relative group py-1">
                  <button
                    onClick={() => router.push('/account')}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-navy text-brand-gold font-sans font-bold text-xs shadow-xs border border-brand-gold/40 hover:border-brand-gold transition-all duration-200 focus:outline-none cursor-pointer"
                    aria-label="User Profile Menu"
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span>{user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}</span>
                    )}
                  </button>

                  {/* Hover Dropdown displaying basic info & logout button */}
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-neutral-200 shadow-xl rounded-md py-4 px-4 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 transform translate-y-1 group-hover:translate-y-0 before:content-[''] before:absolute before:-top-2 before:right-3 before:w-0 before:h-0 before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:border-b-8 before:border-b-white">
                    {/* Basic Information */}
                    <div className="pb-3 border-b border-neutral-100">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-full bg-brand-navy text-brand-gold font-bold text-sm flex items-center justify-center flex-shrink-0 border border-brand-gold/40">
                          {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-serif text-sm font-bold text-brand-charcoal truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="font-sans text-[11px] text-neutral-500 truncate">
                            {user.email}
                          </p>
                          {user.provider === 'google' && (
                            <span className="inline-flex items-center space-x-1 mt-1 text-[9px] font-sans font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                              </svg>
                              <span>Google Account</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Navigation & Actions */}
                    <div className="pt-2.5 space-y-1 font-sans text-xs">
                      <Link
                        href="/account"
                        className="block py-1.5 px-2 font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-black rounded transition-colors"
                      >
                        My Account Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left py-1.5 px-2 font-semibold text-red-600 hover:bg-red-50 rounded transition-colors flex items-center space-x-1.5 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/account" className="relative py-1 group transition-colors duration-200" aria-label="Account">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              )}


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
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
            </div>

          </div>
        </div>

        {/* 4. Slide-down Search Bar Panel */}
        <div className="relative w-full">
          <div
            className={`w-full bg-[#FAF9F6] border-b border-neutral-200 transition-all duration-300 ease-in-out overflow-hidden z-30 relative ${isSearchOpen ? 'max-h-16 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
              }`}
          >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-3 flex-grow mr-8">
              <svg className="h-5 w-5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products, collections, brands..."
                className="w-full bg-transparent border-none outline-none text-sm text-neutral-800 placeholder-neutral-400 font-sans py-2.5"
                autoFocus={isSearchOpen}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <button
              onClick={handleCloseSearch}
              className="text-neutral-500 hover:text-black transition-colors"
              aria-label="Close Search"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Suggestions Dropdown Overlay */}
        {isSearchOpen && debouncedQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-neutral-200 z-50 max-h-[400px] overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8 space-x-2 text-neutral-500">
                  <svg className="animate-spin h-5 w-5 text-brand-gold" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="font-sans text-xs tracking-widest uppercase text-neutral-500">Searching suggestions...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-[10px] font-sans font-bold tracking-[0.2em] text-neutral-400 uppercase">
                    Suggested Products ({suggestions.length})
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {suggestions.map((product) => (
                      <button
                        key={product._id || product.id}
                        onClick={() => handleSuggestionClick(product)}
                        className="flex items-center space-x-3 p-2 hover:bg-neutral-50 transition-colors duration-150 text-left w-full border border-neutral-100 rounded"
                      >
                        <div className="relative w-12 h-16 flex-shrink-0 bg-neutral-100 overflow-hidden">
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <span className="block font-sans text-[9px] font-bold text-neutral-400 uppercase tracking-wider truncate">
                            {product.brand}
                          </span>
                          <h4 className="font-serif text-xs text-brand-charcoal truncate font-medium mt-0.5">
                            {product.title}
                          </h4>
                          <span className="block font-sans text-xs text-brand-navy font-semibold mt-1">
                            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500 font-sans text-xs">
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}
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
