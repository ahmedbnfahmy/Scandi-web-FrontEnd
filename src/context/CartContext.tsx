import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from './types/productTypes';

interface CartItem {
  product: Product;
  quantity: number;
  selectedAttributes: Record<string, string>;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedAttributes: Record<string, string>) => void;
  removeFromCart: (itemIndex: number) => void;
  updateQuantity: (itemIndex: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, selectedAttributes: Record<string, string>) => {
    setItems(prevItems => [
      ...prevItems,
      { product, quantity: 1, selectedAttributes }
    ]);
  };

  const removeFromCart = (itemIndex: number) => {
    setItems(prevItems => prevItems.filter((_, index) => index !== itemIndex));
  };

  const updateQuantity = (itemIndex: number, quantity: number) => {
    setItems(prevItems => 
      prevItems.map((item, index) => 
        index === itemIndex ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce((sum, item) => 
    sum + (item.product.prices[0].amount * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}; 