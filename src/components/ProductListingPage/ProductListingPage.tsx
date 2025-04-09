import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
import { useProductData } from '../../context/ProductDataContext';
import { useCart } from '../../context/CartContext';
import './ProductListingPage.scss';

const ProductListingPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  // Use context values directly instead of copying to local state
  const { 
    products, 
    loading, 
    error, 
    fetchProducts 
  } = useProductData();
  
  const { addToCart } = useCart();
  
  const [categories] = useState<string[]>(['all', 'clothes', 'tech', 'accessories']);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryId || null);

  // Fetch products only when component mounts or category changes
  useEffect(() => {
    if (categoryId !== selectedCategory) {
      setSelectedCategory(categoryId || null);
    }
    
    fetchProducts(categoryId);
    // Don't include 'products' in the dependency array
  }, [categoryId, fetchProducts]);
  
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    navigate(`/${category === 'all' ? '' : category}`);
  };
  
  // Handle add to cart
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
        <button onClick={() => fetchProducts(selectedCategory || undefined)}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="product-listing-page">
      {/* Category Navigation */}
      <div className="category-nav">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategorySelect(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Category Title */}
      <h1 className="category-title">
        {selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'All Products'}
      </h1>
      
      {/* Products Grid */}
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