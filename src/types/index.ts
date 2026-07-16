export interface Product {
  id: string;
  brand: string;
  title: string;
  price: number; // Price in USD
  originalPrice?: number;
  discount?: string;
  imageUrl: string;
  colors: string[]; // hex codes for swatches
  slug: string;
  tagLeft?: string; // e.g. "NEW"
  tagRight?: string; // e.g. "PREMIUM"
}

export interface SubBrand {
  name: string;
  sub?: string;
  colorClass?: string;
  subColorClass?: string;
  href?: string;
}
