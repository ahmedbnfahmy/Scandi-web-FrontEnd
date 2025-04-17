import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, ProductDataContextType } from './types/productTypes';
import ErrorDisplay from '../components/ErrorDisplay/ErrorDisplay';
import { analyzeError, ErrorDetails } from '../utils/errorHandlers';
import * as productService from '../services/api/productService';

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
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, ] = useState<string[]>([]);
  
  const handleError = useCallback((err: any) => {
    console.error('Fetch error details:', err);
    const details = analyzeError(err);
    setErrorDetails(details);
    return details;
  }, []);
  
  const fetchProduct = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setErrorDetails(null);
      
      const result = await productService.fetchProduct(id);
      setProduct(result);
    } catch (err) {
      handleError(err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [handleError]);
  
  const clearProduct = useCallback(() => {
    setProduct(null);
  }, []);
  
  const fetchProducts = useCallback(
    async (category?: string) => {
      try {
        setLoading(true);
        setErrorDetails(null);
        
        const result = await productService.fetchProducts(category);
        setProducts(result);
      } catch (err) {
        handleError(err);
        
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );
  
  const contextValue = React.useMemo(() => ({
    loading,
    error: errorDetails?.originalError || null,
    errorDetails,
    product,
    products,
    categories,
    fetchProduct,
    fetchProducts,
    clearProduct
  }), [
    loading, 
    errorDetails, 
    product, 
    products, 
    categories, 
    fetchProduct, 
    fetchProducts, 
    clearProduct
  ]);

  
  if (errorDetails && errorDetails.shouldStopRendering) {
    return <ErrorDisplay errorDetails={errorDetails} />;
  }

  return (
    <ProductDataContext.Provider value={contextValue}>
      {children}
    </ProductDataContext.Provider>
  );
};