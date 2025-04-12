export const CREATE_ORDER = `
  mutation CreateOrder($items: [OrderItemInput!]!, $totalAmount: Float!) {
    createOrder(input: {
      items: $items,
      totalAmount: $totalAmount
    }) {
      id
      items {
        productId
        quantity
        selectedAttributes
      }
      totalAmount
      createdAt
    }
  }
`;