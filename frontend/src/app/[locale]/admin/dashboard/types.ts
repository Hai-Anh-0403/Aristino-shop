export interface AdminSession {
  email: string;
  role: string;
}

export interface SliderItem {
  _id: string;
  imageUrl: string;
  originalName: string;
  order: number;
  isActive: boolean;
}

export interface DashboardProduct {
  _id: string;
  id?: string | number;
  brand: string;
  title: string;
  price: number | string;
  originalPrice?: number;
  discount?: string;
  description?: string;
  images?: string[];
  imageUrl?: string;
  color?: string;
  colors?: string[];
  uploadedAt?: string;
  status?: string;
  done?: boolean;
  theme?: string;
  slug: string;
  tagLeft?: string;
  tagRight?: string;
  lookbookLabel?: string;
  isFlashSale?: boolean;
  isLookbook?: boolean;
}

export interface HomepageBannerItem {
  src: string;
  alt?: string;
  label: string;
  href: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  imageUrl?: string;
}

export interface OrderData {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  phone?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  status: 'Processing' | 'Confirmed' | 'Shipping' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
}

export interface FeedbackData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  userKey?: string;
  createdAt: string;
}

export interface LookbookInfo {
  title: string;
  description: string;
}
