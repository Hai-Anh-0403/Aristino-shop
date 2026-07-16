"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from './CartContext';

interface ProductDetailProps {
  product: {
    id: string;
    title: string;
    price: number;
    description: string;
    imageUrl: string;
    colors: { name: string; hex: string }[];
    sizes: string[];
    details: string[];
  };
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Default');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');

  const handleAddToBag = () => {
    addToCart({
      id: `${product.id}-${selectedColor.toLowerCase()}-${selectedSize.toLowerCase()}`,
      name: product.title,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        
        {/* Product Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 border border-brand-charcoal/5 shadow-md">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="mt-10 lg:mt-0 flex flex-col justify-between">
          <div>
            <span className="font-sans text-xs font-bold tracking-widest text-brand-gold uppercase mb-2 block">
              ARISTINO COLLECTION
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight mb-4">
              {product.title}
            </h1>
            <p className="font-sans text-xl font-semibold text-brand-navy mb-8">
              ${product.price.toFixed(2)} <span className="text-xs font-normal text-brand-charcoal/50">USD</span>
            </p>

            <div className="border-t border-brand-charcoal/10 pt-8 space-y-6">
              <p className="font-sans text-sm text-brand-charcoal/80 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selector */}
              <div>
                <h3 className="font-sans text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-3">
                  Color: <span className="font-normal text-brand-charcoal/60">{selectedColor}</span>
                </h3>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-6 h-6 rounded-full border transition-all duration-200 focus:outline-none ${
                        selectedColor === color.name 
                          ? 'border-brand-gold ring-1 ring-brand-gold ring-offset-2' 
                          : 'border-brand-charcoal/20 hover:border-brand-gold'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={`Select color ${color.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <h3 className="font-sans text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-3">
                  Size: <span className="font-normal text-brand-charcoal/60">{selectedSize}</span>
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
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

            {/* Premium Details List */}
            <div className="space-y-3 pt-6">
              <h4 className="font-sans text-xs font-bold text-brand-charcoal uppercase tracking-widest">PRODUCT DETAILS</h4>
              <ul className="list-disc pl-5 font-sans text-xs text-brand-charcoal/70 space-y-1.5">
                {product.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
