// checkUser.js - Get user ObjectId for testing
import 'dotenv/config';
import connectDB from './config/db.js';
import User from './models/profileuser.js';

const checkUser = async () => {
  try {
    await connectDB();
    
    const user = await User.findOne({email: 'user_1758977655613@bloom.com'});
    
    if (user) {
      console.log('✅ User found:');
      console.log('MongoDB ObjectId:', user._id.toString());
      console.log('Name:', user.name);
      console.log('Email:', user.email);
    } else {
      console.log('❌ User not found');
      
      // Show available users
      const allUsers = await User.find({}).limit(3);
      console.log('\n📋 Available users:');
      allUsers.forEach(u => {
        console.log(`- ${u._id} | ${u.name} | ${u.email}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUser();