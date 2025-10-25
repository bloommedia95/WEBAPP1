import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import all models
import Product from './models/Product.js';
import Category from './models/Category.js';
import User from './models/User.js';
import Admin from './models/Admin.js';
import Coupon from './models/Coupon.js';

dotenv.config();

// Sample data for permanent storage
const sampleCategories = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Electronics',
    description: 'Electronic gadgets and devices',
    image: '/img/categories/electronics.jpg',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(), 
    name: 'Clothing',
    description: 'Fashion and apparel',
    image: '/img/categories/clothing.jpg',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Home & Garden',
    description: 'Home decor and gardening items',
    image: '/img/categories/home.jpg',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleProducts = [
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    category: 'Electronics',
    brand: 'TechBrand',
    stock: 50,
    img: ['/img/products/headphones1.jpg', '/img/products/headphones2.jpg'],
    tags: ['electronics', 'audio', 'wireless'],
    status: 'active',
    featured: true,
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Blue'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Cotton T-Shirt',
    description: 'Comfortable cotton t-shirt for everyday wear',
    price: 599,
    originalPrice: 999,
    discount: 40,
    category: 'Clothing',
    brand: 'FashionWear',
    stock: 100,
    img: ['/img/products/tshirt1.jpg', '/img/products/tshirt2.jpg'],
    tags: ['clothing', 'casual', 'cotton'],
    status: 'active',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Red', 'Blue', 'Green', 'Black'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Smart LED Bulb',
    description: 'WiFi enabled smart LED bulb with app control',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    category: 'Home & Garden',
    brand: 'SmartHome',
    stock: 75,
    img: ['/img/products/smartbulb1.jpg'],
    tags: ['home', 'smart', 'led'],
    status: 'active',
    featured: false,
    sizes: ['Standard'],
    colors: ['White'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleCoupons = [
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Welcome Discount',
    code: 'WELCOME20',
    description: 'Get 20% off on your first order',
    discount: 20,
    discountType: 'percentage',
    minimumAmount: 500,
    maximumDiscount: 1000,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    usageLimit: 1000,
    usedCount: 0,
    status: 'active',
    img: '/img/coupons/welcome.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Free Shipping',
    code: 'FREESHIP',
    description: 'Free shipping on orders above ₹999',
    discount: 100,
    discountType: 'fixed',
    minimumAmount: 999,
    maximumDiscount: 100,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    usageLimit: 500,
    usedCount: 0,
    status: 'active',
    img: '/img/coupons/freeship.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Admin user for dashboard access
const adminUser = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Admin User',
  email: 'admin@bloom.com',
  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
  role: 'admin',
  phone: '+91 9876543210',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Coupon.deleteMany({});
    await Admin.deleteMany({});
    
    // Insert sample data
    console.log('📦 Inserting sample categories...');
    await Category.insertMany(sampleCategories);
    
    console.log('🛍️ Inserting sample products...');
    await Product.insertMany(sampleProducts);
    
    console.log('🎟️ Inserting sample coupons...');
    await Coupon.insertMany(sampleCoupons);
    
    console.log('👤 Creating admin user...');
    await Admin.create(adminUser);
    
    console.log('✅ Database seeded successfully!');
    console.log('📊 Seeded Data Summary:');
    console.log(`   📦 Categories: ${sampleCategories.length}`);
    console.log(`   🛍️ Products: ${sampleProducts.length}`);
    console.log(`   🎟️ Coupons: ${sampleCoupons.length}`);
    console.log(`   👤 Admin User: 1`);
    console.log('');
    console.log('🔑 Admin Login Credentials:');
    console.log('   Email: admin@bloom.com');
    console.log('   Password: password');
    console.log('');
    console.log('💡 This data will persist across system restarts!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
};

// Run seeding
seedDatabase();