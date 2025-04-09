export const GET_PRODUCT = `
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      brand
      inStock
      gallery
      description
      category
      attributes {
        id
        name
        type
        items {
          id
          displayValue
          value
        }
      }
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

export const GET_PRODUCTS = `
  query GetProducts {
    products {
      id
      name
      brand
      inStock
      gallery
      category
      attributes {
        name
        type
        items {
          id
          displayValue
          value
        }
      }
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
export const GET_CATEGORIES = `
  query GetCategories {
    categories {
      name
    }
  }
`;