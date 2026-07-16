import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartDrawer } from '../../src/components/CartDrawer';
import Cookies from 'js-cookie';
import { getCartFromCookies, saveCartToCookies } from '../../src/services/cartService';

// Mock browser cookies
jest.mock('js-cookie', () => {
  let store: Record<string, string> = {};
  return {
    get: jest.fn((key: string) => store[key]),
    set: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    remove: jest.fn((key: string) => {
      delete store[key];
    }),
  };
});

describe('Cart State Service & Drawer UI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('correctly saves and loads items from cookies', () => {
    const mockItems = [
      { id: '1', name: 'Signature Polo', price: 85, quantity: 1, color: 'Navy', size: 'M' }
    ];
    
    saveCartToCookies(mockItems);
    expect(Cookies.set).toHaveBeenCalledWith('aristino_cart', JSON.stringify(mockItems), { expires: 7, path: '/' });
    
    // Mock get cookie returns
    (Cookies.get as jest.Mock).mockReturnValueOnce(JSON.stringify(mockItems));
    const loadedItems = getCartFromCookies();
    expect(loadedItems).toEqual(mockItems);
  });

  it('renders empty cart drawer UI representation', () => {
    render(
      <CartDrawer 
        isOpen={true} 
        onClose={jest.fn()} 
        items={[]} 
        subtotal={0} 
      />
    );

    expect(screen.getByText('Your bag is empty.')).toBeInTheDocument();
    expect(screen.queryByText('PROCEED TO CHECKOUT')).not.toBeInTheDocument();
  });

  it('renders cart items and subtotal correctly inside drawer', () => {
    const mockItems = [
      { id: '1', name: 'Signature Polo', price: 85, quantity: 2, color: 'Navy', size: 'M' }
    ];

    render(
      <CartDrawer 
        isOpen={true} 
        onClose={jest.fn()} 
        items={mockItems} 
        subtotal={170} 
      />
    );

    expect(screen.getByText('Signature Polo')).toBeInTheDocument();
    expect(screen.getAllByText('$170.00').length).toBe(2);
    expect(screen.getByText('PROCEED TO CHECKOUT')).toBeInTheDocument();
  });
});
