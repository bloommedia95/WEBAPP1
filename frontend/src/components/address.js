import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Cart.css";
import Footer from "./footer";
import { useSelectedItems } from "./SelectedItemsContext";
import { useCart } from "./cartContext";
import { useAuth } from "../context/AuthContext";

export default function Address() {
  const [activeStep, setActiveStep] = useState("Address");
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems, donation } = useSelectedItems();
  const { cart } = useCart();
  const { user, setUser } = useAuth();
  
  // Constants for pricing
  const platformFee = 20;
  const taxRate = 0.18; // 18% GST
  
  // Get cart data from navigation state
  const cartData = location.state?.cartData;

  // ✅ Addresses state (start with user's existing address if available)
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // ✅ Form data for adding new address
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phoneNumber: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'Home',
    deliveryInstructions: ''
  });

  // Fetch addresses from API
  const fetchAddresses = async () => {
    if (!user?._id) return;
    
    try {
      const response = await fetch(`/api/addresses/user/${user._id}`);
      const data = await response.json();
      
      if (data.success) {
        console.log('Addresses fetched:', data.addresses);
        console.log('First address structure:', data.addresses[0]);
        setAddresses(data.addresses);
        // Force select first address - handle different ID fields
        if (data.addresses.length > 0) {
          const firstAddress = data.addresses[0];
          const addressId = firstAddress._id || firstAddress.id || firstAddress.addressId || Date.now();
          console.log('Force selecting first address:', addressId);
          setSelectedAddress(addressId);
        }
      }
    } catch (error) {
      console.error('Fetch addresses error:', error);
    }
  };

  // Load addresses and setup initial state
  useEffect(() => {
    fetchAddresses();
    
    // If user has address but no saved addresses, create one from user data
    if (user && user.address && addresses.length === 0) {
      setAddresses(prev => [
        ...prev,
        {
          _id: Date.now(),
          fullName: user.name,
          addressLine1: user.address,
          phoneNumber: user.phone || "",
          city: "City",
          state: "State", 
          pincode: "000000",
          addressType: "Home",
          isUserAddress: true
        },
      ]);
    }
  }, [user]);

  // Auto-select first address when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      console.log('Auto-selecting first address:', addresses[0]._id);
      setSelectedAddress(addresses[0]._id);
    }
  }, [addresses, selectedAddress]);

  const handleStepClick = (step) => {
    setActiveStep(step);
    if (step === "Cart") navigate("/cart");
    else if (step === "Address") navigate("/address");
    else if (step === "Payment") navigate("/payment");
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.addressLine1 || !formData.phoneNumber) {
      alert("Please fill all required fields");
      return;
    }

    if (!user?._id) {
      alert('Please login to add address');
      return;
    }

    try {
      const response = await fetch('/api/addresses/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          ...formData
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowAddForm(false);
        setFormData({
          fullName: user?.name || '',
          phoneNumber: user?.phone || '',
          addressLine1: '',
          addressLine2: '',
          landmark: '',
          city: '',
          state: '',
          pincode: '',
          addressType: 'Home',
          deliveryInstructions: ''
        });
        fetchAddresses(); // Refresh addresses
        
        // Update user context if this is first address
        if (addresses.length === 0) {
          const fullAddress = `${formData.addressLine1}, ${formData.addressLine2 ? formData.addressLine2 + ', ' : ''}${formData.city}, ${formData.state} - ${formData.pincode}`;
          setUser(prev => ({
            ...prev,
            address: fullAddress,
            phone: formData.phoneNumber
          }));
        }
      } else {
        alert(data.message || 'Failed to add address');
      }
    } catch (error) {
      console.error('Add address error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    try {
      const response = await fetch(`/api/addresses/delete/${addressId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchAddresses(); // Refresh addresses
        if (selectedAddress === addressId) {
          setSelectedAddress(null);
        }
      } else {
        alert(data.message || 'Failed to delete address');
      }
    } catch (error) {
      console.error('Delete address error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Proceed to payment
  const handleProceedToPayment = () => {
    console.log('Continue button clicked!'); // Debug log
    console.log('Selected address:', selectedAddress); // Debug log
    
    if (!selectedAddress || selectedAddress === "") {
      alert('Please select a delivery address');
      return;
    }

    const selectedAddressData = addresses.find(addr => {
      const addressId = addr._id || addr.id || addr.addressId;
      return addressId === selectedAddress;
    });
    console.log('Selected address data:', selectedAddressData); // Debug log
    
    const orderData = {
      userId: cartData?.userId || "guest",
      items: items,
      pricing: {
        totalMrp,
        totalPrice,
        totalDiscount,
        couponDiscount,
        donation: donationAmount,
        platformFee,
        finalTotal,
      },
      appliedCoupon: cartData?.appliedCoupon || null,
      userDetails: cartData?.userDetails || null,
      selectedAddress: selectedAddressData
    };

    console.log('Navigating to payment with orderData:', orderData); // Debug log
    
    navigate("/payment", {
      state: { orderData }
    });
  };

  // Use cart items from cartData (passed from Cart.js), fallback to cart context
  const items = cartData?.items || cart || [];
  
  console.log('Address page debug:');
  console.log('- Items:', items);
  console.log('- Cart data from navigation:', cartData);
  console.log('- Addresses array:', addresses);
  console.log('- Selected address:', selectedAddress);
  console.log('- User:', user);
  
  // Use Cart.js pricing if available, otherwise calculate fresh (exact same logic as Cart.js)
  let totalMrp, totalPrice, totalDiscount, couponDiscount, donationAmount, taxAmount, finalTotal;
  
  if (cartData?.pricing) {
    // Use pre-calculated values from Cart.js
    totalMrp = cartData.pricing.totalMrp;
    totalPrice = cartData.pricing.totalPrice;
    totalDiscount = cartData.pricing.totalDiscount;
    couponDiscount = cartData.pricing.couponDiscount;
    donationAmount = cartData.pricing.donation;
    taxAmount = cartData.pricing.taxAmount;
    finalTotal = cartData.pricing.finalTotal;
  } else {
    // Fallback: Calculate using same logic as Cart.js
    let mrpTotal = 0;
    let priceTotal = 0;

    items.forEach((item) => {
      const itemMrp = item.mrp || item.price;
      const quantity = item.qty || item.quantity || 1;
      
      mrpTotal += itemMrp * quantity;
      priceTotal += item.price * quantity;
    });

    totalMrp = mrpTotal;
    totalPrice = priceTotal;
    totalDiscount = mrpTotal - priceTotal;
    couponDiscount = cartData?.pricing?.couponDiscount || 0;
    donationAmount = cartData?.pricing?.donation || donation || 0;
    
    const platformFee = 20;
    const taxRate = 0.18; // 18% GST (same as Cart.js)
    const subtotal = priceTotal - couponDiscount + platformFee + donationAmount;
    taxAmount = subtotal * taxRate;
    finalTotal = subtotal + taxAmount;
  }

  return (
    <div>
      <div className="cart-page">
        {/* Progress Bar */}
        <div className="cart-steps">
          <div className="steps-center">
            <span
              className={`step ${activeStep === "Cart" ? "active" : "done"}`}
              onClick={() => handleStepClick("Cart")}
            >
              Cart
            </span>
            <span> → </span>
            <span
              className={`step ${activeStep === "Address" ? "active" : ""}`}
              onClick={() => handleStepClick("Address")}
            >
              Address
            </span>
            <span> → </span>
            <span
              className={`step ${activeStep === "Payment" ? "active" : ""}`}
              onClick={() => handleStepClick("Payment")}
            >
              Payment
            </span>
          </div>
          <div className="secure">
            <img
              src="/img/s.png"
              alt="secure"
              className="secure-icon"
            />
            <span>100% Secure</span>
          </div>
        </div>

        <div className="cart-container">
          {/* Left Section - Address Selection */}
          <div className="left-section">
            <div className="address-section">
              <h2>Select Delivery Address</h2>
              
              {addresses.length === 0 ? (
                <div className="no-addresses">
                  <p>No saved addresses found. Please add a new address.</p>
                </div>
              ) : (
                <div className="addresses-list">
                  {addresses.map((address, index) => {
                    const addressId = address._id || address.id || address.addressId || `addr_${index}`;
                    return (
                    <div key={addressId} className={`address-item ${selectedAddress === addressId ? 'selected' : ''}`}>
                      <div 
                        className="address-header"
                        onClick={() => {
                          console.log('Address clicked:', addressId);
                          setSelectedAddress(addressId);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={addressId}
                          checked={selectedAddress === addressId}
                          onChange={() => {}} // Handled by div click
                          style={{ cursor: 'pointer' }}
                        />
                        <div className="address-info">
                          <h4>{address.fullName}</h4>
                          <span className="address-type">{address.addressType}</span>
                        </div>
                        {!address.isUserAddress && (
                          <button 
                            className="delete-address-btn"
                            onClick={() => handleDeleteAddress(address._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <div className="address-details">
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        {address.landmark && <p>Landmark: {address.landmark}</p>}
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                        <p>Phone: {address.phoneNumber}</p>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}

              <button 
                className="add-new-address-btn"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                + Add New Address
              </button>

              {/* Add Address Form */}
              {showAddForm && (
                <div className="add-address-form">
                  <h3>Add New Address</h3>
                  <form onSubmit={handleAddAddress}>
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Address Line 1 *</label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        placeholder="House/Flat no, Building name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Address Line 2</label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        placeholder="Area, Colony, Street"
                      />
                    </div>

                    <div className="form-group">
                      <label>Landmark</label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        placeholder="Near famous place"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Pincode *</label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Address Type</label>
                      <select
                        name="addressType"
                        value={formData.addressType}
                        onChange={handleInputChange}
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Delivery Instructions</label>
                      <textarea
                        name="deliveryInstructions"
                        value={formData.deliveryInstructions}
                        onChange={handleInputChange}
                        placeholder="Any specific delivery instructions"
                        rows="3"
                      />
                    </div>

                    <div className="form-actions">
                      <button type="button" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </button>
                      <button type="submit">Save Address</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Cart Items & Price Details */}
          <div className="right-section">
            {/* Cart Items Display */}
            {items.length > 0 ? (
              <div className="cart-items-summary">
                <div className="delivery-info">
                  <img src="/img/delivery.png" alt="delivery" className="delivery-icon" />
                  <div>
                    <div>Estimated Delivery by</div>
                    <div>2 September 2025</div>
                  </div>
                </div>
                
                {items.map((item, index) => (
                  <div key={item.id || index} className="cart-item-summary">
                    <img 
                      src={item.img || item.image || "/img/default-product.jpg"} 
                      alt={item.name || item.title || "Product"} 
                    />
                    <div className="item-details">
                      <h4>{item.name || item.title || "Product"}</h4>
                      <p>Size: {item.size || "One Size"} | Color: {item.color || "Default"}</p>
                      <p>Qty: {item.qty || item.quantity || 1}</p>
                      <div className="item-pricing">
                        <span className="current-price">₹{(item.price * (item.qty || item.quantity || 1)).toLocaleString()}</span>
                        {item.mrp && item.mrp > item.price && (
                          <>
                            <span className="original-price">₹{(item.mrp * (item.qty || item.quantity || 1)).toLocaleString()}</span>
                            <span className="discount-percent">
                              ({Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-items-message">
                <p>No items found. Please add items to cart first.</p>
                <p>Debug: Items length = {items.length}</p>
              </div>
            )}

            {/* Price Details */}
            <div className="price-details">
              <h3>Price Detail ({items.length} Item{items.length > 1 ? 's' : ''})</h3>
              
              <div className="price-row">
                <span>Total MRP</span>
                <span>Rs.{totalMrp.toLocaleString()}</span>
              </div>
              
              <div className="price-row">
                <span>Discount on MRP</span>
                <span>{totalDiscount > 0 ? `${Math.round((totalDiscount / totalMrp) * 100)}% Off` : '0% Off'}</span>
              </div>
              
              {couponDiscount > 0 && (
                <div className="price-row">
                  <span>Coupon Discount</span>
                  <span>-Rs.{couponDiscount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="price-row">
                <span>Platform Fee</span>
                <span>Rs.{platformFee}</span>
              </div>
              
              {donationAmount > 0 && (
                <div className="price-row">
                  <span>Donation</span>
                  <span>Rs.{donationAmount.toLocaleString()}</span>
                </div>
              )}
              
              <hr />
              <div className="price-row total-amount">
                <span>Total Amount</span>
                <span>Rs.{finalTotal.toLocaleString()}</span>
              </div>
              
              <button 
                className="continue-btn"
                onClick={handleProceedToPayment}
                disabled={!selectedAddress || selectedAddress === ""}
                style={{ 
                  cursor: (selectedAddress && selectedAddress !== "") ? 'pointer' : 'not-allowed',
                  opacity: (selectedAddress && selectedAddress !== "") ? 1 : 0.6,
                  pointerEvents: 'auto'
                }}
              >
                {(selectedAddress && selectedAddress !== "") ? 'CONTINUE' : 'SELECT ADDRESS FIRST'}
              </button>
              
              {/* Debug: Manual address selection */}
              {/* {addresses.length > 0 && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    const firstAddress = addresses[0];
                    const firstAddressId = firstAddress._id || firstAddress.id || firstAddress.addressId || `addr_0`;
                    console.log('Debug button clicked, selecting:', firstAddressId);
                    console.log('First address object:', firstAddress);
                    setSelectedAddress(firstAddressId);
                    console.log('State should be updated to:', firstAddressId);
                  }}
                  type="button"
                  style={{
                    marginTop: '10px',
                    padding: '10px',
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
               Select Address
                </button>
              )} */}

              {/* Debug: Show current state */}
              {/* <div style={{ 
                marginTop: '10px', 
                padding: '10px', 
                background: '#f0f0f0', 
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                <strong>Debug Info:</strong><br/>
                Addresses Count: {addresses.length}<br/>
                Selected Address: {selectedAddress || 'None'}<br/>
                Button Enabled: {selectedAddress ? 'Yes' : 'No'}
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}