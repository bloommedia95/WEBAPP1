// Test user creation directly
import mongoose from "mongoose";
import Account from "./models/Account.js";
import connectDB from "./config/db.js";

async function testUserCreation() {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🧪 Testing user creation...');
    
    // Test data
    const testUser = {
      name: "Test User",
      email: "test@example.com", 
      password: "testpassword",
      role: "admin"
    };
    
    console.log('📝 Creating user with data:', testUser);
    
    // Check if user already exists
    const existing = await Account.findOne({ email: testUser.email });
    if (existing) {
      console.log('🗑️ Deleting existing test user...');
      await Account.deleteOne({ email: testUser.email });
    }
    
    // Create new user
    const account = new Account(testUser);
    const savedAccount = await account.save();
    
    console.log('✅ User created successfully!');
    console.log('📊 Saved account:', savedAccount);
    
    // Verify it was saved
    const foundUser = await Account.findOne({ email: testUser.email });
    console.log('🔍 Found user in database:', foundUser);
    
    // List all accounts
    const allAccounts = await Account.find();
    console.log('📊 Total accounts in database:', allAccounts.length);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error testing user creation:', error);
    process.exit(1);
  }
}

testUserCreation();