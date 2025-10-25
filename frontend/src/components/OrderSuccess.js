import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Cart.css";
import Footer from "./footer";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, orderData } = location.state || {};

  useEffect(() => {
    if (!orderId || !orderData) {
      navigate("/cart");
    }
  }, [orderId, orderData, navigate]);

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleTrackOrder = () => {
    navigate("/order-details", { state: { orderId } });
  };

  if (!orderId || !orderData) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h3>Invalid order data</h3>
          <button onClick={() => navigate("/cart")}>Go to Cart</button>
        </div>
      </div>
    );
  }

  const { items, pricing, selectedAddress } = orderData;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return (
    <div>
      <div className="cart-page">
        <div className="order-success-container">
          
          {/* Success Animation */}
          <div className="order-success-animation">
            <div className="success-checkmark">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p className="order-id">Order ID: <strong>{orderId}</strong></p>
            <p className="thank-you">Thank you for shopping with us!</p>
          </div>

          {/* Order Summary */}
          <div className="success-order-summary">
            <div className="summary-section">
              <h3>📦 Order Summary</h3>
              <div className="order-items">
                {items?.map((item, index) => (
                  <div key={index} className="success-item">
                    <img src={item.img || "/img/placeholder.jpg"} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity || item.qty} × ₹{item.price} = ₹{(item.price * (item.quantity || item.qty)).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-total">
                <h4>Total Paid: ₹{pricing?.finalTotal?.toLocaleString() || 0}</h4>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="summary-section">
              <h3>🚚 Delivery Information</h3>
              <div className="delivery-address">
                <p><strong>{selectedAddress?.fullName}</strong></p>
                <p>{selectedAddress?.addressLine1}</p>
                <p>{selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}</p>
                <p>Phone: {selectedAddress?.phoneNumber}</p>
              </div>
              
              <div className="delivery-timeline">
                <p className="estimated-delivery">
                  📅 Estimated Delivery: <strong>{estimatedDelivery.toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</strong>
                </p>
                <p className="delivery-note">
                  You will receive tracking details via email and SMS soon.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="success-actions">
            <button className="continue-shopping-btn" onClick={handleContinueShopping}>
              Continue Shopping
            </button>
            <button className="track-order-btn" onClick={handleTrackOrder}>
              Track Your Order
            </button>
          </div>

          {/* Customer Support */}
          <div className="customer-support">
            <h4>Need Help?</h4>
            <p>Contact our customer support for any queries regarding your order.</p>
            <div className="support-options">
              <span>📞 +91-9876543210</span>
              <span>📧 support@bloom.com</span>
              <button onClick={() => navigate("/helpcenter")}>Help Center</button>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}