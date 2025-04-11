import { Product } from './productTypes';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedAttributes: Record<string, string>;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedAttributes: Record<string, string>) => void;
  removeFromCart: (item: CartItem) => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
export interface AttributeOption {
  id: string;
  value: string;
  displayValue: string;
}

export interface Attribute {
  name: string;
  type: 'text' | 'swatch';
  items: AttributeOption[];
}

export interface CartOverlayItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  gallery: string[];
  quantity: number;
  attributes: {
    [key: string]: {
      options: string[];
      selected: string;
    };
  };
  availableAttributes: Attribute[];
}

export interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartOverlayItem[];
  onIncreaseQuantity: (itemId: string, selectedAttributes: Record<string, string>) => void;
  onDecreaseQuantity: (itemId: string, selectedAttributes: Record<string, string>) => void;
  onViewCart: () => void;
  onCheckout: () => void;
} 