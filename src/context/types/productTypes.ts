import { ErrorDetails } from '../../utils/errorHandlers';


export interface Price {
    currency: {
      symbol: string;
      label: string;
    };
    amount: number;
  }
  
  export interface AttributeItem {
    id: string;
    displayValue: string;
    value: string;
  }
  
  export interface ProductAttribute {
    id: string;
    name: string;
    type: 'text' | 'swatch';
    items: AttributeItem[];
  }
  
  export interface Product {
    id: string;
    name: string;
    brand: string;
    inStock: boolean;
    gallery: string[];
    description: string;
    attributes: ProductAttribute[];
    prices: Price[];
    category: string;
  }
  export interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
  }

  export interface ProductsResponse {
    products: Product[];
    errors?: GraphQLError[]; 
  }
  
  export interface ProductResponse {
    product: Product;
    errors?: GraphQLError[]; 
  }
  
  export interface CategoriesResponse {
    categories: {
      name: string;
    }[];
  }
  export interface ProductDataContextType {
    loading: boolean;
    error: Error | null;
    errorDetails: ErrorDetails | null; 
    product: Product | null;
    products: Product[];
    categories: string[];
    fetchProduct: (id: string) => Promise<void>;
    fetchProducts: (category?: string) => Promise<void>;
    clearProduct: () => void;
  }
  
interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
  extensions?: Record<string, any>;
}
