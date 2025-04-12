import { API_URL, graphqlClient } from '../../utils/graphqlClient';
import { GET_PRODUCT, GET_PRODUCTS } from '../../context/queries/productQueries';
import { Product, ProductResponse, ProductsResponse } from '../../context/types/productTypes';

const handleGraphQLErrors = (response: any, operation: string) => {
  if ('errors' in response && response.errors) {
    const errorMessage = Array.isArray(response.errors) && 
                        response.errors.length > 0 && 
                        response.errors[0]?.message
      ? response.errors[0].message
      : `GraphQL error during ${operation}`;
    throw new Error(errorMessage);
  }
  return response;
};

export const fetchProduct = async (id: string): Promise<Product> => {
  if (!id) {
    throw new Error('Product ID is required');
  }
  
  console.log('Fetching product from:', API_URL);
  const result = await graphqlClient.request<ProductResponse>(GET_PRODUCT, { id });
  
  handleGraphQLErrors(result, 'product fetch');
  
  if (!result || !result.product) {
    throw new Error('Product not found in API response');
  }
  
  return result.product;
};

export const fetchProducts = async (category?: string): Promise<Product[]> => {
  console.log('Fetching products from:', API_URL);
  const response = await graphqlClient.request<ProductsResponse>(GET_PRODUCTS);
  
  if (!response) {
    throw new Error('No response from API');
  }
  
  handleGraphQLErrors(response, 'products fetch');
  
  if (!response.products) {
    throw new Error('No products found in API response');
  }
  
  const products = response.products;
  
  if (!products || !Array.isArray(products)) {
    throw new Error('No products found in API response');
  }
  
  return category && category !== 'all'
    ? products.filter(p => p.category === category)
    : products;
}; 