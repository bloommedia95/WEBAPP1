// seedCoupons.js - Create sample coupons for testing
import 'dotenv/config';
import connectDB from './config/db.js';
import Coupon from './models/Coupon.js';

const seedCoupons = async () => {
  try {
    await connectDB();
    
    // Clear existing coupons (optional)
    await Coupon.deleteMany({});
    console.log('🗑️ Cleared existing coupons');
    
    const sampleCoupons = [
      {
        title: "First Time User Special",
        code: "FIRST20",
        discount: 20,
        discountType: "percentage",
        minPurchase: 999,
        maxDiscount: 200,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        status: "Active",
        firstOrderOnly: true,
        img: "/img/first-time-coupon.png"
      },
      {
        title: "Fashion Week Sale",
        code: "FASHION15",
        discount: 15,
        discountType: "percentage",
        minPurchase: 1500,
        maxDiscount: 500,
        startDate: new Date(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
        status: "Active",
        firstOrderOnly: false,
        img: "/img/fashion-coupon.png"
      },
      {
        title: "Weekend Flash Sale",
        code: "WEEKEND100",
        discount: 100,
        discountType: "flat",
        minPurchase: 800,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        status: "Active",
        firstOrderOnly: false,
        img: "/img/weekend-coupon.png"
      },
      {
        title: "Free Shipping",
        code: "FREESHIP",
        discount: 50,
        discountType: "flat",
        minPurchase: 500,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        status: "Active",
        firstOrderOnly: false,
        img: "/img/shipping-coupon.png"
      },
      {
        title: "Big Shopping Festival",
        code: "BIGFEST25",
        discount: 25,
        discountType: "percentage",
        minPurchase: 2000,
        maxDiscount: 1000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: "Active",
        firstOrderOnly: false,
        img: "/img/festival-coupon.png"
      },
      {
        title: "Expired Sale (Demo)",
        code: "EXPIRED10",
        discount: 10,
        discountType: "percentage",
        minPurchase: 500,
        maxDiscount: 100,
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago  
        status: "Inactive",
        firstOrderOnly: false,
        img: "/img/expired-coupon.png"
      }
    ];
    
    for (const couponData of sampleCoupons) {
      const coupon = new Coupon(couponData);
      await coupon.save();
      console.log(`✅ Created coupon: ${coupon.code} - ${coupon.title}`);
    }
    
    console.log(`🎉 Successfully created ${sampleCoupons.length} sample coupons!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedCoupons();