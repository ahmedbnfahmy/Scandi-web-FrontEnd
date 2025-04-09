// Basic query to get all categories
export const GET_ALL_CATEGORIES = `
  query GetAllCategories {
    categories {
      name
      id
    }
  }
`;

// Get categories with product count
export const GET_CATEGORIES_WITH_PRODUCT_COUNT = `
  query GetCategoriesWithProductCount {
    categories {
      name
      id
      productCount
    }
  }
`;

// Get a single category with details
export const GET_CATEGORY_DETAILS = `
  query GetCategoryDetails($id: String!) {
    category(id: $id) {
      id
      name
      description
      image
    }
  }
`;

// Get category with featured products
export const GET_CATEGORY_WITH_PRODUCTS = `
  query GetCategoryWithProducts($id: String!, $limit: Int) {
    category(id: $id) {
      id
      name
      products(limit: $limit) {
        id
        name
        brand
        inStock
        gallery
        prices {
          currency {
            symbol
            label
          }
          amount
        }
      }
    }
  }
`;

// Get nested categories (if your schema supports subcategories)
export const GET_NESTED_CATEGORIES = `
  query GetNestedCategories {
    categories {
      id
      name
      parentId
      subcategories {
        id
        name
      }
    }
  }
`;

// Get products filtered by multiple categories
export const GET_PRODUCTS_BY_CATEGORIES = `
  query GetProductsByCategories($categoryIds: [String!]) {
    productsByCategories(categoryIds: $categoryIds) {
      id
      name
      brand
      inStock
      gallery
      category
      prices {
        currency {
          symbol
          label
        }
        amount
      }
    }
  }
`;