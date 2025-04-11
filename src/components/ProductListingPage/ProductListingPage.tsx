import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
import { useProductData } from '../../context/ProductDataContext';
import { useCart } from '../../context/CartContext';
import './ProductListingPage.scss';

const ProductListingPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const { 
    products, 
    loading, 
    error, 
    fetchProducts 
  } = useProductData();
  
  const { addToCart } = useCart();
  
  useEffect(() => {
    fetchProducts(categoryId);
  }, [categoryId, fetchProducts]);
  
  const handleAddToCart = (product: any) => {
    addToCart(product, {});
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <h2>Error loading products</h2>
        <p>{error.message}</p>
        <button onClick={() => fetchProducts(categoryId)}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="product-listing-page">
      <h1 className="category-title">
        {categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : 'All Products'}
      </h1>
      
      {products.length === 0 ? (
        <div className="no-products">No products found.</div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;