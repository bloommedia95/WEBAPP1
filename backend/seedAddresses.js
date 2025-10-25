// seedAddresses.js - Add sample addresses for testing
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Address from './models/Address.js';
import User from './models/profileuser.js';

dotenv.config();

const sampleAddresses = [
  {
    fullName: "Surabhi Jhariya",
    phoneNumber: "9876543210",
    addressLine1: "145 B, Apollo Heights Building, 1st Floor",
    addressLine2: "Sector 7, Scheme No. 78",
    landmark: "Near City Mall",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "452010",
    addressType: "Home",
    isDefault: true,
    deliveryInstructions: "Ring the bell twice. Flat is on the first floor."
  },
  {
    fullName: "Surabhi Jhariya",
    phoneNumber: "9876543210",
    addressLine1: "Tech Park Office Complex, Building A",
    addressLine2: "Floor 3, Wing B, Cubicle 301",
    landmark: "Opposite Metro Station",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411028",
    addressType: "Work",
    isDefault: false,
    deliveryInstructions: "Deliver to reception. Call before delivery."
  },
  {
    fullName: "Riya Jhariya",
    phoneNumber: "8765432109",
    addressLine1: "208 A, Milan Heights Building, 2nd Floor",
    addressLine2: "Behind Park Avenue Mall",
    landmark: "Near HDFC Bank",
    city: "Mumbai",
    state: "Maharashtra", 
    pincode: "400078",
    addressType: "Other",
    isDefault: false,
    deliveryInstructions: "Contact security first. Building entry requires ID."
  },
  {
    fullName: "Surabhi Jhariya",
    phoneNumber: "9876543210",
    addressLine1: "Villa 12, Green Valley Society",
    addressLine2: "Phase 2, Near Club House",
    landmark: "Opposite School",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    addressType: "Home",
    isDefault: false,
    deliveryInstructions: "Gate code: 1234. House is at the end of the lane."
  }
];

const seedAddresses = async () => {
  try {
    await connectDB();
    console.log('🔌 Connected to MongoDB');
    
    // Find a user to assign addresses to
    const user = await User.findOne().limit(1);
    if (!user) {
      console.log('❌ No user found. Please create a user first.');
      process.exit(1);
    }
    
    console.log(`👤 Found user: ${user.name} (${user.email})`);
    
    // Clear existing addresses for this user
    await Address.deleteMany({ userId: user._id });
    console.log('🗑️ Cleared existing addresses');
    
    // Create sample addresses
    for (const addressData of sampleAddresses) {
      const address = new Address({
        userId: user._id,
        ...addressData
      });
      
      await address.save();
      console.log(`✅ Created address: ${address.addressType} - ${address.shortAddress}`);
    }
    
    console.log('🎉 Sample addresses created successfully!');
    console.log(`📊 Total addresses for ${user.name}: ${sampleAddresses.length}`);
    
    // Show default address
    const defaultAddress = await Address.findOne({ userId: user._id, isDefault: true });
    if (defaultAddress) {
      console.log(`🏠 Default Address: ${defaultAddress.formattedAddress}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding addresses:', error);
    process.exit(1);
  }
};

// Run the seed function
seedAddresses();