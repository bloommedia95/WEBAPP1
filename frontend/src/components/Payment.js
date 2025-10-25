import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Cart.css";
import Footer from "./footer";
import { useAuth } from "../context/AuthContext";

export default function Payment() {
  const [activeStep, setActiveStep] = useState("Payment");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Get data from address page
  const orderData = location.state?.orderData;

  // Payment form states
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: ""
  });

  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    if (!orderData) {
      navigate("/cart");
    }
  }, [orderData, navigate]);

  const handleStepClick = (step) => {
    setActiveStep(step);
    if (step === "Cart") navigate("/cart");
    else if (step === "Address") navigate("/address");
    else if (step === "Payment") navigate("/payment");
  };

  const handleCardInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === "cardNumber") {
      // Format card number (XXXX XXXX XXXX XXXX)
      formattedValue = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
      formattedValue = formattedValue.substring(0, 19);
    } else if (field === "expiryDate") {
      // Format expiry date (MM/YY)
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").substring(0, 5);
    } else if (field === "cvv") {
      // Only allow 3-4 digits
      formattedValue = value.replace(/\D/g, "").substring(0, 4);
    }
    
    setCardDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const validatePaymentMethod = () => {
    if (selectedPaymentMethod === "card") {
      const { cardNumber, expiryDate, cvv, nameOnCard } = cardDetails;
      return cardNumber.replace(/\s/g, "").length >= 13 && 
             expiryDate.length === 5 && 
             cvv.length >= 3 && 
             nameOnCard.trim().length > 0;
    } else if (selectedPaymentMethod === "upi") {
      return upiId.includes("@") && upiId.length > 5;
    } else if (selectedPaymentMethod === "netbanking" || selectedPaymentMethod === "wallet") {
      return true; // These will be handled by respective gateways
    } else if (selectedPaymentMethod === "cod") {
      return true;
    }
    return false;
  };

  const handlePlaceOrder = async () => {
    if (!validatePaymentMethod()) {
      alert("Please fill all payment details correctly");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Here you would typically:
      // 1. Process payment with payment gateway
      // 2. Save order to database
      // 3. Send confirmation email
      // 4. Clear cart

      setOrderPlaced(true);
      
      // Clear cart from localStorage
      if (user) {
        localStorage.removeItem(`cart_${user.id}`);
      }

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        navigate("/order-success", {
          state: {
            orderId: `ORD${Date.now()}`,
            orderData: orderData
          }
        });
      }, 2000);

    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!orderData) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h3>No order data found</h3>
          <button onClick={() => navigate("/cart")}>Go to Cart</button>
        </div>
      </div>
    );
  }

  const { items, pricing, selectedAddress, userDetails } = orderData;

  if (orderPlaced) {
    return (
      <div className="cart-page">
        <div className="order-success-animation">
          <div className="success-checkmark">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="cart-page">
        {/* Progress Bar */}
        <div className="cart-steps">
          <div className="steps-center">
            <span className="step done" onClick={() => handleStepClick("Cart")}>
              Cart
            </span>
            <span>----------</span>
            <span className="step done" onClick={() => handleStepClick("Address")}>
              Address
            </span>
            <span>----------</span>
            <span className="step active">
              Payment
            </span>
          </div>
          <span className="secure">
            <img src="/img/s.png" alt="secure" className="secure-icon" /> 100% Secured
          </span>
        </div>

        <div className="cart-container">
          {/* Left Side - Payment Methods */}
          <div className="cart-left">
            
            {/* Delivery Address */}
            <div className="address-box">
              <h4>📍 Delivery Address</h4>
              <p>
                <strong>{selectedAddress?.fullName || userDetails?.name}</strong><br />
                {selectedAddress?.addressLine1}, {selectedAddress?.addressLine2}<br />
                {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}<br />
                Phone: {selectedAddress?.phoneNumber || userDetails?.phone}
              </p>
              <button className="changes-btn" onClick={() => navigate("/address")}>
                Change Address
              </button>
            </div>

            {/* Payment Methods */}
            <div className="payment-methods">
              <h4>💳 Choose Payment Method</h4>
              
              <div className="payment-options">
                
                {/* Credit/Debit Card */}
                <div className={`payment-option ${selectedPaymentMethod === "card" ? "active" : ""}`}>
                  <label>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="card" 
                      checked={selectedPaymentMethod === "card"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  
                  {selectedPaymentMethod === "card" && (
                    <div className="card-form">
                      <input 
                        type="text" 
                        placeholder="Card Number" 
                        value={cardDetails.cardNumber}
                        onChange={(e) => handleCardInputChange("cardNumber", e.target.value)}
                      />
                      <div className="card-row">
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          value={cardDetails.expiryDate}
                          onChange={(e) => handleCardInputChange("expiryDate", e.target.value)}
                        />
                        <input 
                          type="text" 
                          placeholder="CVV" 
                          value={cardDetails.cvv}
                          onChange={(e) => handleCardInputChange("cvv", e.target.value)}
                        />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Name on Card" 
                        value={cardDetails.nameOnCard}
                        onChange={(e) => handleCardInputChange("nameOnCard", e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* UPI */}
                <div className={`payment-option ${selectedPaymentMethod === "upi" ? "active" : ""}`}>
                  <label>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="upi" 
                      checked={selectedPaymentMethod === "upi"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <span>UPI Payment</span>
                  </label>
                  
                  {selectedPaymentMethod === "upi" && (
                    <div className="upi-form">
                      <input 
                        type="text" 
                        placeholder="Enter UPI ID (e.g., user@paytm)" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                      <div className="upi-apps">
                        <img src="/img/gpay.png" alt="Google Pay" />
                        <img src="/img/phonepe.png" alt="PhonePe" />
                        <img src="/img/paytm.png" alt="Paytm" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Net Banking */}
                <div className={`payment-option ${selectedPaymentMethod === "netbanking" ? "active" : ""}`}>
                  <label>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="netbanking" 
                      checked={selectedPaymentMethod === "netbanking"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <span>Net Banking</span>
                  </label>
                </div>

                {/* Wallets */}
                <div className={`payment-option ${selectedPaymentMethod === "wallet" ? "active" : ""}`}>
                  <label>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="wallet" 
                      checked={selectedPaymentMethod === "wallet"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <span>Mobile Wallets</span>
                  </label>
                </div>

                {/* Cash on Delivery */}
                <div className={`payment-option ${selectedPaymentMethod === "cod" ? "active" : ""}`}>
                  <label>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={selectedPaymentMethod === "cod"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>

              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="cart-right">
            
            {/* Order Items Summary */}
            <div className="order-items-summary">
              <h4>📦 Order Summary ({items?.length || 0} items)</h4>
              <div className="items-list">
                {items?.slice(0, 3).map((item, index) => (
                  <div key={index} className="summary-item">
                    <img src={item.img || "/img/placeholder.jpg"} alt={item.name} />
                    <div className="item-info">
                      <p>{item.name}</p>
                      <p>Qty: {item.quantity || item.qty} × ₹{item.price} = ₹{(item.price * (item.quantity || item.qty)).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {items?.length > 3 && (
                  <p className="more-items">+{items.length - 3} more items</p>
                )}
              </div>
            </div>

            {/* Price Details */}
            <div className="price-box">
              <h4>💰 Price Details</h4>
              
              <div className="price-row">
                <span>Total MRP:</span>
                <span>₹{pricing?.totalMrp?.toLocaleString() || 0}</span>
              </div>
              
              <div className="price-row discount">
                <span>Discount on MRP:</span>
                <span>- ₹{pricing?.totalDiscount?.toLocaleString() || 0}</span>
              </div>
              
              {pricing?.couponDiscount > 0 && (
                <div className="price-row coupon-discount">
                  <span>Coupon Discount:</span>
                  <span>- ₹{pricing.couponDiscount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="price-row">
                <span>Platform Fee:</span>
                <span>₹20</span>
              </div>
              
              {pricing?.donation > 0 && (
                <div className="price-row donation">
                  <span>Donation:</span>
                  <span>₹{pricing.donation}</span>
                </div>
              )}
              
              <div className="price-row">
                <span>Tax (18% GST):</span>
                <span>₹{pricing?.taxAmount?.toLocaleString() || 0}</span>
              </div>
              
              <hr />
              
              <div className="price-row total">
                <span>Total Amount:</span>
                <span>₹{pricing?.finalTotal?.toLocaleString() || 0}</span>
              </div>
              
              {(pricing?.totalDiscount + pricing?.couponDiscount) > 0 && (
                <div className="savings-highlight">
                  🎉 You saved ₹{((pricing?.totalDiscount || 0) + (pricing?.couponDiscount || 0)).toLocaleString()} in total!
                </div>
              )}
            </div>

            {/* Place Order Button */}
            <button 
              className={`place-order ${!validatePaymentMethod() || isProcessing ? 'disabled' : ''}`}
              onClick={handlePlaceOrder}
              disabled={!validatePaymentMethod() || isProcessing}
            >
              {isProcessing ? "PROCESSING PAYMENT..." : `PAY ₹${pricing?.finalTotal?.toLocaleString() || 0}`}
            </button>
            
            <div className="secure-payment">
              <span>🔒 100% Secure Payment</span>
              <p>Your payment information is encrypted and secure</p>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}