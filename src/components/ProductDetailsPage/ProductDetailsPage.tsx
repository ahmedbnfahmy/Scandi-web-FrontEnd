import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import parse from 'html-react-parser';
import './ProductDetailsPage.scss';

// Types
interface Attribute {
  name: string;
  type: 'text' | 'swatch';
  items: Array<{
    id: string;
    value: string;
    displayValue: string;
  }>;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  inStock: boolean;
  gallery: string[];
  description: string;
  attributes: Attribute[];
  prices: Array<{
    currency: {
      symbol: string;
      label: string;
    };
    amount: number;
  }>;
}

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // This is a mock fetch - replace with your actual API call
        setTimeout(() => {
          const mockProduct: Product = {
            id: '1',
            name: 'Apollo Running Short',
            brand: 'Nike',
            inStock: true,
            gallery: [
              '/product-image-1.jpg',
              '/product-image-2.jpg',
              '/product-image-3.jpg',
              '/product-image-4.jpg'
            ],
            description: '<p>Find stunning women\'s cocktail dresses and party dresses. Stand out in lace and metallic cocktail dresses and party dresses from all your favorite brands.</p>',
            attributes: [
              {
                name: 'Size',
                type: 'text',
                items: [
                  { id: 'xs', value: 'XS', displayValue: 'XS' },
                  { id: 's', value: 'S', displayValue: 'S' },
                  { id: 'm', value: 'M', displayValue: 'M' },
                  { id: 'l', value: 'L', displayValue: 'L' }
                ]
              },
              {
                name: 'Color',
                type: 'swatch',
                items: [
                  { id: 'black', value: '#000000', displayValue: 'Black' },
                  { id: 'white', value: '#FFFFFF', displayValue: 'White' },
                  { id: 'green', value: '#0F6450', displayValue: 'Green' }
                ]
              }
            ],
            prices: [
              {
                currency: { symbol: '$', label: 'USD' },
                amount: 50.00
              }
            ]
          };
          
          setProduct(mockProduct);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Initialize selected attributes
  useEffect(() => {
    if (product) {
      const initialAttributes: Record<string, string> = {};
      product.attributes.forEach(attr => {
        // Don't set initial values to allow user selection
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

  const handleAddToCart = () => {
    if (!product || !isAllAttributesSelected()) return;
    
    const productToAdd = {
      ...product,
      selectedAttributes,
      quantity: 1
    };
    
    console.log('Added to cart:', productToAdd);
    // Here you would dispatch to your cart state management
    // For example: dispatch(addToCart(productToAdd));
    
    // Open cart overlay
    // For example: dispatch(openCartOverlay());
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
        
        {/* Product Attributes */}
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
          className={`pdp-add-to-cart ${!isAllAttributesSelected() ? 'disabled' : ''}`}
          disabled={!isAllAttributesSelected()}
          onClick={handleAddToCart}
          data-testid="add-to-cart"
        >
          ADD TO CART
        </button>
        
        {/* Product Description */}
        {/* <div className="pdp-description" data-testid="product-description">
          {parse(product.description)}
        </div> */}
      </div>
    </div>
  );
};

export default ProductDetailsPage;