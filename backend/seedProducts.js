
// Add test products for categories
import Product from './models/Product.js';
import Category from './models/Category.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dashtar-dashboard')
.then(() => console.log('✅ MongoDB Connected for seeding'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const seedData = async () => {
  try {
    // Create categories first
    const categories = await Category.insertMany([
      { name: 'Clothing', imageUrl: '/uploads/categories/clothing.png' },
      { name: 'Footwear', imageUrl: '/uploads/categories/footwear.png' },
      { name: 'Bags', imageUrl: '/uploads/categories/bags.png' },
      { name: 'Cosmetic', imageUrl: '/uploads/categories/cosmetic.png' },
      { name: 'Accessories', imageUrl: '/uploads/categories/accessories.png' }
    ]);
    console.log('✅ Categories seeded:', categories.length);

    // Create test products
    const products = await Product.insertMany([
      // Clothing products
      {
        name: 'Men\'s Cotton T-Shirt',
        sku: 'CLT001',
        category: 'Clothing',
        subcategory: 'Tops',
        price: 999,
        stock: 50,
        gender: 'Men',
        brand: 'H&M',
        size: 'L',
        color: 'Blue',
        material: 'Cotton',
        description: 'Premium cotton t-shirt for men',
        status: 'Active',
        images: ['/uploads/clothing/tshirt1.jpg'],
        imageUrl: '/uploads/clothing/tshirt1.jpg'
      },
      {
        name: 'Women\'s Summer Dress',
        sku: 'CLD001', 
        category: 'Clothing',
        subcategory: 'Dresses',
        price: 1499,
        stock: 30,
        gender: 'Women',
        brand: 'Max',
        size: 'M',
        color: 'Red',
        material: 'Cotton',
        description: 'Beautiful summer dress for women',
        status: 'Active',
        images: ['/uploads/clothing/dress1.jpg'],
        imageUrl: '/uploads/clothing/dress1.jpg'
      },
      
      // Footwear products
      {
        name: 'Men\'s Running Shoes',
        sku: 'FW001',
        category: 'Footwear',
        subcategory: 'Shoes',
        price: 2499,
        stock: 25,
        gender: 'Men',
        brand: 'Nike',
        size: '42',
        color: 'Black',
        material: 'Synthetic',
        description: 'Comfortable running shoes for men',
        status: 'Active',
        images: ['/uploads/footwear/shoes1.jpg'],
        imageUrl: '/uploads/footwear/shoes1.jpg'
      },
      {
        name: 'Women\'s High Heels',
        sku: 'FW002',
        category: 'Footwear',
        subcategory: 'Heels',
        price: 1899,
        stock: 20,
        gender: 'Women',
        brand: 'Bata',
        size: '38',
        color: 'Black',
        material: 'Leather',
        description: 'Elegant high heels for women',
        status: 'Active',
        images: ['/uploads/footwear/heels1.jpg'],
        imageUrl: '/uploads/footwear/heels1.jpg'
      },

      // Bags products
      {
        name: 'Leather Handbag',
        sku: 'BG001',
        category: 'Bags',
        subcategory: 'Handbag',
        price: 2999,
        stock: 15,
        gender: 'Women',
        brand: 'Lavie',
        size: 'Medium',
        color: 'Brown',
        material: 'Leather',
        description: 'Premium leather handbag',
        status: 'Active',
        images: ['/uploads/bags/handbag1.jpg'],
        imageUrl: '/uploads/bags/handbag1.jpg'
      },

      // Cosmetic products  
      {
        name: 'Lipstick - Red Matte',
        sku: 'CS001',
        category: 'Cosmetic',
        subcategory: 'Lipstick',
        price: 599,
        stock: 100,
        gender: 'Women',
        brand: 'Lakme',
        size: 'Standard',
        color: 'Red',
        material: 'Cosmetic',
        description: 'Long lasting red matte lipstick',
        status: 'Active',
        images: ['/uploads/cosmetic/lipstick1.jpg'],
        imageUrl: '/uploads/cosmetic/lipstick1.jpg'
      },

      // Accessories products
      {
        name: 'Men\'s Watch',
        sku: 'AC001',
        category: 'Accessories',
        subcategory: 'Watch', 
        price: 4999,
        stock: 10,
        gender: 'Men',
        brand: 'Titan',
        size: 'Standard',
        color: 'Silver',
        material: 'Metal',
        description: 'Stylish men\'s wrist watch',
        status: 'Active',
        images: ['/uploads/accessories/watch1.jpg'],
        imageUrl: '/uploads/accessories/watch1.jpg'
      }
    ]);

    console.log('✅ Products seeded:', products.length);
    console.log('🎉 Seed data completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();