"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

const PLACEHOLDER_PRODUCTS: Product[] = [
  {
    id: 'flash-1',
    title: "Men's Slim Fit Tweed Blazer Jacket",
    brand: "Aristino",
    price: 98.00,
    originalPrice: 140.00,
    discount: "30% off",
    imageUrl: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=600&auto=format&fit=crop",
    colors: ['#8A9A86', '#4A5D4E'],
    slug: 'mens-slim-fit-tweed-blazer-jacket'
  },
  {
    id: 'flash-2',
    title: "Men's Premium Patterned Long Sleeve Shirt",
    brand: "Aristino",
    price: 25.00,
    originalPrice: 35.80,
    discount: "30% off",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop",
    colors: ['#FFFFFF', '#D1E8E2'],
    slug: 'mens-premium-patterned-long-sleeve-shirt'
  },
  {
    id: 'flash-3',
    title: "Men's Classic Textured Dress Shirt",
    brand: "Aristino",
    price: 26.60,
    originalPrice: 38.00,
    discount: "30% off",
    imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop",
    colors: ['#0A192F', '#A3B18A'],
    slug: 'mens-classic-textured-dress-shirt'
  },
  {
    id: 'flash-4',
    title: "Men's Premium Dotted Business Shirt",
    brand: "Aristino",
    price: 23.80,
    originalPrice: 34.00,
    discount: "30% off",
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop",
    colors: ['#E3E8F0', '#B9D5FD'],
    slug: 'mens-premium-dotted-business-shirt'
  }
];

export const FlashSale: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 1,
    minutes: 38,
    seconds: 1
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          return { days: 0, hours: 1, minutes: 38, seconds: 1 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted]);

  const padZero = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  if (!mounted) {
    return (
      <section className="w-full py-8 bg-brand-offwhite">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#8B0E0E] h-20 rounded-md animate-pulse flex items-center justify-center">
            <span className="text-white/60 font-serif tracking-widest text-sm">LOADING FLASH SALE...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-8 bg-brand-offwhite">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#8B0E0E] p-3.5 rounded-lg shadow-sm border border-[#7A0C0C]">
          
          {/* Header Bar */}
          <div className="text-white pb-3.5 px-1.5 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            
            {/* Timer + Title Left */}
            <div className="flex items-center space-x-4">
              
              {/* Countdown Numbers */}
              <div className="flex space-x-1.5 font-sans">
                <span className="w-7 h-6 bg-white text-black font-bold text-xs flex items-center justify-center rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.15)] border border-black/5">
                  {padZero(timeLeft.days)}
                </span>
                <span className="w-7 h-6 bg-white text-black font-bold text-xs flex items-center justify-center rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.15)] border border-black/5">
                  {padZero(timeLeft.hours)}
                </span>
                <span className="w-7 h-6 bg-white text-black font-bold text-xs flex items-center justify-center rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.15)] border border-black/5">
                  {padZero(timeLeft.minutes)}
                </span>
                <span className="w-7 h-6 bg-white text-black font-bold text-xs flex items-center justify-center rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.15)] border border-black/5">
                  {padZero(timeLeft.seconds)}
                </span>
              </div>

              {/* Lightning Bolt + Title */}
              <div className="flex items-center space-x-1 text-white font-bold tracking-wider italic text-sm md:text-base">
                <svg className="w-5 h-5 text-yellow-400 fill-current animate-pulse" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <span>FLASH SALE</span>
              </div>

            </div>

            {/* View Details Right */}
            <Link 
              href="/collections/flash-sale" 
              className="text-white hover:text-white/80 text-xs font-semibold tracking-wider flex items-center space-x-1.5 transition-colors duration-200"
            >
              <span>View Details</span>
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </Link>

          </div>

          {/* Product Grid - Renders unified ProductCard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#8B0E0E]">
            {PLACEHOLDER_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Slider Scroll Bar Progress Indicator (matching mockup) */}
          <div className="w-full bg-brand-charcoal/10 h-[3px] mt-3.5 rounded-full relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 bg-white w-[45%]" />
          </div>

        </div>
      </div>
    </section>
  );
};
