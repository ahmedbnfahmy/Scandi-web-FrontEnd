import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { graphqlClient } from '../utils/graphqlClient.ts';
import { GET_PRODUCT, GET_PRODUCTS, GET_CATEGORIES } from './queries/productQueries';
import { 
  Product, 
  ProductResponse, 
  ProductsResponse, 
  CategoriesResponse,
  ProductDataContextType
} from './types/productTypes';

// Create context with an undefined initial value
const ProductDataContext = createContext<ProductDataContextType | undefined>(undefined);

export const useProductData = (): ProductDataContextType => {
  const context = useContext(ProductDataContext);
  if (!context) {
    throw new Error('useProductData must be used within a ProductDataProvider');
  }
  return context;
};

interface ProductDataProviderProps {
  children: ReactNode;
}

export const ProductDataProvider: React.FC<ProductDataProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  const fetchProduct = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!id) {
        throw new Error('Product ID is required');
      }
      
      const result = await graphqlClient.request<ProductResponse>(
        GET_PRODUCT,
        { id }
      );
      
      if (!result || !result.product) {
        throw new Error('Product not found in API response');
      }
      
      setProduct(result.product);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch product'));
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Clear the current product
  const clearProduct = useCallback(() => {
    setProduct(null);
  }, []);
  
  // Fetch products, optionally filtered by category
  const fetchProducts = useCallback(async (category?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await graphqlClient.request<ProductsResponse>(GET_PRODUCTS);
      
      if (!result || !result.products) {
        throw new Error('No products found in API response');
      }
      
      let filteredProducts = result.products;
      
      if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(
          product => product.category === category
        );
      }
      
      setProducts(filteredProducts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const contextValue = React.useMemo(() => ({
    loading,
    error,
    product,
    products,
    categories,
    fetchProduct,
    fetchProducts,
    clearProduct
  }), [
    loading, 
    error, 
    product, 
    products, 
    categories, 
    fetchProduct, 
    fetchProducts, 
    clearProduct
  ]);

  return (
    <ProductDataContext.Provider value={contextValue}>
      {children}
    </ProductDataContext.Provider>
  );
};