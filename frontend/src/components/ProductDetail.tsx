"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from './CartContext';

interface ProductDetailProps {
  product: {
    id: string;
    title: string;
    price: number | string;
    originalPrice?: number | string;
    discount?: string;
    description: string;
    imageUrl: string;
    images?: string[];
    colors: { name: string; hex: string }[];
    sizes: string[];
    details: string[];
    brand?: string;
    isFlashSale?: boolean;
  };
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { addToCart } = useCart();
  const allImages = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const [selectedImage, setSelectedImage] = useState(allImages[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Default');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');

  const parseNumericPrice = (val: any): number => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const formatCurrency = (val: any): string => {
    const num = parseNumericPrice(val);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const numericPrice = parseNumericPrice(product.price);
  const displayPriceText = formatCurrency(product.price);

  let numOrigPrice = product.originalPrice ? parseNumericPrice(product.originalPrice) : 0;
  if (numOrigPrice <= numericPrice && product.discount) {
    const discNum = parseFloat(String(product.discount).replace(/[^0-9.]/g, ''));
    if (!isNaN(discNum) && discNum > 0 && discNum < 100) {
      numOrigPrice = numericPrice / (1 - discNum / 100);
    } else {
      numOrigPrice = numericPrice * 1.25;
    }
  } else if (numOrigPrice <= numericPrice && product.isFlashSale) {
    numOrigPrice = numericPrice * 1.30;
  }

  const displayOriginalPriceText = (numOrigPrice > numericPrice) ? formatCurrency(numOrigPrice) : null;
  const discountLabel = product.discount || (displayOriginalPriceText ? '-25%' : null);

  const handleAddToBag = () => {
    addToCart({
      id: `${product.id}-${selectedColor.toLowerCase()}-${selectedSize.toLowerCase()}`,
      name: product.title,
      price: numericPrice,
      color: selectedColor,
      size: selectedSize,
      imageUrl: selectedImage,
    });
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
          
          {/* Main Image Gallery */}
          <div className="flex flex-col">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 border border-brand-charcoal/10 rounded-lg">
              <Image
                src={selectedImage}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 lg:mt-0 flex flex-col justify-between">
            <div>
              <span className="font-sans text-xs font-bold tracking-widest text-brand-gold uppercase mb-2 block">
                {product.brand || 'ARISTINO COLLECTION'}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight mb-4">
                {product.title}
              </h1>

              {/* Price section with line-through original price & discount tag */}
              <div className="flex items-baseline gap-3 mb-8 flex-wrap">
                <span className="font-sans text-2xl font-bold text-brand-navy">
                  {displayPriceText}
                </span>
                {displayOriginalPriceText && (
                  <span className="font-sans text-base text-neutral-400 line-through font-normal">
                    {displayOriginalPriceText}
                  </span>
                )}
                {discountLabel && (
                  <span className="font-sans text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {String(discountLabel).startsWith('-') || String(discountLabel).includes('%') ? discountLabel : `-${discountLabel}%`}
                  </span>
                )}
              </div>

              <div className="border-t border-brand-charcoal/10 pt-8 space-y-6">
                <p className="font-sans text-sm text-brand-charcoal/80 leading-relaxed">
                  {product.description}
                </p>

                {/* PRODUCT DETAILS List (Moved above Color & Size selectors) */}
                <div className="space-y-3 py-4 border-y border-brand-charcoal/10 my-4">
                  <h4 className="font-sans text-xs font-bold text-brand-charcoal uppercase tracking-widest">PRODUCT DETAILS</h4>
                  <ul className="list-disc pl-5 font-sans text-xs text-brand-charcoal/70 space-y-1.5">
                    {(product.details || []).map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>

                {/* Color Selector (Image Swatches representing product colors) */}
                {allImages && allImages.length > 0 && (
                  <div>
                    <h3 className="font-sans text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-3">
                      Color
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {(allImages || []).map((img, idx) => {
                        const colorName = product.colors && product.colors[idx]?.name
                          ? product.colors[idx].name
                          : `Color ${idx + 1}`;
                        const isSelected = selectedImage === img;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedImage(img);
                              setSelectedColor(colorName);
                            }}
                            onMouseEnter={() => {
                              setSelectedImage(img);
                              setSelectedColor(colorName);
                            }}
                            className={`relative w-14 h-18 border transition-all duration-200 overflow-hidden group/swatch ${
                              isSelected ? 'border-brand-gold ring-1 ring-brand-gold scale-105' : 'border-brand-charcoal/20 opacity-70 hover:opacity-100'
                            }`}
                            title={colorName}
                          >
                            <Image
                              src={img}
                              alt={colorName}
                              fill
                              sizes="56px"
                              className="object-cover object-top"
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-brand-navy/80 text-[9px] text-white py-0.5 text-center font-sans tracking-tight truncate px-0.5">
                              {colorName}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                <div>
                  <h3 className="font-sans text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-3">
                    Size: <span className="font-normal text-brand-charcoal/60">{selectedSize}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {(product.sizes || []).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border font-sans text-xs font-medium transition-all duration-200 focus:outline-none ${
                          selectedSize === size 
                            ? 'bg-brand-navy border-brand-navy text-brand-offwhite' 
                            : 'border-brand-charcoal/20 text-brand-charcoal hover:border-brand-navy'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-brand-charcoal/10 space-y-6">
              <button
                onClick={handleAddToBag}
                className="w-full py-4 bg-brand-navy text-brand-offwhite hover:bg-brand-gold hover:text-brand-navy font-sans text-xs font-bold tracking-widest transition-all duration-300 shadow-md"
              >
                ADD TO BAG
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
