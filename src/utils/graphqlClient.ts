import { GraphQLClient } from 'graphql-request';

const API_URL = import.meta.env.VITE_GRAPHQL_API || 'http://localhost:8000/graphql';

const customFetch = async (url: RequestInfo | URL, options: RequestInit = {}) => {
  const response = await fetch(url, options);
  
  if (response.ok) {
    const text = await response.text();
    const fixedText = text.includes('Database connection successful!')
      ? text.replace('Database connection successful!', '')
      : text;
    
    return new Response(fixedText, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }
  
  return response;
};

export const graphqlClient = new GraphQLClient(API_URL, {
  fetch: customFetch,
});