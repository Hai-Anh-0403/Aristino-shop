"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Grouping products into 2-row columns
interface ProductColumn {
  top: Product;
  bottom: Product;
}

const VISIBLE_DESKTOP = 4;
const VISIBLE_TABLET = 3;
const VISIBLE_MOBILE = 2;
const GAP_PX = 16;

export const NewCollection: React.FC = () => {
  const [columns, setColumns] = useState<ProductColumn[]>([]);
  const [visibleCount, setVisibleCount] = useState(VISIBLE_DESKTOP);
  const [currentIndex, setCurrentIndex] = useState(VISIBLE_DESKTOP);
  const [useTransition, setUseTransition] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Fetch new products dynamically and group them into 2-row columns
  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products?limit=16`);
        const data = await res.json();
        
        let targetProducts: Product[] = [];
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          targetProducts = data.data.map((p: any) => ({
            _id: p._id,
            id: p.id || p._id,
            brand: p.brand,
            title: p.title,
            price: p.price,
            originalPrice: p.originalPrice,
            discount: p.discount,
            description: p.description,
            imageUrl: p.imageUrl || (p.images && p.images[0]) || '',
            images: p.images || [],
            color: p.color || '',
            colors: p.colors || (p.color ? [p.color] : []),
            theme: p.theme || '',
            status: p.status || '',
            done: p.done,
            uploadedAt: p.uploadedAt,
            slug: p.slug || p.id || p._id,
            tagLeft: p.tagLeft,
            tagRight: p.tagRight
          }));
        }

        if (targetProducts.length === 0) {
          setColumns([]);
          return;
        }

        // Group into columns
        const half = Math.ceil(targetProducts.length / 2);
        const cols: ProductColumn[] = [];
        for (let i = 0; i < half; i++) {
          cols.push({
            top: targetProducts[i],
            bottom: targetProducts[i + half] || targetProducts[i] // fallback bottom to top if odd number
          });
        }
        setColumns(cols);
      } catch (err) {
        console.error('Failed to fetch new collection products:', err);
        setColumns([]);
      }
    };

    fetchNewProducts();
  }, []);

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

  const totalReal = columns.length;

  const slides = totalReal > 0 ? [
    ...columns.slice(-visibleCount),
    ...columns,
    ...columns.slice(0, visibleCount)
  ] : [];

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

  // Autoplay slideshow
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
