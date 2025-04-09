import './App.css'
import Header from './components/Headers'
import { Routes, Route } from 'react-router-dom'
import ProductListingPage from './components/ProductListingPage/ProductListingPage'
import ProductDetailsPage from './components/ProductDetailsPage/ProductDetailsPage'
import { ProductDataProvider } from './context/ProductDataContext'
import { CartProvider } from '../src/context/CartContext'

function App() {
  return (
    <ProductDataProvider>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/:categoryId" element={<ProductListingPage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
        </Routes>
      </CartProvider>
    </ProductDataProvider>
  )
}

export default App