import React from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '../icons/ShoppingCartIcon';
import { Product } from '../../context/types/productTypes';
import './ProductCard.scss';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const productImage = product.gallery && product.gallery.length > 0 
    ? product.gallery[0] 
    : '/placeholder-image.jpg';
  
  const getPrice = () => {
    if (product.prices && product.prices.length > 0) {
      return product.prices[0].amount;
    }
    return 0;
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
    
    console.log('Product being added:', product);
    
    const productToAdd = {
      ...product,
      attributes: product.attributes.map(attr => ({
        ...attr,
        selected: attr.items ? attr.items[0]?.id : 'default'
      }))
    };
    
    onAddToCart(productToAdd);
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