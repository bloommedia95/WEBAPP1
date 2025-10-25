// checkAddresses.js - Check Address Collection
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Address from './models/Address.js';

dotenv.config();

async function checkAddresses() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Get all addresses
    const addresses = await Address.find({});
    
    console.log(`\n📍 Addresses found: ${addresses.length}`);
    
    addresses.forEach((address, index) => {
      console.log(`\nAddress ${index + 1}:`);
      console.log(`  ID: ${address._id}`);
      console.log(`  User ID: ${address.userId}`);
      console.log(`  Full Name: ${address.fullName}`);
      console.log(`  Phone: ${address.phoneNumber}`);
      console.log(`  Address: ${address.addressLine1}, ${address.city}, ${address.state} - ${address.pincode}`);
      console.log(`  Type: ${address.addressType}`);
      console.log(`  Default: ${address.isDefault}`);
      console.log(`  Active: ${address.isActive}`);
      console.log(`  Created: ${address.createdAt}`);
    });
    
    // Group by user
    const addressesByUser = {};
    addresses.forEach(address => {
      const userId = address.userId.toString();
      if (!addressesByUser[userId]) {
        addressesByUser[userId] = [];
      }
      addressesByUser[userId].push(address);
    });
    
    console.log('\n👥 Addresses grouped by User:');
    Object.entries(addressesByUser).forEach(([userId, userAddresses]) => {
      console.log(`\nUser ID: ${userId}`);
      console.log(`  Total Addresses: ${userAddresses.length}`);
      console.log(`  Default Address: ${userAddresses.find(addr => addr.isDefault)?.addressLine1 || 'None'}`);
      console.log(`  Address Types: ${[...new Set(userAddresses.map(addr => addr.addressType))].join(', ')}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkAddresses();