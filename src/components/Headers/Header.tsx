import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ShoppingCartIcon from '../icons/ShoppingCartIcon';
import { useProductData } from '../../context/ProductDataContext';
import './Header.scss';

interface Category {
  id: string;
  name: string;
}

const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [displayCategories, setDisplayCategories] = useState<Category[]>([]);
  
  const location = useLocation();
  const { products, fetchProducts } = useProductData();
  
  useEffect(() => {
    const allCategory = { id: 'all', name: 'All' };
    
    if (products.length > 0) {
      const uniqueCategories = Array.from(
        new Set(products.map(product => product.category))
      ).map(category => ({
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1)
      }));
      
      setDisplayCategories([allCategory, ...uniqueCategories]);
    } else {
      fetchProducts();
      setDisplayCategories([allCategory]);
    }
  }, [products, fetchProducts]);
  
  useEffect(() => {
    const path = location.pathname.substring(1);
    if (path === '') {
      setActiveCategory('all');
    } else if (path.includes('/')) {
    } else {
      setActiveCategory(path);
    }
  }, [location]);

  return (
    <header className="header" data-testid="header">
      <nav className="header__nav">
        <div className="header__nav-left">
          <ul className="header__categories">
            {displayCategories.map((category) => (
              <li key={category.id}>
                <Link
                  to={category.id === 'all' ? '/' : `/${category.id}`}
                  className={`header__category-link ${
                    activeCategory === category.id ? 'header__category-link--active' : ''
                  }`}
                  data-testid={
                    activeCategory === category.id
                      ? 'active-category-link'
                      : 'category-link'
                  }
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="header__nav-center">
          <Link
            to="/"
            className="header__logo"
            data-testid="header-logo"
            onClick={() => setActiveCategory('all')}
          >
            MyStore
          </Link>
        </div>

        <div className="header__nav-right">
          <button
            className="header__cart-btn"
            onClick={() => setIsCartOpen(!isCartOpen)}
            data-testid="cart-btn"
          >
            <ShoppingCartIcon />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;