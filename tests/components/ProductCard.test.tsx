import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../../src/components/ProductCard';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock Next.js Image component
jest.mock('next/image', () => {
  return ({ src, alt, className }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} />;
  };
});

// Mock CartContext
jest.mock('../../src/components/CartContext', () => ({
  useCart: () => ({
    addToCart: jest.fn(),
  }),
}));

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 'prod-1',
    brand: 'ARISTINO',
    title: 'Premium Linen Blazer',
    price: 180.00,
    imageUrl: 'https://aristino.com/assets/linen-blazer.jpg',
    colors: ['#0A192F', '#C5A880'],
    slug: 'premium-linen-blazer',
  };

  it('renders the product card details correctly', () => {
    render(<ProductCard product={mockProduct} />);

    // Brand label check
    expect(screen.getByText('ARISTINO')).toBeInTheDocument();

    // Title check
    expect(screen.getByText('Premium Linen Blazer')).toBeInTheDocument();

    // Price check ($180.00)
    expect(screen.getByText('$180.00')).toBeInTheDocument();

    // Swatches are spans, quick add button is the only button element
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(1);
  });
});
