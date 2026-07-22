import { Product } from '../types';

const generateMockSuits = (): Product[] => {
  const list: Product[] = [];
  
  // Exact layout fits matching screenshot
  list.push({
    id: 'suit-1',
    brand: 'Aristino Business',
    title: 'Bộ Suits Nam Wool Aristino Business Premio...',
    price: 12500.00,
    imageUrl: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=800&auto=format&fit=crop',
    tagLeft: 'NEW',
    tagRight: 'PREMIUM',
    colors: ['#808080'],
    slug: 'bo-suits-nam-wool-aristino-business-premio-1',
  });
  
  list.push({
    id: 'suit-2',
    brand: 'Aristino Business',
    title: 'Bộ Suits Nam Wool Aristino Business Premio 1SURO1S',
    price: 12500.00,
    imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop',
    tagLeft: 'NEW',
    tagRight: 'PREMIUM',
    colors: ['#000000'],
    slug: 'bo-suits-nam-wool-aristino-business-premio-1suro1s',
  });
  
  list.push({
    id: 'suit-3',
    brand: 'Aristino',
    title: 'Áo Blazer Nam Kẻ Aristino Premio ABZ005S0H4',
    price: 4500.00,
    imageUrl: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=800&auto=format&fit=crop',
    tagLeft: 'NEW',
    colors: ['#D3D3D3'],
    slug: 'ao-blazer-nam-ke-aristino-premio-abz005s0h4',
  });
  
  // Unsplash menswear suite images
  const suitImages = [
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop'
  ];
  
  const brands = ['Aristino', 'Aristino Business', 'Aristino Golf'];
  const titles = [
    'Bộ Suit Nam Cao Cấp Wool Luxury Premium',
    'Áo Blazer Nam Regular Fit Phong Cách Ý',
    'Bộ Suit Công Sở Aristino Business Class',
    'Áo Vest Nam Dạo Phố Aristino Active',
    'Bộ Suit Cưới Nam Cao Cấp Wool Silk Blend',
    'Áo Blazer Nam Họa Tiết Kẻ Lịch Lãm'
  ];
  const colorOptions = [
    ['#0A192F', '#A3B18A'],
    ['#1A1A1A', '#808080'],
    ['#FAF9F6', '#C5A880'],
    ['#1D3557', '#457B9D'],
    ['#2F4F4F', '#000000'],
  ];

  for (let i = 4; i <= 47; i++) {
    const brandIdx = (i % brands.length);
    const titleIdx = (i % titles.length);
    const imgIdx = (i % suitImages.length);
    const colorIdx = (i % colorOptions.length);
    const isPremium = i % 3 === 0;
    const isNew = i % 2 === 0;
    
    list.push({
      id: `suit-${i}`,
      brand: brands[brandIdx],
      title: `${titles[titleIdx]} ${i}`,
      price: (i % 2 === 0) ? (200.00 + i * 15) : (150.00 + i * 8),
      imageUrl: suitImages[imgIdx],
      tagLeft: isNew ? 'NEW' : undefined,
      tagRight: isPremium ? 'PREMIUM' : undefined,
      colors: colorOptions[colorIdx],
      slug: `suit-product-${i}`
    });
  }
  
  return list;
};

export const getProductsByCollection = (slug: string): Product[] => {
  const normSlug = slug.toLowerCase();
  
  if (
    normSlug === 'suits-blazers' || 
    normSlug === 'suits' || 
    normSlug === 'suits-and-blazers' || 
    normSlug === 'suits-blazer'
  ) {
    return generateMockSuits();
  }
  
  // Mock data for other slots
  const count = normSlug === 'accessories' ? 12 : 24;
  const list: Product[] = [];
  const images = [
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop'
  ];
  
  const titleMap: Record<string, string> = {
    'apparel': 'Aristino Apparel Essential Dress Shirt',
    'accessories': 'Aristino Leather Wallet/Belt Premium',
    'leather-goods': 'Aristino Premium Leather Oxford Shoes',
    'activewear': 'Aristino Active Sport Performance Polo',
    'default': 'Aristino Premium Men Fashion Wear'
  };
  
  const activeTitle = titleMap[normSlug] || titleMap['default'];
  
  for (let i = 1; i <= count; i++) {
    list.push({
      id: `${normSlug}-${i}`,
      brand: i % 2 === 0 ? 'Aristino Business' : 'Aristino',
      title: `${activeTitle} Style ${i}`,
      price: 45.00 + i * 5,
      imageUrl: images[i % images.length],
      colors: ['#000000', '#808080'],
      slug: `${normSlug}-item-${i}`,
      tagLeft: i % 3 === 0 ? 'NEW' : undefined
    });
  }
  
  return list;
};

/**
 * Async API fetcher: fetch details for multiple products by their IDs
 */
export const fetchProductsByIds = async (ids: string[]): Promise<Product[]> => {
  if (!ids || ids.length === 0) return [];
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  try {
    const query = new URLSearchParams({ ids: ids.join(','), limit: String(Math.max(100, ids.length)) });
    const res = await fetch(`${API_URL}/products?${query.toString()}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data.map((p: any) => ({
        _id: p._id,
        id: p.id || p._id,
        brand: p.brand || 'Aristino',
        title: p.title,
        price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0,
        originalPrice: p.originalPrice ? (typeof p.originalPrice === 'number' ? p.originalPrice : parseFloat(String(p.originalPrice).replace(/[^0-9.]/g, '')) || undefined) : undefined,
        discount: p.discount || undefined,
        description: p.description || '',
        imageUrl: p.imageUrl || (p.images && p.images[0]) || '',
        images: p.images || (p.imageUrl ? [p.imageUrl] : []),
        color: p.color || '',
        colors: p.colors || (p.color ? [p.color] : []),
        theme: p.theme || '',
        status: p.status || '',
        done: p.done,
        uploadedAt: p.uploadedAt,
        slug: p.slug || p.id || p._id,
        tagLeft: p.tagLeft,
        tagRight: p.tagRight,
      }));
    }
    return [];
  } catch (err) {
    console.warn('Failed to fetch products by IDs from API, using fallback mock data:', err);
    try {
      const mockProducts = generateMockSuits();
      return mockProducts.filter(p => ids.includes(String(p.id)) || ids.includes(String(p._id)));
    } catch {
      return [];
    }
  }
};
