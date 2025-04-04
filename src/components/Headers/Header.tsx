import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '../icons/ShoppingCartIcon';
import './Header.scss';

interface Category {
  id: string;
  name: string;
}

const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories: Category[] = [
    { id: 'all', name: 'All' },
    { id: 'clothes', name: 'Clothes' },
    { id: 'tech', name: 'Tech' },
  ];

  return (
    <header className="header" data-testid="header">
      <nav className="header__nav">
        {/* Category Navigation (Left) */}
        <div className="header__nav-left">
          <ul className="header__categories">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/${category.id}`}
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

        {/* Logo (Center) */}
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

        {/* Cart Button (Right) */}
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