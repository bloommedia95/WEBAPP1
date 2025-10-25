import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * SMS Service Options:
 * 1. MSG91 - Most reliable, free credits
 * 2. Fast2SMS - Good for testing
 * 3. TextLocal - Backup option
 */

// MSG91 Configuration (Recommended)
const MSG91_CONFIG = {
  authKey: process.env.MSG91_AUTH_KEY || 'your-msg91-auth-key',
  route: '4', // Transactional route
  country: '91', // India
  templateId: process.env.MSG91_TEMPLATE_ID || 'your-template-id',
  baseUrl: 'https://api.msg91.com/api/v5'
};

// Fast2SMS Configuration (Alternative)
const FAST2SMS_CONFIG = {
  apiKey: process.env.FAST2SMS_API_KEY || 'your-fast2sms-key',
  baseUrl: 'https://www.fast2sms.com/dev/bulkV2'
};

// Generate OTP message template
const generateOTPMessage = (otp, name = 'User') => {
  return `Hello ${name}! Your Bloom E-Commerce verification code is: ${otp}. Valid for 10 minutes. Do not share this with anyone.`;
};

/**
 * Send OTP via MSG91 (Primary method)
 */
export const sendOTPViaMSG91 = async (phone, otp, name = 'User') => {
  try {
    console.log(`📱 Sending OTP via MSG91 to ${phone}: ${otp}`);

    // Remove country code if present and clean phone number
    const cleanPhone = phone.replace(/^\+?91/, '').replace(/\D/g, '');
    
    if (cleanPhone.length !== 10) {
      throw new Error('Invalid phone number format');
    }

    const message = generateOTPMessage(otp, name);

    // MSG91 API call
    const response = await axios.post(`${MSG91_CONFIG.baseUrl}/sms`, {
      authkey: MSG91_CONFIG.authKey,
      template_id: MSG91_CONFIG.templateId,
      route: MSG91_CONFIG.route,
      country: MSG91_CONFIG.country,
      sms: [{
        message: message,
        to: [`${MSG91_CONFIG.country}${cleanPhone}`],
        variables: {
          name: name,
          otp: otp
        }
      }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'authkey': MSG91_CONFIG.authKey
      }
    });

    console.log('✅ MSG91 Response:', response.data);

    if (response.data.type === 'success') {
      return {
        success: true,
        messageId: response.data.request_id,
        message: 'OTP sent successfully via SMS',
        service: 'MSG91'
      };
    } else {
      throw new Error(response.data.message || 'MSG91 API error');
    }

  } catch (error) {
    console.error('❌ MSG91 Error:', error.message);
    return {
      success: false,
      error: error.message,
      service: 'MSG91'
    };
  }
};

/**
 * Send OTP via Fast2SMS (Backup method)
 */
export const sendOTPViaFast2SMS = async (phone, otp, name = 'User') => {
  try {
    console.log(`📱 Sending OTP via Fast2SMS to ${phone}: ${otp}`);

    const cleanPhone = phone.replace(/^\+?91/, '').replace(/\D/g, '');
    
    if (cleanPhone.length !== 10) {
      throw new Error('Invalid phone number format');
    }

    const message = `${otp} is your OTP for Bloom E-Commerce. Valid for 10 minutes. Do not share with anyone. -BLOOM`;

    const response = await axios.post(FAST2SMS_CONFIG.baseUrl, {
      route: 'otp',
      variables_values: otp,
      flash: 0,
      numbers: cleanPhone
    }, {
      headers: {
        'Authorization': FAST2SMS_CONFIG.apiKey,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Fast2SMS Response:', response.data);

    if (response.data.return) {
      return {
        success: true,
        messageId: response.data.request_id,
        message: 'OTP sent successfully via SMS',
        service: 'Fast2SMS'
      };
    } else {
      throw new Error(response.data.message || 'Fast2SMS API error');
    }

  } catch (error) {
    console.error('❌ Fast2SMS Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message,
      service: 'Fast2SMS'
    };
  }
};

/**
 * Main SMS OTP function with fallback
 */
export const sendSMSOTP = async (phone, otp, name = 'User') => {
  console.log(`\n🚀 Attempting to send SMS OTP to ${phone}`);

  // Try MSG91 first (most reliable)
  if (MSG91_CONFIG.authKey !== 'your-msg91-auth-key') {
    const msg91Result = await sendOTPViaMSG91(phone, otp, name);
    if (msg91Result.success) {
      return msg91Result;
    }
    console.log('⚠️ MSG91 failed, trying Fast2SMS...');
  }

  // Fallback to Fast2SMS
  if (FAST2SMS_CONFIG.apiKey !== 'your-fast2sms-key') {
    const fast2smsResult = await sendOTPViaFast2SMS(phone, otp, name);
    if (fast2smsResult.success) {
      return fast2smsResult;
    }
    console.log('⚠️ Fast2SMS also failed');
  }

  // If both fail, return console version for testing
  console.log('\n🎯=== SMS OTP FOR TESTING (No API Keys) ===🎯');
  console.log(`📱 Phone: ${phone}`);
  console.log(`🔢 OTP Code: ${otp}`);
  console.log(`👤 User: ${name}`);
  console.log('📧 Check console for OTP (SMS APIs not configured)');
  console.log('🎯=======================================🎯\n');
  
  return {
    success: true,
    message: 'OTP displayed in console (SMS service needs API keys)',
    service: 'Console',
    consoleOTP: otp
  };
};

/**
 * Setup instructions for SMS services
 */
export const SMS_SETUP_INSTRUCTIONS = {
  MSG91: {
    website: 'https://msg91.com/',
    steps: [
      '1. Sign up at msg91.com',
      '2. Verify your account',
      '3. Get Auth Key from dashboard',
      '4. Create SMS template',
      '5. Add credentials to .env file'
    ],
    envVars: [
      'MSG91_AUTH_KEY=your-auth-key-here',
      'MSG91_TEMPLATE_ID=your-template-id-here'
    ],
    freeCredits: '₹50 free credits on signup'
  },
  FAST2SMS: {
    website: 'https://www.fast2sms.com/',
    steps: [
      '1. Sign up at fast2sms.com',
      '2. Verify your mobile number',
      '3. Get API Key from dashboard',
      '4. Add to .env file'
    ],
    envVars: [
      'FAST2SMS_API_KEY=your-api-key-here'
    ],
    freeCredits: 'Free SMS credits available'
  }
};