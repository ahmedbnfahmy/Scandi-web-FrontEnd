import { GraphQLClient, ClientError } from 'graphql-request';

export const API_URL = import.meta.env.VITE_GRAPHQL_API;

export const graphqlClient = new GraphQLClient(API_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export const executeRequest = async <T = any>(
  query: string, 
  variables: Record<string, any> = {}
): Promise<{ data: T | null; error: { message: string; originalError: unknown } | null }> => {
  try {
    const response = await graphqlClient.request<T>(query, variables);
    return { data: response, error: null };
  } catch (error: unknown) {
    console.error('GraphQL request failed:', error);
    
    let errorMessage = 'Failed to connect to server';
    
    if (error instanceof ClientError) {
      if (error.response?.errors && error.response.errors.length > 0) {
        errorMessage = 'Server error: ' + (error.response.errors[0]?.message || 'Unknown error');
      } 
      // HTTP errors
      else if (error.response) {
        errorMessage = `HTTP error ${error.response.status || ''}: ${error.response.statusText || 'Unknown error'}`;
      }
    } 
    else if (error instanceof Error) {
      if (error.message.includes('Network') || error.message.includes('connection')) {
        errorMessage = 'Network error: Please check your connection';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
    }
    
    return { 
      data: null, 
      error: { 
        message: errorMessage, 
        originalError: error
      } 
    };
  }
};

