"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const DEFAULT_IMAGES = [
  '/images/hero-man.png',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1600&auto=format&fit=crop'
];

export const HeroSlideshow: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(1);
  const [useTransition, setUseTransition] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch(`${API_URL}/sliders`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const urls = data.data.map((s: { imageUrl: string }) => `http://localhost:8000${s.imageUrl}`);
          setImages(urls);
        } else {
          setImages(DEFAULT_IMAGES);
        }
      } catch {
        setImages(DEFAULT_IMAGES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliders();
  }, []);

  // Cloned slides for infinite loop: [Last, ...All, First]
  const slides = images.length > 0 ? [images[images.length - 1], ...images, images[0]] : [];

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
    startAutoplay();
    return () => stopAutoplay();
  }, [currentIdx, isTransitioning, images]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setUseTransition(true);

    const nextIdx = currentIdx + 1;
    setCurrentIdx(nextIdx);

    if (nextIdx === slides.length - 1) {
      setTimeout(() => {
        setUseTransition(false);
        setCurrentIdx(1);
        setIsTransitioning(false);
      }, 700);
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
        setCurrentIdx(slides.length - 2);
        setIsTransitioning(false);
      }, 700);
    } else {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
    }
  };

  if (isLoading) {
    return (
      <section
        style={{ height: '570.375px' }}
        className="w-full bg-[#FAF9F6] animate-pulse flex items-center justify-center border-b border-brand-charcoal/10"
      >
        <svg className="animate-spin h-8 w-8 text-brand-navy" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section
        style={{ height: '300px' }}
        className="w-full bg-brand-navy-light text-brand-offwhite flex flex-col items-center justify-center border-b border-brand-charcoal/10 text-center font-serif px-6"
      >
        <svg className="w-10 h-10 text-brand-gold mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-sm font-semibold tracking-wider uppercase mb-1">Hero Slideshow</h3>
        <p className="text-xs text-brand-offwhite/60 font-sans">No content available</p>
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
        {slides.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className="relative w-full h-full flex-shrink-0"
          >
            <Link href="/collections/new-arrivals" className="block relative w-full h-full cursor-pointer">
              <Image
                src={url}
                alt={`Aristino Editorial Slide ${idx}`}
                fill
                priority={idx === currentIdx}
                loading={idx === currentIdx ? 'eager' : 'lazy'}
                quality={75}
                unoptimized={url.includes('localhost') || url.includes('127.0.0.1')}
                sizes="100vw"
                className="object-cover object-top"
              />
            </Link>
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

