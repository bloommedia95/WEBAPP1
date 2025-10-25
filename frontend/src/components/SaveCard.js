// SaveCard.js - Fully Dynamic Payment Methods Management
import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./first.css";
import Navbar from "./navbar";
import Footer from "./footer";
import LoginModal from "./LoginModal";
import { AuthContext } from "../context/AuthContext";

function SavedCard() {
  // States
  const [activeTab, setActiveTab] = useState("cards");
  const [showLogin, setShowLogin] = useState(false);
  const [cards, setCards] = useState([]);
  const [upis, setUPIs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [showCardForm, setShowCardForm] = useState(false);
  const [showUPIForm, setShowUPIForm] = useState(false);
  const [cardFormData, setCardFormData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardType: 'Visa',
    cardCategory: 'Debit',
    bankName: '',
    nickname: ''
  });
  const [upiFormData, setUPIFormData] = useState({
    upiId: '',
    provider: 'GooglePay',
    accountHolderName: '',
    mobileNumber: '',
    nickname: ''
  });
  
  const { user } = useContext(AuthContext);

  // Fetch cards from API
  const fetchCards = async () => {
    if (!user) {
      console.log('❌ No user found, skipping fetch cards');
      return;
    }
    
    console.log('🔍 Fetching cards for user:', user._id);
    
    try {
      setLoading(true);
      const response = await fetch(`/api/payments/cards/user/${user._id}`);
      console.log('📡 Cards API response status:', response.status);
      
      const data = await response.json();
      console.log('📊 Cards API response data:', data);
      
      if (data.success) {
        setCards(data.cards);
        setError('');
        console.log('✅ Cards fetched successfully:', data.cards.length);
      } else {
        setError(data.message || 'Failed to fetch cards');
        console.log('❌ Cards fetch failed:', data.message);
      }
    } catch (error) {
      console.error('💥 Fetch cards error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch UPIs from API
  const fetchUPIs = async () => {
    if (!user) {
      console.log('❌ No user found, skipping fetch UPIs');
      return;
    }
    
    console.log('🔍 Fetching UPIs for user:', user._id);
    
    try {
      const response = await fetch(`/api/payments/upi/user/${user._id}`);
      console.log('📡 UPIs API response status:', response.status);
      
      const data = await response.json();
      console.log('📊 UPIs API response data:', data);
      
      if (data.success) {
        setUPIs(data.upis);
        setError('');
        console.log('✅ UPIs fetched successfully:', data.upis.length);
      } else {
        setError(data.message || 'Failed to fetch UPI IDs');
        console.log('❌ UPIs fetch failed:', data.message);
      }
    } catch (error) {
      console.error('💥 Fetch UPIs error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load payment methods when component mounts
  useEffect(() => {
    console.log('🚀 SaveCard useEffect triggered, user:', user);
    if (user) {
      console.log('👤 User found, fetching payment methods for user ID:', user._id);
      fetchCards();
      fetchUPIs();
    } else {
      console.log('❌ No user found, stopping loading');
      setLoading(false);
    }
  }, [user]);

  // Handle card form input changes
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      if (formattedValue.replace(/\s/g, '').length <= 16) {
        setCardFormData(prev => ({ ...prev, [name]: formattedValue }));
      }
      return;
    }
    
    // CVV validation
    if (name === 'cvv' && value.length > 4) return;
    
    setCardFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle UPI form input changes
  const handleUPIInputChange = (e) => {
    const { name, value } = e.target;
    setUPIFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add new card
  const handleAddCard = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/payments/cards/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          ...cardFormData
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowCardForm(false);
        setCardFormData({
          cardHolderName: '',
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          cardType: 'Visa',
          cardCategory: 'Debit',
          bankName: '',
          nickname: ''
        });
        fetchCards();
        alert('Card added successfully!');
      } else {
        alert(data.message || 'Failed to add card');
      }
    } catch (error) {
      console.error('Add card error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Add new UPI
  const handleAddUPI = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/payments/upi/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          ...upiFormData
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowUPIForm(false);
        setUPIFormData({
          upiId: '',
          provider: 'GooglePay',
          accountHolderName: '',
          mobileNumber: '',
          nickname: ''
        });
        fetchUPIs();
        alert('UPI ID added successfully!');
      } else {
        alert(data.message || 'Failed to add UPI ID');
      }
    } catch (error) {
      console.error('Add UPI error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Delete card
  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Are you sure you want to remove this card?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/payments/cards/${cardId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchCards();
        alert('Card removed successfully!');
      } else {
        alert(data.message || 'Failed to remove card');
      }
    } catch (error) {
      console.error('Delete card error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Delete UPI
  const handleDeleteUPI = async (upiId) => {
    if (!window.confirm('Are you sure you want to remove this UPI ID?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/payments/upi/${upiId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchUPIs();
        alert('UPI ID removed successfully!');
      } else {
        alert(data.message || 'Failed to remove UPI ID');
      }
    } catch (error) {
      console.error('Delete UPI error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Set default card
  const handleSetDefaultCard = async (cardId) => {
    try {
      const response = await fetch(`/api/payments/cards/${cardId}/set-default`, {
        method: 'PATCH'
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchCards();
      } else {
        alert(data.message || 'Failed to set default card');
      }
    } catch (error) {
      console.error('Set default card error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Set default UPI
  const handleSetDefaultUPI = async (upiId) => {
    try {
      const response = await fetch(`/api/payments/upi/${upiId}/set-default`, {
        method: 'PATCH'
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchUPIs();
      } else {
        alert(data.message || 'Failed to set default UPI');
      }
    } catch (error) {
      console.error('Set default UPI error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Generate years for expiry dropdown
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 20; i++) {
      years.push((currentYear + i).toString());
    }
    return years;
  };

  // Get card type icon
  const getCardIcon = (cardType) => {
    switch (cardType.toLowerCase()) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'rupay': return '💳';
      case 'american express': return '💳';
      default: return '💳';
    }
  };

  // Get UPI provider icon
  const getUPIIcon = (provider) => {
    switch (provider.toLowerCase()) {
      case 'googlepay': return '🟢';
      case 'phonepe': return '🟣';
      case 'paytm': return '🔵';
      case 'bhim': return '🟠';
      default: return '💰';
    }
  };

  return (
    <>
      <Navbar />

      {!user ? (
        <div style={{ padding: '40px 20px', minHeight: '60vh' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1>Save Cards & UPI</h1>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '30px', 
              borderRadius: '10px', 
              marginTop: '30px' 
            }}>
              <h3>Please Login to View Your Payment Methods</h3>
              <p style={{ margin: '20px 0', color: '#666' }}>
                You need to be logged in to access your saved cards and UPI details.
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
      ) : loading ? (
        <div style={{ padding: '40px 20px', minHeight: '60vh', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>Loading your payment methods...</h2>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #FF0004',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '20px auto'
            }}></div>
          </div>
        </div>
      ) : (
        <>
          {/* Payment Methods Section */}
          <div className="order-container">
            {/* Sidebar */}
            <aside className="order-sidebar">
              <h3>Account</h3>
              <p className="username">{user.name || user.email}</p>
              <ul>
                <li><Link to="/order-details">Order Detail</Link></li>
                <li><Link to="/saved-address">Saved Address</Link></li>
                <li className="active">Saved Cards & UPI</li>
                <li><Link to="/coupons">Coupons</Link></li>
                <li><Link to="/helpcenter">Help & Support</Link></li>
                <li><Link to="/editprofile">Edit Profile</Link></li>
                <li><Link to="/logout">Logout</Link></li>
              </ul>
            </aside>

            {/* Main Content */}
            <main className="saved-address-main">
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
                    if (activeTab === 'cards') fetchCards();
                    else fetchUPIs();
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

              {/* Header with Add Buttons */}
              <div className="saved-address-header">
                <h2>Saved Cards & UPI</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn-add-address"
                    onClick={() => {
                      setShowCardForm(true);
                      setCardFormData({
                        cardHolderName: user?.name || '',
                        cardNumber: '',
                        expiryMonth: '',
                        expiryYear: '',
                        cvv: '',
                        cardType: 'Visa',
                        cardCategory: 'Debit',
                        bankName: '',
                        nickname: ''
                      });
                    }}
                    style={{ marginRight: '10px' }}
                  >
                    Add Card
                  </button>
                  <button 
                    className="btn-add-address"
                    onClick={() => {
                      setShowUPIForm(true);
                      setUPIFormData({
                        upiId: '',
                        provider: 'GooglePay',
                        accountHolderName: user?.name || '',
                        mobileNumber: user?.contactNumber || '',
                        nickname: ''
                      });
                    }}
                  >
                    Add UPI
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="savedcards-tabs">
                <button
                  className={activeTab === "cards" ? "tab active" : "tab"}
                  onClick={() => setActiveTab("cards")}
                >
                  Cards ({cards.length})
                </button>
                <button
                  className={activeTab === "upi" ? "tab active" : "tab"}
                  onClick={() => setActiveTab("upi")}
                >
                  UPI ({upis.length})
                </button>
              </div>

              {/* Content */}
              <div className="savedcards-content">
                {activeTab === "cards" && (
                  <div>
                    {cards.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '60px 40px' }}>
                        <div style={{ fontSize: '48px', color: '#ddd', marginBottom: '20px' }}>
                          💳
                        </div>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '24px', color: '#333' }}>No Cards Found</h3>
                        <p style={{ margin: '0 0 30px 0', color: '#666', fontSize: '16px' }}>
                          Add your first payment card to get started
                        </p>
                        <button 
                          className="btn-add-address"
                          onClick={() => {
                            setShowCardForm(true);
                            setCardFormData({
                              cardHolderName: user?.name || '',
                              cardNumber: '',
                              expiryMonth: '',
                              expiryYear: '',
                              cvv: '',
                              cardType: 'Visa',
                              cardCategory: 'Debit',
                              bankName: '',
                              nickname: ''
                            });
                          }}
                        >
                          Add Your First Card
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {cards.map((card) => (
                          <div key={card.id} className={`card-box ${card.isDefault ? 'default-card' : ''}`} style={{
                            border: card.isDefault ? '2px solid #FF0004' : '1px solid #ddd',
                            borderRadius: '12px',
                            padding: '20px',
                            background: 'white',
                            position: 'relative'
                          }}>
                            {card.isDefault && (
                              <div style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '15px',
                                background: '#FF0004',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                Default
                              </div>
                            )}
                            
                            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '24px' }}>{getCardIcon(card.cardType)}</span>
                                <div>
                                  <span className="bank-name" style={{ fontWeight: '600' }}>{card.bankName}</span>
                                  <div style={{ fontSize: '12px', color: '#666' }}>
                                    {card.cardType} • {card.cardCategory}
                                  </div>
                                </div>
                              </div>
                              {card.isExpired && (
                                <span style={{
                                  background: '#ff4444',
                                  color: 'white',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '10px'
                                }}>
                                  Expired
                                </span>
                              )}
                            </div>
                            
                            <p className="card-number" style={{ margin: '10px 0 5px 0', fontWeight: '500' }}>
                              {card.cardHolderName}
                            </p>
                            <p className="card-digits" style={{ 
                              fontSize: '18px', 
                              fontFamily: 'monospace', 
                              letterSpacing: '2px',
                              margin: '5px 0 10px 0' 
                            }}>
                              {card.maskedCardNumber}
                            </p>
                            <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 15px 0' }}>
                              Expires: {card.formattedExpiry}
                            </p>
                            {card.nickname && (
                              <p style={{ fontSize: '12px', color: '#888', margin: '5px 0', fontStyle: 'italic' }}>
                                "{card.nickname}"
                              </p>
                            )}
                            
                            <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                              {!card.isDefault && (
                                <button 
                                  onClick={() => handleSetDefaultCard(card.id)}
                                  style={{
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Set Default
                                </button>
                              )}
                              <button 
                                className="remove-btn"
                                onClick={() => handleDeleteCard(card.id)}
                                style={{
                                  background: '#ff4444',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "upi" && (
                  <div>
                    {upis.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '60px 40px' }}>
                        <div style={{ fontSize: '48px', color: '#ddd', marginBottom: '20px' }}>
                          💰
                        </div>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '24px', color: '#333' }}>No UPI IDs Found</h3>
                        <p style={{ margin: '0 0 30px 0', color: '#666', fontSize: '16px' }}>
                          Add your first UPI ID for quick payments
                        </p>
                        <button 
                          className="btn-add-address"
                          onClick={() => {
                            setShowUPIForm(true);
                            setUPIFormData({
                              upiId: '',
                              provider: 'GooglePay',
                              accountHolderName: user?.name || '',
                              mobileNumber: user?.contactNumber || '',
                              nickname: ''
                            });
                          }}
                        >
                          Add Your First UPI
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {upis.map((upi) => (
                          <div key={upi.id} className={`upi-box ${upi.isDefault ? 'default-card' : ''}`} style={{
                            border: upi.isDefault ? '2px solid #FF0004' : '1px solid #ddd',
                            borderRadius: '12px',
                            padding: '20px',
                            background: 'white',
                            position: 'relative'
                          }}>
                            {upi.isDefault && (
                              <div style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '15px',
                                background: '#FF0004',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                Default
                              </div>
                            )}
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                              <span style={{ fontSize: '24px' }}>{getUPIIcon(upi.provider)}</span>
                              <div>
                                <div style={{ fontWeight: '600' }}>{upi.provider}</div>
                                {upi.isVerified && (
                                  <div style={{ fontSize: '12px', color: '#28a745' }}>✓ Verified</div>
                                )}
                              </div>
                            </div>
                            
                            <p style={{ margin: '10px 0 5px 0', fontWeight: '500' }}>
                              {upi.accountHolderName}
                            </p>
                            <p style={{ 
                              fontSize: '16px', 
                              fontFamily: 'monospace',
                              margin: '5px 0 10px 0',
                              color: '#333'
                            }}>
                              {upi.maskedUpiId}
                            </p>
                            <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 15px 0' }}>
                              Mobile: {upi.mobileNumber}
                            </p>
                            {upi.nickname && (
                              <p style={{ fontSize: '12px', color: '#888', margin: '5px 0', fontStyle: 'italic' }}>
                                "{upi.nickname}"
                              </p>
                            )}
                            
                            <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                              {!upi.isDefault && (
                                <button 
                                  onClick={() => handleSetDefaultUPI(upi.id)}
                                  style={{
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Set Default
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeleteUPI(upi.id)}
                                style={{
                                  background: '#ff4444',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </main>
          </div>

          <Footer />
        </>
      )}
      {/* Card Form Modal */}
      {showCardForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              padding: '20px 30px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3>Add New Card</h3>
              <button 
                onClick={() => setShowCardForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddCard}>
              <div style={{ padding: '30px', display: 'grid', gap: '15px' }}>
                <div>
                  <label>Card Holder Name *</label>
                  <input
                    type="text"
                    name="cardHolderName"
                    value={cardFormData.cardHolderName}
                    onChange={handleCardInputChange}
                    required
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '5px' }}
                  />
                </div>

                <div>
                  <label>Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardFormData.cardNumber}
                    onChange={handleCardInputChange}
                    required
                    placeholder="1234 5678 9012 3456"
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '5px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label>Month *</label>
                    <select
                      name="expiryMonth"
                      value={cardFormData.expiryMonth}
                      onChange={handleCardInputChange}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '5px' }}
                    >
                      <option value="">Month</option>
                      {Array.from({length: 12}, (_, i) => {
                        const month = (i + 1).toString().padStart(2, '0');
                        return <option key={month} value={month}>{month}</option>
                      })}
                    </select>
                  </div>
                  
                  <div>
                    <label>Year *</label>
                    <select
                      name="expiryYear"
                      value={cardFormData.expiryYear}
                      onChange={handleCardInputChange}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '5px' }}
                    >
                      <option value="">Year</option>
                      {generateYears().map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label>CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardFormData.cvv}
                      onChange={handleCardInputChange}
                      required
                      maxLength="4"
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '5px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label>Card Type *</label>
                    <select
                      name="cardType"
                      value={cardFormData.cardType}
                      onChange={handleCardInputChange}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '5px' }}
                    >
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="Rupay">Rupay</option>
                      <option value="American Express">American Express</option>
                    </select>
                  </div>
                  
                  <div>
                    <label>Card Category *</label>
                    <select
                      name="cardCategory"
                      value={cardFormData.cardCategory}
                      onChange={handleCardInputChange}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '5px' }}
                    >
                      <option value="Debit">Debit Card</option>
                      <option value="Credit">Credit Card</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label>Bank Name *</label>
                  <input
                    type="text"
                    name="bankName"
                    value={cardFormData.bankName}
                    onChange={handleCardInputChange}
                    required
                    placeholder="e.g., HDFC Bank, SBI, ICICI"
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '5px' }}
                  />
                </div>

                <div>
                  <label>Nickname (Optional)</label>
                  <input
                    type="text"
                    name="nickname"
                    value={cardFormData.nickname}
                    onChange={handleCardInputChange}
                    placeholder="e.g., Salary Card, Shopping Card"
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '5px' }}
                  />
                </div>
              </div>

              <div style={{
                padding: '20px 30px',
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '15px'
              }}>
                <button 
                  type="button" 
                  onClick={() => setShowCardForm(false)}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    background: '#FF0004',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPI Form Modal */}
      {showUPIForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              padding: '20px 30px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3>Add New UPI ID</h3>
              <button 
                onClick={() => setShowUPIForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddUPI}>
              <div style={{ padding: '30px', display: 'grid', gap: '15px' }}>
                <div>
                  <label>UPI ID *</label>
                  <input
                    type="text"
                    name="upiId"
                    value={upiFormData.upiId}
                    onChange={handleUPIInputChange}
                    required
                    placeholder="username@paytm, mobile@ybl"
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '5px' }}
                  />
                </div>

                <div>
                  <label>UPI Provider *</label>
                  <select
                    name="provider"
                    value={upiFormData.provider}
                    onChange={handleUPIInputChange}
                    required
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '5px' }}
                  >
                    <option value="GooglePay">Google Pay</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Paytm">Paytm</option>
                    <option value="BHIM">BHIM</option>
                    <option value="Amazon Pay">Amazon Pay</option>
                    <option value="WhatsApp Pay">WhatsApp Pay</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label>Account Holder Name *</label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={upiFormData.accountHolderName}
                    onChange={handleUPIInputChange}
                    required
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '5px' }}
                  />
                </div>

                <div>
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={upiFormData.mobileNumber}
                    onChange={handleUPIInputChange}
                    required
                    placeholder="10-digit mobile number"
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '5px' }}
                  />
                </div>

                <div>
                  <label>Nickname (Optional)</label>
                  <input
                    type="text"
                    name="nickname"
                    value={upiFormData.nickname}
                    onChange={handleUPIInputChange}
                    placeholder="e.g., Personal UPI, Business UPI"
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '5px' }}
                  />
                </div>
              </div>

              <div style={{
                padding: '20px 30px',
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '15px'
              }}>
                <button 
                  type="button" 
                  onClick={() => setShowUPIForm(false)}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    background: '#FF0004',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Add UPI ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default SavedCard;
