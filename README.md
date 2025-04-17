# E-Commerce Frontend

## Modern E-Commerce Platform Built with React, Vite, TypeScript, and GraphQL

A fully-featured shopping experience with responsive design, product customization, and seamless cart functionality. Leveraging the power of TypeScript for type safety and GraphQL for efficient data fetching.

## Features

- Product catalog browsing
- Product detail pages with image gallery
- Product attributes selection (color, size, etc.)
- Shopping cart functionality
- Responsive design
- Fast GraphQL data fetching

## Tech Stack

- **React**: UI library for building the component-based interface
- **Vite**: Next generation frontend tooling for fast development and optimized builds
- **GraphQL**: API query language for efficient data fetching
- **TypeScript**: Type safety for more reliable code
- **SCSS**: Advanced styling with variables and mixins

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- Yarn or npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/scandi-web-frontend.git
   cd scandi-web-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your GraphQL endpoint
   ```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:5173/

### Building for Production

```bash
npm run build
# or
yarn build
```

Preview the production build:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── CartOverlay/
│   ├── Headers/
│   ├── ProductCard/
│   ├── ProductDetailsPage/
│   └── ProductListingPage/
├── context/            # React Context for state management
│   ├── CartContext.tsx
│   ├── ProductDataContext.tsx
│   └── types/          # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Features

### Product Listing
- View products by category
- Add products to cart directly from listing page

### Product Details
- View product information and description
- Browse product images gallery
- Select product attributes (size, color, etc.)
- Add products with selected attributes to cart

### Shopping Cart
- View cart contents in an overlay
- Adjust item quantities
- Remove items from cart
- View total price
- Proceed to checkout

## Development Tools

### Comment Removal Tool

This project includes a PHP script to clean up comments before deployment:

```bash
php commentScript.php
```

The script removes all comments from code files while preserving configuration files. See the script's documentation for more details.

## Testing

Run the test suite:

```bash
npm run test
# or
yarn test
```

E2E tests:

```bash
npm run test:e2e
# or
yarn test:e2e
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [GraphQL](https://graphql.org/) for the efficient data fetching architecture
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) communities for their excellent tools
