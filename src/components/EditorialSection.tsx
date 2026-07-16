"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Sample editorial images for this section's carousel with labels below each image
const SECTION_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    alt: 'Collection Look 1',
    label: 'DYNAMIC',
  },
  {
    src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
    alt: 'Collection Look 2',
    label: 'SUMMER COLLECTION',
  },
  {
    src: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=800&auto=format&fit=crop',
    alt: 'Collection Look 3',
    label: 'LIFE STYLE',
  },
  {
    src: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop',
    alt: 'Collection Look 4',
    label: 'DELICATE',
  },
  {
    src: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800&auto=format&fit=crop',
    alt: 'Collection Look 5',
    label: 'DYNAMIC',
  },
  {
    src: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=800&auto=format&fit=crop',
    alt: 'Collection Look 6',
    label: 'SUMMER COLLECTION',
  },
  {
    src: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
    alt: 'Collection Look 7',
    label: 'LIFE STYLE',
  },
  {
    src: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop',
    alt: 'Collection Look 8',
    label: 'DELICATE',
  },
];

const VISIBLE_COUNT = 4;
const GAP_PX = 12;

export const EditorialSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(VISIBLE_COUNT);
  const [useTransition, setUseTransition] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const totalReal = SECTION_IMAGES.length;

  const slides = [
    ...SECTION_IMAGES.slice(-VISIBLE_COUNT),
    ...SECTION_IMAGES,
    ...SECTION_IMAGES.slice(0, VISIBLE_COUNT)
  ];

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
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
    if (isTransitioning) return;
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
      {/* Main layout: Text left + Carousel right */}
      <div className="flex flex-col lg:flex-row lg:items-center w-full min-h-[420px]">

        {/* Left Content Panel */}
        <div className="w-full lg:w-[28%] lg:flex-shrink-0 flex flex-col justify-center px-8 sm:px-12 lg:pl-16 lg:pr-10 py-8 lg:py-0">
          {/* Logo and Title (aligned horizontally) */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-10 h-10 flex items-center justify-center relative flex-shrink-0">
              <Image 
                src="/images/aristino-logo.svg" 
                alt="Aristino Logo Symbol" 
                width={36} 
                height={36}
                className="object-contain"
              />
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-brand-charcoal leading-tight">
              INHERIT THE LEGEND
            </h2>
          </div>

          {/* Description */}
          <p className="font-sans text-[12px] leading-relaxed text-brand-charcoal/70 mb-7">
            In the era of a rising Vietnam, every man defines his own path with the courage to move forward. Guided by this spirit, Aristino presents the story of &quot;Vietnamese character from unique courage&quot; – where inner strength is not defined by blending in, but by persistent personal identity. Each persona is a distinct thread, weaving a modern Vietnam: self-reliant, resilient, adaptive, and constantly striving to continue the legacy of &quot;Inheriting the Legend&quot;.
          </p>

          {/* CTA Button */}
          <div className="w-full">
            <Link
              href="/collections/editorial"
              className="block w-full text-center py-3 bg-brand-charcoal text-white font-sans text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-brand-navy transition-colors duration-300"
            >
              VIEW DETAILS
            </Link>
          </div>
        </div>

        {/* Right Carousel Panel */}
        <div className="w-full lg:w-[72%] min-w-0 relative select-none pr-6 sm:pr-10 lg:pr-16">
          <div className="relative overflow-hidden w-full">
            {/* Track */}
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
              {slides.map((img, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 relative group cursor-pointer flex flex-col"
                  style={{
                    width: `calc(100% / ${VISIBLE_COUNT} - ${GAP_PX * (VISIBLE_COUNT - 1) / VISIBLE_COUNT}px)`,
                  }}
                >
                  {/* Image Container with 3:4 aspect ratio */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 18vw"
                      className="object-cover object-top"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  
                  {/* Text underneath each slide image */}
                  <div className="text-center mt-3.5">
                    <span className="font-sans text-[11px] font-bold tracking-[0.18em] text-brand-charcoal uppercase group-hover:text-brand-gold transition-colors duration-300">
                      {img.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-2 top-[38%] -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-brand-charcoal/10 hover:bg-white hover:shadow-lg transition-all duration-200 text-brand-charcoal"
              aria-label="Previous Slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow */}
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
      </div>
    </section>
  );
};
