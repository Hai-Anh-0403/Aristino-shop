import Cookies from 'js-cookie';

const COOKIE_NAME = 'aristino_cart';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  imageUrl?: string;
}

export interface CartCookieItem {
  id: string;
  color: string;
  size: string;
  quantity: number;
}

/**
 * Loads the cart items from cookies. Safely returns empty array during SSR.
 */
export const getCartFromCookies = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const data = Cookies.get(COOKIE_NAME);
  if (!data) return [];
  try {
    const rawItems = JSON.parse(data);
    return rawItems.map((item: any) => ({
      id: item.id,
      color: item.color || '',
      size: item.size || '',
      quantity: Number(item.quantity) || 1,
      name: item.name || '',
      price: Number(item.price) || 0,
      imageUrl: item.imageUrl || '',
    }));
  } catch (error) {
    console.error('Failed to parse cart cookie data:', error);
    return [];
  }
};

export const saveCartToCookies = (items: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  const cookieData: CartCookieItem[] = items.map((item) => ({
    id: item.id,
    color: item.color || '',
    size: item.size || '',
    quantity: item.quantity || 1,
  }));
  Cookies.set(COOKIE_NAME, JSON.stringify(cookieData), { expires: 7, path: '/' });
};

/**
 * Helper to add an item to the cart, merging duplicates.
 */
export const addItemToCart = (currentItems: CartItem[], newItem: Omit<CartItem, 'quantity'>): CartItem[] => {
  const existingItemIndex = currentItems.findIndex(
    (item) => item.id === newItem.id && item.color === newItem.color && item.size === newItem.size
  );

  let updatedItems = [...currentItems];

  if (existingItemIndex > -1) {
    updatedItems[existingItemIndex].quantity += 1;
  } else {
    updatedItems.push({ ...newItem, quantity: 1 });
  }

  saveCartToCookies(updatedItems);
  return updatedItems;
};

/**
 * Helper to remove an item from the cart.
 */
export const removeItemFromCart = (currentItems: CartItem[], itemIdToRemove: string): CartItem[] => {
  const updatedItems = currentItems.filter((item) => item.id !== itemIdToRemove);
  saveCartToCookies(updatedItems);
  return updatedItems;
};
