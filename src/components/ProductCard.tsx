"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './CartContext';
import { Product } from '../types';

export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, title, price, originalPrice, discount, imageUrl, colors, slug, brand, tagLeft, tagRight } = product;
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: `${id}-${colors[0]?.replace('#', '').toLowerCase() || 'default'}-m`,
      name: title,
      price: price,
      color: colors[0] || 'Default',
      size: 'M',
    });
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="group flex flex-col w-full bg-white relative hover:shadow-lg transition-all duration-300 border border-brand-charcoal/5">
      {/* Image Container with 3:4 aspect ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <Link href={`/product/${slug}`} className="relative block w-full h-full" draggable={false}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-103"
            draggable={false}
          />
        </Link>

        {/* Tags overlay - matches screenshot */}
        {tagLeft && (
          <span className="absolute top-2.5 left-2.5 bg-black text-white text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase rounded-none select-none">
            {tagLeft}
          </span>
        )}

        {tagRight && (
          <span className="absolute top-2.5 right-2.5 bg-black text-brand-gold text-[8px] font-bold px-2 py-0.5 tracking-widest uppercase rounded-none select-none">
            {tagRight}
          </span>
        )}

        {/* Color Swatch overlay bottom-left - matches screenshot */}
        {colors && colors.length > 0 && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs py-1 px-1.5 border border-brand-charcoal/5">
            {colors.slice(0, 2).map((hex, index) => (
              <span 
                key={index} 
                style={{ backgroundColor: hex }} 
                className="w-3 h-3 border border-black/10 block cursor-pointer"
                title={hex}
              />
            ))}
            {colors.length > 2 && (
              <span className="text-[10px] font-black text-brand-charcoal/60 leading-none select-none">+</span>
            )}
          </div>
        )}

        {/* Add to bag overlay bottom-right - matches screenshot [+] button */}
        <button 
          onClick={handleQuickAdd}
          className="absolute bottom-2.5 right-2.5 w-6 h-6 bg-white border border-brand-charcoal/10 rounded flex items-center justify-center hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-colors duration-200 focus:outline-none"
          aria-label="Quick add to cart"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      {/* Content info centered - matches screenshot */}
      <div className="flex flex-col text-center px-2 pt-3 pb-4">
        {/* Brand */}
        <span className="font-serif text-[11px] font-bold tracking-widest text-brand-charcoal/60 uppercase">
          {brand || 'ARISTINO'}
        </span>

        {/* Title */}
        <h3 className="font-serif text-[13px] text-brand-charcoal font-medium leading-relaxed tracking-wide line-clamp-2 mt-1 h-10 flex items-center justify-center">
          <Link href={`/product/${slug}`} className="hover:text-brand-gold transition-colors duration-200">
            {title}
          </Link>
        </h3>

        {/* Price */}
        <div className="mt-1 font-sans text-xs font-semibold text-black flex items-center justify-center gap-2">
          <span>{formatPrice(price)}</span>
          {originalPrice && (
            <span className="text-[10px] text-neutral-400 line-through font-normal">
              {formatPrice(originalPrice)}
            </span>
          )}
          {discount && (
            <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
              ({discount})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
