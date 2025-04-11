import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Product } from './types/productTypes';
import { CartItem, CartContextType } from './types/cartTypes';

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

  const addToCart = useCallback((product: Product, selectedAttributes: Record<string, string>) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => 
          item.product.id === product.id && 
          Object.entries(item.selectedAttributes).every(
            ([key, value]) => selectedAttributes[key] === value
          )
      );

      if (existingItemIndex !== -1) {
        return prevItems.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      
      return [...prevItems, { product, quantity: 1, selectedAttributes }];
    });
  }, []);

  const removeFromCart = useCallback((itemToRemove: CartItem) => {
    setItems(prevItems => 
      prevItems.filter(item => 
        !(
          item.product.id === itemToRemove.product.id && 
          Object.entries(item.selectedAttributes).every(
            ([key, value]) => itemToRemove.selectedAttributes[key] === value
          )
        )
      )
    );
  }, []);

  const updateQuantity = useCallback((itemToUpdate: CartItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemToUpdate);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => {
        const isSameProduct = 
          item.product.id === itemToUpdate.product.id && 
          Object.entries(item.selectedAttributes).every(
            ([key, value]) => itemToUpdate.selectedAttributes[key] === value
          );
          
        return isSameProduct ? { ...item, quantity: newQuantity } : item;
      })
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Calculate derived values
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce((sum, item) => 
    sum + (item.product.prices[0].amount * item.quantity), 0);

  // Create a memoized context value
  const contextValue = React.useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  }), [items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};