import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';
import './blog.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  // Fashion categories data
  const fashionCategories = [
    { name: 'Clothing', items: ['Mens Shirt', 'Womens Dress', 'T-Shirt', 'Jeans', 'Jacket'], route: '/categories/Clothing' },
    { name: 'Footwear', items: ['Sneakers', 'Formal Shoes', 'Boots', 'Sandals'], route: '/categories/Footwear' },
    { name: 'Bags', items: ['Handbag', 'Backpack', 'Wallet', 'Travel Bag'], route: '/categories/Bags' },
    { name: 'Beauty', items: ['Skincare', 'Makeup', 'Perfume', 'Hair Care'], route: '/categories/Cosmetic' }
  ];

  // Filter categories based on search query
  const getFilteredResults = () => {
    if (!query) return [];
    
    const results = [];
    fashionCategories.forEach(category => {
      category.items.forEach(item => {
        if (item.toLowerCase().includes(query.toLowerCase()) || 
            category.name.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            name: item,
            category: category.name,
            route: category.route
          });
        }
      });
    });
    return results;
  };

  const filteredResults = getFilteredResults();

  return (
    <>
      <Navbar />
      <div className="search-results-page">
        <div className="search-container">
          <div className="search-header">
            <h1>Search Results</h1>
            <p>
              {query ? (
                <>
                  Results for: <strong>"{query}"</strong>
                  <span> ({filteredResults.length} found)</span>
                </>
              ) : (
                'No search query provided'
              )}
            </p>
          </div>

          {filteredResults.length === 0 ? (
            <div className="search-no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No results found</h3>
              <p>Try different keywords or browse our categories</p>
              <div className="search-suggestions">
                <h4>Popular Categories:</h4>
                <div className="category-grid">
                  {fashionCategories.map((category, index) => (
                    <Link key={index} to={category.route} className="category-card">
                      <h5>{category.name}</h5>
                      <p>{category.items.slice(0, 2).join(', ')}...</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="search-results">
              <div className="result-grid">
                {filteredResults.map((item, index) => (
                  <Link key={index} to={item.route} className="result-card">
                    <div className="result-icon">
                      {item.category === 'Clothing' && '👕'}
                      {item.category === 'Footwear' && '👟'}
                      {item.category === 'Bags' && '👜'}
                      {item.category === 'Beauty' && '💄'}
                    </div>
                    <div className="result-info">
                      <h3>{item.name}</h3>
                      <p>{item.category} Collection</p>
                    </div>
                    <div className="result-arrow">→</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;