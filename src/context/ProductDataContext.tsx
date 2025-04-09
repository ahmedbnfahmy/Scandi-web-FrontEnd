import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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

// Hook for consuming the context
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
  const [productCache, setProductCache] = useState<{[key: string]: Product}>({});
  
  const fetchProduct = useCallback(async (id: string) => {
    // Check cache first
    if (productCache[id]) {
      setProduct(productCache[id]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching product with ID:", id);
      console.log("Using query:", GET_PRODUCT);
      console.log("GraphQL endpoint:", import.meta.env.VITE_GRAPHQL_API);
      
      // Add additional error handling
      if (!id) {
        throw new Error('Product ID is required');
      }
      
      const result = await graphqlClient.request<ProductResponse>(
        GET_PRODUCT,
        { id }
      );
      
      console.log("API response:", result);
      
      if (!result || !result.product) {
        throw new Error('Product not found in API response');
      }
      
      setProduct(result.product);
      
      // Add to cache
      setProductCache(prev => ({
        ...prev,
        [id]: result.product
      }));
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch product'));
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productCache]);
  // Clear the current product (useful on unmount or transitions)
  const clearProduct = useCallback(() => {
    setProduct(null);
  }, []);
  
  const fetchProducts = useCallback(async (category?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('fetchProducts called with category:', category);
      
      // Check if we already have products in cache for this category
      // This prevents unnecessary API calls
      if (products.length > 0 && !category) {
        console.log('Using cached products (all categories)');
        setLoading(false);
        return;
      }
      
      // Fetch all products
      const result = await graphqlClient.request<ProductsResponse>(GET_PRODUCTS);
      
      if (!result || !result.products) {
        throw new Error('No products found in API response');
      }
      
      // Process all products once (store them for future filtering)
      // This acts as our full product cache
      const allProducts = result.products;
      
      // Store all products in a ref to avoid unnecessary re-renders
      if (JSON.stringify(productCache) !== JSON.stringify({})) {
        // Only update cache if it's empty or significantly different
        const newCache = { ...productCache };
        allProducts.forEach(product => {
          newCache[product.id] = product;
        });
        setProductCache(newCache);
      }
      
      // Filter products by category on the client side if needed
      let filteredProducts = allProducts;
      if (category && category !== 'all') {
        console.log(`Filtering products for category: ${category}`);
        filteredProducts = allProducts.filter(
          product => product.category === category
        );
      }
      
      // Update state with filtered products
      console.log(`Setting ${filteredProducts.length} products in state`);
      setProducts(filteredProducts);
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      console.error('Error fetching products:', err);
      // Set empty products array on error to avoid undefined issues
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [products.length, productCache]);
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
    products.length,
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