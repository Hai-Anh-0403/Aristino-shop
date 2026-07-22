"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

const STATIC_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop', alt: 'Editorial Look 1' },
  { src: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop', alt: 'Editorial Look 2' },
  { src: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=800&auto=format&fit=crop', alt: 'Editorial Look 3' },
  { src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop', alt: 'Editorial Look 4' },
  { src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop', alt: 'Editorial Look 5' },
  { src: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=800&auto=format&fit=crop', alt: 'Editorial Look 6' },
  { src: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop', alt: 'Editorial Look 7' },
  { src: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800&auto=format&fit=crop', alt: 'Editorial Look 8' },
];

const VISIBLE_DESKTOP = 4;
const VISIBLE_TABLET = 3;
const VISIBLE_MOBILE = 2;
const GAP_PX = 12;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const EditorialCarousel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(VISIBLE_DESKTOP);
  const [currentIndex, setCurrentIndex] = useState(VISIBLE_DESKTOP);
  const [useTransition, setUseTransition] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        let res = await fetch(`${API_URL}/products?isLookbook=true&limit=24`);
        let data = await res.json();
        let targetList = (data.success && Array.isArray(data.data) && data.data.length > 0) ? data.data : [];

        if (targetList.length === 0) {
          res = await fetch(`${API_URL}/products?limit=12`);
          data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            targetList = data.data;
          }
        }

        if (targetList.length > 0) {
          const mapped: Product[] = targetList.map((p: any) => ({
            id: p._id || p.id,
            brand: p.brand,
            title: p.title,
            price: p.price,
            originalPrice: p.originalPrice,
            discount: p.discount,
            imageUrl: p.imageUrl || (p.images && p.images[0]) || '',
            colors: p.colors || [],
            slug: p.slug || p.id || p._id,
            tagLeft: p.tagLeft,
            tagRight: p.tagRight,
            lookbookLabel: p.lookbookLabel
          }));
          setProducts(mapped);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Failed to load editorial carousel products:', err);
        setProducts([]);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const updateVisibleCount = () => {
      const w = window.innerWidth;
      let count = VISIBLE_DESKTOP;
      if (w < 640) count = VISIBLE_MOBILE;
      else if (w < 1024) count = VISIBLE_TABLET;
      
      setVisibleCount(count);
      setCurrentIndex(count);
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const hasDynamic = products.length > 0;
  const totalReal = hasDynamic ? products.length : STATIC_IMAGES.length;

  const slides = hasDynamic
    ? [...products.slice(-visibleCount), ...products, ...products.slice(0, visibleCount)]
    : [...STATIC_IMAGES.slice(-visibleCount), ...STATIC_IMAGES, ...STATIC_IMAGES.slice(0, visibleCount)];

  const handlePrev = useCallback(() => {
    if (isTransitioning || totalReal === 0) return;
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
    if (isTransitioning || totalReal === 0) return;
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

  useEffect(() => {
    if (totalReal === 0 || isDragging) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [handleNext, totalReal, isDragging]);

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



  if (products.length === 0) {
    return (
      <section className="relative w-full bg-brand-offwhite select-none px-6 sm:px-10 lg:px-16 pt-3 pb-4">
        <div className="w-full bg-brand-navy-light text-brand-offwhite py-12 px-6 rounded-lg text-center border border-brand-gold/20 font-serif flex flex-col items-center justify-center">
          <svg className="w-10 h-10 text-brand-gold mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-sm font-semibold tracking-wider uppercase mb-1">Editorial Lookbook</h3>
          <p className="text-xs text-brand-offwhite/60 font-sans">No content available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-brand-offwhite select-none px-6 sm:px-10 lg:px-16 pt-3 pb-4">
      <div className="relative overflow-hidden">
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
          {slides.map((item: any, idx) => {
            const isProd = !!item.id;
            return (
              <div
                key={idx}
                className="flex-shrink-0 relative group"
                style={{
                  width: `calc(100% / ${visibleCount} - ${GAP_PX * (visibleCount - 1) / visibleCount}px)`,
                }}
              >
                {isProd ? (
                  <ProductCard product={item} />
                ) : (
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-100">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover object-top"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-brand-charcoal/10 hover:bg-white hover:shadow-lg transition-all duration-200 text-brand-charcoal"
          aria-label="Previous Slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-brand-charcoal/10 hover:bg-white hover:shadow-lg transition-all duration-200 text-brand-charcoal"
          aria-label="Next Slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};
