"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const FlashSale: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [endTime, setEndTime] = useState<Date | null>(null);

  // Fetch flash sale end time from settings
  useEffect(() => {
    const fetchEndTime = async () => {
      try {
        const res = await fetch(`${API_URL}/settings/flash_sale_end_time`);
        const data = await res.json();
        if (data.success && data.data?.endTime) {
          setEndTime(new Date(data.data.endTime));
        }
      } catch {
        // Use default 24h from now on error
        setEndTime(new Date(Date.now() + 24 * 60 * 60 * 1000));
      }
    };
    fetchEndTime();
  }, []);

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        let res = await fetch(`${API_URL}/products?isFlashSale=true&limit=4`);
        let data = await res.json();

        if (!data.success || !data.data || data.data.length === 0) {
          res = await fetch(`${API_URL}/products?limit=4`);
          data = await res.json();
        }

        if (data.success && data.data && data.data.length > 0) {
          const mapped = data.data.map((p: any) => {
            const rawPrice = p.price;
            const rawOrig = p.originalPrice;
            const discountVal = p.discount || '-25%';
            const priceNum = parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) || 0;
            const origPriceVal = rawOrig ? rawOrig : (priceNum > 0 ? (priceNum * 1.3).toFixed(2) : undefined);

            return {
              _id: p._id,
              id: p.id || p._id,
              title: p.title,
              brand: p.brand,
              price: p.price,
              originalPrice: origPriceVal,
              discount: discountVal,
              imageUrl: p.imageUrl || (p.images && p.images[0]) || '',
              images: p.images || [],
              color: p.color || '',
              colors: p.colors || (p.color ? [p.color] : []),
              slug: p.slug || p.id || p._id
            };
          });
          setProducts(mapped);
        }
      } catch {
        // Keep empty on error
      }
    };

    fetchFlashSale();
  }, []);

  // Countdown timer logic — counts down to the real endTime
  useEffect(() => {
    if (!endTime) return;

    const computeTimeLeft = () => {
      const now = new Date().getTime();
      const diff = endTime.getTime() - now;

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(computeTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(computeTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const padZero = (num: number) => {
    return num.toString().padStart(2, '0');
  };



  if (products.length === 0) {
    return (
      <section className="w-full py-8 bg-brand-offwhite">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-red-800/20 bg-[#8B0E0E] text-white p-6 rounded-lg text-center flex flex-col items-center justify-center font-serif">
            <svg className="w-10 h-10 text-yellow-400 fill-current mb-3 opacity-60 animate-pulse" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-1">Flash Sale</h3>
            <p className="text-xs text-white/60 font-sans">No content available</p>
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
            {products.map((product) => (
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
