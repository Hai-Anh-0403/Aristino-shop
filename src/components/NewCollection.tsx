"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

const NEW_PRODUCTS: Product[] = [
  {
    id: 'new-1',
    brand: 'Aristino Business',
    title: 'Bộ Suits Nam Wool Aristino Business Premio...',
    price: 12500.00,
    imageUrl: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=800&auto=format&fit=crop',
    tagLeft: 'NEW',
    tagRight: 'PREMIUM',
    colors: ['#808080'],
    slug: 'bo-suits-nam-wool-aristino-business-premio',
  },
  {
    id: 'new-2',
    brand: 'Aristino Business',
    title: 'Bộ Suits Nam Wool Aristino Business Premio 1SURO1S',
    price: 12500.00,
    imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop',
    tagLeft: 'NEW',
    tagRight: 'PREMIUM',
    colors: ['#000000', '#172A45'],
    slug: 'bo-suits-nam-wool-aristino-business-premio-1suro1s',
  },
  {
    id: 'new-3',
    brand: 'Aristino',
    title: 'Áo Blazer Nam Kẻ Aristino Premio ABZ005S0H4',
    price: 4500.00,
    imageUrl: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=800&auto=format&fit=crop',
    tagLeft: 'NEW',
    colors: ['#D3D3D3'],
    slug: 'ao-blazer-nam-ke-aristino-premio-abz005s0h4',
  },
  {
    id: 'new-4',
    brand: 'Aristino Business',
    title: "Men's Premium Solid Polo Shirt",
    price: 126.40,
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
    tagLeft: 'NEW',
    tagRight: 'ONLINE EXCLUSIVE',
    colors: ['#000000'],
    slug: 'mens-premium-solid-polo-shirt',
  },
  {
    id: 'new-5',
    brand: 'Aristino Golf',
    title: "Men's Golf Fit Active Shorts",
    price: 60.00,
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    tagLeft: 'NEW',
    colors: ['#E1D3BE'],
    slug: 'mens-golf-fit-active-shorts',
  },
  {
    id: 'new-6',
    brand: 'Aristino',
    title: "Men's Summer Loungewear Two-Piece Set",
    price: 47.80,
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
    tagLeft: 'NEW',
    colors: ['#C4B59D'],
    slug: 'mens-summer-loungewear-two-piece-set',
  },
  {
    id: 'new-7',
    brand: 'Aristino',
    title: "Men's Relaxed Fit Patterned Polo Shirt",
    price: 42.80,
    imageUrl: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=800&auto=format&fit=crop',
    tagLeft: 'NEW',
    colors: ['#2F4F4F'],
    slug: 'mens-relaxed-fit-patterned-polo-shirt',
  },
  {
    id: 'new-8',
    brand: 'Aristino',
    title: "Men's Casual Sportswear Two-Piece Set",
    price: 59.80,
    imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop',
    tagLeft: 'NEW',
    colors: ['#1A1A1A'],
    slug: 'mens-casual-sportswear-two-piece-set',
  }
];

// Grouping products into 2-row columns
interface ProductColumn {
  top: Product;
  bottom: Product;
}

const PRODUCT_COLUMNS: ProductColumn[] = [
  { top: NEW_PRODUCTS[0], bottom: NEW_PRODUCTS[4] },
  { top: NEW_PRODUCTS[1], bottom: NEW_PRODUCTS[5] },
  { top: NEW_PRODUCTS[2], bottom: NEW_PRODUCTS[6] },
  { top: NEW_PRODUCTS[3], bottom: NEW_PRODUCTS[7] },
];

const VISIBLE_DESKTOP = 4;
const VISIBLE_TABLET = 3;
const VISIBLE_MOBILE = 2;
const GAP_PX = 16;

export const NewCollection: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(VISIBLE_DESKTOP);
  const [currentIndex, setCurrentIndex] = useState(VISIBLE_DESKTOP);
  const [useTransition, setUseTransition] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Responsive items count
  useEffect(() => {
    const updateVisibleCount = () => {
      const w = window.innerWidth;
      let count = VISIBLE_DESKTOP;
      if (w < 640) count = VISIBLE_MOBILE;
      else if (w < 1024) count = VISIBLE_TABLET;

      setVisibleCount(count);
      setCurrentIndex(count); // Start at offset due to clones
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const totalReal = PRODUCT_COLUMNS.length;

  const slides = [
    ...PRODUCT_COLUMNS.slice(-visibleCount),
    ...PRODUCT_COLUMNS,
    ...PRODUCT_COLUMNS.slice(0, visibleCount)
  ];

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setUseTransition(true);

    const prevIdx = currentIndex - 1;
    setCurrentIndex(prevIdx);

    if (prevIdx === visibleCount - 1) {
      setTimeout(() => {
        setUseTransition(false);
        setCurrentIndex(visibleCount + totalReal - 1);
        setIsTransitioning(false);
      }, 500);
    } else {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }
  }, [currentIndex, visibleCount, totalReal, isTransitioning]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setUseTransition(true);

    const nextIdx = currentIndex + 1;
    setCurrentIndex(nextIdx);

    if (nextIdx === visibleCount + totalReal) {
      setTimeout(() => {
        setUseTransition(false);
        setCurrentIndex(visibleCount);
        setIsTransitioning(false);
      }, 500);
    } else {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }
  }, [currentIndex, visibleCount, totalReal, isTransitioning]);

  const handleDragStart = (clientX: number) => {
    if (isTransitioning) return;
    setIsDragging(true);
    setDragStartX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    setDragOffset(clientX - dragStartX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 60;
    if (dragOffset > threshold) {
      handlePrev();
    } else if (dragOffset < -threshold) {
      handleNext();
    }
    setDragOffset(0);
  };

  return (
    <section className="w-full bg-brand-offwhite px-6 sm:px-10 lg:px-16 py-12 select-none">
      
      {/* Title Header with logo */}
      <div className="flex items-center justify-center gap-3.5 mb-10">
        <div className="w-10 h-10 flex items-center justify-center relative">
          <Image 
            src="/images/aristino-logo.svg" 
            alt="Aristino Logo Symbol" 
            width={34} 
            height={34}
            className="object-contain"
          />
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-brand-charcoal uppercase">
          NEW COLLECTION
        </h2>
      </div>

      {/* Slider Carousel Wrapper */}
      <div className="relative w-full">
        {/* Overflow Container */}
        <div className="overflow-hidden w-full">
          {/* Track */}
          <div
            ref={trackRef}
            className={`flex ${useTransition ? 'transition-transform duration-500 ease-out' : 'transition-none'}`}
            style={{
              gap: `${GAP_PX}px`,
              transform: `translateX(calc(-${currentIndex} * (calc(100% / ${visibleCount}) - ${GAP_PX * (visibleCount - 1) / visibleCount}px + ${GAP_PX}px) + ${isDragging ? dragOffset : 0}px))`,
            }}
            onMouseDown={(e) => { e.preventDefault(); handleDragStart(e.clientX); }}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
          >
            {slides.map((col, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 flex flex-col gap-y-10 sm:gap-y-12"
                style={{
                  width: `calc(100% / ${visibleCount} - ${GAP_PX * (visibleCount - 1) / visibleCount}px)`,
                }}
              >
                {/* Top card */}
                <ProductCard product={col.top} />
                {/* Bottom card */}
                <ProductCard product={col.bottom} />
              </div>
            ))}
          </div>
        </div>

        {/* Left Navigation Arrow */}
        <button
          onClick={handlePrev}
          className="absolute -left-4 sm:-left-6 lg:-left-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-brand-charcoal/10 hover:bg-white hover:shadow-lg transition-all duration-200 text-brand-charcoal"
          aria-label="Previous Slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Navigation Arrow */}
        <button
          onClick={handleNext}
          className="absolute -right-4 sm:-right-6 lg:-right-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-brand-charcoal/10 hover:bg-white hover:shadow-lg transition-all duration-200 text-brand-charcoal"
          aria-label="Next Slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* View All centered link at bottom */}
      <div className="flex justify-center mt-12">
        <Link 
          href="/collections/new-arrivals"
          className="font-sans text-[11px] font-bold tracking-[0.25em] text-brand-charcoal uppercase border-b border-brand-charcoal pb-0.5 hover:text-brand-gold hover:border-brand-gold transition-colors duration-300"
        >
          View all
        </Link>
      </div>

    </section>
  );
};
