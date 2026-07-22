"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './CartContext';
import { Product } from '../types';

export interface ProductCardProps {
  product: Product;
}

const COLOR_PALETTES = ['#000000', '#1F2937', '#4B5563', '#9CA3AF', '#D1D5DB', '#E5E7EB'];

export const parseNumericPrice = (val: any): number => {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

export const formatCurrency = (val: any): string => {
  const num = parseNumericPrice(val);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    id,
    _id,
    title,
    price,
    originalPrice,
    discount,
    imageUrl,
    images,
    color,
    colors,
    slug,
    brand,
    tagLeft,
    tagRight,
  } = product;

  const { addToCart } = useCart();
  const productImages = images && images.length > 0 ? images : [imageUrl || '/images/shirt-white.png'];
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const displayImage = productImages[activeImgIndex] || productImages[0];
  const displayColors = colors && colors.length > 0 ? colors : (color ? [color] : []);

  const numericPrice = parseNumericPrice(price);
  const displayPriceText = formatCurrency(price);

  let numOrigPrice = originalPrice ? parseNumericPrice(originalPrice) : 0;
  if (numOrigPrice <= numericPrice && discount) {
    const discNum = parseFloat(String(discount).replace(/[^0-9.]/g, ''));
    if (!isNaN(discNum) && discNum > 0 && discNum < 100) {
      numOrigPrice = numericPrice / (1 - discNum / 100);
    } else {
      numOrigPrice = numericPrice * 1.25;
    }
  }
  const displayOriginalPriceText = (numOrigPrice > numericPrice) ? formatCurrency(numOrigPrice) : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: `${id || _id}-color-${activeImgIndex + 1}-m`,
      name: title,
      price: numericPrice,
      color: displayColors[activeImgIndex] || `Color ${activeImgIndex + 1}`,
      size: 'M',
      imageUrl: displayImage,
    });
  };

  const productLink = `/product/${slug || id || _id}`;

  return (
    <div className="group flex flex-col w-full bg-white relative hover:shadow-lg transition-all duration-300 border border-brand-charcoal/5">
      {/* Image Container with 3:4 aspect ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <Link href={productLink} className="relative block w-full h-full" draggable={false}>
          <Image
            src={displayImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-103"
            draggable={false}
          />
        </Link>

        {/* Tags overlay */}
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

        {/* Color / Image Swatches overlay bottom-left */}
        {productImages.length > 1 && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs py-1 px-1.5 border border-brand-charcoal/5 rounded z-10">
            {productImages.map((imgUrl, index) => {
              const swatchColor = displayColors[index] || COLOR_PALETTES[index % COLOR_PALETTES.length];
              const isActive = activeImgIndex === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImgIndex(index);
                  }}
                  onMouseEnter={() => setActiveImgIndex(index)}
                  className={`w-3.5 h-3.5 border transition-all duration-150 relative overflow-hidden flex items-center justify-center ${
                    isActive ? 'border-brand-gold ring-1 ring-brand-gold ring-offset-1 scale-110' : 'border-black/20 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: swatchColor.startsWith('#') ? swatchColor : '#808080' }}
                  title={`Color ${index + 1}`}
                >
                  <Image
                    src={imgUrl}
                    alt={`Color ${index + 1}`}
                    fill
                    sizes="14px"
                    className="object-cover opacity-90 hover:opacity-100"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Add to bag overlay bottom-right */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-2.5 right-2.5 w-6 h-6 bg-white border border-brand-charcoal/10 rounded flex items-center justify-center hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-colors duration-200 focus:outline-none z-10"
          aria-label="Quick add to cart"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      {/* Content info centered */}
      <div className="flex flex-col text-center px-2 pt-3 pb-4">
        {/* Brand */}
        <span className="font-serif text-[11px] font-bold tracking-widest text-brand-charcoal/60 uppercase truncate block">
          {brand || 'ARISTINO'}
        </span>

        {/* Title truncated to 2 lines max with '...' */}
        <div className="mt-1 h-10 flex items-center justify-center overflow-hidden w-full">
          <h3
            className="font-serif text-[13px] text-brand-charcoal font-medium leading-snug tracking-wide text-center line-clamp-2 overflow-hidden text-ellipsis max-h-10"
            title={title}
          >
            <Link
              href={productLink}
              className="hover:text-brand-gold transition-colors duration-200 block overflow-hidden text-ellipsis line-clamp-2"
            >
              {title}
            </Link>
          </h3>
        </div>

        {/* Price */}
        <div className="mt-1 font-sans text-xs font-semibold text-black flex items-center justify-center gap-1.5 flex-wrap">
          <span className="text-brand-navy font-bold">{displayPriceText}</span>
          {displayOriginalPriceText && (
            <span className="text-[11px] text-neutral-400 line-through font-normal">
              {displayOriginalPriceText}
            </span>
          )}
          {discount && (
            <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
              ({String(discount).startsWith('-') || String(discount).includes('%') ? discount : `-${discount}%`})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
