# Data Model: Aristino Frontend Rebuild

This document defines the TypeScript interfaces for the key UI data models.

## Entities

### Product
Represents the structural properties for displaying a product item card inside collection grids.

```typescript
export interface Product {
  id: string;          // Unique identifier
  title: string;       // Product name, truncated to 2 lines max in CSS
  price: number;       // Price in USD
  imageUrl: string;    // Direct URL to static media asset
  colors: string[];    // Array of hex color code strings for swatches
  slug: string;        // URL-friendly product identifier
}
```

### CartItem
Represents the structural properties of an item placed in the Shopping Bag.

```typescript
export interface CartItem {
  id: string;          // Combined key matching variant id (e.g., id-color-size)
  name: string;        // Product name
  price: number;       // Price in USD
  quantity: number;    // Quantity ordered
  color: string;       // Color description
  size: string;        // Selected size
}
```

## State Structures

### CartState
```typescript
export interface CartState {
  items: CartItem[];   // Items currently inside the basket
  isOpen: boolean;     // Cart Drawer visual state
  subtotal: number;    // Calculated sum of all items
}
```
