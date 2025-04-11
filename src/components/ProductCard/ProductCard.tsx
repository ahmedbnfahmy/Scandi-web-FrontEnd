import React from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '../icons/ShoppingCartIcon';
import './ProductCard.scss';

interface Product {
  id: string;
  name: string;
  price?: number; // Make optional since API might not provide directly
  inStock: boolean;
  image?: string; // Make optional since we'll use gallery instead
  category: string;
  gallery?: string[]; // Make sure gallery is included
  prices?: Array<{ // Add prices from API
    currency: {
      symbol: string;
      label: string;
    };
    amount: number;
  }>;
  attributes: {
    [key: string]: {
      options: string[];
      selected: string;
    };
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const productImage = product.gallery && product.gallery.length > 0 
    ? product.gallery[0] 
    : product.image || '/placeholder-image.jpg';
  
  // Get price from API prices array or fallback to direct price property
  const getPrice = () => {
    if (product.prices && product.prices.length > 0) {
      return product.prices[0].amount;
    }
    return product.price || 0;
  };
  
  // Get currency symbol from API prices or default to $
  const getCurrencySymbol = () => {
    if (product.prices && product.prices.length > 0) {
      return product.prices[0].currency.symbol;
    }
    return '$';
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart({
      ...product,
      attributes: Object.fromEntries(
        Object.entries(product.attributes).map(([key, val]) => [
          key,
          { ...val, selected: val.options[0] }
        ])
      )
    });
  };
  
  // For debugging purposes
  console.log(`Product ${product.name} image:`, productImage);

  return (
    <div
      className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}
      data-testid={`product-${product.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <Link
        to={`/product/${product.id}`}
        className="product-link"
        state={{ fromCategory: product.category }}
      >
        <div className="image-container">
          <img
            src={productImage}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              console.error(`Failed to load image for ${product.name}`);
              e.currentTarget.src = '/placeholder-image.jpg';
            }}
          />
          {!product.inStock && (
            <div className="out-of-stock-label">Out of Stock</div>
          )}
          {product.inStock && (
            <button
              className="quick-shop-btn"
              onClick={handleAddToCart}
              data-testid={`quick-shop-${product.name.toLowerCase().replace(/\s+/g, '-')}`}
              aria-label="Add to cart" 
            >
              <ShoppingCartIcon />
            </button>
          )}
        </div>

        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="price">
            {formatPrice(getPrice())}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;