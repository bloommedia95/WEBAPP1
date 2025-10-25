import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Coupon from './models/Coupon.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Create uploads/coupons directory if it doesn't exist
const uploadDir = './public/uploads/coupons';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Created coupons upload directory');
}

// Demo coupon data with local images
const demoCouponsLocal = [
  {
    title: '🎉 Welcome Bonus - 25% Off',
    code: 'WELCOME25LOCAL',
    discountType: 'percentage',
    discount: 25,
    minPurchase: 500,
    maxDiscount: 1000,
    firstOrderOnly: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'Active',
    img: '/uploads/coupons/welcome-coupon.jpg' // Local path
  },
  {
    title: '🌸 Spring Sale - Flat ₹200 Off',
    code: 'SPRING200LOCAL',
    discountType: 'flat',
    discount: 200,
    minPurchase: 1000,
    maxDiscount: 0,
    firstOrderOnly: false,
    startDate: new Date(),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: 'Active',
    img: '/uploads/coupons/spring-coupon.jpg' // Local path
  },
  {
    title: '⚡ Flash Sale - 40% Off',
    code: 'FLASH40LOCAL',
    discountType: 'percentage',
    discount: 40,
    minPurchase: 1500,
    maxDiscount: 2000,
    firstOrderOnly: false,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'Active',
    img: '/uploads/coupons/flash-coupon.jpg' // Local path
  },
  {
    title: '🎁 Festive Special - ₹500 Off',
    code: 'FESTIVE500LOCAL',
    discountType: 'flat',
    discount: 500,
    minPurchase: 2500,
    maxDiscount: 0,
    firstOrderOnly: false,
    startDate: new Date(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    status: 'Active',
    img: '/uploads/coupons/festive-coupon.jpg' // Local path
  },
  {
    title: '👑 VIP Exclusive - 30% Off',
    code: 'VIP30LOCAL',
    discountType: 'percentage',
    discount: 30,
    minPurchase: 3000,
    maxDiscount: 1500,
    firstOrderOnly: false,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    status: 'Active',
    img: '/uploads/coupons/vip-coupon.jpg' // Local path
  }
];

// Function to download and save images locally
async function downloadImage(url, filename) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const buffer = Buffer.from(await response.arrayBuffer());
    const filepath = path.join(uploadDir, filename);
    
    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Downloaded: ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to download ${filename}:`, error.message);
    return false;
  }
}

// Seed demo coupons with local images
async function seedDemoCouponsWithLocalImages() {
  try {
    console.log('🎫 Starting local demo coupon seeding process...');
    
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Download images from Unsplash and save locally
    console.log('📥 Downloading coupon images...');
    const imageUrls = [
      { url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=200&fit=crop', filename: 'welcome-coupon.jpg' },
      { url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=200&fit=crop', filename: 'spring-coupon.jpg' },
      { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop', filename: 'flash-coupon.jpg' },
      { url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop', filename: 'festive-coupon.jpg' },
      { url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=200&fit=crop', filename: 'vip-coupon.jpg' }
    ];

    for (const img of imageUrls) {
      await downloadImage(img.url, img.filename);
    }

    // Check existing coupons
    const existingCoupons = await Coupon.find({});
    const existingCodes = existingCoupons.map(coupon => coupon.code);
    
    console.log(`📋 Found ${existingCoupons.length} existing coupons`);

    // Filter new coupons (avoid duplicates)
    const newCoupons = demoCouponsLocal.filter(coupon => !existingCodes.includes(coupon.code));
    
    if (newCoupons.length === 0) {
      console.log('✅ All local demo coupons already exist in the database!');
    } else {
      // Insert new coupons
      const insertedCoupons = await Coupon.insertMany(newCoupons);
      console.log(`🎉 Successfully added ${insertedCoupons.length} new local demo coupons:`);
      
      insertedCoupons.forEach((coupon, index) => {
        console.log(`   ${index + 1}. 🎫 ${coupon.title}`);
        console.log(`      Code: ${coupon.code}`);
        console.log(`      Image: ${coupon.img} (LOCAL)`);
        console.log('');
      });
    }

    console.log('\n🎫 Local demo coupon seeding completed successfully!');
    console.log('💡 Images are now stored locally and will work offline!');
    console.log('📁 Images location: ./public/uploads/coupons/');
    
  } catch (error) {
    console.error('❌ Error seeding local demo coupons:', error);
    throw error;
  }
}

// Run the seeder
console.log('🚀 Bloom E-Commerce Local Demo Coupon Seeder');
console.log('============================================');

seedDemoCouponsWithLocalImages()
  .then(() => {
    console.log('\n✅ Local seeding process completed!');
    console.log('🔒 Images are now permanently stored on your server!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Local seeding process failed:', error);
    process.exit(1);
  });