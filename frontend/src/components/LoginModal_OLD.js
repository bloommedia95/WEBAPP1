import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './first.css';

function LoginModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login logic
      if (email && password) {
        // Mock login - in real app, you'd call an API
        const user = {
          id: 1,
          email: email,
          name: name || 'User',
        };
        login(user);
        onClose();
      }
    } else {
      // Signup logic
      if (email && password && name && phone) {
        // Mock signup - in real app, you'd call an API
        const user = {
          id: 1,
          email: email,
          name: name,
          phone: phone,
        };
        login(user);
        onClose();
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <p className="sub-text">
          {isLogin 
            ? 'Welcome back! Please login to your account.' 
            : 'Create your account to get started.'}
        </p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          {!isLogin && (
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          )}
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <div className="signup-text">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }}>
                Sign Up
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }}>
                Login
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginModal;