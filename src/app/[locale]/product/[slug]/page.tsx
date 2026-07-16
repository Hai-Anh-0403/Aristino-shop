import { Metadata } from 'next';
import React from 'react';
import { ProductDetail } from '../../../../components/ProductDetail';
import { notFound } from 'next/navigation';

// Mock product list
const MOCK_PRODUCTS: Record<string, {
  id: string;
  title: string;
  price: number;
  description: string;
  keywords: string;
  imageUrl: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  details: string[];
}> = {
  'signature-polo': {
    id: 'polo-navy-1',
    title: 'Premium Pima Cotton Polo Shirt',
    price: 85.00,
    description: "Discover Aristino's signature Polo shirt crafted from premium long-staple Pima cotton. Perfect tailored fit with Italian refinement.",
    keywords: 'premium menswear, tailored shirts, Pima cotton polo, Italian style menswear, luxury shirts',
    imageUrl: '/images/polo-navy.png',
    colors: [
      { name: 'Navy', hex: '#0A192F' },
      { name: 'Gold', hex: '#C5A880' },
      { name: 'Charcoal', hex: '#1F2937' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    details: [
      '100% long-staple Pima cotton for exceptional softness',
      'Mercerized finish for subtle luster and drape',
      'Contoured collar that retains its shape',
      'Italian-inspired tailored silhouette'
    ]
  },
  'classic-shirt': {
    id: 'classic-shirt',
    title: 'Classic Egyptian Cotton Shirt',
    price: 95.00,
    description: 'Meticulously crafted from extra-long staple Egyptian cotton, this shirt features a structured collar and hand-finished cuffs.',
    keywords: 'egyptian cotton shirt, premium shirting, tailored business shirt, luxury formal wear',
    imageUrl: '/images/shirt-white.png',
    colors: [
      { name: 'Classic White', hex: '#FFFFFF' },
      { name: 'Light Blue', hex: '#8FA9C4' }
    ],
    sizes: ['39', '40', '41', '42'],
    details: [
      '100% two-ply Egyptian cotton fabric',
      'Hand-finished cuffs and premium stitching',
      'Reinforced gussets for durability',
      'Easy-iron finish for perfect look'
    ]
  }
};

interface PageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = MOCK_PRODUCTS[slug] || MOCK_PRODUCTS['signature-polo'];

  return {
    title: `${product.title} | ARISTINO`,
    description: product.description,
    keywords: product.keywords,
    openGraph: {
      title: `${product.title} | ARISTINO`,
      description: product.description,
      url: `https://aristino.com/product/${slug}`,
      images: [
        {
          url: product.imageUrl,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | ARISTINO`,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS[slug];

  if (!product) {
    // If specific slug is not classic-shirt or signature-polo, fallback or show 404
    // We can fallback to signature-polo if desired, but returning 404 is cleaner next-standard
    // Let's fallback to signature-polo so user's arbitrary testing doesn't break
    const fallbackProduct = MOCK_PRODUCTS['signature-polo'];
    return <ProductDetail product={fallbackProduct} />;
  }

  return <ProductDetail product={product} />;
}
