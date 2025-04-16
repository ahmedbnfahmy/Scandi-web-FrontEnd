import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Product } from './types/productTypes';
import { CartItem, CartContextType } from './types/cartTypes';
import { CREATE_ORDER } from './mutations/orderMutations';
import { graphqlClient } from '../utils/graphqlClient';

interface CreateOrderResponse {
  createOrder: {
    id: string;
    items: Array<{
      productId: string;
      quantity: number;
      selectedAttributes: Record<string, string>;
    }>;
    totalAmount: number;
    createdAt: string;
  };
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
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<Error | null>(null);

  const addToCart = useCallback((product: Product, selectedAttributes: Record<string, string>) => {
    // Don't add to cart if product is out of stock
    if (!product.inStock) {
      console.error('Cannot add out-of-stock product to cart');
      return;
    }
    
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

  const placeOrder = useCallback(async () => {
    if (items.length === 0) return null;
    
    setOrderLoading(true);
    setOrderError(null);
    
    try {
      const orderItems = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        selectedAttributes: item.selectedAttributes
      }));
      
      const totalAmount = items.reduce((sum, item) => 
        sum + (item.product.prices[0].amount * item.quantity), 0);
      
      // Execute the mutation with graphql-request and properly type the response
      const response = await graphqlClient.request<CreateOrderResponse>(CREATE_ORDER, {
        items: orderItems,
        totalAmount: totalAmount
      });
      
      clearCart();
      
      setOrderLoading(false);
      return response.createOrder;
    } catch (err) {
      console.error('Error placing order:', err);
      setOrderError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setOrderLoading(false);
      throw err;
    }
  }, [items, clearCart]);

  // Calculate derived values
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => 
    sum + (item.product.prices[0].amount * item.quantity), 0);

  const formattedItemsCount = totalItems === 1 ? '1 Item' : `${totalItems} Items`;

  const calculateTotalAmount = () => {
    return items.reduce((total, item) => total + (item.product.prices[0].amount * item.quantity), 0);
  };

  const cartContextValue: CartContextType = {
    items,
    totalItems,
    totalAmount: calculateTotalAmount(),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    placeOrder,
    orderLoading,
    orderError,
    totalPrice,
    formattedItemsCount
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};