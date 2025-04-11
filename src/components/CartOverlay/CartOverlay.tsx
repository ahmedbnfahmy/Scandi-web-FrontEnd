import React from 'react';
import { CartOverlayProps } from '../../context/types/cartTypes';
import './CartOverlay.scss';

const CartOverlay: React.FC<CartOverlayProps> = ({
  isOpen,
  onClose,
  cartItems,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onViewCart,
  onCheckout
}) => {
  if (!isOpen) return null;

  const toKebabCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  };

  const extractSelectedAttributes = (attrs: {
    [key: string]: { options: string[]; selected: string };
  }): Record<string, string> => {
    const selectedAttrs: Record<string, string> = {};
    Object.entries(attrs).forEach(([key, attr]) => {
      selectedAttrs[key] = attr.selected;
    });
    return selectedAttrs;
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    return (
        <div className="cart-overlay">
            <div className="cart-overlay__backdrop" onClick={onClose}></div>
            <div className="cart-overlay__content">
                <div className="cart-overlay__header">
                    <h2 className="cart-overlay__title">My Bag, {itemCount} items</h2>
                    <button className="cart-overlay__close" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="cart-overlay__items">
                    {cartItems.length === 0 ? (
                        <p className="cart-overlay__empty">Your cart is empty</p>
                    ) : (
                        cartItems.map((item, index) => {
                            // Create a unique ID for each cart item based on product and selected attributes
                            const itemKey = `${item.id}-${Object.values(item.attributes)
                                .map(attr => attr.selected)
                                .join('-')}`;

                            return (
                                <div key={itemKey} className="cart-item">
                                    <div className="cart-item__info">
                                        <h3 className="cart-item__brand">{item.brand}</h3>
                                        <h4 className="cart-item__name">{item.name}</h4>
                                        <p className="cart-item__price">{formatPrice(item.price)}</p>

                                        {/* Attributes */}
                                        {item.availableAttributes.map(attribute => {
                                            const attrName = toKebabCase(attribute.name);
                                            const selectedValue = item.attributes[attribute.name]?.selected || '';

                                            return (
                                                <div
                                                    key={`${itemKey}-${attrName}`}
                                                    className="cart-item__attribute"
                                                    data-testid={`cart-item-attribute-${attrName}`}
                                                >
                                                    <h5 className="cart-item__attribute-name">{attribute.name}:</h5>
                                                    <div className="cart-item__attribute-options">
                                                        {attribute.items.map(option => {
                                                            const isSelected = option.id === selectedValue;
                                                            const optionKebab = toKebabCase(option.id);

                                                            return (
                                                                <div
                                                                    key={`${itemKey}-${attrName}-${optionKebab}`}
                                                                    className={`
                                                                        cart-item__attribute-option 
                                                                        cart-item__attribute-option--${attribute.type}
                                                                        ${isSelected ? 'cart-item__attribute-option--selected' : ''}
                                                                    `}
                                                                    style={
                                                                        attribute.type === 'swatch'
                                                                            ? { backgroundColor: option.value }
                                                                            : undefined
                                                                    }
                                                                    data-testid={
                                                                        isSelected
                                                                            ? `cart-item-attribute-${attrName}-${optionKebab}-selected`
                                                                            : `cart-item-attribute-${attrName}-${optionKebab}`
                                                                    }
                                                                >
                                                                    {attribute.type === 'text' ? option.displayValue : ''}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Quantity controls and image */}
                                    <div className="cart-item__controls">
                                        <div className="cart-item__quantity">
                                            <button
                                                className="cart-item__quantity-button cart-item__quantity-increase"
                                                onClick={() => onIncreaseQuantity(
                                                    item.id, 
                                                    extractSelectedAttributes(item.attributes)
                                                )}
                                                aria-label="Increase quantity"
                                                data-testid="cart-item-amount-increase"
                                            >
                                                +
                                            </button>
                                            
                                            <span 
                                                className="cart-item__quantity-value"
                                                data-testid="cart-item-amount"
                                            >
                                                {item.quantity}
                                            </span>
                                            
                                            <button
                                                className="cart-item__quantity-button cart-item__quantity-decrease"
                                                onClick={() => onDecreaseQuantity(
                                                    item.id, 
                                                    extractSelectedAttributes(item.attributes)
                                                )}
                                                aria-label="Decrease quantity"
                                                data-testid="cart-item-amount-decrease"
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                        </div>

                                        <div className="cart-item__image-container">
                                            <img
                                                src={item.gallery[0]}
                                                alt={item.name}
                                                className="cart-item__image"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Total */}
                <div className="cart-overlay__total">
                    <span className="cart-overlay__total-label">Total</span>
                    <span
                        className="cart-overlay__total-value"
                        data-testid="cart-total"
                    >
                        {formatPrice(totalPrice)}
                    </span>
                </div>

                {/* Actions */}
                <div className="cart-overlay__actions">
                    <button
                        className="cart-overlay__button cart-overlay__button--view-bag"
                        onClick={onViewCart}
                    >
                        VIEW BAG
                    </button>
                    <button
                        className="cart-overlay__button cart-overlay__button--checkout"
                        onClick={onCheckout}
                        disabled={cartItems.length === 0}
                    >
                        CHECK OUT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartOverlay;