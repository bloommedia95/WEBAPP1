// src/components/SavedAddress.js - Fully Dynamic Address Management
import React, { useState, useContext, useEffect } from "react";
import "./first.css";
import Navbar from "./navbar";
import Footer from "./footer";
import LoginModal from "./LoginModal";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function SavedAddress() {
  // States
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'Home',
    deliveryInstructions: ''
  });
  
  const { user } = useContext(AuthContext);

  // Fetch addresses from API
  const fetchAddresses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/addresses/user/${user._id}`);
      const data = await response.json();
      
      if (data.success) {
        setAddresses(data.addresses);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch addresses');
      }
    } catch (error) {
      console.error('Fetch addresses error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load addresses when component mounts
  useEffect(() => {
    fetchAddresses();
  }, [user]);

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
          fullName: '',
          phoneNumber: '',
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
        alert('Address added successfully!');
      } else {
        alert(data.message || 'Failed to add address');
      }
    } catch (error) {
      console.error('Add address error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Edit address
  const handleEditAddress = (address) => {
    setEditingAddress(address.id);
    setFormData({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      landmark: address.landmark || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      addressType: address.addressType,
      deliveryInstructions: address.deliveryInstructions || ''
    });
    setShowAddForm(true);
  };

  // Update address
  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/addresses/${editingAddress}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowAddForm(false);
        setEditingAddress(null);
        setFormData({
          fullName: '',
          phoneNumber: '',
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
        alert('Address updated successfully!');
      } else {
        alert(data.message || 'Failed to update address');
      }
    } catch (error) {
      console.error('Update address error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to remove this address?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchAddresses(); // Refresh addresses
        alert('Address removed successfully!');
      } else {
        alert(data.message || 'Failed to remove address');
      }
    } catch (error) {
      console.error('Delete address error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Set default address
  const handleSetDefault = async (addressId) => {
    try {
      const response = await fetch(`/api/addresses/${addressId}/set-default`, {
        method: 'PATCH'
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchAddresses(); // Refresh addresses
      } else {
        alert(data.message || 'Failed to set default address');
      }
    } catch (error) {
      console.error('Set default address error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Cancel form
  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    setFormData({
      fullName: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      addressType: 'Home',
      deliveryInstructions: ''
    });
  };

  return (
    <>
      <Navbar />

      {!user ? (
        <div style={{ padding: '40px 20px', minHeight: '60vh' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1>Saved Addresses</h1>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '30px', 
              borderRadius: '10px', 
              marginTop: '30px' 
            }}>
              <h3>Please Login to View Your Addresses</h3>
              <p style={{ margin: '20px 0', color: '#666' }}>
                You need to be logged in to access your saved addresses.
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
            <h2>Loading your addresses...</h2>
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
          {/* Saved Address Section */}
          <div className="order-container">
            {/* Sidebar */}
            <aside className="order-sidebar">
              <h3>Account</h3>
              <p className="username">{user.name || user.email}</p>
              <ul>
                <li><Link to="/order-details">Order Detail</Link></li>
                <li className="active">Saved Address</li>
                <li><Link to="/save-card">Saved Cards & UPI</Link></li>
                <li><Link to="/coupons">Coupons</Link></li>
                <li><Link to="/helpcenter">Help Center</Link></li>
                <li><Link to="/editprofile">Edit Profile</Link></li>
                <li><Link to="/logout">Logout</Link></li>
              </ul>
            </aside>

            {/* Main Content */}
            <main className="saved-address-main">
              <div className="saved-address-header">
                <h2>Saved Address</h2>
                <button 
                  className="btn-add-address"
                  onClick={() => {
                    setShowAddForm(true);
                    setEditingAddress(null);
                    setFormData({
                      fullName: user?.name || '',
                      phoneNumber: user?.phoneNumber || '',
                      addressLine1: '',
                      addressLine2: '',
                      landmark: '',
                      city: '',
                      state: '',
                      pincode: '',
                      addressType: 'Home',
                      deliveryInstructions: ''
                    });
                  }}
                >
                  Add New Address
                </button>
              </div>

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
                  <button onClick={fetchAddresses} style={{
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

              <div className="saved-address-list">
                {addresses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 40px' }}>
                    <div style={{ fontSize: '48px', color: '#ddd', marginBottom: '20px' }}>
                      📍
                    </div>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '24px', color: '#333' }}>No Addresses Found</h3>
                    <p style={{ margin: '0 0 30px 0', color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
                      Add your first delivery address to get started
                    </p>
                    <button 
                      className="btn-add-address"
                      onClick={() => {
                        setShowAddForm(true);
                        setEditingAddress(null);
                        setFormData({
                          fullName: user?.name || '',
                          phoneNumber: user?.phoneNumber || '',
                          addressLine1: '',
                          addressLine2: '',
                          landmark: '',
                          city: '',
                          state: '',
                          pincode: '',
                          addressType: 'Home',
                          deliveryInstructions: ''
                        });
                      }}
                    >
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Default Address */}
                    {addresses.filter(addr => addr.isDefault).map((address) => (
                      <div key={address.id} className="saved-address-card">
                        <h4>Default Address</h4>
                        <div className="saved-address-box">
                          <p className="name">{address.fullName}</p>
                          <p className="address">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                            {address.landmark && `, Near ${address.landmark}`}
                            <br />
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="mobile">Mobile No: {address.phoneNumber}</p>
                          {address.deliveryInstructions && (
                            <p className="instructions">Instructions: {address.deliveryInstructions}</p>
                          )}
                          <div className="saved-address-actions">
                            <button 
                              className="btn-remove"
                              onClick={() => handleDeleteAddress(address.id)}
                            >
                              Remove
                            </button>
                            <button 
                              className="btn-edit"
                              onClick={() => handleEditAddress(address)}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Other Addresses */}
                    {addresses.filter(addr => !addr.isDefault).map((address) => (
                      <div key={address.id} className="saved-address-card">
                        <h4>Other Address ({address.addressType})</h4>
                        <div className="saved-address-box">
                          <p className="name">{address.fullName}</p>
                          <p className="address">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                            {address.landmark && `, Near ${address.landmark}`}
                            <br />
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="mobile">Mobile No: {address.phoneNumber}</p>
                          {address.deliveryInstructions && (
                            <p className="instructions">Instructions: {address.deliveryInstructions}</p>
                          )}
                          <div className="saved-address-actions">
                            <button 
                              className="btn-set-default"
                              onClick={() => handleSetDefault(address.id)}
                            >
                              Set Default
                            </button>
                            <button 
                              className="btn-remove"
                              onClick={() => handleDeleteAddress(address.id)}
                            >
                              Remove
                            </button>
                            <button 
                              className="btn-edit"
                              onClick={() => handleEditAddress(address)}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Address Statistics */}
              {addresses.length > 0 && (
                <div style={{
                  marginTop: '30px',
                  padding: '20px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <h4>Address Statistics</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '15px' }}>
                    <div>
                      <strong>{addresses.length}</strong><br />
                      <span>Total</span>
                    </div>
                    <div>
                      <strong>{addresses.filter(addr => addr.addressType === 'Home').length}</strong><br />
                      <span>Home</span>
                    </div>
                    <div>
                      <strong>{addresses.filter(addr => addr.addressType === 'Work').length}</strong><br />
                      <span>Work</span>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>

          <Footer />
        </>
      )}

      {/* Address Form Modal */}
      {showAddForm && (
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
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              padding: '20px 30px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
              <button 
                onClick={handleCancelForm}
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
            
            <form onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}>
              <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      marginTop: '8px'
                    }}
                  />
                </div>

                <div>
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      marginTop: '8px'
                    }}
                    placeholder="Enter 10-digit phone number"
                    minLength="10"
                  />
                </div>

                <div>
                  <label>Address Type</label>
                  <select
                    name="addressType"
                    value={formData.addressType}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      marginTop: '8px'
                    }}
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Address Line 1 *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      marginTop: '8px'
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Address Line 2</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      marginTop: '8px'
                    }}
                  />
                </div>

                <div>
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      marginTop: '8px'
                    }}
                  />
                </div>

                <div>
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      marginTop: '8px'
                    }}
                  />
                </div>

                <div>
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      marginTop: '8px'
                    }}
                    placeholder="Enter 6-digit pincode"
                    maxLength="6"
                    pattern="[0-9]{6}"
                  />
                </div>

                <div>
                  <label>Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      marginTop: '8px'
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Delivery Instructions</label>
                  <textarea
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      marginTop: '8px'
                    }}
                  ></textarea>
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
                  onClick={handleCancelForm}
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
                  {editingAddress ? 'Update Address' : 'Save Address'}
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

export default SavedAddress;
