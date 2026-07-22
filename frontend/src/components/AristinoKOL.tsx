"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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

interface KOLItem {
  isMock: boolean;
  imageUrl: string;
  slug?: string;
  title?: string;
}

const DEFAULT_KOL_ITEMS_1: KOLItem[] = KOL_IMAGES_1.map((url, i) => ({ isMock: false, imageUrl: url, slug: `178450957237${i}` }));
const DEFAULT_KOL_ITEMS_2: KOLItem[] = KOL_IMAGES_2.map((url, i) => ({ isMock: false, imageUrl: url, slug: `178450957237${i}` }));

export const AristinoKOL: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(VISIBLE_DESKTOP);
  const [items1, setItems1] = useState<KOLItem[]>([]);
  const [items2, setItems2] = useState<KOLItem[]>([]);
  
  // States for Row 1
  const [currentIndex1, setCurrentIndex1] = useState(VISIBLE_DESKTOP);
  const [useTransition1, setUseTransition1] = useState(true);
  const [isTransitioning1, setIsTransitioning1] = useState(false);

  // States for Row 2
  const [currentIndex2, setCurrentIndex2] = useState(VISIBLE_DESKTOP);
  const [useTransition2, setUseTransition2] = useState(true);
  const [isTransitioning2, setIsTransitioning2] = useState(false);

  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        let res = await fetch(`${API_URL}/settings/kol_slider_products`);
        let data = await res.json();

        let loadedProducts: KOLItem[] = [];

        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          loadedProducts = data.data.map((p: any) => ({
            isMock: false,
            imageUrl: p.imageUrl || (p.images && p.images[0]) || '',
            slug: p.slug || p.id || p._id,
            title: p.title
          }));
        }

        if (loadedProducts.length === 0) {
          res = await fetch(`${API_URL}/products?limit=10`);
          data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            loadedProducts = data.data.map((p: any) => ({
              isMock: false,
              imageUrl: p.imageUrl || (p.images && p.images[0]) || '',
              slug: p.slug || p.id || p._id,
              title: p.title
            }));
          }
        }

        if (loadedProducts.length > 0) {
          setItems1(loadedProducts);
          setItems2([...loadedProducts].reverse());
        } else {
          setItems1([]);
          setItems2([]);
        }
      } catch (err) {
        console.error('Failed to fetch suggested KOL products:', err);
        setItems1([]);
        setItems2([]);
      }
    };
    fetchSuggested();
  }, []);

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

  const totalReal1 = items1.length || 1;
  const totalReal2 = items2.length || 1;

  const slides1 = items1.length > 0 ? [
    ...items1.slice(-visibleCount),
    ...items1,
    ...items1.slice(0, visibleCount)
  ] : [];

  const slides2 = items2.length > 0 ? [
    ...items2.slice(-visibleCount),
    ...items2,
    ...items2.slice(0, visibleCount)
  ] : [];

  // Slides Row 1 Left (index increases)
  const slideRow1Next = useCallback(() => {
    if (isTransitioning1) return;
    setIsTransitioning1(true);
    setUseTransition1(true);

    const nextIdx = currentIndex1 + 1;
    setCurrentIndex1(nextIdx);

    if (nextIdx === visibleCount + totalReal1) {
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
  }, [currentIndex1, visibleCount, totalReal1, isTransitioning1]);

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
        setCurrentIndex2(visibleCount + totalReal2 - 1);
        setIsTransitioning2(false);
      }, 500);
    } else {
      setTimeout(() => {
        setIsTransitioning2(false);
      }, 500);
    }
  }, [currentIndex2, visibleCount, totalReal2, isTransitioning2]);

  // Autoplay intervals in opposite directions
  useEffect(() => {
    if (slides1.length === 0 || slides2.length === 0) return;
    const timer = setInterval(() => {
      slideRow1Next();
      slideRow2Prev();
    }, 4000);
    return () => clearInterval(timer);
  }, [slideRow1Next, slideRow2Prev, slides1.length, slides2.length]);

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
          Things You Might Like
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
            {slides1.map((item, idx) => {
              const content = (
                <Image
                  src={item.imageUrl}
                  alt={item.title || `KOL Style ${idx}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  draggable={false}
                />
              );

              return (
                <div
                  key={`row1-${idx}`}
                  className="flex-shrink-0 relative aspect-square overflow-hidden bg-gray-100 group"
                  style={{
                    width: `calc(100% / ${visibleCount} - ${GAP_PX * (visibleCount - 1) / visibleCount}px)`,
                  }}
                >
                  <Link href={`/product/${encodeURIComponent(item.slug || '1784509572378')}`} className="block w-full h-full relative cursor-pointer">
                    {content}
                  </Link>
                </div>
              );
            })}
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
            {slides2.map((item, idx) => {
              const content = (
                <Image
                  src={item.imageUrl}
                  alt={item.title || `KOL Style Shifted ${idx}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  draggable={false}
                />
              );

              return (
                <div
                  key={`row2-${idx}`}
                  className="flex-shrink-0 relative aspect-square overflow-hidden bg-gray-100 group"
                  style={{
                    width: `calc(100% / ${visibleCount} - ${GAP_PX * (visibleCount - 1) / visibleCount}px)`,
                  }}
                >
                  <Link href={`/product/${encodeURIComponent(item.slug || '1784509572378')}`} className="block w-full h-full relative cursor-pointer">
                    {content}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
 
      </div>
    </section>
  );
};
