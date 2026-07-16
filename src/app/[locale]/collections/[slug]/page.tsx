"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProductCard } from '../../../../components/ProductCard';
import { getProductsByCollection } from '../../../../services/productService';

const getCategoryName = (slug: string): string => {
  const mapping: Record<string, string> = {
    'suits-blazers': 'Suits & Blazers',
    'suits-blazer': 'Suits & Blazer',
    'apparel': 'Apparel',
    'accessories': 'Accessories',
    'leather-goods': 'Leather Goods',
    'activewear': 'Activewear',
    'online-exclusives': 'Online Exclusives',
    'collections': 'Collections',
    'new-arrivals': 'New Arrivals',
    'tops': 'Tops',
    'bottoms': 'Bottoms',
    'underwear-loungewear': 'Underwear & Loungewear'
  };
  return mapping[slug.toLowerCase()] || slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ');
};

const getCategoryBanner = (slug: string): string => {
  const mapping: Record<string, string> = {
    'suits-blazers': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600&auto=format&fit=crop',
    'apparel': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    'accessories': 'https://images.unsplash.com/photo-1627124118123-e4d31169ddc7?q=80&w=1600&auto=format&fit=crop',
    'leather-goods': 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1600&auto=format&fit=crop',
    'activewear': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop',
    'online-exclusives': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
    'collections': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    'new-arrivals': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    'tops': 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1600&auto=format&fit=crop',
    'bottoms': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1600&auto=format&fit=crop',
    'underwear-loungewear': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop'
  };
  return mapping[slug.toLowerCase()] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop';
};

const COLOR_OPTIONS = [
  { name: 'white', hex: '#FFFFFF', border: true },
  { name: 'green', hex: '#1E5631' },
  { name: 'red', hex: '#D32F2F' },
  { name: 'brown', hex: '#5C4033' },
  { name: 'lightgreen', hex: '#C2E1C2' },
  { name: 'cream', hex: '#FFFDD0', border: true },
  { name: 'gray', hex: '#808080' },
  { name: 'darkgray', hex: '#404040' },
  { name: 'black', hex: '#000000' }
];

export default function CollectionPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'suits-blazers';
  const categoryName = getCategoryName(slug);
  const bannerImage = getCategoryBanner(slug);

  const [products, setProducts] = useState(() => getProductsByCollection(slug));
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('default');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Expanded filters states
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    colors: true,
    products: true,
    sizes: true,
    fits: true
  });

  // Filter selection states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedFits, setSelectedFits] = useState<string[]>([]);

  // Reload products if slug changes
  useEffect(() => {
    setProducts(getProductsByCollection(slug));
    setCurrentPage(1);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedProductTypes([]);
    setSelectedSizes([]);
    setSelectedFits([]);
  }, [slug]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCheckboxChange = (
    value: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (state.includes(value)) {
      setState(state.filter(v => v !== value));
    } else {
      setState([...state, value]);
    }
    setCurrentPage(1);
  };

  const handleColorClick = (hex: string) => {
    if (selectedColors.includes(hex)) {
      setSelectedColors(selectedColors.filter(c => c !== hex));
    } else {
      setSelectedColors([...selectedColors, hex]);
    }
    setCurrentPage(1);
  };

  // Filter and sort items
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    if (selectedColors.length > 0) {
      result = result.filter(p => p.colors.some(c => selectedColors.includes(c)));
    }

    if (selectedProductTypes.length > 0) {
      result = result.filter(p => {
        const title = p.title.toLowerCase();
        return selectedProductTypes.some(type => {
          if (type === 'Suits') return title.includes('suit') || title.includes('suits') || title.includes('bộ');
          if (type === 'Blazers') return title.includes('blazer');
          if (type === 'Vests') return title.includes('vest') || title.includes('gile');
          return false;
        });
      });
    }

    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result = [...result].sort((a, b) => (a.tagLeft === 'NEW' ? -1 : 1));
    }

    return result;
  }, [products, selectedBrands, selectedColors, selectedProductTypes, sortBy]);

  // Pagination config
  const itemsPerPage = 36;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedProductTypes([]);
    setSelectedSizes([]);
    setSelectedFits([]);
    setCurrentPage(1);
  };

  const hasActiveFilters = 
    selectedBrands.length > 0 || 
    selectedColors.length > 0 || 
    selectedProductTypes.length > 0 || 
    selectedSizes.length > 0 || 
    selectedFits.length > 0;

  return (
    <div className="w-full">
      {/* 1. Full-Width Category Advertising Banner */}
      <div className="relative w-full h-[240px] sm:h-[300px] bg-neutral-900 overflow-hidden flex items-center justify-center select-none">
        <img 
          src={bannerImage} 
          alt={`${categoryName} Banner`} 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4">
          <span className="text-[10px] font-sans text-[#C5A880] tracking-[0.4em] uppercase block mb-2.5 font-bold">
            Aristino Premium
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-[0.2em] text-white uppercase">
            {categoryName}
          </h1>
          <p className="text-[10px] font-sans text-neutral-300 tracking-[0.3em] uppercase mt-3">
            Collection 2026 / Inherit the Legend
          </p>
        </div>
      </div>

      {/* Main Content Container (Padded) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 2. Breadcrumbs */}
        <div className="text-[11px] font-sans text-neutral-500 tracking-wider mb-6">
          <Link href="/" className="hover:text-[#8B6E4A] transition-colors duration-200">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black font-semibold uppercase">{categoryName}</span>
        </div>

        {/* 3. Page Header bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-neutral-200 mb-8 gap-4">
          <div className="flex items-center">
            <span className="text-[11px] font-sans font-bold text-neutral-500 tracking-widest uppercase">
              {filteredProducts.length} PRODUCTS FOUND
            </span>
          </div>

          {/* Right header segment with Sort dropdown */}
          <div className="flex items-center space-x-2 text-xs select-none ml-auto md:ml-0">
            <span className="font-sans text-neutral-500 tracking-wider">SORT BY</span>
            <select 
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="border border-neutral-300 rounded px-2.5 py-1.5 bg-white font-sans text-neutral-800 focus:border-[#8B6E4A] focus:outline-none tracking-wide"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

      {/* 3. Main Body Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Sidebar Filters */}
        <div className={`lg:w-1/4 flex-shrink-0 lg:sticky lg:top-28 self-start max-h-[calc(100vh-140px)] overflow-y-auto pr-1 transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden'}`}>
          <div className="border border-neutral-200 p-5 bg-white rounded">
            
            {/* Header filters */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-4">
              <span className="font-serif text-sm font-bold tracking-widest text-brand-charcoal flex items-center">
                FILTERS
              </span>
              {hasActiveFilters && (
                <button 
                  onClick={clearAllFilters}
                  className="text-[10px] font-sans text-brand-gold hover:underline tracking-wider font-bold"
                >
                  CLEAR ALL
                </button>
              )}
            </div>

            {/* A. Brands collapsible filter */}
            <div className="border-b border-neutral-100 py-3">
              <button 
                onClick={() => toggleSection('brands')}
                className="w-full flex items-center justify-between font-sans text-[11px] font-bold tracking-wider text-neutral-800 focus:outline-none"
              >
                <span>BRANDS</span>
                <span className="text-sm font-light">{expandedSections.brands ? '—' : '+'}</span>
              </button>
              {expandedSections.brands && (
                <div className="mt-3.5 space-y-2 font-sans text-[12px] text-neutral-700">
                  {['Aristino', 'Aristino Business', 'Aristino Golf'].map((brand) => (
                    <label key={brand} className="flex items-center space-x-2.5 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleCheckboxChange(brand, selectedBrands, setSelectedBrands)}
                        className="w-3.5 h-3.5 border-neutral-300 rounded text-brand-gold focus:ring-brand-gold"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* B. Colors collapsible filter */}
            <div className="border-b border-neutral-100 py-3">
              <button 
                onClick={() => toggleSection('colors')}
                className="w-full flex items-center justify-between font-sans text-[11px] font-bold tracking-wider text-neutral-800 focus:outline-none"
              >
                <span>COLORS</span>
                <span className="text-sm font-light">{expandedSections.colors ? '—' : '+'}</span>
              </button>
              {expandedSections.colors && (
                <div className="mt-3.5 grid grid-cols-5 gap-2.5">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleColorClick(c.hex)}
                      className={`w-6 h-6 rounded-full relative transition-all duration-200 hover:scale-110 flex items-center justify-center ${
                        c.border ? 'border border-neutral-300' : ''
                      } ${selectedColors.includes(c.hex) ? 'ring-2 ring-brand-gold ring-offset-2' : ''}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name.toUpperCase()}
                      aria-label={`Filter color ${c.name}`}
                    >
                      {selectedColors.includes(c.hex) && (
                        <svg className={`w-3.5 h-3.5 ${c.hex === '#FFFFFF' || c.hex === '#FFFDD0' ? 'text-black' : 'text-white'}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* C. Product collapsible filter */}
            <div className="border-b border-neutral-100 py-3">
              <button 
                onClick={() => toggleSection('products')}
                className="w-full flex items-center justify-between font-sans text-[11px] font-bold tracking-wider text-neutral-800 focus:outline-none"
              >
                <span>PRODUCT TYPE</span>
                <span className="text-sm font-light">{expandedSections.products ? '—' : '+'}</span>
              </button>
              {expandedSections.products && (
                <div className="mt-3.5 space-y-2 font-sans text-[12px] text-neutral-700">
                  {['Suits', 'Blazers', 'Vests'].map((type) => (
                    <label key={type} className="flex items-center space-x-2.5 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedProductTypes.includes(type)}
                        onChange={() => handleCheckboxChange(type, selectedProductTypes, setSelectedProductTypes)}
                        className="w-3.5 h-3.5 border-neutral-300 rounded text-brand-gold focus:ring-brand-gold"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* D. Sizes collapsible filter */}
            <div className="border-b border-neutral-100 py-3">
              <button 
                onClick={() => toggleSection('sizes')}
                className="w-full flex items-center justify-between font-sans text-[11px] font-bold tracking-wider text-neutral-800 focus:outline-none"
              >
                <span>SIZES</span>
                <span className="text-sm font-light">{expandedSections.sizes ? '—' : '+'}</span>
              </button>
              {expandedSections.sizes && (
                <div className="mt-3.5 grid grid-cols-3 gap-2 font-sans text-[11px] text-neutral-700 font-bold select-none">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleCheckboxChange(size, selectedSizes, setSelectedSizes)}
                      className={`py-1.5 border text-center transition-all ${
                        selectedSizes.includes(size)
                          ? 'bg-black text-white border-black'
                          : 'border-neutral-200 hover:border-neutral-800'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* E. Fits collapsible filter */}
            <div className="py-3">
              <button 
                onClick={() => toggleSection('fits')}
                className="w-full flex items-center justify-between font-sans text-[11px] font-bold tracking-wider text-neutral-800 focus:outline-none"
              >
                <span>FITS</span>
                <span className="text-sm font-light">{expandedSections.fits ? '—' : '+'}</span>
              </button>
              {expandedSections.fits && (
                <div className="mt-3.5 space-y-2 font-sans text-[12px] text-neutral-700">
                  {['Slim Fit', 'Regular Fit'].map((fit) => (
                    <label key={fit} className="flex items-center space-x-2.5 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedFits.includes(fit)}
                        onChange={() => handleCheckboxChange(fit, selectedFits, setSelectedFits)}
                        className="w-3.5 h-3.5 border-neutral-300 rounded text-brand-gold focus:ring-brand-gold"
                      />
                      <span>{fit}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Products Grid (conforming to 3 per row on desktop) */}
        <div className="flex-grow">
          {paginatedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-neutral-200 rounded bg-white text-center px-4">
              <svg className="w-12 h-12 text-neutral-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-serif text-base font-bold text-neutral-800 mb-1">No products found</h3>
              <p className="font-sans text-xs text-neutral-500 max-w-xs">
                We couldn't find any products matching your filters. Try selecting different options or clearing all filters.
              </p>
            </div>
          ) : (
            <>
              {/* Product Card grid - 3 per row on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-1.5 mt-12 mb-6 select-none">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="px-3.5 py-2 border border-neutral-200 text-[10px] font-bold tracking-widest disabled:opacity-30 hover:border-black transition-colors focus:outline-none uppercase"
                  >
                    PREV
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`w-9 h-9 flex items-center justify-center border text-[11px] font-bold transition-all ${
                        currentPage === page 
                          ? 'bg-black text-white border-black' 
                          : 'border-neutral-200 hover:border-black'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="px-3.5 py-2 border border-neutral-200 text-[10px] font-bold tracking-widest disabled:opacity-30 hover:border-black transition-colors focus:outline-none uppercase"
                  >
                    NEXT
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  </div>
  );
}
