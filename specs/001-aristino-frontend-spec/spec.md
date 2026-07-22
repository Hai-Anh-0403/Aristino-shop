# Feature Specification: Aristino Frontend Rebuild

**Feature Branch**: `001-aristino-frontend-spec`
**Created**: 2026-07-15
**Status**: Approved
**Input**: Rebuilding the Aristino website (https://aristino.com) in 100% English Next.js (App Router, TS) and Tailwind CSS while maintaining UI fidelity.

---

## Clarifications

### Session 2026-07-15
- Q: Should our frontend components support dual currencies (VND/USD) with a header toggle, or display a single currency? → A: Single currency (USD) natively formatted as $XX.XX for an exclusively international target audience.
- Q: How should the Shopping Bag state be persisted on the client side? → A: Store cart state in Cookies (enables full Server-Side Rendering support and avoids client-side hydration flashes).
- Q: When clicking the Search icon in the header, what interaction pattern should be displayed? → A: Sliding Header Overlay: Expands search inputs inline/directly below the header, showing search suggestions on the current page.
- Q: Should the header display a visual language selector dropdown (e.g., showing "EN" as active) to match the layout structure of the legacy site? → A: Omit Selector: Remove the language picker element completely from the header actions since the site is currently 100% English.
- Q: For mobile viewports, how should the mobile menu be displayed? → A: Slide-in Sidebar: Mobile navigation slides in smoothly as a drawer from the left side of the viewport.

---

## User Scenarios & Testing

### User Story 1 - Header Navigation and Brand Identity (Priority: P1)
As a visitor, I want to navigate the store using a premium, responsive header in English so that I can explore categories easily and locate products.

**Acceptance Scenarios**:
1. **Given** the homepage is loaded, **When** I view the top of the page, **Then** I see the centered brand logo, localized navigation links ("NEW ARRIVALS", "SHIRTING", "POLOS", "TROUSERS", "SUITS", "ACCESSORIES", "OUR STORY"), search tool, wishlist count, and shopping bag icon.
2. **Given** I am on a mobile viewport, **When** I tap the hamburger icon, **Then** a sliding mobile menu opens displaying the category links in premium English.
3. **Given** I scroll down the page, **When** I pass the fold, **Then** the header remains sticky at the top with a subtle backdrop blur effect.

---

### User Story 2 - Premium Product Card and Quick Actions (Priority: P1)
As a customer browsing collections, I want to see product cards that look premium, show key details (image zoom, title, price, swatches), and let me quick-add to the cart without breaking the grid layout.

**Acceptance Scenarios**:
1. **Given** a product grid page, **When** I hover over a product image, **Then** the image subtly zooms in without resizing the card container.
2. **Given** a product with a long title, **When** it renders, **Then** the title is truncated to a maximum of 2 lines to maintain grid alignment.
3. **Given** color swatches are present, **When** I hover over a swatch, **Then** a subtle border highlights the active swatch.

---

### User Story 3 - Shopping Bag Drawer Interaction (Priority: P2)
As a customer, I want to see my cart contents in a sliding drawer from the right side of the screen when I click the shopping bag icon.

**Acceptance Scenarios**:
1. **Given** I click the Shopping Bag icon, **When** the drawer triggers, **Then** it slides in smoothly from the right side of the viewport with a dark overlay blocking interactions behind it.
2. **Given** the drawer is open, **When** I click the "Checkout" button or close icon, **Then** it performs the redirect or slides back out of view respectively.

---

## Technical Specifications & UI Design System

### 1. Tailwind Config & Design System (`frontend/tailwind.config.js`)
This configuration file sets up the design tokens matching Aristino's premium, masculine aesthetic.

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aristino Premium Palette
        brand: {
          navy: {
            DEFAULT: '#0A192F', // Primary background & headers
            light: '#172A45',
            dark: '#020C1B',
          },
          gold: {
            DEFAULT: '#C5A880', // Accents, hover borders, active swatches
            light: '#E6D5B8',
            dark: '#A3855C',
          },
          charcoal: {
            DEFAULT: '#1F2937', // Text, secondary borders
            muted: '#4B5563',
          },
          offwhite: {
            DEFAULT: '#FAF9F6', // Secondary background
            light: '#FFFFFF',
          }
        }
      },
      fontFamily: {
        // Serif for premium headings, Sans-serif for UI elements
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'Helvetica Neue', 'sans-serif'],
      },
      lineClamp: {
        2: '2',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
```

---

### 2. Core Component Specifications

#### A. Header / Navigation Bar (`frontend/src/components/Header.tsx`)
```tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Master Localized Menu items matching the Aristino Localization Constitution
const NAV_LINKS = [
  { label: 'NEW ARRIVALS', href: '/collections/new-arrivals' },
  { label: 'SHIRTING', href: '/collections/shirts' },
  { label: 'POLOS', href: '/collections/polos' },
  { label: 'TROUSERS', href: '/collections/trousers' },
  { label: 'SUITS', href: '/collections/suits' },
  { label: 'ACCESSORIES', href: '/collections/accessories' },
  { label: 'OUR STORY', href: '/pages/about-us' }
];

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-brand-navy/95 backdrop-blur-md border-b border-brand-charcoal/20 shadow-md py-3' 
          : 'bg-brand-navy py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-brand-offwhite hover:text-brand-gold transition-colors duration-200"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Brand Logo - Centered/Left */}
        <div className="flex-1 lg:flex-initial flex justify-center lg:justify-start">
          <Link href="/" className="font-serif text-2xl font-bold tracking-widest text-brand-offwhite">
            ARISTINO
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-sans text-xs font-semibold tracking-widest text-brand-offwhite/90 hover:text-brand-gold transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Header Actions: Search, Wishlist, Shopping Bag */}
        <div className="flex items-center space-x-6 text-brand-offwhite">
          {/* Search Icon */}
          <button className="hover:text-brand-gold transition-colors duration-200" aria-label="Search">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Account Icon */}
          <Link href="/account" className="hover:text-brand-gold transition-colors duration-200" aria-label="Account">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>

          {/* Shopping Bag Icon */}
          <button className="hover:text-brand-gold transition-colors duration-200 relative" aria-label="Shopping Bag">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-navy font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sliding Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-brand-navy border-t border-brand-charcoal/20 px-4 pt-4 pb-6 space-y-4 shadow-lg animate-fadeIn">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-sans text-sm font-semibold tracking-wider text-brand-offwhite hover:text-brand-gold transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
```

---

#### B. Premium Product Card (`frontend/src/components/ProductCard.tsx`)
```tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  colors: string[]; // hex codes
  slug: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  imageUrl,
  colors,
  slug,
}) => {
  return (
    <div className="group flex flex-col w-full bg-brand-offwhite-light border border-brand-charcoal/5 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      
      {/* Product Image Container with zoom effect */}
      <Link href={`/product/${slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-0 bg-brand-navy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <button className="w-11/12 py-3 bg-brand-navy text-brand-offwhite font-sans text-xs font-semibold tracking-widest hover:bg-brand-gold hover:text-brand-navy transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            QUICK ADD
          </button>
        </div>
      </Link>

      {/* Product Details Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Brand Header */}
        <span className="font-sans text-[10px] font-bold tracking-widest text-brand-charcoal/50 mb-1">
          ARISTINO
        </span>

        {/* Title capped to max 2 lines to maintain layout alignment */}
        <h3 className="font-serif text-sm font-medium text-brand-charcoal line-clamp-2 leading-relaxed mb-2 h-10">
          <Link href={`/product/${slug}`} className="hover:text-brand-gold transition-colors duration-200">
            {title}
          </Link>
        </h3>

        {/* Color Swatches */}
        <div className="flex space-x-2 mb-3">
          {colors.map((hex, index) => (
            <button
              key={index}
              className="w-3.5 h-3.5 rounded-full border border-brand-charcoal/20 hover:border-brand-gold transition-colors duration-200 focus:outline-none"
              style={{ backgroundColor: hex }}
              aria-label={`Select color swatch ${index + 1}`}
            />
          ))}
        </div>

        {/* Pricing information */}
        <div className="mt-auto flex items-center justify-between">
          <span className="font-sans text-sm font-semibold text-brand-navy">
            ${price.toFixed(2)}
          </span>
          <span className="font-sans text-[11px] text-brand-charcoal/50">
            USD
          </span>
        </div>
      </div>
    </div>
  );
};
```

---

#### C. Shopping Bag Drawer (`frontend/src/components/CartDrawer.tsx`)
```tsx
"use client";

import React from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
      <div className="absolute inset-0 overflow-hidden">
        
        {/* Dark Backdrop Overlay */}
        <div 
          onClick={onClose}
          className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out"
        />

        {/* Slide-over Panel */}
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md transform bg-brand-offwhite-light shadow-2xl transition-transform duration-500 ease-in-out">
            <div className="flex h-full flex-col overflow-y-scroll py-6">
              
              {/* Drawer Header */}
              <div className="px-4 sm:px-6 flex items-center justify-between border-b border-brand-charcoal/10 pb-5">
                <h2 className="font-serif text-lg font-bold text-brand-navy tracking-wide">
                  Shopping Bag
                </h2>
                <button
                  onClick={onClose}
                  className="text-brand-charcoal hover:text-brand-gold transition-colors duration-200"
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
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between font-serif text-sm font-medium text-brand-charcoal">
                              <h3>{item.name}</h3>
                              <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-xs text-brand-charcoal/50">
                              {item.color} | {item.size}
                            </p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-xs">
                            <p className="text-brand-charcoal/60 font-sans">
                              Qty {item.quantity}
                            </p>
                            <button type="button" className="font-sans font-semibold text-brand-gold hover:text-brand-gold-dark transition-colors duration-200">
                              Remove
                            </button>
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
                  <button className="w-full py-4 bg-brand-navy text-brand-offwhite font-sans text-xs font-bold tracking-widest hover:bg-brand-gold hover:text-brand-navy transition-all duration-300">
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
```

---

## Internationalization (i18n) & SEO Strategy

### i18n Routing Structure
Since the primary goal is a 100% English rebuild, the website will serve English natively at the root path (`/`). To allow simple extensibility for additional locales in the future (e.g. Vietnamese `vi` or Japanese `ja`), we recommend configuring Next.js App Router dynamic localized segments:

- Folder Layout: `src/app/[locale]/`
- Middleware redirects the user from `/` to `/[locale]` based on language preferences or config files, mapping English natively to `/en` or keeping a fallback redirect logic.

```typescript
// frontend/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'vi'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if pathname is missing any locale prefix
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    // Rewrite path to target locale natively
    return NextResponse.rewrite(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    // Skip static assets and internal requests
    '/((?!api|_next/static|_next/image|favicon.ico|assets|images).*)',
  ],
};
```

### Next.js SEO Metadata Configuration
A standard `metadata` block structure used for English SEO keywords on Product detail pages to align with menswear optimization targets.

```typescript
// frontend/src/app/[locale]/product/[slug]/page.tsx
import { Metadata } from 'next';

interface ProductParams {
  params: {
    slug: string;
    locale: string;
  };
}

export async function generateMetadata({ params }: ProductParams): Promise<Metadata> {
  const { slug } = params;
  
  // Example data fetch from API/Mock database
  const product = {
    title: "Premium Pima Cotton Polo Shirt",
    description: "Discover Aristino's signature Polo shirt crafted from premium long-staple Pima cotton. Perfect tailored fit with Italian refinement.",
    keywords: "premium menswear, tailored shirts, Pima cotton polo, Italian style menswear, luxury shirts",
    imageUrl: "https://aristino.com/assets/product-images/polo-navy-1.jpg"
  };

  return {
    title: `${product.title} | ARISTINO`,
    description: product.description,
    keywords: product.keywords,
    openGraph: {
      title: `${product.title} | ARISTINO`,
      description: product.description,
      url: `https://aristino.com/product/${slug}`,
      images: [
        {
          url: product.imageUrl,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | ARISTINO`,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}
```

---

## User Story 14 - Customer and Contact Feedback Hub (Priority: P2)
As an administrator, I want to access a central contact management section in the Admin Dashboard to aggregate and manage user messages submitted through the contact form.

**Acceptance Scenarios**:
1. **Given** the Admin Dashboard is loaded and I select the "Khách hàng" (Customers) tab, **When** the page renders, **Then** I see the list of all customer messages showing submission timestamp, sender's name, email, phone, and message snippet.
2. **Given** the list of messages is loaded, **When** I type into the search bar, **Then** the list is filtered in real-time by sender's name, email, phone, or message body.
3. **Given** the list of messages, **When** I click the "Chi tiết" (View Details) button, **Then** a modal overlay opens displaying all sender details and the full feedback message.
4. **Given** a customer message, **When** I click the "Xóa" (Delete) button and confirm, **Then** the message is permanently deleted from the collection and the list refreshes.

---

## Assumptions

- We assume Tailwind CSS plugins (`@tailwindcss/line-clamp`) are installed in the developer's project context.
- We assume standard system fonts are used as secondary options if Google Fonts (Inter, Playfair Display) are failing to load.
- Rebuilding in Next.js will align with Haravan's core layout endpoints mapping to static static-rendered Next.js pages.
