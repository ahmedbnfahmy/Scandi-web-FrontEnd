import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { API_URL, graphqlClient } from '../utils/graphqlClient.ts';
import { GET_PRODUCT, GET_PRODUCTS } from './queries/productQueries';
import { 
  Product, 
  ProductResponse, 
  ProductsResponse, 
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
  const [categories, ] = useState<string[]>([]);
  const [connectionFailed, setConnectionFailed] = useState(false);
  
  const fetchProduct = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setConnectionFailed(false);
      
      if (!id) {
        throw new Error('Product ID is required');
      }
      
      console.log('Attempting to fetch product from:', API_URL);
      const result = await graphqlClient.request<ProductResponse>(
        GET_PRODUCT,
        { id }
      );
      
      // Handle GraphQL errors
      if ('errors' in result && result.errors) {
        // Safely access errors if they exist
        const errorMessage = Array.isArray(result.errors) && result.errors.length > 0 && result.errors[0]?.message
          ? result.errors[0].message
          : 'GraphQL error fetching product';
        throw new Error(errorMessage);
      }
      
      if (!result || !result.product) {
        throw new Error('Product not found in API response');
      }
      
      setProduct(result.product);
    } catch (err) {
      console.error('Fetch error details:', err);
      
      // Check for different types of errors
      const isConnectionError = 
        err instanceof Error && 
        (err.message.includes('Failed to fetch') || 
         err.message.includes('Network request failed') ||
         err.message.includes('ERR_CONNECTION_REFUSED'));
      
      // Check specifically for server errors (500)
      const isServerError = 
        err instanceof Error && 
        (err.message.includes('500') || 
         err.message.includes('Internal Server Error'));
      
      if (isConnectionError || isServerError) {
        setConnectionFailed(true);
      }
      
      if (isServerError) {
        setError(new Error('The server encountered an error (HTTP 500). Please try again later.'));
      } else if (isConnectionError) {
        setError(new Error('Failed to connect to the GraphQL server. Is it running?'));
      } else {
        setError(err instanceof Error 
          ? err 
          : new Error('Failed to fetch product. Please try again.'));
      }
      
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const clearProduct = useCallback(() => {
    setProduct(null);
  }, []);
  
  const fetchProducts = useCallback(
    async (category?: string) => {
      setLoading(true);
      setError(null);
      setConnectionFailed(false);
  
      try {
        console.log('Attempting to fetch products from:', API_URL);
        const response = await graphqlClient.request<ProductsResponse>(GET_PRODUCTS);
        if (!response) {
          throw new Error('No response from API');
        }
        
        // Handle GraphQL errors
        if ('errors' in response && response.errors) {
          // Safely access errors if they exist
          const errorMessage = Array.isArray(response.errors) && response.errors.length > 0 && response.errors[0]?.message
            ? response.errors[0].message
            : 'GraphQL error fetching products';
          throw new Error(errorMessage);
        }
        
        // Safely access the products
        if (!response.products) {
          throw new Error('No products found in API response');
        }
        
        const products = response.products;
        console.log('Products received:', products);
        
        if (!products || !Array.isArray(products)) {
          throw new Error('No products found in API response');
        }
  
        const filtered = category && category !== 'all'
          ? products.filter(p => p.category === category)
          : products;
  
        setProducts(filtered);
      } catch (err) {
        console.error('Fetch error details:', err);
        
        // Check for different types of errors
        const isConnectionError = 
          err instanceof Error && 
          (err.message.includes('Failed to fetch') || 
           err.message.includes('Network request failed') ||
           err.message.includes('ERR_CONNECTION_REFUSED'));
        
        // Check specifically for server errors (500)
        const isServerError = 
          err instanceof Error && 
          (err.message.includes('500') || 
           err.message.includes('Internal Server Error'));
        
        if (isConnectionError || isServerError) {
          setConnectionFailed(true);
        }
        
        if (isServerError) {
          setError(new Error('The server encountered an error (HTTP 500). Please try again later.'));
        } else if (isConnectionError) {
          setError(new Error('Failed to connect to the GraphQL server. Is it running?'));
        } else {
          setError(err instanceof Error 
            ? err 
            : new Error('Failed to fetch products. Please try again.'));
        }
        
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );
  
  const contextValue = React.useMemo(() => ({
    loading,
    error,
    product,
    products,
    categories,
    connectionFailed,
    fetchProduct,
    fetchProducts,
    clearProduct
  }), [
    loading, 
    error, 
    product, 
    products, 
    categories,
    connectionFailed, 
    fetchProduct, 
    fetchProducts, 
    clearProduct
  ]);

  if (connectionFailed) {
    const isServerError = error?.message.includes('500') || error?.message.includes('Internal Server Error');
    
    return (
      <div className="connection-error" style={{
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
        backgroundColor: isServerError ? '#fff3e0' : '#ffebee', // Orange for server errors, red for connection errors
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginTop: '2rem'
      }}>
        <h2 style={{ color: isServerError ? '#e65100' : '#d32f2f' }}>
          {isServerError ? 'Server Error' : 'Connection Error'}
        </h2>
        <p>
          {isServerError 
            ? 'The server encountered an internal error. Please try again later.' 
            : 'Failed to connect to the GraphQL server. Please check if the server is running.'}
        </p>
        <p style={{ 
          backgroundColor: isServerError ? '#ffe0b2' : '#f8d7da', 
          padding: '0.75rem', 
          borderRadius: '4px',
          fontFamily: 'monospace'
        }}>
          Error details: {error?.message}
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: isServerError ? '#e65100' : '#d32f2f',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem',
            fontWeight: 'bold'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ProductDataContext.Provider value={contextValue}>
      {children}
    </ProductDataContext.Provider>
  );
};