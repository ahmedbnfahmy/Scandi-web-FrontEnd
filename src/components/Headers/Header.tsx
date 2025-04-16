import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '../icons/ShoppingCartIcon';
import CartOverlay from '../CartOverlay/CartOverlay';
import { useProductData } from '../../context/ProductDataContext';
import { useCart } from '../../context/CartContext';
import { Category, HeaderProps } from '../../context/types/headerTypes';
import './Header.scss';

const Header: React.FC<HeaderProps> = ({ logoText = 'MyStore' }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [displayCategories, setDisplayCategories] = useState<Category[]>([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { products, fetchProducts } = useProductData();
  const { items, totalItems, removeFromCart, updateQuantity } = useCart();
  
  useEffect(() => {
    const allCategory = { id: 'all', name: 'All' };
    
    if (products.length > 0) {
      const uniqueCategories = Array.from(
        new Set(products.map(product => product.category))
      )
      .filter(Boolean) 
      .map(category => ({
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1)
      }));
      
      setDisplayCategories([allCategory, ...uniqueCategories]);
    } else {
      fetchProducts();
      setDisplayCategories([allCategory]);
    }
  }, [products, fetchProducts]);
  
  useEffect(() => {
    const path = location.pathname.substring(1);
    if (path === '') {
      setActiveCategory('all');
    } else if (!path.includes('/')) {
      setActiveCategory(path);
    }
  }, [location]);

  const handleCartToggle = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);
  
  const handleCloseCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);
  
  const handleCategorySelect = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);
  
  const findCartItem = useCallback((productId: string, attrs: Record<string, string>) => {
    return items.find(item => {
      if (item.product.id !== productId) return false;
      
      return Object.entries(attrs).every(
        ([key, value]) => item.selectedAttributes[key] === value
      );
    });
  }, [items]);
  
  const handleIncreaseQuantity = useCallback((productId: string, selectedAttributes: Record<string, string>) => {
    const item = findCartItem(productId, selectedAttributes);
    if (item) {
      updateQuantity(item, item.quantity + 1);
    }
  }, [findCartItem, updateQuantity]);
  
  const handleDecreaseQuantity = useCallback((productId: string, selectedAttributes: Record<string, string>) => {
    const item = findCartItem(productId, selectedAttributes);
    if (item) {
      if (item.quantity > 1) {
        updateQuantity(item, item.quantity - 1);
      } else {
        removeFromCart(item);
      }
    }
  }, [findCartItem, updateQuantity, removeFromCart]);
  
  const handleViewCart = useCallback(() => {
    navigate('/cart');
    setIsCartOpen(false);
  }, [navigate]);
  
  const handleCheckout = useCallback(() => {
    alert('Proceeding to checkout!');
    setIsCartOpen(false);
  }, []);
  
  const formattedCartItems = useMemo(() => {
    return items.map(item => {
      const availableAttributes = item.product.attributes.map(attr => ({
        name: attr.name,
        type: attr.type,
        items: attr.items.map(attrItem => ({
          id: attrItem.id,
          value: attrItem.value,
          displayValue: attrItem.displayValue
        }))
      }));
      const formattedAttributes = {} as Record<string, { options: string[], selected: string }>;
      Object.entries(item.selectedAttributes).forEach(([key, value]) => {
        const attributeOptions = item.product.attributes
          .find(attr => attr.name === key)?.items
          .map(i => i.id) || [];
          
        formattedAttributes[key] = {
          options: attributeOptions,
          selected: value
        };
      });
      
      return {
        id: item.product.id,
        name: item.product.name,
        brand: item.product.brand,
        price: item.product.prices[0].amount,
        gallery: item.product.gallery,
        quantity: item.quantity,
        attributes: formattedAttributes,
        availableAttributes
      };
    });
  }, [items]);
  useEffect(() => {
    const handleOpenCartOverlay = () => {
      setIsCartOpen(true);
    };
    
    window.addEventListener('openCartOverlay', handleOpenCartOverlay);
    
    return () => {
      window.removeEventListener('openCartOverlay', handleOpenCartOverlay);
    };
  }, []);
  return (
    <header className="header" data-testid="header">
      <nav className="header__nav">
        <div className="header__nav-left">
          <ul className="header__categories">
            {displayCategories.map((category) => (
              <li key={category.id}>
                <Link
                  to={category.id === 'all' ? '/all' : `/${category.id}`}
                  className={`header__category-link ${
                    activeCategory === category.id ? 'header__category-link--active' : ''
                  }`}
                  data-testid={
                    activeCategory === category.id
                      ? 'active-category-link'
                      : 'category-link'
                  }
                  onClick={() => handleCategorySelect(category.id)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="header__nav-center">
          <Link
            to="/"
            className="header__logo"
            data-testid="header-logo"
            onClick={() => handleCategorySelect('all')}
          >
            {logoText}
          </Link>
        </div>

        <div className="header__nav-right">
          <button
            className="header__cart-btn"
            onClick={handleCartToggle}
            data-testid="cart-btn"
            aria-label="Shopping cart"
          >
            <ShoppingCartIcon />
            {totalItems > 0 && (
              <span className="header__cart-count" aria-label={`${totalItems} items in cart`}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>
      
      <CartOverlay
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        cartItems={formattedCartItems}
        onIncreaseQuantity={handleIncreaseQuantity}
        onDecreaseQuantity={handleDecreaseQuantity}
        onViewCart={handleViewCart}
        onCheckout={handleCheckout}
      />
    </header>
  );
};

export default React.memo(Header);