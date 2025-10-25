// checkCoupons.js - Check existing coupons in database
import 'dotenv/config';
import connectDB from './config/db.js';
import Coupon from './models/Coupon.js';

const checkCoupons = async () => {
  try {
    await connectDB();
    
    const coupons = await Coupon.find({}).limit(5);
    
    if (coupons.length > 0) {
      console.log('✅ Found coupons in database:');
      coupons.forEach(coupon => {
        console.log(`- ${coupon.code} | ${coupon.title} | ${coupon.status} | ${coupon.discount}% off`);
      });
      console.log(`\n📊 Total coupons in database: ${await Coupon.countDocuments()}`);
    } else {
      console.log('❌ No coupons found in database');
      
      // Create a sample coupon for testing
      const sampleCoupon = new Coupon({
        title: "Welcome Discount",
        code: "WELCOME10",
        discount: 10,
        discountType: "percentage",
        minPurchase: 500,
        maxDiscount: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: "Active",
        firstOrderOnly: true,
        img: "/img/welcome-coupon.png"
      });
      
      await sampleCoupon.save();
      console.log('✅ Created sample coupon: WELCOME10');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkCoupons();