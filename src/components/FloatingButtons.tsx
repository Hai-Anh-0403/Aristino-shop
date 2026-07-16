"use client";

import React, { useState, useEffect } from 'react';

export const FloatingButtons: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed right-5 bottom-8 z-50 flex flex-col items-center gap-3">
      {/* Contact – always visible */}
      <a
        href="tel:18006226"
        className="group flex flex-col items-center"
        aria-label="Contact"
      >
        <div className="w-12 h-12 rounded-full bg-brand-charcoal text-white flex items-center justify-center shadow-lg group-hover:bg-brand-navy group-hover:scale-110 transition-all duration-300">
          {/* Chat/contact icon */}
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
            <path d="M12 10c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm-4 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm8 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z" />
          </svg>
        </div>
        <span className="text-[10px] font-bold text-brand-charcoal mt-1 tracking-wide">Contact</span>
      </a>

      {/* BACK TO TOP – slides in from right when scrolled */}
      <div
        className={`flex flex-col items-center transition-all duration-500 ease-out ${
          showBackToTop
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-16 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToTop}
          className="group flex flex-col items-center"
          aria-label="Back to top"
        >
          <div className="w-12 h-12 rounded-full border-2 border-brand-charcoal/30 bg-white text-brand-charcoal flex items-center justify-center shadow-md group-hover:border-brand-charcoal group-hover:scale-110 transition-all duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V5m0 0l-5 5m5-5l5 5" />
            </svg>
          </div>
          <span className="text-[9px] font-bold text-brand-charcoal mt-1 tracking-wider uppercase">Back to top</span>
        </button>
      </div>
    </div>
  );
};
