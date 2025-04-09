import { useEffect } from 'react';
import { useProductData } from '../context/ProductDataContext';

export function useProduct(productId: string | undefined) {
  const { 
    fetchProduct, 
    clearProduct, 
    product, 
    loading, 
    error 
  } = useProductData();
  
  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
    
    // Clean up on unmount
    return () => {
      clearProduct();
    };
  }, [productId, fetchProduct, clearProduct]);
  
  return { product, loading, error };
}