import { GraphQLClient } from 'graphql-request';

export const API_URL = import.meta.env.VITE_GRAPHQL_API || 'http://localhost:8000/graphql';

export const graphqlClient = new GraphQLClient(API_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
});
console.log(graphqlClient)
