import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import './ProductDetailsPage.scss';
import { Product } from '../../context/types/productTypes';
import { useProductData } from '../../context/ProductDataContext';
import { useCart } from '../../context/CartContext';

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  
  const { 
    product: contextProduct, 
    loading: contextLoading, 
    error: contextError, 
    fetchProduct 
  } = useProductData();
  
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const triggerCartOpen = () => {
    const event = new CustomEvent('openCartOverlay');
    window.dispatchEvent(event);
  };

  useEffect(() => {
    if (productId && (!contextProduct || contextProduct.id !== productId)) {
      fetchProduct(productId);
    } else if (contextProduct && contextProduct.id === productId) {
      setProduct(contextProduct);
      setLoading(false);
    }
  }, [productId, contextProduct, fetchProduct]);
  
  useEffect(() => {
    if (contextProduct && productId === contextProduct.id) {
      setLoading(contextLoading);
      setProduct(contextProduct);
      
      if (contextError) {
        console.error('Error fetching product:', contextError);
      }
    }
  }, [contextProduct, contextLoading, contextError, productId]);

  useEffect(() => {
    if (product) {
      const initialAttributes: Record<string, string> = {};
      product.attributes.forEach(attr => {
        initialAttributes[attr.name] = '';
      });
      setSelectedAttributes(initialAttributes);
    }
  }, [product]);

  const handleAttributeSelect = (attributeName: string, itemId: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeName]: itemId
    }));
  };

  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex(prev => (prev + 1) % product.gallery.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex(prev => (prev - 1 + product.gallery.length) % product.gallery.length);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const isAllAttributesSelected = () => {
    if (!product) return false;
    
    return product.attributes.every(attr => 
      selectedAttributes[attr.name] && selectedAttributes[attr.name] !== ''
    );
  };

  const canAddToCart = () => {
    if (!product) return false;
    
    if (!product.inStock) return false;
    
    return product.attributes.every(attr => 
      selectedAttributes[attr.name] && selectedAttributes[attr.name] !== ''
    );
  };

  const handleAddToCart = () => {
    if (!product || !canAddToCart()) return;
    addToCart(product, selectedAttributes);
    triggerCartOpen();
  };

  if (loading) {
    return <div className="pdp-loading">Loading product details...</div>;
  }

  if (!product) {
    return <div className="pdp-error">Product not found.</div>;
  }

  return (
    <div className="product-details-page">
      {/* Product Gallery */}
      <div className="pdp-gallery" data-testid="product-gallery">
        <div className="pdp-gallery-thumbnails">
          {product.gallery.map((image, index) => (
            <div 
              key={index} 
              className={`pdp-gallery-thumbnail ${currentImageIndex === index ? 'active' : ''}`}
              onClick={() => handleImageSelect(index)}
            >
              <img src={image} alt={`${product.name} - view ${index + 1}`} />
            </div>
          ))}
        </div>
        
        <div className="pdp-gallery-main">
          <button className="pdp-gallery-arrow pdp-gallery-prev" onClick={prevImage}>
            &#10094;
          </button>
          <img 
            src={product.gallery[currentImageIndex]} 
            alt={product.name} 
            className="pdp-gallery-image"
          />
          <button className="pdp-gallery-arrow pdp-gallery-next" onClick={nextImage}>
            &#10095;
          </button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="pdp-info">
        <h1 className="pdp-title">{product.brand}</h1>
        <h2 className="pdp-subtitle">{product.name}</h2>
        
        {!product.inStock && (
          <div className="pdp-out-of-stock-notice">
            This product is currently out of stock
          </div>
        )}
        
        {product.attributes.map(attribute => (
          <div 
            key={attribute.name}
            className="pdp-attribute"
            data-testid={`product-attribute-${attribute.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <h3 className="pdp-attribute-name">{attribute.name}:</h3>
            <div className={`pdp-attribute-values pdp-attribute-${attribute.type}`}>
              {attribute.items.map(item => (
                <button
                  key={item.id}
                  className={`
                    pdp-attribute-button 
                    pdp-attribute-${attribute.type} 
                    ${selectedAttributes[attribute.name] === item.id ? 'selected' : ''}
                  `}
                  data-testid={`product-attribute-${attribute.name.toLowerCase().replace(/\s+/g, '-')}-${item.value}`}
                  style={
                    attribute.type === 'swatch' 
                      ? { backgroundColor: item.value } 
                      : undefined
                  }
                  onClick={() => handleAttributeSelect(attribute.name, item.id)}
                >
                  {attribute.type === 'text' ? item.displayValue : ''}
                </button>
              ))}
            </div>
          </div>
        ))}
        
        {/* Price */}
        <div className="pdp-price">
          <h3 className="pdp-price-label">PRICE:</h3>
          <p className="pdp-price-value">
            {formatPrice(product.prices[0].amount)}
          </p>
        </div>
        
        {/* Add to Cart Button */}
        <button
          className={`pdp-add-to-cart ${!canAddToCart() ? 'disabled' : ''}`}
          disabled={!canAddToCart()}
          onClick={handleAddToCart}
          data-testid="add-to-cart"
        >
          {!product.inStock ? 'OUT OF STOCK' : 
           !isAllAttributesSelected() ? 'SELECT OPTIONS' : 
           'ADD TO CART'}
        </button>
        
        {/* Product Description */}
        <div className="pdp-description" data-testid="product-description">
          {parse(product.description)}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductDetailsPage);