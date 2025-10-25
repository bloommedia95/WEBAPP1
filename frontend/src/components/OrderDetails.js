// src/components/OrderDetails.js - Fully Dynamic Order Management
import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./first.css";
import "./OrderStyles.css";
import Navbar from "./navbar";
import Footer from "./footer";
import LoginModal from "./LoginModal";
import { AuthContext } from "../context/AuthContext";

function OrderDetails() {
  // States
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratings, setRatings] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const filterRef = useRef(null);
  const { user } = useContext(AuthContext);

  // Fetch orders from API
  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: statusFilter,
        search: searchQuery,
        sortBy,
        sortOrder
      });
      
      const response = await fetch(`/api/orders/user/${user._id}?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load orders when component mounts or filters change
  useEffect(() => {
    fetchOrders();
  }, [user, statusFilter, searchQuery, sortBy, sortOrder]);

  // Rating handler
  const handleRating = async (orderId, stars) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: stars })
      });
      
      const data = await response.json();
      if (data.success) {
        setRatings(prev => ({ ...prev, [orderId]: stars }));
        // Update the order in local state
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, rating: stars }
            : order
        ));
      }
    } catch (error) {
      console.error('Rating error:', error);
    }
  };

  // Cancel order handler
  const handleCancelOrder = async (orderId, reason = 'Customer request') => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      
      const data = await response.json();
      if (data.success) {
        fetchOrders(); // Refresh orders
        alert('Order cancelled successfully');
      } else {
        alert(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Filter outside click handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterRef]);

  // Utility functions
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      'Processing': '#ffc107',
      'Confirmed': '#17a2b8',
      'Shipped': '#fd7e14',
      'Out for Delivery': '#6f42c1',
      'Delivered': '#28a745',
      'Cancelled': '#dc3545',
      'Returned': '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const isReturnEligible = (order) => {
    if (!order.returnEligible || order.status !== 'Delivered') return false;
    if (!order.returnWindow) return false;
    return new Date() < new Date(order.returnWindow);
  };

  const canCancelOrder = (order) => {
    return ['Processing', 'Confirmed'].includes(order.status);
  };

  return (
    <>
      <Navbar />

      {!user ? (
        <div style={{ padding: '40px 20px', minHeight: '60vh' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1>Order Details</h1>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '30px', 
              borderRadius: '10px', 
              marginTop: '30px' 
            }}>
              <h3>Please Login to View Your Orders</h3>
              <p style={{ margin: '20px 0', color: '#666' }}>
                You need to be logged in to access your order history and details.
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
          {/* Orders Section */}
          <div className="order-container">
            {/* Sidebar */}
            <aside className="order-sidebar">
              <h3>Account</h3>
              <p className="username">{user?.name || 'User'}</p>
              <ul>
                <li className="active">Order Detail</li>
                <li><Link to="/saved-address">Saved Address</Link></li>
                <li><Link to="/save-card">Saved Cards & UPI</Link></li>
                <li><Link to="/coupons">Coupons</Link></li>
                <li><Link to="/helpcenter">Help & Support</Link></li>
                <li><Link to="/editprofile">Edit Profile</Link></li>
                <li><Link to="/logout">Logout</Link></li>
              </ul>
            </aside>

            {/* Main Content */}
            <main className="order-main">
              <div className="order-header">
                <h2>All Orders ({orders.length})</h2>
                <div className="order-actions" ref={filterRef}>
                  <input 
                    type="text" 
                    placeholder="Search in orders..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className="filter-btn"
                    onClick={() => setShowFilter(!showFilter)}
                  >
                    <img src="/img/filter.png" alt="Filter" className="filter-icon" />
                    Filter
                  </button>

                  {showFilter && (
                    <div className="custom-filter-dropdown">
                      <h3>Filter Orders</h3>
                      
                      {/* Status Filter */}
                      <div className="custom-filter-section">
                        <p>Status</p>
                        <label>
                          <input 
                            type="radio" 
                            name="status" 
                            checked={statusFilter === 'all'}
                            onChange={() => setStatusFilter('all')}
                          /> All
                        </label>
                        <label>
                          <input 
                            type="radio" 
                            name="status" 
                            checked={statusFilter === 'Processing'}
                            onChange={() => setStatusFilter('Processing')}
                          /> Processing
                        </label>
                        <label>
                          <input 
                            type="radio" 
                            name="status" 
                            checked={statusFilter === 'Shipped'}
                            onChange={() => setStatusFilter('Shipped')}
                          /> Shipped
                        </label>
                        <label>
                          <input 
                            type="radio" 
                            name="status" 
                            checked={statusFilter === 'Delivered'}
                            onChange={() => setStatusFilter('Delivered')}
                          /> Delivered
                        </label>
                        <label>
                          <input 
                            type="radio" 
                            name="status" 
                            checked={statusFilter === 'Cancelled'}
                            onChange={() => setStatusFilter('Cancelled')}
                          /> Cancelled
                        </label>
                      </div>

                      {/* Sort Options */}
                      <div className="custom-filter-section">
                        <p>Sort By</p>
                        <label>
                          <input 
                            type="radio" 
                            name="sort" 
                            checked={sortBy === 'orderDate' && sortOrder === 'desc'}
                            onChange={() => { setSortBy('orderDate'); setSortOrder('desc'); }}
                          /> Newest First
                        </label>
                        <label>
                          <input 
                            type="radio" 
                            name="sort" 
                            checked={sortBy === 'orderDate' && sortOrder === 'asc'}
                            onChange={() => { setSortBy('orderDate'); setSortOrder('asc'); }}
                          /> Oldest First
                        </label>
                      </div>

                      <button 
                        onClick={() => setShowFilter(false)}
                        className="apply-filter-btn"
                      >
                        Apply Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Area */}
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading your orders...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <p className="error-message">{error}</p>
                  <button onClick={fetchOrders} className="retry-btn">
                    Try Again
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div className="no-orders">
                  <h3>No orders found</h3>
                  <p>You haven't placed any orders yet.</p>
                  <Link to="/" className="shop-now-btn">Start Shopping</Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      {/* Order Status */}
                      <div className="order-status">
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(order.status), color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}
                        >
                          {order.status}
                        </span>
                        <span className="order-date">
                          Placed on {formatDate(order.date)}
                        </span>
                        <span className="order-number">
                          #{order.orderNumber}
                        </span>
                      </div>

                      {/* Order Items */}
                      {order.items && order.items.map((item, index) => (
                        <div key={index} className="order-info">
                          <img 
                            src={item.image || '/img/placeholder.png'} 
                            alt={item.name}
                            className="product-img" 
                          />
                          <div className="order-details">
                            <h4>{item.brand || 'Brand'}</h4>
                            <p>{item.name}</p>
                            {item.size && <p className="size">Size: {item.size}</p>}
                            {item.quantity > 1 && <p className="qty">Quantity: {item.quantity}</p>}
                            <p className="price">{formatPrice(item.price)}</p>
                            
                            {/* Order Total */}
                            {index === 0 && (
                              <div className="order-total">
                                <strong>Order Total: {formatPrice(order.total)}</strong>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="order-actions-btns">
                              {canCancelOrder(order) && (
                                <button 
                                  className="cancel-btn"
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  Cancel Order
                                </button>
                              )}
                              
                              {order.trackingNumber && (
                                <button className="track-btn">
                                  Track Order
                                </button>
                              )}
                              
                              {order.status === 'Delivered' && (
                                <button className="reorder-btn">
                                  Buy Again
                                </button>
                              )}
                            </div>

                            {/* Return Info */}
                            {order.status === 'Delivered' && order.returnWindow && (
                              <div className="return-info">
                                {isReturnEligible(order) ? (
                                  <p className="return-eligible">
                                    ✅ Return available until {formatDate(order.returnWindow)}
                                  </p>
                                ) : (
                                  <p className="return-expired">
                                    ❌ Return window closed on {formatDate(order.returnWindow)}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Rating Section */}
                            {order.status === 'Delivered' && (
                              <div className="rating-section">
                                <div className="stars">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                      key={star}
                                      className={
                                        star <= (ratings[order.id] || order.rating || 0)
                                          ? "stars filled"
                                          : "stars"
                                      }
                                      onClick={() => handleRating(order.id, star)}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="rate-text">Rate & Review</span>
                              </div>
                            )}
                          </div>
                          <span className="arrow">›</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </>
      )}

      {/* Login Modal */}
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}

      <Footer />
    </>
  );
}

export default OrderDetails;