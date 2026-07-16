"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

const EDITORIAL_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop',
    alt: 'Editorial Look 1 – Classic White Polo',
  },
  {
    src: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
    alt: 'Editorial Look 2 – Sport Casual',
  },
  {
    src: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=800&auto=format&fit=crop',
    alt: 'Editorial Look 3 – Sharp Blazer',
  },
  {
    src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    alt: 'Editorial Look 4 – Relaxed Fit',
  },
  {
    src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
    alt: 'Editorial Look 5 – Business Style',
  },
  {
    src: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=800&auto=format&fit=crop',
    alt: 'Editorial Look 6 – Outdoor Active',
  },
  {
    src: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop',
    alt: 'Editorial Look 7 – Street Style',
  },
  {
    src: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800&auto=format&fit=crop',
    alt: 'Editorial Look 8 – Smart Casual',
  },
];

const VISIBLE_DESKTOP = 4;
const VISIBLE_TABLET = 3;
const VISIBLE_MOBILE = 2;
const GAP_PX = 12;

export const EditorialCarousel: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(VISIBLE_DESKTOP);
  const [currentIndex, setCurrentIndex] = useState(VISIBLE_DESKTOP);
  const [useTransition, setUseTransition] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Responsive visible count
  useEffect(() => {
    const updateVisibleCount = () => {
      const w = window.innerWidth;
      let count = VISIBLE_DESKTOP;
      if (w < 640) count = VISIBLE_MOBILE;
      else if (w < 1024) count = VISIBLE_TABLET;
      
      setVisibleCount(count);
      setCurrentIndex(count); // Start at index = visible count due to prepended clones
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const totalReal = EDITORIAL_IMAGES.length;
  
  // Construct infinite list: prepend cloned items from the end, append cloned items from the start
  const slides = [
    ...EDITORIAL_IMAGES.slice(-visibleCount),
    ...EDITORIAL_IMAGES,
    ...EDITORIAL_IMAGES.slice(0, visibleCount)
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
      }, 500); // 500ms matches transition duration
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
    <section className="relative w-full bg-brand-offwhite select-none px-6 sm:px-10 lg:px-16 pt-3 pb-4">
      {/* Overflow container – clips exactly at visible images */}
      <div className="relative overflow-hidden">
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
          {slides.map((img, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 relative group cursor-pointer"
              style={{
                width: `calc(100% / ${visibleCount} - ${GAP_PX * (visibleCount - 1) / visibleCount}px)`,
                aspectRatio: '3 / 4',
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes={`(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw`}
                className="object-cover object-top"
                draggable={false}
              />
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Left Arrow - Always visible for infinite loop */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-brand-charcoal/10 hover:bg-white hover:shadow-lg transition-all duration-200 text-brand-charcoal"
          aria-label="Previous Slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow - Always visible for infinite loop */}
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
