import React, { useEffect, useState } from "react";
import "./first.css";
import Navbar from "./navbar";
import Footer from "./footer";
import { useWishlist } from "./wishlistContext";
import { useCart } from "./cartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";

function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const moveToCart = (item) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    addToCart(item);            
    removeFromWishlist(item.id); 
  };

  return (
    <>
      <Navbar />
      
      {/* Login Modal */}
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}

      <div className="wishlist-page">
        <div className="wishlist-header">
          <h2>My Wishlist ({wishlist.length} items)</h2>
          <p>{user ? `Welcome back, ${user.name || user.email}! Your saved items:` : 'Your saved items:'}</p>
          {!user && (
            <div style={{ 
              backgroundColor: '#fff3e0', 
              border: '1px solid #ff9800', 
              borderRadius: '8px', 
              padding: '15px', 
              margin: '20px 0',
              textAlign: 'center'
            }}>
              <p style={{ color: '#e65100', margin: '0 0 10px 0', fontWeight: '600' }}>
                🔒 Login to sync your wishlist across devices
              </p>
              <button 
                onClick={() => setShowLogin(true)}
                style={{
                  background: '#FF0004',
                  color: 'white',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Login / Signup
              </button>
            </div>
          )}
        </div>

        <div className="wishlist-grid">
          {wishlist.length > 0 ? (
            wishlist.map((item) => (
              <div key={item.id} className="wishlist-card">
                <button
                  className="remover-btn"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  ×
                </button>
                <img
                  src={item.img}
                  alt={item.name}
                  className="wishlist-img"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${item.id}`)}
                />
                <h3
                  className="wishlist-name"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  {item.name}
                </h3>
                <p className="wishlist-price">
                  {String(item.price).includes("Rs") ? item.price : `Rs.${item.price}`}
                </p>
                <button className="move-btn" onClick={() => moveToCart(item)}>
                  Move To Cart
                </button>
              </div>
            ))
          ) : (
            <div className="empty-wishlist">
              <img src="/img/empty-wishlist.png" alt="Empty Wishlist" style={{width: "150px", marginBottom: "20px"}} />
              <h3>Your wishlist is empty!</h3>
              <p>Save items you love to your wishlist and shop them later.</p>
              <button className="continue-shopping" onClick={() => navigate("/")}>
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Wishlist;
