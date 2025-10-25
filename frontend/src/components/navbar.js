import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import api from "./api";
import { AuthContext } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import "./first.css"; // Import CSS for navbar styles

// Debounce utility function
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [latestCoupon, setLatestCoupon] = useState(null);

  // 🔹 Enhanced search states with fashion-specific suggestions
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  // Fashion-specific search suggestions
  const fashionSuggestions = [
    { name: 'Mens Shirt', category: 'Clothing', icon: '👔', route: '/categories/Clothing' },
    { name: 'Mens Jeans', category: 'Clothing', icon: '👖', route: '/categories/Clothing' },
    { name: 'Womens Dress', category: 'Clothing', icon: '👗', route: '/categories/Clothing' },
    { name: 'T-Shirt', category: 'Clothing', icon: '👕', route: '/categories/Clothing' },
    { name: 'Jacket', category: 'Clothing', icon: '🧥', route: '/categories/Clothing' },
    { name: 'Mens Shoes', category: 'Footwear', icon: '👞', route: '/categories/Footwear' },
    { name: 'Womens Shoes', category: 'Footwear', icon: '👠', route: '/categories/Footwear' },
    { name: 'Sneakers', category: 'Footwear', icon: '👟', route: '/categories/Footwear' },
    { name: 'Handbag', category: 'Bags', icon: '👜', route: '/categories/Bags' },
    { name: 'Backpack', category: 'Bags', icon: '🎒', route: '/categories/Bags' },
    { name: 'Skincare', category: 'Beauty', icon: '🧴', route: '/categories/Cosmetic' },
    { name: 'Makeup', category: 'Beauty', icon: '💄', route: '/categories/Cosmetic' },
  ];

  const [cats, setCats] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  const profileWrapperRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  // Fetch categories from backend
  useEffect(() => {
    api
      .get("/api/categories")
      .then((res) => setCats(res.data || []))
      .catch((err) => console.error("Cannot fetch categories", err));
  }, []);

  // Fetch latest coupon for top banner
  useEffect(() => {
    const fetchLatestCoupon = async () => {
      try {
        const response = await api.get("/api/coupons");
        if (response.data && response.data.length > 0) {
          // Get the most recent active coupon
          const activeCoupons = response.data.filter(coupon => coupon.status === 'Active');
          if (activeCoupons.length > 0) {
            // Sort by creation date and get the latest one
            const latest = activeCoupons.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
            setLatestCoupon(latest);
          }
        }
      } catch (error) {
        console.error("Error fetching latest coupon:", error);
        // Set default message if API fails
        setLatestCoupon({
          code: "WELCOME25",
          discountType: "percentage",
          discount: 20,
          title: "Get 20% Off On Your First Order"
        });
      }
    };

    fetchLatestCoupon();
  }, []);

  // Outside click handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileWrapperRef.current &&
        !profileWrapperRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
      // Close search suggestions when clicking outside
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = () => {
    logout(); // Use AuthContext logout function
    setShowProfile(false);
  };

  // Simple search function without API calls
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSearch(true);
    
    if (value.trim().length > 0) {
      const filtered = fashionSuggestions.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.category.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
    } else {
      setSuggestions(fashionSuggestions.slice(0, 6));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery("");
    setSuggestions([]);
    setShowSearch(false);
    // Direct navigation to category page
    navigate(suggestion.route);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      // Show all relevant suggestions instead of navigating
      const filtered = fashionSuggestions.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSearch(true);
    }
  };

  // Generate dynamic banner message based on latest coupon
  const getBannerMessage = () => {
    if (!latestCoupon) {
      return "Get Amazing Deals on Fashion!";
    }

    const { discountType, discount, code, title, minPurchase } = latestCoupon;
    
    // If coupon has a custom title, use it
    if (title && !title.includes('Off')) {
      return title;
    }

    // Generate message based on discount type
    if (discountType === 'percentage') {
      const minText = minPurchase > 0 ? ` on orders above ₹${minPurchase}` : '';
      return `Get ${discount}% Off${minText} | Use Code: ${code}`;
    } else if (discountType === 'flat') {
      const minText = minPurchase > 0 ? ` on orders above ₹${minPurchase}` : '';
      return `Get ₹${discount} Off${minText} | Use Code: ${code}`;
    }
    
    return `Special Offer Available | Use Code: ${code}`;
  };

  return (
    <div className="fashion-hub">
      <div className="top-banner">{getBannerMessage()}</div>

      <nav className="navbar">
        {/* Left Links */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>

          {/* Categories Dropdown */}
          <div className="dropdown" ref={dropdownRef}>
            <Link
              to="#"
              className="flex items-center gap-1"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(!isOpen);
              }}
            >
              Categories
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ease-in-out ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </Link>

            {isOpen && (
              <div className="dropdown-menu flex flex-col mt-2 bg-white shadow-lg rounded-md p-2">
                {cats.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/categories/${encodeURIComponent(cat.name)}`}
                    className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/faq">FAQ</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/helpcenter">Contact</Link>
        </div>

        {/* Logo */}
        <Link to="/" className="logo" style={{textDecoration: 'none', color: 'inherit'}}>
          FASHION HUB
        </Link>

        {/* Right Icons */}
        <div className="profile-wrapper" ref={profileWrapperRef}>
          <div className="nav-icons">
            <div className="nav-right" ref={searchRef}>
              {/* 🔹 Search Input */}
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={query}
                  onChange={handleInputChange}
                  onFocus={() => {
                    setShowSearch(true);
                    if (suggestions.length === 0) {
                      setSuggestions(fashionSuggestions.slice(0, 6));
                    }
                  }}
                  className={`search-bar ${showSearch ? "active" : ""}`}
                />
              </form>
              <img
                src="/img/search.png"
                alt="Search"
                className="icon"
                onClick={() => {
                  const newShowSearch = !showSearch;
                  setShowSearch(newShowSearch);
                  if (newShowSearch) {
                    setSuggestions(fashionSuggestions.slice(0, 6));
                    // Focus the search input after a small delay
                    setTimeout(() => {
                      const searchInput = document.querySelector('.search-bar');
                      if (searchInput) {
                        searchInput.focus();
                      }
                    }, 100);
                  } else {
                    setSuggestions([]);
                  }
                }}
              />
              
              {/* 🔹 Fashion Search Suggestions */}
              {(suggestions.length > 0 || showSearch) && (
                <div className="suggestions-dropdown">
                  {suggestions.length > 0 ? suggestions.map((item, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      <div className="suggestion-icon">
                        {item.icon}
                      </div>
                      <div className="suggestion-content">
                        <div className="suggestion-title">
                          {item.name}
                        </div>
                        <div className="suggestion-desc">
                          {item.category} Collection
                        </div>
                      </div>
                      <div className="suggestion-arrow">→</div>
                    </div>
                  )) : showSearch && (
                    <div className="suggestion-item">
                      <div className="suggestion-content">
                        <div className="suggestion-title">
                          Start typing to see suggestions...
                        </div>
                      </div>
                    </div>
                  )}
                  {query.trim().length > 0 && suggestions.length > 0 && (
                    <div className="suggestion-footer">
                      <div onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}>  
                        View all results for "{query}" →
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>            <Link to="/cart">
              <img src="/img/cart.png" alt="Cart" className="icon" />
            </Link>

            <Link to="/wishlist">
              <img src="/img/heart.png" alt="Wishlist" className="icon" />
            </Link>

            {/* Profile Menu */}
            <img
              src="/img/person.png"
              alt="User"
              className="icon"
              onClick={() => setShowProfile(!showProfile)}
            />

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="profile-menu">
                {!user ? (
                  <div className="profile-header">
                    <p>Welcome</p>
                    <span>To access account and manage orders</span>
                    <hr />
                    <button className="login-btn" onClick={() => setShowLogin(true)}>
                      Login / Signup
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="profile-header">
                      <p>Welcome</p>
                      <span style={{ fontWeight: "bold" }}>{user.name}</span>
                      <br />
                      <span style={{ color: "#555" }}>{user.contactNumber}</span>
                    </div>
                    <hr />
                  </>
                )}

                {/* Menu Items */}
                <ul>
                  <li>
                    <span className="menu-icon" style={{fontSize: '20px'}}>📦</span>
                    <Link to="/order-details" className="text">Order Details</Link>
                  </li>
                  <li>
                    <span className="menu-icon" style={{fontSize: '20px'}}>📍</span>
                    <Link to="/saved-address" className="text">Saved Addresses</Link>
                  </li>
                  <li>
                    <span className="menu-icon" style={{fontSize: '20px'}}>💳</span>
                    <Link to="/save-card" className="text">Save Cards & UPI</Link>
                  </li>
                  <li>
                    <span className="menu-icon" style={{fontSize: '20px'}}>🎫</span>
                    <Link to="/coupons" className="text">Coupons</Link>
                  </li>
                  <li>
                    <span className="menu-icon" style={{fontSize: '20px'}}>❓</span>
                    <Link to="/helpcenter" className="text">Help Center</Link>
                  </li>
                  <li>
                    <span className="menu-icon" style={{fontSize: '20px'}}>✏️</span>
                    <Link to="/editprofile" className="text">Edit Profile</Link>
                  </li>
                </ul>

                {user && (
                  <>
                    <hr />
                    <ul>
                      <li>
                        <span className="menu-icon" style={{fontSize: '20px'}}>→</span>
                        <span className="text" style={{cursor:'pointer'}} onClick={handleLogout}>
                          Logout
                        </span>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

   
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default Navbar;
