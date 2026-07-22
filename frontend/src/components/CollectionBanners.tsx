"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BannerItem {
  src: string;
  alt?: string;
  label: string;
  href: string;
}

const DEFAULT_BANNERS: BannerItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop',
    alt: 'New Arrivals',
    label: 'NEW ARRIVALS',
    href: '/collections/new-arrivals',
  },
  {
    src: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop',
    alt: 'New Collection',
    label: 'NEW COLLECTION',
    href: '/collections/new-collection',
  },
  {
    src: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=1200&auto=format&fit=crop',
    alt: 'Luxury Suits',
    label: 'LUXURY SUITS',
    href: '/collections/suits-blazers',
  },
  {
    src: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=1200&auto=format&fit=crop',
    alt: 'Activewear',
    label: 'ACTIVEWEAR',
    href: '/collections/activewear',
  },
];

const GAP_PX = 16;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const CollectionBanners: React.FC = () => {
  const [banners, setBanners] = useState<BannerItem[]>(DEFAULT_BANNERS);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(2);
  const [currentIndex, setCurrentIndex] = useState(2);
  const [useTransition, setUseTransition] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_URL}/settings/homepage_banners`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setBanners(data.data);
        }
      } catch (e) {
        console.error('Failed to fetch homepage banners setting:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Responsive items count
  useEffect(() => {
    const updateVisibleCount = () => {
      const w = window.innerWidth;
      const count = w < 768 ? 1 : 2;
      setVisibleCount(count);
      setCurrentIndex(count); // reset index to start after clones
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const totalReal = banners.length;

  const slides = banners.length > 0
    ? [
        ...banners.slice(-visibleCount),
        ...banners,
        ...banners.slice(0, visibleCount)
      ]
    : [];


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

  // Autoplay loop
  useEffect(() => {
    if (isDragging) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [handleNext, isDragging]);

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
    <section className="relative w-full bg-brand-offwhite select-none px-6 sm:px-10 lg:px-16 py-8">
      <div className="relative overflow-hidden w-full">
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
          {slides.map((banner, idx) => {
            const imgSrc = banner.src?.startsWith('/uploads/')
              ? `http://localhost:8000${banner.src}`
              : (banner.src || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop');

            return (
              <Link
                key={idx}
                href={banner.href}
                className="flex-shrink-0 relative group cursor-pointer aspect-[4/5] overflow-hidden"
                style={{
                  width: `calc(100% / ${visibleCount} - ${GAP_PX * (visibleCount - 1) / visibleCount}px)`,
                }}
              >
                <Image
                  src={imgSrc}
                  alt={banner.alt || banner.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={imgSrc.includes('localhost') || imgSrc.includes('127.0.0.1')}
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-103"
                  draggable={false}
                />
                {/* Darkened overlay at bottom for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Bold caption centered at the bottom */}
                <div className="absolute bottom-8 left-0 right-0 text-center z-10 px-4">
                  <span className="font-sans text-xl sm:text-2xl font-bold tracking-[0.25em] text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                    {banner.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
