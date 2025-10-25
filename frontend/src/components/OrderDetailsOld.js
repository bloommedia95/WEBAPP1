// src/components/OrderDetails.js - Fully Dynamic Order Management
import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./first.css";
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
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      
      const data = await response.json();
      if (data.success) {
        // Refresh orders
        fetchOrders();
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
                    <label>
                      <input 
                        type="radio" 
                        name="sort" 
                        checked={sortBy === 'total' && sortOrder === 'desc'}
                        onChange={() => { setSortBy('total'); setSortOrder('desc'); }}
                      /> Price: High to Low
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="sort" 
                        checked={sortBy === 'total' && sortOrder === 'asc'}
                        onChange={() => { setSortBy('total'); setSortOrder('asc'); }}
                      /> Price: Low to High
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
            </label>
            <label>
              <input type="radio" name="status" /> Delivered
            </label>
            <label>
              <input type="radio" name="status" /> Cancelled
            </label>
            <label>
              <input type="radio" name="status" /> Returned
            </label>
          </div>
          <hr />
          <div className="custom-filter-section">
            <p>Time</p>
            <label>
              <input type="radio" name="time" /> Anytime
            </label>
            <label>
              <input type="radio" name="time" /> Last 30 Days
            </label>
            <label>
              <input type="radio" name="time" /> Last 6 Months
            </label>
            <label>
              <input type="radio" name="time" /> Last Year
            </label>
          </div>
          <hr />
          <div className="custom-filter-actions">
            <button className="custom-clear-btn">Clear All</button>
            <button className="custom-apply-btn">Apply</button>
          </div>
        </div>
      )}
    </div>
    </div>

          {/* ✅ Orders List */}
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-status">
                  <img
                    src="/img/profile (5).png"
                    alt="status"
                    className="status-icon"
                  />
                  <span className="status-text">{order.status}</span>
                  <span className="date">On {order.date}</span>
                </div>

                <div className="order-info">
                  <img src={order.img} alt={order.desc} className="product-img" />
                  <div className="order-details">
                    <h4>{order.title}</h4>
                    <p>{order.desc}</p>
                    <p className="size">Size : {order.size}</p>
                    <hr />
                    <p className="return-text">{order.return}</p>
                    <hr />

                    {/* ⭐ Rating Section */}
                    <div className="rating-section">
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map((stars) => (
                          <span
                            key={stars}
                            className={
                              stars <= (ratings[order.id] || 0)
                                ? "stars filled"
                                : "stars"
                            }
                            onClick={() => handleRating(order.id, stars)}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="rate-text">Rate & Review</span>
                    </div>
                  </div>
                  <span className="arrow">›</span>
                </div>
              </div>
            ))}
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

export default OrderDetails;
