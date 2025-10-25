import express from 'express';
import OTP from '../models/OTP.js';
import User from '../models/profileuser.js';
import { generateOTP, sendOTPEmail, sendOTPSMS } from '../config/emailService.js';
import { sendWelcomeEmail } from '../config/welcomeEmailService.js';

const router = express.Router();

// Utility function to detect email vs phone
const detectContactType = (input) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
  
  if (emailRegex.test(input)) return 'email';
  if (phoneRegex.test(input.replace(/[\s\-\(\)]/g, ''))) return 'phone';
  return null;
};

// Send OTP Route
router.post('/send-otp', async (req, res) => {
  try {
    const { identifier } = req.body; // email या phone number
    
    if (!identifier) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email या Phone Number required है' 
      });
    }

    const contactType = detectContactType(identifier);
    if (!contactType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid email या phone number enter करें' 
      });
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    
    // Store OTP in database
    await OTP.cleanupAndCreate(identifier, otp, contactType);
    
    // Smart OTP delivery based on input type
    let sendResult;
    if (contactType === 'email') {
      // Email OTP - FREE and primary choice
      sendResult = await sendOTPEmail(identifier, otp, 'Valued Customer');
    } else {
      // SMS OTP - Paid service, only if SMS is specifically needed
      console.log('📱 SMS OTP requested - Using console for testing (configure SMS service for production)');
      sendResult = await sendOTPSMS(identifier, otp, 'Valued Customer');
    }
    
    if (sendResult.success) {
      // OTP sent successfully - logging removed for security
      res.json({
        success: true,
        message: `OTP sent successfully to your ${contactType}`,
        type: contactType,
        identifier: contactType === 'email' ? identifier : identifier.replace(/.(?=.{4})/g, '*')
      });
    } else {
      res.status(500).json({
        success: false,
        message: `Failed to send OTP via ${contactType}`
      });
    }
    
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Verify OTP and Login/Signup Route
router.post('/verify-otp', async (req, res) => {
  try {
    const { identifier, otp, name, phoneNumber } = req.body;
    
    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Identifier और OTP both required हैं'
      });
    }

    // Verify OTP
    const verification = await OTP.verifyOTP(identifier, otp);
    
    if (!verification.success) {
      return res.status(400).json(verification);
    }

    const contactType = detectContactType(identifier);
    
    // Find existing user
    let user = await User.findOne({
      $or: [
        { email: contactType === 'email' ? identifier : undefined },
        { contactNumber: contactType === 'phone' ? identifier : undefined }
      ].filter(Boolean)
    });

    if (user) {
      // User exists - Login
      const { password, ...userWithoutPassword } = user.toObject();
      res.json({
        success: true,
        message: 'Login successful!',
        user: userWithoutPassword,
        isNewUser: false
      });
    } else {
      // New user - Auto Signup
      const finalPhoneNumber = contactType === 'phone' 
        ? identifier 
        : phoneNumber || '+91-0000000000'; // Use provided phone or default

      const userData = {
        name: name || 'User',
        email: contactType === 'email' ? identifier : `user_${Date.now()}@bloom.com`,
        contactNumber: finalPhoneNumber,
        password: 'otp_verified', // Placeholder since OTP verified
      };

      user = new User(userData);
      await user.save();

      // 🎉 Send welcome email for new users AFTER OTP verification
      if (contactType === 'email') {
        try {
          console.log(`🌸 Sending welcome email to new user: ${userData.name} (${userData.email})`);
          const welcomeResult = await sendWelcomeEmail(userData.name, userData.email);
          
          if (welcomeResult.success) {
            console.log('✅ Welcome email sent successfully!');
          } else {
            console.log('⚠️ Welcome email failed but signup completed:', welcomeResult.error);
          }
        } catch (welcomeError) {
          console.log('⚠️ Welcome email error (signup still successful):', welcomeError.message);
        }
      }

      const { password, ...userWithoutPassword } = user.toObject();
      res.json({
        success: true,
        message: 'Account created successfully!',
        user: userWithoutPassword,
        isNewUser: true
      });
    }
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Resend OTP Route
router.post('/resend-otp', async (req, res) => {
  try {
    const { identifier } = req.body;
    
    // Check if too many recent attempts
    const recentOTP = await OTP.findOne({
      identifier,
      createdAt: { $gte: new Date(Date.now() - 1 * 60 * 1000) } // Within last 1 minute
    });

    if (recentOTP) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 1 minute before requesting new OTP'
      });
    }

    // Reuse send-otp logic
    req.body = { identifier };
    return router.handle(req, res);
    
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Get OTP Analytics Route
router.get('/analytics', async (req, res) => {
  try {
    // Import analytics
    const { getEmailAnalytics } = await import('../config/emailOTPService.js');
    
    const analytics = getEmailAnalytics();
    
    res.json({
      success: true,
      analytics: {
        ...analytics,
        message: `Saved ₹${analytics.costSaved?.toFixed(2)} by using free email OTP!`
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics'
    });
  }
});

export default router;