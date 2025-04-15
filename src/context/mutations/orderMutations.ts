export const CREATE_ORDER = `
  mutation CreateOrder($input: OrderInput!) {
    createOrder(input: $input) {
      totalAmount
      createdAt
      items {
        productId
        quantity
        selectedAttributes {
          attributeName
          attributeItemId
          displayValue
        }
      }
    }
  }
`;