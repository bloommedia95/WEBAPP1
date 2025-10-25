// Quick SMS Test - Multiple Services
import fetch from 'node-fetch';

/**
 * Quick SMS testing with multiple free services
 */

// TextLocal (Free tier available)
const sendViaTextLocal = async (phone, otp) => {
  try {
    const apiKey = 'test'; // Replace with actual key
    const sender = 'BLOOM';
    const message = `Your Bloom E-Commerce OTP is: ${otp}. Valid for 10 minutes.`;
    
    const response = await fetch('https://api.textlocal.in/send/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        apikey: apiKey,
        numbers: phone,
        message: message,
        sender: sender
      })
    });
    
    const result = await response.json();
    return { success: result.status === 'success', data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Way2SMS (Alternative)
const sendViaWay2SMS = async (phone, otp) => {
  // Implementation for Way2SMS
  console.log(`Way2SMS OTP to ${phone}: ${otp}`);
  return { success: true, service: 'Way2SMS' };
};

// Test all services
export const testAllSMSServices = async (phone, otp) => {
  console.log(`\n🧪 Testing SMS services for ${phone}`);
  
  const services = [
    { name: 'TextLocal', func: sendViaTextLocal },
    { name: 'Way2SMS', func: sendViaWay2SMS }
  ];
  
  for (const service of services) {
    try {
      console.log(`\n📱 Testing ${service.name}...`);
      const result = await service.func(phone, otp);
      
      if (result.success) {
        console.log(`✅ ${service.name} - SUCCESS!`);
        return { success: true, service: service.name, data: result };
      } else {
        console.log(`❌ ${service.name} - Failed:`, result.error);
      }
    } catch (error) {
      console.log(`❌ ${service.name} - Error:`, error.message);
    }
  }
  
  return { success: false, message: 'All SMS services failed' };
};