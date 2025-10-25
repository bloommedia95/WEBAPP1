import React, { useState } from "react";
import "./signup.css";
import Navbar from "../components/navbar";
import LoginModal from "../components/LoginModal";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", contactNumber: "" });
  const [showLogin, setShowLogin] = useState(false); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Starting signup process...');
    console.log('📋 Form data to submit:', formData);
    console.log('🌐 Target URL:', 'http://localhost:5000/api/auth/signup');
    
    try {
      console.log('📡 Sending request...');
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log('📡 Response received!');
      console.log('📊 Response status:', res.status);
      console.log('📊 Response headers:', [...res.headers.entries()]);
      
      const data = await res.json();
      console.log('📋 Response data:', data);
      
      if (res.ok) {
        console.log('✅ Signup successful!');
        alert("User created successfully!");
        setFormData({ name: "", email: "", password: "", contactNumber: "" }); 
      } else {
        console.error('❌ Signup failed with status:', res.status);
        console.error('❌ Error message:', data.message);
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error('🚨 Network/Fetch error occurred:');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Full error object:', error);
      alert("Network error: " + error.message);
    }
  };

  return (
    <div className="signup-wrapper">
      <Navbar />
      <div className="signup-page">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <p className="signup-text">
          Already have an account?{" "}
          <span
            onClick={() => setShowLogin(true)}
            style={{ color: "#0070f3", cursor: "pointer" }}
          >
            Login here
          </span>
        </p>
      </div>

      {/* Login modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default Signup;
