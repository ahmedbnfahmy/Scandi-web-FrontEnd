import React from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '../icons/ShoppingCartIcon';
import './ProductCard.scss';

interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  image: string;
  category: string;
  gallery: string[];
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
            src={product.image}
            alt={product.name}
            className="product-image"
          />
          {!product.inStock && (
            <div className="out-of-stock-label">Out of Stock</div>
          )}
          {product.inStock && (
        <button
          className="quick-shop-btn"
          onClick={handleAddToCart}
          data-testid={`quick-shop-${product.name.toLowerCase().replace(/\s+/g, '-')}`}
          aria-label="Add to cart" // For accessibility
        >
          <ShoppingCartIcon />
        </button>
      )}
        </div>

        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="price">{formatPrice(product.price)}</p>
        </div>
      </Link>

      
    </div>
  );
};

export default ProductCard;