import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { CREATE_ORDER } from '../../context/mutations/orderMutations';
import { graphqlClient } from '../../utils/graphqlClient';
import './PlaceOrderButton.scss';

interface PlaceOrderButtonProps {
  className?: string;
  onSuccess: () => void;
  onError: (error: any) => void;
}

const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({
  className,
  onSuccess,
  onError
}) => {
  const { items, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const calculateTotalAmount = () => {
    return items.reduce((total, item) => {
      const price = item.product && item.product.prices && item.product.prices[0] 
        ? item.product.prices[0].amount 
        : 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      onError(new Error('Cannot place an order with an empty cart'));
      return;
    }

    console.log('Cart items:', JSON.stringify(items, null, 2));

    setIsLoading(true);

    try {
      const orderItems = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        selectedAttributes: Object.entries(item.selectedAttributes || {}).map(([attrName, attrValue]) => ({
          attributeName: attrName,
          attributeItemId: attrValue,
          displayValue: attrValue
        }))
      }));

      const calculatedTotal = calculateTotalAmount();
      console.log('Calculated total amount:', calculatedTotal);
      
      const orderInput = {
        customerName: "Guest User",
        customerEmail: "guest@example.com",
        address: "Guest Address",
        totalAmount: calculatedTotal,
        items: orderItems
      };

      console.log('Sending order:', JSON.stringify(orderInput, null, 2));

      const response = await graphqlClient.request(CREATE_ORDER, {
        input: orderInput
      });

      console.log('Order placed successfully:', response);
      
      clearCart();
      
      onSuccess();
    } catch (error) {
      console.error('Error placing order:', error);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`place-order-button ${className || ''} ${isLoading ? 'loading' : ''}`}
      onClick={handlePlaceOrder}
      disabled={isLoading || items.length === 0}
    >
      {isLoading ? 'Processing...' : 'Checkout'}
    </button>
  );
};

export default PlaceOrderButton;