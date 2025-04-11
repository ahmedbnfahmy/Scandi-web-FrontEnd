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
  }
  
  export interface ProductResponse {
    product: Product;
  }
  
  export interface CategoriesResponse {
    categories: {
      name: string;
    }[];
  }
  
  // Context type
  export interface ProductDataContextType {
    loading: boolean;
    error: Error | null;
    product: Product | null;
    products: Product[];
    categories: string[];
    fetchProduct: (id: string) => Promise<void>;
    fetchProducts: (category?: string) => Promise<void>;
    clearProduct: () => void;  
  }