import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./first.css";
import Navbar from "./navbar";
import Footer from "./footer";
import LoginModal from "./LoginModal";
import { AuthContext } from "../context/AuthContext";
import { useSelectedItems } from "./SelectedItemsContext";
import { Link } from "react-router-dom";

export default function Coupons() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showLogin, setShowLogin] = useState(false);
  const { setCoupon } = useSelectedItems();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Backend se coupons fetch
  useEffect(() => {
    console.log('🎟️ Fetching coupons from backend...');
    setLoading(true);
    axios
      .get("/api/coupons")
      .then((res) => {
        console.log('✅ Coupons fetched successfully:', res.data.length, 'coupons');
        setCoupons(res.data);
        setError('');
      })
      .catch((err) => {
        console.error("💥 Error fetching coupons:", err);
        setError('Failed to load coupons. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ Filter logic
  const filteredOffers =
    activeFilter === "All"
      ? coupons
      : coupons.filter((offer) => {
          if (activeFilter === "Expiring Soon") {
            const expiryDate = new Date(offer.endDate);
            const today = new Date();
            const diffDays =
              (expiryDate - today) / (1000 * 60 * 60 * 24);
            return diffDays <= 30 && diffDays >= 0;
          }
          if (activeFilter === "Trending") {
            return offer.status === "Active";
          }
          if (activeFilter === "Discount") {
            return offer.discount > 0;
          }
          return true;
        });

  // ✅ Apply coupon handler
  const handleApplyCoupon = (offer) => {
    setCoupon(offer);
    navigate("/cart");
  };

  return (
    <>
      <Navbar />

      {!user ? (
        <div style={{ padding: '40px 20px', minHeight: '60vh' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1>Coupons</h1>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '30px', 
              borderRadius: '10px', 
              marginTop: '30px' 
            }}>
              <h3>Please Login to View Your Coupons</h3>
              <p style={{ margin: '20px 0', color: '#666' }}>
                You need to be logged in to access your available coupons and discounts.
              </p>
              <button 
                onClick={() => setShowLogin(true)}
                style={{
                  background: '#FF0004',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Login / Signup
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="order-container">
        {/* Sidebar */}
        <aside className="order-sidebar">
          <h3>Account</h3>
          <p className="username">{user.name || user.email}</p>
          <ul>
            <li><Link to="/order-details">Order Detail</Link></li>
            <li><Link to="/saved-address">Saved Address</Link></li>
            <li><Link to="/save-card">Saved Cards & UPI</Link></li>
            <li className="active">Coupons</li>
            <li><Link to="/helpcenter">Help & Support</Link></li>
            <li><Link to="/editprofile">Edit Profile</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="saved-address-main">
          <div className="offers-container">
            {/* Header */}
            <div className="saved-address-header">
              <h2>Available Coupons</h2>
              <p style={{ color: '#666', margin: '10px 0' }}>
                Apply coupons to get amazing discounts on your orders
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div style={{
                background: '#fff5f5',
                border: '1px solid #fed7d7',
                color: '#c53030',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <p>{error}</p>
                <button onClick={() => {
                  setLoading(true);
                  axios
                    .get("/api/coupons")
                    .then((res) => {
                      setCoupons(res.data);
                      setError('');
                    })
                    .catch((err) => {
                      console.error("Error fetching coupons:", err);
                      setError('Failed to load coupons. Please try again.');
                    })
                    .finally(() => setLoading(false));
                }} style={{
                  background: '#FF0004',
                  color: 'white',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}>
                  Retry
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 40px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #FF0004',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 20px auto'
                }}></div>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#333' }}>Loading Coupons...</h3>
                <p style={{ color: '#666' }}>Please wait while we fetch the latest offers</p>
              </div>
            ) : (
              <>
                {/* Sort Buttons */}
                {/* <div className="sort-buttons">
                  {["All", "Trending", "Discount", "Expiring Soon"].map(
                    (btn) => (
                      <button
                        key={btn}
                        onClick={() => setActiveFilter(btn)}
                        className={`sort-btn ${
                          activeFilter === btn ? "active" : ""
                        }`}
                      >
                        {btn} {btn === "All" ? `(${coupons.length})` : `(${filteredOffers.length})`}
                      </button>
                    )
                  )}
                </div> */}

                {/* Empty State */}
                {filteredOffers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 40px' }}>
                    <div style={{ fontSize: '48px', color: '#ddd', marginBottom: '20px' }}>
                      🎟️
                    </div>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '24px', color: '#333' }}>
                      {activeFilter === "All" ? "No Coupons Available" : `No ${activeFilter} Coupons Found`}
                    </h3>
                    <p style={{ margin: '0 0 30px 0', color: '#666', fontSize: '16px' }}>
                      {activeFilter === "All" 
                        ? "Check back later for new exciting offers and discounts!"
                        : `Try selecting a different filter to see more coupons.`}
                    </p>
                    {activeFilter !== "All" && (
                      <button 
                        onClick={() => setActiveFilter("All")}
                        style={{
                          background: '#FF0004',
                          color: 'white',
                          padding: '12px 24px',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        View All Coupons
                      </button>
                    )}
                  </div>
                ) : (
            <div className="offers-grid">
              {filteredOffers.map((offer, index) => (
                <div key={index} className="offer-card">
                  <div className="offer-left">
                    <img
                      src={offer.img || "/img/default-coupon.png"}
                      alt={offer.title}
                      className="offer-img"
                    />
                  </div>
                  <div className="offer-right">
                    <div className="offer-tag">
                      {offer.discountType || "Offer"}
                    </div>
                    <h3 className="offer-title">{offer.title}</h3>
                    <p className="offer-code">Code: {offer.code}</p>

                    {/* ✅ Discount Info */}
                    <p className="offer-details">
                      Discount:{" "}
                      {offer.discountType === "percentage"
                        ? `${offer.discount}%`
                        : `₹${offer.discount}`}
                    </p>

                    {/* ✅ Min / Max Purchase */}
                    {offer.minPurchase && (
                      <p className="offer-details">
                        Min Purchase: ₹{offer.minPurchase}
                      </p>
                    )}
                    {offer.maxDiscount && offer.discountType === "percentage" && (
                      <p className="offer-details">
                        Max Discount: ₹{offer.maxDiscount}
                      </p>
                    )}

                    {/* ✅ First Order Only */}
                    <p className="offer-details">
                      First Order Only:{" "}
                      {offer.firstOrderOnly ? "Yes" : "No"}
                    </p>

                    {/* ✅ Validity Dates */}
                    <p className="offer-expiry">
                      Start:{" "}
                      {offer.startDate
                        ? new Date(offer.startDate).toLocaleDateString()
                        : "N/A"}
                      {"  "} | End:{" "}
                      {offer.endDate
                        ? new Date(offer.endDate).toLocaleDateString()
                        : "No Expiry"}
                    </p>

                    {/* ✅ Status */}
                    <p className="offer-status">
                      Status:{" "}
                      <span
                        className={
                          offer.status === "Active"
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {offer.status}
                      </span>
                    </p>

                    {/* ✅ Apply button */}
                    <button
                      className="apply-btn"
                      disabled={offer.status !== "Active"}
                      onClick={() => handleApplyCoupon(offer)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />
        </>
      )}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
