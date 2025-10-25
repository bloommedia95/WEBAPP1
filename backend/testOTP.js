import fetch from 'node-fetch';

console.log('🧪 Testing OTP System...\n');

async function testSendOTP() {
  try {
    console.log('1️⃣ Testing Send OTP API...');
    
    const response = await fetch('http://localhost:5000/api/otp/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        identifier: 'test@gmail.com' 
      })
    });

    const data = await response.json();
    console.log('📡 Response:', data);
    
    if (data.success) {
      console.log('✅ Send OTP API working!');
      return true;
    } else {
      console.log('❌ Send OTP failed:', data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

async function testPhoneDetection() {
  try {
    console.log('\n2️⃣ Testing Phone Number Detection...');
    
    const response = await fetch('http://localhost:5000/api/otp/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        identifier: '9876543210' 
      })
    });

    const data = await response.json();
    console.log('📡 Response:', data);
    
    if (data.success) {
      console.log('✅ Phone detection working!');
      return true;
    } else {
      console.log('❌ Phone detection failed:', data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

async function testInvalidInput() {
  try {
    console.log('\n3️⃣ Testing Invalid Input Validation...');
    
    const response = await fetch('http://localhost:5000/api/otp/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        identifier: 'invalid-input' 
      })
    });

    const data = await response.json();
    console.log('📡 Response:', data);
    
    if (!data.success && data.message.includes('Valid email')) {
      console.log('✅ Input validation working!');
      return true;
    } else {
      console.log('❌ Input validation not working properly');
      return false;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting OTP System Tests...\n');
  
  const test1 = await testSendOTP();
  const test2 = await testPhoneDetection();  
  const test3 = await testInvalidInput();
  
  console.log('\n📊 Test Results:');
  console.log(`Email OTP: ${test1 ? '✅' : '❌'}`);
  console.log(`Phone Detection: ${test2 ? '✅' : '❌'}`);
  console.log(`Input Validation: ${test3 ? '✅' : '❌'}`);
  
  const allPassed = test1 && test2 && test3;
  console.log(`\n🎯 Overall: ${allPassed ? '✅ ALL TESTS PASSED!' : '❌ Some tests failed'}`);
  
  if (allPassed) {
    console.log('\n🎉 OTP System is ready for frontend testing!');
    console.log('📱 Next: Test the UI on http://localhost:3000');
  } else {
    console.log('\n🔧 Check server logs for issues');
  }
}

runAllTests();