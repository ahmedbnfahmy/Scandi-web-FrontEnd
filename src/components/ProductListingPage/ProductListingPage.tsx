import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
import './ProductListingPage.scss';

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

interface Category {
  id: string;
  name: string;
}

const ProductListingPage: React.FC = () => {
  const { categoryId = 'all' } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch for categories (should match your header categories)
    const fetchCategories = async () => {
      const mockCategories: Category[] = [
        { id: 'all', name: 'All' },
        { id: 'clothes', name: 'Clothes' },
        { id: 'tech', name: 'Tech' },
        { id: 'furniture', name: 'Furniture' }
      ];
      setCategories(mockCategories);
    };

    const fetchProducts = async () => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Black T-Shirt',
          price: 29.99,
          inStock: true,
          image: '/black-tshirt.jpg',
          gallery: ['/black-tshirt.jpg', '/black-tshirt-2.jpg'],
          category: 'clothes',
          attributes: {
            size: { options: ['S', 'M', 'L'], selected: 'M' },
            color: { options: ['black', 'white'], selected: 'black' }
          }
        },
        {
          id: '2',
          name: 'Wireless Headphones',
          price: 199.99,
          inStock: false,
          image: '/headphones.jpg',
          gallery: ['/headphones.jpg', '/headphones-2.jpg'],
          category: 'tech',
          attributes: {
            color: { options: ['black', 'silver'], selected: 'black' }
          }
        },
        {
          id: '3',
          name: 'Lap Top',
          price: 199.99,
          inStock: false,
          image: '/headphoness.jpg',
          gallery: ['/headphones.jpg', '/headphones-2.jpg'],
          category: 'tech',
          attributes: {
            color: { options: ['black', 'silver'], selected: 'black' }
          }
        },
        
      ];
      setProducts(mockProducts);
      setIsLoading(false);
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const filteredProducts = categoryId === 'all'
    ? products
    : products.filter(product => product.category === categoryId);

  const currentCategory = categories.find(cat => cat.id === categoryId) || { name: 'All Products' };

  const addToCart = (product: Product) => {
    // Add product with default attributes to cart
    const productToAdd = {
      ...product,
      attributes: Object.fromEntries(
        Object.entries(product.attributes).map(([key, val]) => [
          key,
          { ...val, selected: val.options[0] }
        ])
      ),
      quantity: 1
    };
    console.log('Added to cart:', productToAdd);
    // Implement your actual cart state management here
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="product-listing-page">
      <h1 className="category-title">{currentCategory.name}</h1>
      
      <div className="product-grid">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductListingPage;