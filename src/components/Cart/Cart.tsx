import React from 'react';
import { useCart } from '../../context/CartContext';
import PlaceOrderButton from '../PlaceOrderButton/PlaceOrderButton';
import './Cart.scss';

const Cart: React.FC = () => {
  const { items, totalItems, totalPrice } = useCart();
  
  const formatItemsCount = (count: number) => {
    return count === 1 ? '1 Item' : `${count} Items`;
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      {items.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-summary">
            <p>{formatItemsCount(totalItems)}</p>
            <p className="total-price">Total: {formatPrice(totalPrice)}</p>
          </div>
          
          <div className="cart-items">
            {items.map((item, index) => (
              <div key={index} className="cart-item">
                {/* Display cart item details */}
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p>{formatPrice(item.product.prices[0].amount)}</p>
                  
                  {/* Display selected attributes */}
                  <div className="selected-attributes">
                    {Object.entries(item.selectedAttributes).map(([attrId, valueId]) => (
                      <div key={attrId} className="attribute">
                        <span className="attribute-name">
                          {item.product.attributes.find(attr => attr.id === attrId)?.name}:
                        </span>
                        <span className="attribute-value">
                          {item.product.attributes
                            .find(attr => attr.id === attrId)?.items
                            .find(item => item.id === valueId)?.displayValue}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="quantity-controls">
                    <span>Quantity: {item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Place Order Button */}
          <PlaceOrderButton />
        </>
      )}
    </div>
  );
};

export default Cart; 