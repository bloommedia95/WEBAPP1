import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./first.css";
import Navbar from "./navbar";
import Footer from "./footer";
import LoginModal from "./LoginModal";
import { AuthContext } from "../context/AuthContext";

function EditProfile() {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState('basic'); // basic, address, preferences

  // Form state for all profile fields
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    alternateNumber: "",
    gender: "",
    birthday: "",
    fullName: "",
    profileImage: "",
    bio: "",
    occupation: "",
    dateOfBirth: "",
    addresses: [],
    preferences: {
      newsletter: false,
      smsAlerts: false,
      emailNotifications: true,
      language: 'en',
      currency: 'INR'
    }
  });

  // Mobile number editing state
  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [tempMobile, setTempMobile] = useState("");

  // Load user profile data when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      // Set default values from user context first
      const defaultData = {
        name: user.name || "",
        email: user.email || "",
        contactNumber: user.contactNumber || user.phone || "",
        alternateNumber: "",
        gender: "",
        birthday: "",
        fullName: user.name || user.fullName || "",
        profileImage: user.profileImage || user.avatar || "",
        bio: "",
        occupation: "",
        dateOfBirth: "",
        addresses: [],
        preferences: {
          newsletter: false,
          smsAlerts: false,
          emailNotifications: true,
          language: 'en',
          currency: 'INR'
        }
      };
      
      setProfileData(defaultData);
      setTempMobile(user.contactNumber || user.phone || "");
      
      // Try to load additional data from API if available
      try {
        const userId = user._id || user.id;
        const token = user.token || localStorage.getItem('authToken');
        
        const response = await axios.get(`/api/users/profile/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          const userData = response.data.user;
          setProfileData({
            name: userData.name || defaultData.name,
            email: userData.email || defaultData.email,
            contactNumber: userData.contactNumber || userData.phone || defaultData.contactNumber,
            alternateNumber: userData.alternateNumber || "",
            gender: userData.gender || "",
            birthday: userData.birthday ? userData.birthday.split('T')[0] : "",
            fullName: userData.fullName || userData.name || defaultData.name,
            profileImage: userData.profileImage || userData.avatar || defaultData.profileImage,
            bio: userData.bio || "",
            occupation: userData.occupation || "",
            dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : "",
            addresses: userData.addresses || [],
            preferences: {
              newsletter: userData.preferences?.newsletter || false,
              smsAlerts: userData.preferences?.smsAlerts || false,
              emailNotifications: userData.preferences?.emailNotifications !== false,
              language: userData.preferences?.language || 'en',
              currency: userData.preferences?.currency || 'INR'
            }
          });
          setTempMobile(userData.contactNumber || userData.phone || defaultData.contactNumber);
          
          // Update user context if we got new data
          if (updateUser) {
            updateUser({
              ...user,
              ...userData,
              profileImage: userData.profileImage || userData.avatar
            });
          }
        }
      } catch (apiError) {
        console.log("Profile API not available, using user context data:", apiError);
        // Try fallback API endpoint
        try {
          const fallbackResponse = await axios.get('/api/profile', {
            params: { email: user.email }
          });
          
          if (fallbackResponse.data.success) {
            const userData = fallbackResponse.data.user;
            setProfileData(prev => ({
              ...prev,
              ...userData,
              birthday: userData.birthday ? userData.birthday.split('T')[0] : prev.birthday
            }));
          }
        } catch (fallbackError) {
          console.log("Fallback API also failed, using context data only");
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Failed to load profile data. Using available information.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('preferences.')) {
      const prefKey = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear messages when user types
    if (message || error) {
      setMessage("");
      setError("");
    }
  };

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('profileImage', file);
      formData.append('userId', user._id || user.id);

      const token = user.token || localStorage.getItem('authToken');
      const response = await axios.post('/api/users/upload-profile-image', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const imageUrl = response.data.imageUrl;
        setProfileData(prev => ({
          ...prev,
          profileImage: imageUrl
        }));
        
        // Update user context
        if (updateUser) {
          updateUser({
            ...user,
            profileImage: imageUrl,
            avatar: imageUrl
          });
        }
        
        setMessage('Profile image updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Trigger file input
  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  // Remove profile image
  const removeProfileImage = () => {
    setProfileData(prev => ({
      ...prev,
      profileImage: ''
    }));
    setMessage('Profile image removed');
    setTimeout(() => setMessage(''), 2000);
  };

  // Handle mobile number editing - simplified
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (value.length <= 10) { // Limit to 10 digits
      setTempMobile(value);
    }
  };

  const handleMobileEditToggle = () => {
    if (isEditingMobile) {
      // Validate mobile number before saving
      if (tempMobile.length !== 10) {
        setError("Mobile number must be exactly 10 digits");
        return;
      }
      
      // Save mobile number to main profile data
      setProfileData(prev => ({
        ...prev,
        contactNumber: tempMobile
      }));
      
      setMessage("Mobile number updated! Don't forget to save your profile.");
      setTimeout(() => setMessage(""), 3000);
    } else {
      // Start editing - set current number
      setTempMobile(profileData.contactNumber.replace(/[^0-9]/g, ''));
    }
    setIsEditingMobile(!isEditingMobile);
  };

  // Enhanced but simplified form validation
  const validateForm = () => {
    // Clear previous errors
    setError("");
    
    // Required field checks
    if (!profileData.name || !profileData.name.trim()) {
      setError("Full name is required");
      return false;
    }
    
    if (!profileData.email || !profileData.email.trim()) {
      setError("Email address is required");
      return false;
    }
    
    if (!profileData.contactNumber || !profileData.contactNumber.trim()) {
      setError("Mobile number is required");
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email.trim())) {
      setError("Please enter a valid email address");
      return false;
    }
    
    // Mobile number validation
    const cleanNumber = profileData.contactNumber.replace(/[\s-()]/g, '');
    if (!/^\d{10}$/.test(cleanNumber)) {
      setError("Mobile number must be exactly 10 digits");
      return false;
    }
    
    // Alternate number validation (if provided)
    if (profileData.alternateNumber && profileData.alternateNumber.trim()) {
      const cleanAltNumber = profileData.alternateNumber.replace(/[\s-()]/g, '');
      if (!/^\d{10}$/.test(cleanAltNumber)) {
        setError("Alternate number must be exactly 10 digits");
        return false;
      }
      
      if (cleanNumber === cleanAltNumber) {
        setError("Alternate number cannot be same as primary mobile number");
        return false;
      }
    }
    
    // Birthday validation (if provided)
    if (profileData.birthday) {
      const birthDate = new Date(profileData.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (birthDate > today) {
        setError("Birthday cannot be in the future");
        return false;
      }
      
      if (age < 13) {
        setError("You must be at least 13 years old");
        return false;
      }
      
      if (age > 120) {
        setError("Please enter a valid birth date");
        return false;
      }
    }
    
    console.log("Form validation passed");
    return true;
  };

  // Handle form submission with enhanced API integration
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError("");
      
      console.log("Saving profile data:", profileData);
      
      // Prepare simplified data for saving
      const dataToSave = {
        name: profileData.name,
        email: profileData.email,
        contactNumber: profileData.contactNumber,
        phone: profileData.contactNumber, // Add for compatibility
        alternateNumber: profileData.alternateNumber,
        gender: profileData.gender,
        birthday: profileData.birthday,
        fullName: profileData.fullName || profileData.name,
        bio: profileData.bio,
        occupation: profileData.occupation,
        profileImage: profileData.profileImage,
        preferences: profileData.preferences,
        currentEmail: user.email,
        userId: user._id || user.id
      };
      
      console.log("Data being sent to API:", dataToSave);
      
      // Try to save with multiple approaches
      let saveSuccessful = false;
      
      // Approach 1: Try primary API with authentication
      try {
        const userId = user._id || user.id;
        const token = user.token || localStorage.getItem('authToken');
        
        if (userId && token) {
          const response = await axios.put(`http://localhost:5000/api/users/profile/${userId}`, dataToSave, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log("Primary API Response:", response.data);
          
          if (response.data.success || response.status === 200) {
            saveSuccessful = true;
            setMessage("Profile updated successfully via API!");
            
            // Update user context if available
            if (updateUser && response.data.user) {
              updateUser({
                ...user,
                ...response.data.user
              });
            }
          }
        }
      } catch (primaryError) {
        console.log("Primary API failed:", primaryError.message);
      }
      
      // Approach 2: Try fallback API without authentication
      if (!saveSuccessful) {
        try {
          const response = await axios.put('http://localhost:5000/api/profile', dataToSave);
          console.log("Fallback API Response:", response.data);
          
          if (response.data.success || response.status === 200) {
            saveSuccessful = true;
            setMessage("Profile updated successfully!");
          }
        } catch (fallbackError) {
          console.log("Fallback API also failed:", fallbackError.message);
        }
      }
      
      // Approach 3: Save to localStorage as final fallback
      if (!saveSuccessful) {
        try {
          const savedProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
          savedProfiles[user.email || 'default'] = dataToSave;
          localStorage.setItem('userProfiles', JSON.stringify(savedProfiles));
          
          // Also update user data in localStorage
          const updatedUser = {
            ...user,
            name: dataToSave.name,
            email: dataToSave.email,
            contactNumber: dataToSave.contactNumber,
            phone: dataToSave.contactNumber,
            profileImage: dataToSave.profileImage
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // Update context if available
          if (updateUser) {
            updateUser(updatedUser);
          }
          
          saveSuccessful = true;
          setMessage("Profile data saved locally! (API not available)");
        } catch (localError) {
          console.error("Local storage save failed:", localError);
        }
      }
      
      if (saveSuccessful) {
        setTimeout(() => setMessage(""), 4000);
      } else {
        setError("Failed to save profile. Please check your connection and try again.");
      }
      
    } catch (error) {
      console.error("Error in handleSaveProfile:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Delete account function
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      const userId = user._id || user.id;
      const token = user.token || localStorage.getItem('authToken');
      
      const response = await axios.delete(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />

      {!user ? (
        <div style={{ padding: '40px 20px', minHeight: '60vh' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1>Edit Profile</h1>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '30px', 
              borderRadius: '10px', 
              marginTop: '30px' 
            }}>
              <h3>Please Login to Edit Your Profile</h3>
              <p style={{ margin: '20px 0', color: '#666' }}>
                You need to be logged in to access and edit your personal details.
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
        <div className="order-container">
          {/* Sidebar */}
          <aside className="order-sidebar">
            <h3>Account</h3>
            <p className="username">{profileData.name || "User"}</p>
            <ul>
              <li><Link to="/order-details">Order Detail</Link></li>
              <li><Link to="/saved-address">Saved Address</Link></li>
              <li><Link to="/save-card">Saved Cards & UPI</Link></li>
              <li><Link to="/coupons">Coupons</Link></li>
              <li><Link to="/helpcenter">Help & Support</Link></li>
              <li className="active">Edit Profile</li>
              <li><Link to="/logout">Logout</Link></li>
            </ul>
          </aside>

          {/* Main Section */}
          <main className="saved-address-main">
            <div className="edit-profile">
              <h2>Edit Profile</h2>

              {/* Loading State */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '4px solid #f3f3f3', 
                    borderTop: '4px solid #FF0004',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 20px'
                  }}></div>
                  <p>Loading profile data...</p>
                </div>
              ) : (
                <>
                  {/* Tab Navigation */}
                  <div style={{ 
                    display: 'flex', 
                    borderBottom: '2px solid #eee', 
                    marginBottom: '20px' 
                  }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab('basic')}
                      style={{
                        padding: '10px 20px',
                        border: 'none',
                        background: activeTab === 'basic' ? '#FF0004' : 'transparent',
                        color: activeTab === 'basic' ? 'white' : '#333',
                        borderRadius: '4px 4px 0 0',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'basic' ? 'bold' : 'normal'
                      }}
                    >
                      Basic Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('preferences')}
                      style={{
                        padding: '10px 20px',
                        border: 'none',
                        background: activeTab === 'preferences' ? '#FF0004' : 'transparent',
                        color: activeTab === 'preferences' ? 'white' : '#333',
                        borderRadius: '4px 4px 0 0',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'preferences' ? 'bold' : 'normal',
                        marginLeft: '5px'
                      }}
                    >
                      Preferences
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('security')}
                      style={{
                        padding: '10px 20px',
                        border: 'none',
                        background: activeTab === 'security' ? '#FF0004' : 'transparent',
                        color: activeTab === 'security' ? 'white' : '#333',
                        borderRadius: '4px 4px 0 0',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'security' ? 'bold' : 'normal',
                        marginLeft: '5px'
                      }}
                    >
                      Security
                    </button>
                  </div>

                  <form onSubmit={handleSaveProfile}>
                    {/* Success/Error Messages */}
                    {message && (
                      <div style={{ 
                        padding: '15px', 
                        backgroundColor: '#d4edda', 
                        border: '1px solid #c3e6cb',
                        borderRadius: '8px',
                        color: '#155724',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: '500',
                        fontSize: '14px'
                      }}>
                        <span style={{ 
                          marginRight: '10px', 
                          fontSize: '18px',
                          color: '#28a745'
                        }}>✅</span>
                        {message}
                      </div>
                    )}
                    
                    {error && (
                      <div style={{ 
                        padding: '15px', 
                        backgroundColor: '#f8d7da', 
                        border: '1px solid #f5c6cb',
                        borderRadius: '8px',
                        color: '#721c24',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: '500',
                        fontSize: '14px'
                      }}>
                        <span style={{ 
                          marginRight: '10px', 
                          fontSize: '18px',
                          color: '#dc3545'
                        }}>❌</span>
                        {error}
                        <button
                          type="button"
                          onClick={() => setError("")}
                          style={{
                            marginLeft: 'auto',
                            background: 'transparent',
                            border: 'none',
                            color: '#721c24',
                            cursor: 'pointer',
                            fontSize: '18px',
                            padding: '0 5px'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {/* Basic Info Tab */}
                    {activeTab === 'basic' && (
                      <>
                        {/* Profile Image Section */}
                        {/* <div style={{ 
                          textAlign: 'center', 
                          marginBottom: '30px',
                          padding: '20px',
                          background: '#f8f9fa',
                          borderRadius: '8px'
                        }}>
                          <div style={{ 
                            position: 'relative', 
                            display: 'inline-block',
                            marginBottom: '15px'
                          }}>
                            <img
                              src={profileData.profileImage || '/img/user.png'}
                              alt="Profile"
                              style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '4px solid #fff',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                              }}
                            />
                            {uploadingImage && (
                              <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                background: 'rgba(0,0,0,0.7)',
                                borderRadius: '50%',
                                width: '120px',
                                height: '120px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                              }}>
                                <div style={{
                                  width: '20px',
                                  height: '20px',
                                  border: '2px solid #fff',
                                  borderTop: '2px solid transparent',
                                  borderRadius: '50%',
                                  animation: 'spin 1s linear infinite'
                                }}></div>
                              </div>
                            )}
                          </div> */}
                          {/* <div>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleImageUpload}
                              accept="image/*"
                              style={{ display: 'none' }}
                            />
                            <button
                              type="button"
                              onClick={triggerImageUpload}
                              disabled={uploadingImage}
                              style={{
                                background: '#FF0004',
                                color: 'white',
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '10px',
                                opacity: uploadingImage ? 0.7 : 1
                              }}
                            >
                              {uploadingImage ? 'Uploading...' : 'Change Photo'}
                            </button>
                            {profileData.profileImage && (
                              <button
                                type="button"
                                onClick={removeProfileImage}
                                style={{
                                  background: '#6c757d',
                                  color: 'white',
                                  padding: '8px 16px',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                                Remove
                              </button>
                            )}
                          </div> */}
                        {/* </div> */}

                        {/* Mobile Number with Change Button */}
                        <div className="form-group mobile-group">
                          <label>Mobile No. *</label>
                          <div className="mobile-box">
                            <input
                              type="text"
                              value={isEditingMobile ? tempMobile : profileData.contactNumber}
                              onChange={handleMobileChange}
                              readOnly={!isEditingMobile}
                              maxLength="15"
                              style={{
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                flex: '1',
                                marginRight: '10px'
                              }}
                            />
                            <button 
                              type="button"
                              className="change-btn" 
                              onClick={handleMobileEditToggle}
                              style={{
                                background: '#28a745',
                                color: 'white',
                                padding: '10px 15px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              {isEditingMobile ? "Save Number" : "Change"}
                            </button>
                          </div>
                        </div>

                        {/* Full Name */}
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input 
                            type="text" 
                            name="name"
                            value={profileData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name" 
                            required
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '14px'
                            }}
                          />
                        </div>

                        {/* Email */}
                        <div className="form-group">
                          <label>Email *</label>
                          <input 
                            type="email" 
                            name="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email" 
                            required
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '14px'
                            }}
                          />
                        </div>

                        {/* Bio */}
                        <div className="form-group">
                          <label>Bio</label>
                          <textarea 
                            name="bio"
                            value={profileData.bio}
                            onChange={handleInputChange}
                            placeholder="Tell us about yourself..."
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '14px',
                              resize: 'vertical'
                            }}
                          />
                        </div>

                        {/* Gender and Occupation Row */}
                        <div style={{ display: 'flex', gap: '15px' }}>
                          <div className="form-group" style={{ flex: 1 }}>
                            <label>Gender</label>
                            <select 
                              name="gender"
                              value={profileData.gender}
                              onChange={handleInputChange}
                              style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                              }}
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div className="form-group" style={{ flex: 1 }}>
                            <label>Occupation</label>
                            <input 
                              type="text" 
                              name="occupation"
                              value={profileData.occupation}
                              onChange={handleInputChange}
                              placeholder="Your profession"
                              style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                              }}
                            />
                          </div>
                        </div>

                        {/* Birthday */}
                        <div className="form-group">
                          <label>Birthday</label>
                          <input 
                            type="date" 
                            name="birthday"
                            value={profileData.birthday}
                            onChange={handleInputChange}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '14px'
                            }}
                          />
                        </div>

                        {/* Alternate Number */}
                        <div className="form-group">
                          <label>Alternate Number</label>
                          <input 
                            type="text" 
                            name="alternateNumber"
                            value={profileData.alternateNumber}
                            onChange={handleInputChange}
                            placeholder="Enter alternate number" 
                            maxLength="15"
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      </>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                      <>
                        <div style={{ marginBottom: '20px' }}>
                          <h3 style={{ marginBottom: '15px' }}>Notification Preferences</h3>
                          
                          <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                            <input 
                              type="checkbox" 
                              name="preferences.emailNotifications"
                              checked={profileData.preferences.emailNotifications}
                              onChange={handleInputChange}
                              style={{ marginRight: '10px' }}
                            />
                            <label style={{ margin: 0 }}>Email Notifications</label>
                          </div>

                          {/* <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                            <input 
                              type="checkbox" 
                              name="preferences.smsAlerts"
                              checked={profileData.preferences.smsAlerts}
                              onChange={handleInputChange}
                              style={{ marginRight: '10px' }}
                            />
                            <label style={{ margin: 0 }}>SMS Alerts</label>
                          </div> */}
{/* 
                          <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                            <input 
                              type="checkbox" 
                              name="preferences.newsletter"
                              checked={profileData.preferences.newsletter}
                              onChange={handleInputChange}
                              style={{ marginRight: '10px' }}
                            />
                            <label style={{ margin: 0 }}>Newsletter Subscription</label>
                          </div> */}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                          <h3 style={{ marginBottom: '15px' }}>Regional Preferences</h3>
                          
                          <div style={{ display: 'flex', gap: '15px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                              <label>Language</label>
                              <select 
                                name="preferences.language"
                                value={profileData.preferences.language}
                                onChange={handleInputChange}
                                style={{
                                  width: '100%',
                                  padding: '10px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                              >
                                <option value="en">English</option>
                                <option value="hi">Hindi</option>
                                <option value="bn">Bengali</option>
                                <option value="ta">Tamil</option>
                                <option value="te">Telugu</option>
                              </select>
                            </div>

                            <div className="form-group" style={{ flex: 1 }}>
                              <label>Currency</label>
                              <select 
                                name="preferences.currency"
                                value={profileData.preferences.currency}
                                onChange={handleInputChange}
                                style={{
                                  width: '100%',
                                  padding: '10px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                              >
                                <option value="INR">Indian Rupee (₹)</option>
                                <option value="USD">US Dollar ($)</option>
                                <option value="EUR">Euro (€)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                      <>
                        <div style={{ marginBottom: '20px' }}>
                          <h3 style={{ marginBottom: '15px' }}>Account Security</h3>
                          
                          <div className="form-group">
                            <label>Current Password</label>
                            <input 
                              type="password" 
                              name="currentPassword"
                              placeholder="Enter current password to make changes"
                              style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                              }}
                            />
                          </div>

                          <div className="form-group">
                            <label>New Password</label>
                            <input 
                              type="password" 
                              name="newPassword"
                              placeholder="Enter new password"
                              style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                              }}
                            />
                          </div>

                          <div className="form-group">
                            <label>Confirm New Password</label>
                            <input 
                              type="password" 
                              name="confirmPassword"
                              placeholder="Confirm new password"
                              style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                              }}
                            />
                          </div>

                          <div style={{ 
                            background: '#fff3cd', 
                            border: '1px solid #ffeaa7',
                            borderRadius: '4px',
                            padding: '15px',
                            marginTop: '20px'
                          }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>Account Deletion</h4>
                            <p style={{ margin: '0 0 15px 0', color: '#856404' }}>
                              Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <button
                              type="button"
                              onClick={handleDeleteAccount}
                              disabled={saving}
                              style={{
                                background: '#dc3545',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                opacity: saving ? 0.7 : 1
                              }}
                            >
                              {saving ? 'Processing...' : 'Delete Account'}
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Save Button */}
                    <button 
                      type="submit" 
                      className="save-btn"
                      disabled={saving}
                      style={{
                        background: '#FF0004',
                        color: 'white',
                        padding: '12px 30px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        opacity: saving ? 0.7 : 1,
                        marginTop: '20px',
                        width: '200px'
                      }}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </main>
        </div>
      )}

      <Footer />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      
      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }
        
        .mobile-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .edit-profile {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  );
}

export default EditProfile;
