import express from 'express';
import Coupon from '../models/Coupon.js';

const router = express.Router();

// Get all coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find({ status: 'Active' })
      .sort({ createdAt: -1 });
    
    console.log(`📋 Fetched ${coupons.length} active coupons`);
    res.json(coupons);
  } catch (error) {
    console.error('❌ Error fetching coupons:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupons',
      error: error.message
    });
  }
});

// Get coupon by code
router.get('/code/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      status: 'Active',
      endDate: { $gte: new Date() }
    });
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found or expired'
      });
    }
    
    res.json({
      success: true,
      coupon
    });
  } catch (error) {
    console.error('❌ Error fetching coupon by code:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupon',
      error: error.message
    });
  }
});

// Apply/Validate coupon
router.post('/validate', async (req, res) => {
  try {
    const { code, orderAmount, userId } = req.body;
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      status: 'Active',
      endDate: { $gte: new Date() }
    });
    
    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired coupon code'
      });
    }
    
    // Check minimum purchase requirement
    if (coupon.minPurchase > 0 && orderAmount < coupon.minPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of ₹${coupon.minPurchase} required for this coupon`
      });
    }
    
    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount * coupon.discount) / 100;
      // Apply max discount limit if specified
      if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === 'flat') {
      discountAmount = coupon.discount;
    }
    
    // Make sure discount doesn't exceed order amount
    discountAmount = Math.min(discountAmount, orderAmount);
    
    res.json({
      success: true,
      message: 'Coupon applied successfully!',
      coupon: {
        code: coupon.code,
        title: coupon.title,
        discountType: coupon.discountType,
        discount: coupon.discount,
        discountAmount: Math.round(discountAmount)
      }
    });
    
  } catch (error) {
    console.error('❌ Error validating coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating coupon',
      error: error.message
    });
  }
});

// Get latest/featured coupon for banner
router.get('/latest', async (req, res) => {
  try {
    const latestCoupon = await Coupon.findOne({ 
      status: 'Active',
      endDate: { $gte: new Date() }
    })
    .sort({ createdAt: -1 });
    
    if (!latestCoupon) {
      return res.json({
        success: false,
        message: 'No active coupons available'
      });
    }
    
    res.json({
      success: true,
      coupon: latestCoupon
    });
  } catch (error) {
    console.error('❌ Error fetching latest coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching latest coupon',
      error: error.message
    });
  }
});

export default router;