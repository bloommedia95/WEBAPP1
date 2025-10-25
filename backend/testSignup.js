import fetch from 'node-fetch';

async function testSignup() {
  try {
    const testData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      contactNumber: "1234567890"
    };

    console.log('🧪 Testing signup with data:', testData);

    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('📡 Response status:', response.status);
    const result = await response.json();
    console.log('📋 Response data:', result);

    if (response.ok) {
      console.log('✅ Signup successful!');
    } else {
      console.log('❌ Signup failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testSignup();