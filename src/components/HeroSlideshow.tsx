"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const IMAGES = [
  '/images/hero-man.png',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1600&auto=format&fit=crop'
];

// Cloned slides: [C, A, B, C, A]
const SLIDES = [IMAGES[IMAGES.length - 1], ...IMAGES, IMAGES[0]];

export const HeroSlideshow: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(1);
  const [useTransition, setUseTransition] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const startAutoplay = () => {
    stopAutoplay();
    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);
  };

  const stopAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    startAutoplay();
    return () => stopAutoplay();
  }, [mounted, currentIdx, isTransitioning]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setUseTransition(true);
    
    const nextIdx = currentIdx + 1;
    setCurrentIdx(nextIdx);

    if (nextIdx === SLIDES.length - 1) {
      setTimeout(() => {
        setUseTransition(false);
        setCurrentIdx(1);
        setIsTransitioning(false);
      }, 700); // 700ms matches transition duration
    } else {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
    }
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setUseTransition(true);

    const prevIdx = currentIdx - 1;
    setCurrentIdx(prevIdx);

    if (prevIdx === 0) {
      setTimeout(() => {
        setUseTransition(false);
        setCurrentIdx(SLIDES.length - 2);
        setIsTransitioning(false);
      }, 700);
    } else {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
    }
  };

  if (!mounted) {
    return (
      <section 
        style={{ height: '570.375px' }}
        className="w-full bg-gray-100 border-b border-brand-charcoal/10 flex items-center justify-center"
      >
        <div className="relative w-full h-full">
          <Image
            src={IMAGES[0]}
            alt="Aristino Editorial Slide 1"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
      </section>
    );
  }

  return (
    <section 
      style={{ height: '570.375px' }}
      className="relative w-full overflow-hidden bg-gray-100 border-b border-brand-charcoal/10"
    >
      {/* Slides Container */}
      <div 
        className={`flex w-full h-full ${useTransition ? 'transition-transform duration-700 ease-in-out' : 'transition-none'}`}
        style={{ transform: `translateX(-${currentIdx * 100}%)` }}
      >
        {SLIDES.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className="relative w-full h-full flex-shrink-0"
          >
            <Image
              src={url}
              alt={`Aristino Editorial Slide ${idx}`}
              fill
              priority={idx === 1}
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>
        ))}
      </div>

      {/* Slide Navigation Buttons (mockup layout style) */}
      <div className="absolute bottom-12 right-12 z-20 flex border border-white/30 bg-black/10 backdrop-blur-xs">
        <button 
          onClick={handlePrev}
          className="p-3 text-white hover:bg-white/15 active:bg-white/25 transition-colors duration-200 focus:outline-none"
          aria-label="Previous Slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="w-[1px] bg-white/30" />
        <button 
          onClick={handleNext}
          className="p-3 text-white hover:bg-white/15 active:bg-white/25 transition-colors duration-200 focus:outline-none"
          aria-label="Next Slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </section>
  );
};
