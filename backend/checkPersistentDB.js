import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import models
import Product from './models/Product.js';
import Category from './models/Category.js';
import User from './models/User.js';
import Admin from './models/Admin.js';
import Coupon from './models/Coupon.js';
import Order from './models/Order.js';

dotenv.config();

const checkDatabase = async () => {
  try {
    console.log('🔍 Checking database status...');
    console.log('=' .repeat(50));
    
    // Connect to database
    await connectDB();
    
    // Check collections and counts
    const stats = {
      products: await Product.countDocuments(),
      categories: await Category.countDocuments(),
      users: await User.countDocuments(),
      admins: await Admin.countDocuments(),
      coupons: await Coupon.countDocuments(),
      orders: await Order.countDocuments()
    };
    
    console.log('📊 Database Statistics:');
    console.log('=' .repeat(30));
    console.log(`📦 Categories: ${stats.categories}`);
    console.log(`🛍️ Products: ${stats.products}`);
    console.log(`👥 Users: ${stats.users}`);
    console.log(`👤 Admins: ${stats.admins}`);
    console.log(`🎟️ Coupons: ${stats.coupons}`);
    console.log(`📋 Orders: ${stats.orders}`);
    console.log('');
    
    // Check database name and connection
    console.log('🔗 Connection Details:');
    console.log('=' .repeat(30));
    console.log(`📂 Database Name: ${mongoose.connection.name}`);
    console.log(`🌐 Connection Host: ${mongoose.connection.host}`);
    console.log(`📍 Connection Port: ${mongoose.connection.port}`);
    console.log(`🟢 Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log('');
    
    // Show sample data if available
    if (stats.products > 0) {
      console.log('🛍️ Sample Products:');
      console.log('=' .repeat(30));
      const sampleProducts = await Product.find().limit(3).select('title price category');
      sampleProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.title} - ₹${product.price} (${product.category})`);
      });
      console.log('');
    }
    
    if (stats.categories > 0) {
      console.log('📦 Available Categories:');
      console.log('=' .repeat(30));
      const categories = await Category.find().select('name description');
      categories.forEach((category, index) => {
        console.log(`${index + 1}. ${category.name} - ${category.description}`);
      });
      console.log('');
    }
    
    if (stats.coupons > 0) {
      console.log('🎟️ Active Coupons:');
      console.log('=' .repeat(30));
      const coupons = await Coupon.find({ status: 'active' }).select('code title discount');
      coupons.forEach((coupon, index) => {
        console.log(`${index + 1}. ${coupon.code} - ${coupon.title} (${coupon.discount}% off)`);
      });
      console.log('');
    }
    
    // Database health check
    const totalDocuments = Object.values(stats).reduce((sum, count) => sum + count, 0);
    console.log('💡 Database Health:');
    console.log('=' .repeat(30));
    console.log(`📄 Total Documents: ${totalDocuments}`);
    console.log(`✅ Database Status: ${totalDocuments > 0 ? 'Contains Data' : 'Empty'}`);
    console.log(`🔄 Data Persistence: ${mongoose.connection.name.includes('persistent') ? 'ENABLED' : 'STANDARD'}`);
    
    if (totalDocuments === 0) {
      console.log('');
      console.log('⚠️  Database is empty!');
      console.log('💡 Run "npm run seed-data" to add sample data');
    } else {
      console.log('');
      console.log('✅ Database contains persistent data!');
      console.log('💾 Data will remain available across system restarts');
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('');
    console.log('🔒 Database check completed');
    process.exit(0);
  }
};

// Run database check
checkDatabase();