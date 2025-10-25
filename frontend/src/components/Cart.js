import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import Footer from "./footer";
import { useCart } from "./cartContext";
import { useSelectedItems } from "./SelectedItemsContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  // Offers state
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);

  // Fetch offers from backend
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setOffersLoading(true);
        const res = await axios.get("http://localhost:5000/api/offers");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.offers || [];
        setOffers(data);
      } catch (err) {
        console.error("Error fetching offers:", err);
        setOffers([]);
      } finally {
        setOffersLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Debug: Log offers after fetch
  useEffect(() => {
    if (!offersLoading) {
      console.log('Offers fetched:', offers);
    }
  }, [offersLoading, offers]);

  const [activeStep, setActiveStep] = useState("Cart");
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAllOffers, setShowAllOffers] = useState(false);
  const navigate = useNavigate();

  const { cart, removeFromCart, setCart, clearCart } = useCart();
  const { selectedItems, setSelectedItems, donation, setDonation, coupon, setCoupon } = useSelectedItems();
  const { user } = useAuth();

  const taxRate = 0.18; // 18% GST

  // Load user's cart from localStorage on component mount
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (parsedCart.length > 0) {
            setCart(parsedCart);
          }
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
        }
      }
    }
  }, [user, setCart]);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (user && cart.length > 0) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  // Update coupon code field when coupon is applied from coupons page
  useEffect(() => {
    if (coupon && coupon.code && couponCode !== coupon.code) {
      setCouponCode(coupon.code);
      setCouponMessage(`✅ ${coupon.code} applied!`);
    }
  }, [coupon, couponCode]);

  // Calculate totals dynamically
  const { totalMrp, totalPrice, totalDiscount, itemCount, couponDiscount, taxAmount, finalTotal } = useMemo(() => {
    let mrpTotal = 0;
    let priceTotal = 0;
    let count = 0;

    cart.forEach((item) => {
      const itemMrp = item.mrp || item.price;
      const quantity = item.qty || 1;
      
      mrpTotal += itemMrp * quantity;
      priceTotal += item.price * quantity;
      count += quantity;
    });

    const totalDiscount = mrpTotal - priceTotal;
    let couponDiscount = 0;

    // Apply coupon discount if applicable
    if (coupon && coupon.status === "Active") {
      const meetsMinPurchase = !coupon.minPurchase || priceTotal >= coupon.minPurchase;
      const meetsMinItems = !coupon.minItems || count >= coupon.minItems;

      if (meetsMinPurchase && meetsMinItems) {
        if (coupon.discountType === "percentage") {
          couponDiscount = Math.round((priceTotal * coupon.discount) / 100);
          if (coupon.maxDiscount) {
            couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
          }
        } else if (coupon.discountType === "fixed") {
          couponDiscount = Math.min(coupon.discount, priceTotal);
        }
      }
    }

    const platformFee = 20;
    const subtotal = priceTotal - couponDiscount + platformFee + donation;
    const taxAmount = subtotal * taxRate;
    const finalTotal = subtotal + taxAmount;

    return {
      totalMrp: mrpTotal,
      totalPrice: priceTotal,
      totalDiscount,
      itemCount: count,
      couponDiscount,
      taxAmount,
      finalTotal,
    };
  }, [cart, coupon, donation]);

  // Apply coupon function with backend integration
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage("❌ Enter coupon code");
      return;
    }

    setIsLoading(true);
    
    try {
      // First try to get coupons from backend
      const response = await fetch("/api/coupons");
      let availableCoupons = [];
      
      if (response.ok) {
        availableCoupons = await response.json();
      } else {
        // Fallback to demo coupons if backend not available
        availableCoupons = [
          {
            id: 1,
            code: "SAVE10",
            title: "Save 10%",
            discountType: "percentage",
            discount: 10,
            maxDiscount: 500,
            minPurchase: 299,
            minItems: 1,
            status: "Active"
          },
          {
            id: 2,
            code: "FLAT100",
            title: "Flat ₹100 Off",
            discountType: "fixed",
            discount: 100,
            maxDiscount: null,
            minPurchase: 999,
            minItems: 2,
            status: "Active"
          },
          {
            id: 3,
            code: "WELCOME50",
            title: "Welcome Offer",
            discountType: "fixed",
            discount: 50,
            maxDiscount: null,
            minPurchase: 499,
            minItems: 1,
            status: "Active"
          },
          {
            id: 4,
            code: "HDFCOFFER10",
            title: "HDFC Bank Offer",
            discountType: "percentage",
            discount: 10,
            maxDiscount: 200,
            minPurchase: 500,
            minItems: 1,
            status: "Active"
          }
        ];
      }
      
      const foundCoupon = availableCoupons.find(c => 
        c.code.toLowerCase() === couponCode.toLowerCase()
      );

      if (foundCoupon) {
        // Check if coupon is active
        if (foundCoupon.status !== "Active") {
          setCouponMessage("❌ Coupon expired");
          setCoupon(null);
          return;
        }

        // Check minimum requirements
        const meetsMinPurchase = !foundCoupon.minPurchase || totalPrice >= foundCoupon.minPurchase;
        const meetsMinItems = !foundCoupon.minItems || itemCount >= foundCoupon.minItems;

        if (!meetsMinPurchase) {
          setCouponMessage(`❌ Min purchase ₹${foundCoupon.minPurchase}`);
          setCoupon(null);
          return;
        }

        if (!meetsMinItems) {
          setCouponMessage(`❌ Min ${foundCoupon.minItems} items needed`);
          setCoupon(null);
          return;
        }

        // Calculate discount for message
        let discount = 0;
        if (foundCoupon.discountType === "percentage") {
          discount = Math.round((totalPrice * foundCoupon.discount) / 100);
          if (foundCoupon.maxDiscount) {
            discount = Math.min(discount, foundCoupon.maxDiscount);
          }
        } else if (foundCoupon.discountType === "fixed") {
          discount = Math.min(foundCoupon.discount, totalPrice);
        }

        // Apply coupon
        setCoupon(foundCoupon);
        setCouponMessage(`✅ Saved ₹${discount}!`);
        
      } else {
        setCouponMessage("❌ Invalid coupon code");
        setCoupon(null);
      }
    } catch (error) {
      setCouponMessage("❌ Please try again");
      setCoupon(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponMessage("");
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
    if (step === "Cart") navigate("/cart");
    else if (step === "Address") navigate("/address");
    else if (step === "Payment") navigate("/payment");
  };

  const handleSelectItem = (item) => {
    const isSelected = selectedItems.find((i) => i.id === item.id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...cart]);
    }
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach((item) => {
      removeFromCart(item.id);
    });
    setSelectedItems([]);
  };

  const handleMoveToWishlist = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      // Add to wishlist API call here
      selectedItems.forEach((item) => {
        // Add to wishlist logic
        removeFromCart(item.id);
      });
      setSelectedItems([]);
    } catch (error) {
      console.error("Error moving to wishlist:", error);
    }
  };

  const handleSaveCart = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Navigate to address page first
    navigate("/address", { 
      state: { 
        cartData: {
          userId: user?.id || "guest",
          items: cart.map((item) => ({
            ...item,
            quantity: item.qty || 1,
            totalPrice: item.price * (item.qty || 1),
          })),
          pricing: {
            totalMrp,
            totalPrice,
            totalDiscount,
            couponDiscount,
            donation,
            taxAmount,
            finalTotal,
          },
          appliedCoupon: coupon || null,
          userDetails: user || null,
        }
      } 
    });
  };

  // Update quantity function
  const updateQty = (id, newQty) => {
    if (newQty < 1) return;
    setCart((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, qty: newQty } : item
      )
    );
  };

  // Calculate item discount percentage
  const getDiscountPercentage = (item) => {
    if (!item.mrp || item.mrp <= item.price) return 0;
    return Math.round(((item.mrp - item.price) / item.mrp) * 100);
  };

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
            <span>----------</span>
            <span
              className={`step ${activeStep === "Address" ? "active" : ""}`}
              onClick={() => handleStepClick("Address")}
            >
              Address
            </span>
            <span>----------</span>
            <span
              className={`step ${activeStep === "Payment" ? "active" : ""}`}
              onClick={() => handleStepClick("Payment")}
            >
              Payment
            </span>
          </div>

          <span className="secure">
            <img src="/img/s.png" alt="secure" className="secure-icon" /> 100%
            Secured
          </span>
        </div>

        <div className="cart-container">
          {/* Left Side */}
          <div className="cart-left">
            {/* Address */}
            <div className="address-box">
              <p>
                Deliver To: <b>{user?.name || user?.email || "Guest User"}</b>
                <br />
                {user?.address || user?.city || "Please add delivery address"}
                {user?.pincode && ` - ${user.pincode}`}
              </p>
              <button className="changes-btn" onClick={() => navigate("/address")}>
                {user?.address ? "Change Address" : "Add Address"}
              </button>
            </div>

            {/* Offers */}
            <div className="offers-box">
              <h4>Available Offers</h4>
              {offersLoading ? (
                <p>Loading offers...</p>
              ) : offers.length === 0 ? (
                <p>No offers available at the moment.</p>
              ) : (
                offers.slice(0, 2).map((offer, idx) => (
                  <p key={offer._id || idx} style={{ marginBottom: 16, marginTop: 8 }}>
                    {offer.bank ? `🏦 ${offer.bank}: ` : ''}{offer.description} use code <b>{offer.code}</b>
                  </p>
                ))
              )}
              <span className="show-more" onClick={() => setShowAllOffers(true)}>
                Show More Offers ▼
              </span>
              {/* Popup for all offers */}
              {showAllOffers && (
                <div className="offers-popup" style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  margin: '20px 110px',
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  padding: 24,
                  maxWidth: 500
                }}>
                  <h4 style={{marginTop:0}}>All Offers</h4>
                  <button style={{position:'absolute',top:8,right:16,fontSize:20,border:'none',background:'none',cursor:'pointer'}} onClick={() => setShowAllOffers(false)}>✕</button>
                  {offers.length === 0 ? (
                    <p>No offers available at the moment.</p>
                  ) : (
                    offers.map((offer, idx) => (
                      <p key={offer._id || idx} style={{ marginBottom: 16, marginTop: 8 }}>
                        {offer.bank ? `🏦 ${offer.bank}: ` : ''}{offer.description} use code <b>{offer.code}</b>
                      </p>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selection Bar */}
            <div className="cart-selection-bar">
              <div className="left">
                <input 
                  type="checkbox" 
                  id="selectAll"
                  checked={cart.length > 0 && selectedItems.length === cart.length}
                  onChange={handleSelectAll}
                />
                <label htmlFor="selectAll">
                  {selectedItems.length}/{itemCount} Item{selectedItems.length !== 1 ? 's' : ''} Selected
                </label>
              </div>

              <div className="right">
                <button 
                  className="cart-btn" 
                  onClick={handleRemoveSelected}
                  disabled={selectedItems.length === 0}
                  style={{ 
                    opacity: selectedItems.length === 0 ? 0.5 : 1,
                    cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Remove ({selectedItems.length})
                </button>
                <button 
                  className="cart-btn"
                  onClick={handleMoveToWishlist}
                  disabled={selectedItems.length === 0}
                  style={{ 
                    opacity: selectedItems.length === 0 ? 0.5 : 1,
                    cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Move To Wishlist ({selectedItems.length})
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="cart-items">
              {cart.length > 0 ? cart.map((item) => (
                <div key={item.id} className="item-row">
                  <input
                    type="checkbox"
                    checked={selectedItems.some((i) => i.id === item.id)}
                    onChange={() => handleSelectItem(item)}
                  />
                  <img 
                    src={item.img || item.image || "/img/placeholder.jpg"} 
                    alt={item.name} 
                    style={{cursor: 'pointer'}} 
                    onClick={() => navigate(`/product/${item.id}`)}
                    onError={(e) => {
                      e.target.src = "/img/placeholder.jpg";
                    }}
                  />
                  <div className="item-info" style={{cursor: 'pointer'}} onClick={() => navigate(`/product/${item.id}`)}>
                    <h4>{item.name}</h4>
                    {/* <p>{item.brand || "Unknown Brand"}</p> */}
                    <h5>SKU: {item.sku || item.id}</h5>
                    
                    <div className="options">
                      <label>
                        Size: <span>{item.size || "One Size"}</span>
                      </label>
                      <label className="qty">
                        Qty:
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            updateQty(item.id, (item.qty || 1) - 1);
                          }}
                          disabled={item.qty <= 1}
                        >
                          -
                        </button>
                        <span>{item.qty || 1}</span>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            updateQty(item.id, (item.qty || 1) + 1);
                          }}
                        >
                          +
                        </button>
                      </label>
                    </div>
                    <p>
                      <span className="prices">₹{(item.price * (item.qty || 1)).toLocaleString()}</span>
                      {item.mrp && item.mrp > item.price && (
                        <>
                          {" "}
                          <span className="mrp">₹{(item.mrp * (item.qty || 1)).toLocaleString()}</span>
                          <span className="offer">({getDiscountPercentage(item)}% OFF)</span>
                        </>
                      )}
                    </p>
                    <p className="item-total">
                      Total: ₹{(item.price * (item.qty || 1)).toLocaleString()}
                    </p>
                  </div>
                  <button className="remove" onClick={() => removeFromCart(item.id)} title="Remove item">
                    ✕
                  </button>
                </div>
              )) : (
                <div className="empty-cart">
                  <img src="/img/empty-cart.png" alt="Empty Cart" style={{width: "150px", marginBottom: "20px"}} />
                  <h3>Your cart is empty!</h3>
                  <p>Add some products to get started</p>
                  <button className="continue-shopping" onClick={() => navigate("/")}>
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            <button className="add-more" onClick={() => navigate("/wishlist")}>
              <span>Add More Items From Wishlist</span>
              <span className="arrow">➔</span>
            </button>
          </div>

          {/* Right Side */}
          <div className="cart-right">
            {/* Coupons */}
            <div className="coupon-boxs">
              <h4>COUPONS</h4>
              <div className="coupon-input-container">
                <input 
                  type="text" 
                  className="coupon-input" 
                  placeholder="Enter coupon code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleApplyCoupon()}
                />
                <button 
                  className="apply-btn" 
                  onClick={handleApplyCoupon}
                  disabled={isLoading || !couponCode.trim()}
                >
                  {isLoading ? "Applying..." : "Apply"}
                </button>
              </div>
              
              {/* Fixed height container for coupon feedback */}
              <div className="coupon-feedback-container">
                {coupon && (
                  <div className="applied-coupon">
                    <span className="coupon-success">
                      ✅ {coupon.code} applied! You saved ₹{couponDiscount}
                    </span>
                    <button className="remove-coupon" onClick={handleRemoveCoupon}>✕</button>
                  </div>
                )}
                
                {couponMessage && (
                  <p className={`coupon-message ${couponMessage.includes('✅') || couponMessage.includes('Saved') ? 'success' : 'error'}`}>
                    {couponMessage}
                  </p>
                )}
              </div>
              
              <button className="browse-coupons" onClick={() => navigate("/coupons")}>
                Browse All Coupons
              </button>
            </div>

            {/* Donate */}
            <div className="donate-box">
              <p>🤝 Support Social Work in India</p>
              <label className="donate-label">
                <input 
                  type="checkbox" 
                  checked={donation > 0} 
                  onChange={(e) => !e.target.checked && setDonation(0)} 
                /> 
                Donate and make difference
              </label>
              <div className="donate-options">
                {[10, 20, 50, 100].map((amt) => (
                  <button 
                    key={amt} 
                    className={donation === amt ? "active" : ""} 
                    onClick={() => setDonation(amt)}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              {donation > 0 && (
                <p className="donation-thanks">Thank you for your contribution of ₹{donation}! 💚</p>
              )}
            </div>

            {/* Price Details */}
            <div className="price-box">
              <h4>Price Detail ({itemCount} item{itemCount !== 1 ? 's' : ''})</h4>
              
              <div className="price-row">
                <span>Total MRP:</span>
                <span>₹{totalMrp.toLocaleString()}</span>
              </div>
              
              <div className="price-row discount">
                <span>Discount on MRP:</span>
                <span>- ₹{totalDiscount.toLocaleString()}</span>
              </div>
              
              {coupon && couponDiscount > 0 && (
                <div className="price-row coupon-discount">
                  <span>Coupon Discount ({coupon.code}):</span>
                  <span>- ₹{couponDiscount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="price-row">
                <span>Platform Fee:</span>
                <span>₹20</span>
              </div>
              
              {donation > 0 && (
                <div className="price-row donation">
                  <span>Donation:</span>
                  <span>₹{donation}</span>
                </div>
              )}
              
              <div className="price-row">
                <span>Tax (18% GST):</span>
                <span>₹{taxAmount.toLocaleString()}</span>
              </div>
              
              <hr />
              
              <div className="price-row total">
                <span>Total Amount:</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
              
              {coupon && couponDiscount > 0 && (
                <div className="savings-highlight">
                  🎉 You saved ₹{(totalDiscount + couponDiscount).toLocaleString()} in total!
                </div>
              )}
            </div>

            <button 
              className={`place-order ${cart.length === 0 ? 'disabled' : ''}`}
              onClick={handleSaveCart}
              disabled={cart.length === 0 || isLoading}
            >
              {isLoading ? "PROCESSING..." : "PROCEED TO ADDRESS"}
            </button>
            
            <div className="secure-payment">
              {/* <span>🔒 100% Secure Payment</span> */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
