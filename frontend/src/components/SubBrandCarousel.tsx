"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SubBrand } from '../types';

const SUB_BRANDS: SubBrand[] = [
  {
    name: 'ANIMALS',
    sub: 'THEME',
    colorClass: 'text-brand-charcoal hover:text-brand-navy',
    subColorClass: 'text-brand-gold',
    href: '/collections/themes?cat=animals-pets'
  },
  {
    name: 'SPORTS',
    sub: 'THEME',
    colorClass: 'text-brand-charcoal hover:text-brand-navy',
    subColorClass: 'text-brand-gold',
    href: '/collections/themes?cat=sports'
  },
  {
    name: 'MUSIC',
    sub: 'THEME',
    colorClass: 'text-brand-charcoal hover:text-brand-navy',
    subColorClass: 'text-brand-gold',
    href: '/collections/themes?cat=music'
  },
  {
    name: 'HOLIDAYS',
    sub: 'THEME',
    colorClass: 'text-brand-charcoal hover:text-brand-navy',
    subColorClass: 'text-brand-gold',
    href: '/collections/themes?cat=holidays'
  },
  {
    name: 'OUTDOOR',
    sub: 'THEME',
    colorClass: 'text-brand-charcoal hover:text-brand-navy',
    subColorClass: 'text-brand-gold',
    href: '/collections/themes?cat=outdoor-rec'
  }
];

export interface SubBrandCarouselProps {
  items?: SubBrand[];
}

export const SubBrandCarousel: React.FC<SubBrandCarouselProps> = ({ items }) => {
  const [mounted, setMounted] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(5);
  const [currentIdx, setCurrentIdx] = useState(5);
  const [useTransition, setUseTransition] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const carouselItems = items || SUB_BRANDS;
  const totalReal = carouselItems.length;

  // Responsive items count per view
  useEffect(() => {
    if (!mounted) return;

    const handleResize = () => {
      let perView = 5; // Show all 5 items on desktop spanning the full width
      if (window.innerWidth < 480) {
        perView = 1;
      } else if (window.innerWidth < 768) {
        perView = 2;
      } else if (window.innerWidth < 1024) {
        perView = 3;
      }
      setItemsPerView(perView);
      setCurrentIdx(perView); // Reset currentIdx to start position of real items
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mounted, totalReal]);

  // Construct slides: only clone when we actually need to slide!
  const shouldSlide = itemsPerView < totalReal;
  const slides = shouldSlide
    ? [...carouselItems.slice(-itemsPerView), ...carouselItems, ...carouselItems.slice(0, itemsPerView)]
    : carouselItems;

  const currentTranslateIdx = shouldSlide ? currentIdx : 0;

  useEffect(() => {
    if (!mounted || !shouldSlide) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [mounted, currentIdx, isTransitioning, itemsPerView, shouldSlide, slides.length]);

  const handleNext = () => {
    if (isTransitioning || !shouldSlide) return;
    setIsTransitioning(true);
    setUseTransition(true);

    const nextIdx = currentIdx + 1;
    setCurrentIdx(nextIdx);

    if (nextIdx === slides.length - itemsPerView) {
      setTimeout(() => {
        setUseTransition(false);
        setCurrentIdx(itemsPerView);
        setIsTransitioning(false);
      }, 700); // 700ms matches transition-transform duration
    } else {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
    }
  };

  if (!mounted) {
    return (
      <div className="w-full bg-white border-y border-brand-charcoal/10 h-20 flex items-center justify-center">
        <span className="text-brand-charcoal/40 font-serif tracking-widest text-xs">ARISTINO COLLECTIONS</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border-y border-brand-charcoal/10 h-20 flex items-center overflow-hidden relative">
      <div
        className={`flex h-full ${useTransition && shouldSlide ? 'transition-transform duration-700 ease-in-out' : 'transition-none'}`}
        style={{
          transform: `translateX(-${currentTranslateIdx * (100 / slides.length)}%)`,
          width: `${(slides.length / itemsPerView) * 100}%`
        }}
      >
        {slides.map((brand, idx) => {
          const content = (
            <div className="flex flex-col justify-center items-center text-center px-4">
              <span className={`font-serif text-sm font-bold tracking-[0.18em] ${brand.colorClass || 'text-brand-charcoal'}`}>
                {brand.name}
              </span>
              {brand.sub && (
                <span className={`font-sans text-[8px] font-bold tracking-[0.3em] mt-1 -mr-[0.3em] ${brand.subColorClass || 'text-brand-gold'}`}>
                  {brand.sub}
                </span>
              )}
            </div>
          );

          return (
            <div
              key={`${brand.sub || brand.name}-${idx}`}
              className="h-20 flex flex-col justify-center items-center flex-shrink-0 border-r border-brand-charcoal/5 last:border-r-0"
              style={{ width: `${100 / slides.length}%` }}
            >
              {brand.href ? (
                <Link
                  href={brand.href}
                  className="flex flex-col justify-center items-center w-full h-full hover:opacity-80 transition-opacity"
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
