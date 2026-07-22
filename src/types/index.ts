export interface Product {
  _id?: string;
  id: string | number;
  brand: string;
  title: string;
  price: number | string; // Price e.g. "$15.29" or 15.29
  originalPrice?: number;
  discount?: string;
  description?: string;
  images?: string[];
  imageUrl?: string;
  color?: string;
  colors?: string[]; // hex codes or color names for swatches
  uploadedAt?: string | Date;
  status?: string;
  done?: boolean;
  theme?: string;
  slug: string;
  tagLeft?: string; // e.g. "NEW"
  tagRight?: string; // e.g. "PREMIUM"
  lookbookLabel?: string;
  isFlashSale?: boolean;
  isLookbook?: boolean;
}

export interface SubBrand {
  name: string;
  sub?: string;
  colorClass?: string;
  subColorClass?: string;
  href?: string;
}
