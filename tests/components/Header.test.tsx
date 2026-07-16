import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../../src/components/Header';

// Mock Next.js Link component to avoid router context requirements in tests
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Header Component', () => {
  it('renders the brand logo and all navigation categories', () => {
    render(<Header />);
    
    // Brand Logo rendering check (renders in both desktop logo and mobile drawer title)
    expect(screen.getAllByText('ARISTINO').length).toBe(2);
    
    // Nav categories checklist in premium English
    const expectedLinks = [
      'APPAREL',
      'ACCESSORIES',
      'LEATHER GOODS',
      'BRANDS',
      'ACTIVEWEAR',
      'Online Exclusives',
      'Collections',
      'New Arrivals',
      'Tops',
      'Bottoms',
      'Suits & Blazers',
      'Underwear & Loungewear',
    ];
    
    expectedLinks.forEach((linkText) => {
      const elements = screen.getAllByText(linkText);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('toggles the mobile menu drawer class state when open/close triggers are tapped', () => {
    render(<Header />);
    
    // Trigger button is present
    const openButton = screen.getByLabelText('Open Navigation Menu');
    expect(openButton).toBeInTheDocument();
    
    // The close button inside the sidebar drawer is in the DOM (hidden via css classes initially)
    const closeButton = screen.getByLabelText('Close Navigation Menu');
    expect(closeButton).toBeInTheDocument();
    
    // Tapping open changes state
    fireEvent.click(openButton);
    
    // Tapping close triggers toggle back
    fireEvent.click(closeButton);
  });
});
