import React from 'react';
import { useCart } from '../../context/CartContext';
import './PlaceOrderButton.scss';

interface PlaceOrderButtonProps {
  className?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  children?: React.ReactNode;
}

const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({ 
  className = '',
  onSuccess,
  onError,
  children
}) => {
  const { items, placeOrder, orderLoading, orderError } = useCart();
  
  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    
    try {
      const order = await placeOrder();
      
      if (order && onSuccess) {
        onSuccess();
      }
      
      // Show success message if no callback provided
      if (order && !onSuccess) {
        alert('Your order has been placed successfully!');
      }
    } catch (err) {
      if (onError) {
        onError(err);
      } else {
        alert('Failed to place your order. Please try again.');
      }
    }
  };

  const isCartEmpty = items.length === 0;

  return (
    <button
      className={`place-order-button ${isCartEmpty ? 'disabled' : ''} ${className}`}
      onClick={handlePlaceOrder}
      disabled={isCartEmpty || orderLoading}
      data-testid="place-order-button"
    >
      {orderLoading 
        ? 'Processing...' 
        : children || 'PLACE ORDER'}
      {orderError && <span className="error-indicator">!</span>}
    </button>
  );
};

export default PlaceOrderButton;