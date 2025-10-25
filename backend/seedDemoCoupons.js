import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Coupon from './models/Coupon.js';

dotenv.config();

// Demo coupon data
const demoCoupons = [
  {
    title: '🎉 Welcome Bonus - 25% Off',
    code: 'WELCOME25',
    discountType: 'percentage',
    discount: 25,
    minPurchase: 500,
    maxDiscount: 1000,
    firstOrderOnly: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'Active',
    img: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=200&fit=crop'
  },
  {
    title: '🌸 Spring Sale - Flat ₹200 Off',
    code: 'SPRING200',
    discountType: 'flat',
    discount: 200,
    minPurchase: 1000,
    maxDiscount: 0,
    firstOrderOnly: false,
    startDate: new Date(),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    status: 'Active',
    img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=200&fit=crop'
  },
  {
    title: '⚡ Flash Sale - 40% Off',
    code: 'FLASH40',
    discountType: 'percentage',
    discount: 40,
    minPurchase: 1500,
    maxDiscount: 2000,
    firstOrderOnly: false,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: 'Active',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop'
  },
  {
    title: '🎁 Festive Special - ₹500 Off',
    code: 'FESTIVE500',
    discountType: 'flat',
    discount: 500,
    minPurchase: 2500,
    maxDiscount: 0,
    firstOrderOnly: false,
    startDate: new Date(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    status: 'Active',
    img: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop'
  },
  {
    title: '👑 VIP Exclusive - 30% Off',
    code: 'VIP30',
    discountType: 'percentage',
    discount: 30,
    minPurchase: 3000,
    maxDiscount: 1500,
    firstOrderOnly: false,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    status: 'Active',
    img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=200&fit=crop'
  }
];

// Seed demo coupons function
async function seedDemoCoupons() {
  try {
    console.log('🎫 Starting demo coupon seeding process...');
    
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Check existing coupons
    const existingCoupons = await Coupon.find({});
    const existingCodes = existingCoupons.map(coupon => coupon.code);
    
    console.log(`📋 Found ${existingCoupons.length} existing coupons:`, existingCodes);

    // Filter new coupons (avoid duplicates)
    const newCoupons = demoCoupons.filter(coupon => !existingCodes.includes(coupon.code));
    
    if (newCoupons.length === 0) {
      console.log('✅ All demo coupons already exist in the database!');
    } else {
      // Insert new coupons
      const insertedCoupons = await Coupon.insertMany(newCoupons);
      console.log(`🎉 Successfully added ${insertedCoupons.length} new demo coupons:`);
      
      insertedCoupons.forEach((coupon, index) => {
        console.log(`   ${index + 1}. 🎫 ${coupon.title}`);
        console.log(`      Code: ${coupon.code}`);
        console.log(`      Discount: ${coupon.discountType === 'percentage' ? coupon.discount + '%' : '₹' + coupon.discount}`);
        console.log(`      Min Purchase: ₹${coupon.minPurchase}`);
        console.log(`      Valid Till: ${coupon.endDate.toLocaleDateString()}`);
        console.log('');
      });
    }

    // Display all coupons summary
    const allCoupons = await Coupon.find({}).sort({ createdAt: -1 });
    console.log(`\n📊 Coupon Database Summary:`);
    console.log(`   Total Coupons: ${allCoupons.length}`);
    console.log(`   Active Coupons: ${allCoupons.filter(c => c.status === 'Active').length}`);
    console.log(`   Available Coupons:`);
    
    allCoupons.forEach((coupon, index) => {
      const status = coupon.status === 'Active' ? '🟢 ACTIVE' : '🔴 INACTIVE';
      const discountDisplay = coupon.discountType === 'percentage' 
        ? `${coupon.discount}% off` 
        : `₹${coupon.discount} off`;
      console.log(`     ${index + 1}. ${status} ${coupon.code} - ${discountDisplay}`);
      console.log(`        ${coupon.title}`);
      console.log(`        Valid till: ${coupon.endDate.toLocaleDateString()}`);
    });

    console.log('\n🎫 Demo coupon seeding completed successfully!');
    console.log('💡 You can now use these coupons for testing and demonstrations.');
    
  } catch (error) {
    console.error('❌ Error seeding demo coupons:', error);
    throw error;
  }
}

// Run the seeder
console.log('🚀 Bloom E-Commerce Demo Coupon Seeder');
console.log('=====================================');

seedDemoCoupons()
  .then(() => {
    console.log('\n✅ Seeding process completed!');
    console.log('🛍️ Happy shopping with amazing discounts!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding process failed:', error);
    process.exit(1);
  });