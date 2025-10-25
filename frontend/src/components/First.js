import { Link } from "react-router-dom";
import "./first.css";
import Navbar from "./navbar";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "./wishlistContext"; // context se import
import { FaArrowRight } from "react-icons/fa";
import React, { useState, useContext } from "react";
import { useCart } from "./cartContext"; // ✅ Cart context import
import { FaHeart } from "react-icons/fa";
import LoginModal from "./LoginModal";
import { AuthContext } from "../context/AuthContext";


function First() {
  const products = [
    { id: 101, name: "Brown Linen Cord Set", price: 1299, image: "/img/9.jpg" },
    { id: 102, name: "Structured Hobo Bag", price: 899, image: "/img/10.PNG" },
    { id: 103, name: "Men Sneakers", price: 1889, image: "/img/11.png" },
    { id: 104, name: "Printed Casual Shirt", price: 599, image: "/img/12.png" },
    { id: 105, name: "Parfum Gift Set", price: 499, image: "/img/13.png" },
    { id: 106, name: "Open Toe Flats", price: 979, image: "/img/14.png" },
  ];

  // ✅ Contexts
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useContext(AuthContext);
  
  // ✅ Notification state
  const [notification, setNotification] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  
  // ✅ Show notification function
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Hide after 3 seconds
  };

  // ✅ Handle Add to Cart with login check
  const handleAddToCart = (product) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      mrp: product.price,
      img: product.image,
    });
    navigate("/cart");
  };

  // ✅ Handle Wishlist toggle with login check (like cart)
  const handleWishlistToggle = (product) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    
    const isInWishlist = wishlist.some((item) => item.id === product.id);
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.image,
    });
    
    // Show notification
    if (isInWishlist) {
      showNotification(`${product.name} removed from wishlist! 💔`, 'remove');
    } else {
      showNotification(`${product.name} added to wishlist! ❤️`, 'success');
    }
  };

  const categoryImages = {
    Clothing: ["/img/1.jpg","/img/2.jpg","/img/3.jpg","/img/4.jpg","/img/5.jpg", "/img/6.jpg", "/img/7.jpg"],
    Footwear: ["/img/footwear1.png","/img/footwear8.png", "/img/footwear7.png","/img/footwear6.png","/img/footwear5.png","/img/footwear2.png","/img/footwear3.png"],
    Bags: [ "/img/bag1.jpg", "/img/bag2.jpg","/img/bag3.jpg","/img/bag4.jpg","/img/bag5.jpg","/img/bag6.jpg","/img/bag7.jpg"],
    Accessories: ["/img/accessories4.png", "/img/accessories2.png", "/img/accessories3.png","/img/accessories5.png","/img/accessories6.png","/img/accessories7.png","/img/accessories9.png"],
    Cosmetic: ["/img/skincare6.png","/img/skincare1.png","/img/skincare2.png","/img/skincare3.png","/img/skincare4.png","/img/skincare5.png","/img/skincare7.png"],
  };
  const [activeCategory, setActiveCategory] = useState("Clothing");

  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            Everything You Need, <br /> All in One Place
          </h1>
          <p>
            Shop the latest trends, exclusive deals, and everyday essentials
            delivered right to your doorstep.
          </p>
  <button
  className="shop-btn"
  onClick={() => navigate("/categories/Clothing")} // ✅ yahi working route hai
>
  SHOP NOW
</button>
        </div>

        {/* Stars */}
        <span className="hero-star hero-star-top-right">✦</span>
        <span className="hero-star hero-star-bottom-left">✦</span>

        <div className="hero-images">
          <img src="/img/first.png" alt="Hero Model" />
        </div>
      </section>

      {/* Brands Section */}
      <div className="brands">
        <img src="/img/gucci.png" alt="Gucci" />
        <img src="/img/calvin.png" alt="Calvin Klein" />
        <img src="/img/loreal1.png" alt="L'Oréal" />
        <img src="/img/zara.png" alt="Zara" />
        <img src="/img/adidas.png" alt="Adidas" />
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <div className="categories-left">
          <h2>Categories</h2>
          <img 
            src={categoryImages[activeCategory][0]} 
            alt={activeCategory} 
            onClick={() => navigate(`/categories/${activeCategory}`)}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="categories-right">
          {/* Menu */}
          <div className="categories-menu">
            {Object.keys(categoryImages).map((cat) => (
              <span
                key={cat}
                className={activeCategory === cat ? "active" : ""}
                onClick={() => setActiveCategory(cat)}
                style={{ cursor: "pointer", marginRight: "10px" }}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Grid - skip first image */}
          <div className="categories-grid">
            {categoryImages[activeCategory].slice(1).map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={activeCategory} 
                onClick={() => navigate(`/categories/${activeCategory}`)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <section className="promo-banner">
        <img src="/img/image(1).png" alt="Promo Banner" className="promo-bg-img" />
        <div className="promo-content">
          <h2>
            <span className="highlight">Flat 50% OFF</span>
          </h2>
          <h3>Everything You Love</h3>
          <p>Unbeatable prices on top categories, just for you.</p>
          <button className="shop-btn" onClick={() => navigate("/coupons")}>
            SHOP NOW
          </button>
        </div>
      </section>

      {/* Best Selling Product Section */}
      <section className="best-selling">
  <h2 className="best-selling-title">Best Selling Product</h2>
  <div className="product-grid">
    {products.map((product) => (
      <div className="product-card" key={product.id}>
        <img src={product.image} alt={product.name} />
        <div className="product-info">
          <h4>{product.name}</h4>
          <p>Rs.{product.price}</p>
          <div className="product-actions">
            {/* ✅ Add to cart with login protection */}
            <button
              className="add-btn"
              onClick={() => handleAddToCart(product)}
            >
              Add To Cart
            </button>

            {/* ✅ Wishlist toggle with login protection */}
            <FaHeart
              className="wishlist-icon"
              size={24}
              color={
                wishlist.some((item) => item.id === product.id) ? "red" : "gray"
              }
              onClick={() => handleWishlistToggle(product)}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* New Arrivals */}
     <div className="new-arrivals-container">
      {/* First Image - Bags */}
      <div
        className="new-arrivals-text"
        onClick={() => navigate("/categories/Bags")}
        style={{ cursor: "pointer" }}
      >
        <h2>New Arrivals</h2>
        <p>Be the First to Own the Latest Trends</p>
        <img
          src="/img/15.jpg"
          alt="White Bag"
          className="new-arrivals-img"
        />
      </div>

      {/* Second Image - Accessories */}
      <div
        className="new-arrivals-card"
        onClick={() => navigate("/categories/Acessiories")}
        style={{ cursor: "pointer" }}
      >
        <img
          src="/img/16.jpg"
          alt="Watch"
          className="new-arrivals-img1"
        />
      </div>

      {/* Third Image - Cosmetic */}
      <div
        className="new-arrivals-card"
        onClick={() => navigate("/categories/Cosmetic")}
        style={{ cursor: "pointer" }}
      >
        <img
          src="/img/17.jpg"
          alt="Moisturizer"
          className="new-arrivals-img"
        />
        <button
          className="new-arrivals-btn"
          onClick={(e) => {
            e.stopPropagation(); 
            navigate("/categories/Clothing");
          }}
        >
          View All →
        </button>
      </div>
    </div>

      {/* Collections */}
      <div className="collections-container">
        <div className="collections-title">
          <h2>
            Explore Our <br /> Collections
          </h2>
        </div>
        <div className="collections-grid">
          <button className="collection-btn"  onClick={() => navigate("/categories/Clothing")}>
            Women Clothing <span className="arrow">→</span>
          </button>
          <button className="collection-btn"  onClick={() => navigate("/categories/Clothing")}>
            Mens Clothing <span className="arrow">→</span>
          </button>
          <button className="collection-btn"  onClick={() => navigate("/categories/Footwear")}>
            Women Footwear <span className="arrow">→</span>
          </button>
          <button className="collection-btn" onClick={() => navigate("/categories/Footwear")}>
            Men Footwear <span className="arrow">→</span>
          </button>
          <button className="collection-btn" onClick={() => navigate("/categories/Bags")}>
            Women Bags <span className="arrow">→</span>
          </button>
          <button className="collection-btn" onClick={() => navigate("/categories/Bags")}>
            Mens Bags <span className="arrow">→</span>
          </button>
          <button className="collection-btn" onClick={() => navigate("/categories/Cosmetic")}>
            Women Cosmetic <span className="arrow">→</span>
          </button>
          <button className="collection-btn" onClick={() => navigate("/categories/Cosmetic")}>
            Men Cosmetic <span className="arrow">→</span>
          </button>
        </div>
      </div>

      {/* ✅ Wishlist Notification Toast */}
      {notification && (
        <div className={`wishlist-notification ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-text">{notification.message}</span>
            <button 
              className="notification-close" 
              onClick={() => setNotification(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ✅ Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      <Footer />
    </div>
  );
}

export default First;
