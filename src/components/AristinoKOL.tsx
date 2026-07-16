"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

const KOL_IMAGES_1 = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop',
];

const KOL_IMAGES_2 = [
  'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=600&auto=format&fit=crop',
];

const VISIBLE_DESKTOP = 5;
const VISIBLE_TABLET = 3;
const VISIBLE_MOBILE = 2;
const GAP_PX = 12;

export const AristinoKOL: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(VISIBLE_DESKTOP);
  
  // States for Row 1
  const [currentIndex1, setCurrentIndex1] = useState(VISIBLE_DESKTOP);
  const [useTransition1, setUseTransition1] = useState(true);
  const [isTransitioning1, setIsTransitioning1] = useState(false);

  // States for Row 2
  const [currentIndex2, setCurrentIndex2] = useState(VISIBLE_DESKTOP);
  const [useTransition2, setUseTransition2] = useState(true);
  const [isTransitioning2, setIsTransitioning2] = useState(false);

  // Responsive items count
  useEffect(() => {
    const updateVisibleCount = () => {
      const w = window.innerWidth;
      let count = VISIBLE_DESKTOP;
      if (w < 640) count = VISIBLE_MOBILE;
      else if (w < 1024) count = VISIBLE_TABLET;

      setVisibleCount(count);
      setCurrentIndex1(count);
      setCurrentIndex2(count);
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const totalReal = KOL_IMAGES_1.length;

  const slides1 = [
    ...KOL_IMAGES_1.slice(-visibleCount),
    ...KOL_IMAGES_1,
    ...KOL_IMAGES_1.slice(0, visibleCount)
  ];

  const slides2 = [
    ...KOL_IMAGES_2.slice(-visibleCount),
    ...KOL_IMAGES_2,
    ...KOL_IMAGES_2.slice(0, visibleCount)
  ];

  // Slides Row 1 Left (index increases)
  const slideRow1Next = useCallback(() => {
    if (isTransitioning1) return;
    setIsTransitioning1(true);
    setUseTransition1(true);

    const nextIdx = currentIndex1 + 1;
    setCurrentIndex1(nextIdx);

    if (nextIdx === visibleCount + totalReal) {
      setTimeout(() => {
        setUseTransition1(false);
        setCurrentIndex1(visibleCount);
        setIsTransitioning1(false);
      }, 500);
    } else {
      setTimeout(() => {
        setIsTransitioning1(false);
      }, 500);
    }
  }, [currentIndex1, visibleCount, totalReal, isTransitioning1]);

  // Slides Row 2 Right (index decreases)
  const slideRow2Prev = useCallback(() => {
    if (isTransitioning2) return;
    setIsTransitioning2(true);
    setUseTransition2(true);

    const prevIdx = currentIndex2 - 1;
    setCurrentIndex2(prevIdx);

    if (prevIdx === visibleCount - 1) {
      setTimeout(() => {
        setUseTransition2(false);
        setCurrentIndex2(visibleCount + totalReal - 1);
        setIsTransitioning2(false);
      }, 500);
    } else {
      setTimeout(() => {
        setIsTransitioning2(false);
      }, 500);
    }
  }, [currentIndex2, visibleCount, totalReal, isTransitioning2]);

  // Autoplay intervals in opposite directions
  useEffect(() => {
    const timer = setInterval(() => {
      slideRow1Next();
      slideRow2Prev();
    }, 4000);
    return () => clearInterval(timer);
  }, [slideRow1Next, slideRow2Prev]);

  return (
    <section className="w-full bg-brand-offwhite py-12 select-none overflow-hidden">
      
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
          ARISTINO x KOL
        </h2>
      </div>

      {/* Two Rows Container */}
      <div className="flex flex-col gap-3">
        
        {/* Row 1 - Slides Left (Normal auto-scroll direction) */}
        <div className="relative w-full overflow-hidden">
          <div
            className={`flex ${useTransition1 ? 'transition-transform duration-500 ease-out' : 'transition-none'}`}
            style={{
              gap: `${GAP_PX}px`,
              transform: `translateX(calc(-${currentIndex1} * (calc(100% / ${visibleCount}) - ${GAP_PX * (visibleCount - 1) / visibleCount}px + ${GAP_PX}px)))`,
            }}
          >
            {slides1.map((url, idx) => (
              <div
                key={`row1-${idx}`}
                className="flex-shrink-0 relative aspect-square overflow-hidden bg-gray-100"
                style={{
                  width: `calc(100% / ${visibleCount} - ${GAP_PX * (visibleCount - 1) / visibleCount}px)`,
                }}
              >
                <Image
                  src={url}
                  alt={`KOL Style ${idx}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover object-top hover:scale-102 transition-transform duration-500"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Slides Right (Opposite auto-scroll direction) */}
        <div className="relative w-full overflow-hidden">
          <div
            className={`flex ${useTransition2 ? 'transition-transform duration-500 ease-out' : 'transition-none'}`}
            style={{
              gap: `${GAP_PX}px`,
              transform: `translateX(calc(-${currentIndex2} * (calc(100% / ${visibleCount}) - ${GAP_PX * (visibleCount - 1) / visibleCount}px + ${GAP_PX}px)))`,
            }}
          >
            {slides2.map((url, idx) => (
              <div
                key={`row2-${idx}`}
                className="flex-shrink-0 relative aspect-square overflow-hidden bg-gray-100"
                style={{
                  width: `calc(100% / ${visibleCount} - ${GAP_PX * (visibleCount - 1) / visibleCount}px)`,
                }}
              >
                <Image
                  src={url}
                  alt={`KOL Style Shifted ${idx}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover object-top hover:scale-102 transition-transform duration-500"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
