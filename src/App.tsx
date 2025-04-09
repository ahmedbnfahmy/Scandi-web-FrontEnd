import './App.css'
import Header from './components/Headers'
import { Routes, Route } from 'react-router-dom'
import ProductListingPage from './components/ProductListingPage/ProductListingPage'
import ProductDetailsPage from './components/ProductDetailsPage/ProductDetailsPage'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProductListingPage />} />
        <Route path="/:categoryId" element={<ProductListingPage />} />
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
      </Routes>
    </>
  )
}

export default App