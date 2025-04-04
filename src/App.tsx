import './App.css'
import Header from './components/Headers'
import { Routes, Route } from 'react-router-dom'
import ProductListingPage from './components/ProductListingPage/ProductListingPage'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProductListingPage />} />
        <Route path="/:categoryId" element={<ProductListingPage />} />
      </Routes>
    </>
  )
}

export default App