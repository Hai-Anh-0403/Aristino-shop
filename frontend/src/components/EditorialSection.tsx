"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

const SECTION_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop', alt: 'Collection Look 1', label: 'DYNAMIC' },
  { src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop', alt: 'Collection Look 2', label: 'SUMMER COLLECTION' },
  { src: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=800&auto=format&fit=crop', alt: 'Collection Look 3', label: 'LIFE STYLE' },
  { src: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop', alt: 'Collection Look 4', label: 'DELICATE' },
  { src: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800&auto=format&fit=crop', alt: 'Collection Look 5', label: 'DYNAMIC' },
  { src: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=800&auto=format&fit=crop', alt: 'Collection Look 6', label: 'SUMMER COLLECTION' },
  { src: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop', alt: 'Collection Look 7', label: 'LIFE STYLE' },
  { src: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop', alt: 'Collection Look 8', label: 'DELICATE' },
];

const VISIBLE_COUNT = 4;
const GAP_PX = 12;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const EditorialSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lookbookTitle, setLookbookTitle] = useState('INHERIT THE LEGEND');
  const [lookbookDesc, setLookbookDesc] = useState(
    'In the era of a rising Vietnam, every man defines his own path with the courage to move forward. Guided by this spirit, Aristino presents the story of "Vietnamese character from unique courage" – where inner strength is not defined by blending in, but by persistent personal identity. Each persona is a distinct thread, weaving a modern Vietnam: self-reliant, resilient, adaptive, and constantly striving to continue the legacy of "Inheriting the Legend".'
  );
  const [currentIndex, setCurrentIndex] = useState(VISIBLE_COUNT);
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
        let loaded: Product[] = [];

        if (data.success && data.data && data.data.length > 0) {
          loaded = data.data.map((p: any) => ({
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
            lookbookLabel: p.lookbookLabel || p.brand || p.title
          }));
        }

        if (loaded.length === 0) {
          res = await fetch(`${API_URL}/products?limit=12`);
          data = await res.json();
          if (data.success && data.data && data.data.length > 0) {
            loaded = data.data.map((p: any) => ({
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
              lookbookLabel: p.lookbookLabel || p.brand || p.title
            }));
          }
        }

        setProducts(loaded);
      } catch {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
 
    const fetchLookbookInfo = async () => {
      try {
        const res = await fetch(`${API_URL}/settings/lookbook_info`);
        const data = await res.json();
        if (data.success && data.data) {
          if (data.data.title) setLookbookTitle(data.data.title);
          if (data.data.description) setLookbookDesc(data.data.description);
        }
      } catch (err) {
        console.error('Failed to fetch lookbook settings:', err);
      }
    };
 
    loadProducts();
    fetchLookbookInfo();
  }, []);

  const totalReal = products.length;

  const slides = products.length > 0
    ? [
        ...products.slice(-VISIBLE_COUNT),
        ...products,
        ...products.slice(0, VISIBLE_COUNT)
      ]
    : [];

  const handlePrev = useCallback(() => {
    if (isTransitioning || totalReal === 0) return;
    setIsTransitioning(true);
    setUseTransition(true);

    const prevIdx = currentIndex - 1;
    setCurrentIndex(prevIdx);

    if (prevIdx === VISIBLE_COUNT - 1) {
      setTimeout(() => {
        setUseTransition(false);
        setCurrentIndex(VISIBLE_COUNT + totalReal - 1);
        setIsTransitioning(false);
      }, 500);
    } else {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }
  }, [currentIndex, totalReal, isTransitioning]);

  const handleNext = useCallback(() => {
    if (isTransitioning || totalReal === 0) return;
    setIsTransitioning(true);
    setUseTransition(true);

    const nextIdx = currentIndex + 1;
    setCurrentIndex(nextIdx);

    if (nextIdx === VISIBLE_COUNT + totalReal) {
      setTimeout(() => {
        setUseTransition(false);
        setCurrentIndex(VISIBLE_COUNT);
        setIsTransitioning(false);
      }, 500);
    } else {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }
  }, [currentIndex, totalReal, isTransitioning]);

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
    <section className="w-full bg-brand-offwhite py-8">
      <div className="flex flex-col lg:flex-row lg:items-center w-full min-h-[420px]">
        <div className="w-full lg:w-[28%] lg:flex-shrink-0 flex flex-col justify-center px-8 sm:px-12 lg:pl-16 lg:pr-10 py-8 lg:py-0">
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-10 h-10 flex items-center justify-center relative flex-shrink-0">
              <Image
                src="/images/aristino-logo.svg"
                alt="Aristino Logo Symbol"
                width={36}
                height={36}
                style={{ width: 'auto', height: 'auto' }}
                className="object-contain"
              />
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-brand-charcoal leading-tight">
              {lookbookTitle}
            </h2>
          </div>
          <p className="font-sans text-[12px] leading-relaxed text-brand-charcoal/70 mb-7">
            {lookbookDesc}
          </p>
          <div className="w-full">
            <Link
              href="/collections/themes"
              className="block w-full text-center py-3 bg-brand-charcoal text-white font-sans text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-brand-navy transition-colors duration-300"
            >
              VIEW DETAILS
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="w-full lg:w-[72%] min-w-0 relative select-none pr-6 sm:pr-10 lg:pr-16 flex items-center justify-center">
            <div className="w-full bg-brand-navy-light text-brand-offwhite py-16 px-6 rounded-lg text-center border border-brand-gold/20 font-serif flex flex-col items-center justify-center">
              <svg className="w-10 h-10 text-brand-gold mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-sm font-semibold tracking-wider uppercase mb-1">Lookbook Showcase</h3>
              <p className="text-xs text-brand-offwhite/60 font-sans">No content available</p>
            </div>
          </div>
        ) : (
          <div className="w-full lg:w-[72%] min-w-0 relative select-none pr-6 sm:pr-10 lg:pr-16">
            <div className="relative overflow-hidden w-full">
              <div
                ref={trackRef}
                className={`flex ${useTransition ? 'transition-transform duration-500 ease-out' : 'transition-none'}`}
                style={{
                  gap: `${GAP_PX}px`,
                  transform: `translateX(calc(-${currentIndex} * (calc(100% / ${VISIBLE_COUNT}) - ${GAP_PX * (VISIBLE_COUNT - 1) / VISIBLE_COUNT}px + ${GAP_PX}px) + ${isDragging ? dragOffset : 0}px))`,
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
                  const prodSlug = item.slug || item.id || '1784509572378';
                  const labelText = item.lookbookLabel || item.brand || item.title || 'COLLECTION 2026';
                  const imgUrl = item.imageUrl || (item.images && item.images[0]) || '/images/shirt-white.png';

                  return (
                    <div
                      key={idx}
                      className="flex-shrink-0 relative group flex flex-col cursor-pointer"
                      style={{
                        width: `calc(100% / ${VISIBLE_COUNT} - ${GAP_PX * (VISIBLE_COUNT - 1) / VISIBLE_COUNT}px)`,
                      }}
                    >
                      <Link href={`/product/${encodeURIComponent(prodSlug)}`} className="block relative w-full aspect-[3/4] overflow-hidden rounded-sm" draggable={false}>
                        <img
                          src={imgUrl}
                          alt={item.title || 'Lookbook Product'}
                          className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </Link>
                      <div className="text-center mt-3.5">
                        <Link href={`/product/${encodeURIComponent(prodSlug)}`}>
                          <span className="font-sans text-[11px] font-bold tracking-[0.18em] text-brand-charcoal uppercase group-hover:text-brand-gold transition-colors duration-300 line-clamp-1">
                            {labelText}
                          </span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handlePrev}
                className="absolute left-2 top-[38%] -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-brand-charcoal/10 hover:bg-white hover:shadow-lg transition-all duration-200 text-brand-charcoal"
                aria-label="Previous Slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 top-[38%] -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-brand-charcoal/10 hover:bg-white hover:shadow-lg transition-all duration-200 text-brand-charcoal"
                aria-label="Next Slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
