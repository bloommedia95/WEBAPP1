// src/components/LoginModal.js
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { X, Mail, Phone, Shield, ArrowLeft } from "lucide-react";
import HelpModal from "./HelpModal";
import "./LoginModal.css";

const LoginModal = ({ onClose }) => {
  // States
  const [step, setStep] = useState(1); // 1: Input, 2: OTP
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactType, setContactType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const { setUser } = useContext(AuthContext);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Detect contact type (email/phone)
  const detectContactType = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    
    if (emailRegex.test(input)) return 'email';
    if (phoneRegex.test(input.replace(/[\s\-\(\)]/g, ''))) return 'phone';
    return null;
  };

  // Handle identifier input change
  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    setIdentifier(value);
    setContactType(detectContactType(value));
    setError("");
  };

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Please enter email or phone number");
      return;
    }

    if (!detectContactType(identifier)) {
      setError("Please enter valid email or phone number");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier })
      });

      const data = await response.json();

      if (data.success) {
        setStep(2);
        setSuccess(`OTP sent to your ${data.type}`);
        setCountdown(60); // 60 seconds countdown
        setContactType(data.type);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Send OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          identifier, 
          otp,
          name: name.trim() || "User",
          phoneNumber: phoneNumber.trim() || ""
        })
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setSuccess(data.message);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Verify OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/otp/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("OTP resent successfully!");
        setCountdown(60);
        setOtp("");
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Go back to step 1
  const handleBack = () => {
    setStep(1);
    setOtp("");
    setError("");
    setSuccess("");
    setCountdown(0);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Header */}
        <div className="modal-header">
          {step === 2 && (
            <button className="back-btn" onClick={handleBack}>
              <ArrowLeft size={20} />
            </button>
          )}
          <h2>
            {step === 1 ? "Login or Signup" : "Verify OTP"}
          </h2>
          <p className="sub-text">
            {step === 1 
              ? "Get access to your Orders, Wishlist and Recommendations"
              : `We've sent a 6-digit OTP to your ${contactType}`
            }
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Step 1: Enter Email/Phone */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="login-form">
            <div className="input-group">
              <div className="input-icon">
                {contactType === 'email' ? <Mail size={20} /> : <Phone size={20} />}
              </div>
              <input
                type="text"
                placeholder="Enter Email"
                value={identifier}
                onChange={handleIdentifierChange}
                disabled={loading}
                autoComplete="username"
                className={contactType ? `valid-${contactType}` : ""}
              />
              {contactType && (
                <div className="input-indicator">
                  {contactType === 'email' ? '📧' : '📱'}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="login-btn" 
              disabled={loading || !identifier.trim()}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <Shield size={18} />
                  Continue with OTP
                </>
              )}
            </button>

            <div className="login-info">
              <p>By continuing, I agree to the <strong>Terms of Use</strong> & <strong>Privacy Policy</strong></p>
            </div>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="otp-form">
            <div className="otp-info">
              <p>Enter the 6-digit OTP sent to:</p>
              <strong>{identifier}</strong>
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                  setError("");
                }}
                maxLength="6"
                disabled={loading}
                className="otp-input"
                autoComplete="one-time-code"
              />
            </div>

            {/* Name field for new users */}
            <div className="input-group">
              <input
                type="text"
                placeholder="Your Name (Optional for new account)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                autoComplete="name"
              />
            </div>

            {/* Phone number field (always show for better profile completion) */}
            <div className="input-group">
              <div className="input-icon">
                <Phone size={20} />
              </div>
              <input
                type="tel"
                placeholder={contactType === 'phone' ? "Phone number (detected above)" : "Phone Number (Optional)"}
                value={contactType === 'phone' ? identifier : phoneNumber}
                onChange={(e) => {
                  if (contactType === 'phone') {
                    // If identifier is phone, update identifier
                    setIdentifier(e.target.value);
                  } else {
                    // Otherwise update phoneNumber
                    setPhoneNumber(e.target.value);
                  }
                }}
                disabled={loading || contactType === 'phone'}
                autoComplete="tel"
                className={contactType === 'phone' ? 'pre-filled' : ''}
              />
              {contactType === 'phone' && (
                <div className="input-indicator">
                  ✓
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="verify-btn" 
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                "Verify & Continue"
              )}
            </button>

            <div className="resend-section">
              {countdown > 0 ? (
                <p>Resend OTP in {countdown}s</p>
              ) : (
                <button 
                  type="button" 
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="resend-btn"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="modal-footer">
          <p>Having trouble? <button 
            className="link-btn"
            onClick={() => setShowHelp(true)}
          >
            Need help?
          </button></p>
        </div>

        {/* Help Modal */}
        {showHelp && (
          <HelpModal 
            onClose={() => setShowHelp(false)}
            returnToLogin={() => setShowHelp(false)}
          />
        )}
      </div>
    </div>
  );
};

export default LoginModal;
