// routes/orders.js - Complete Order Management API
import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import User from '../models/profileuser.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get all orders for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, search, sortBy = 'orderDate', sortOrder = 'desc', page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = { userId };
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { 'items.name': { $regex: search, $options: 'i' } },
        { 'items.brand': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get orders with pagination
    const orders = await Order.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email')
      .lean();
    
    // Get total count for pagination
    const totalOrders = await Order.countDocuments(query);
    
    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
      id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      date: order.orderDate,
      total: order.total,
      items: order.items,
      shippingAddress: order.shippingAddress,
      trackingNumber: order.trackingNumber,
      expectedDelivery: order.expectedDelivery,
      deliveredDate: order.deliveredDate,
      returnEligible: order.returnEligible,
      returnWindow: order.returnWindow,
      rating: order.rating,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus
    }));
    
    res.json({
      success: true,
      orders: formattedOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNextPage: page * limit < totalOrders,
        hasPrevPage: page > 1
      }
    });
    
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Get single order details
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId)
      .populate('userId', 'name email contactNumber')
      .lean();
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order
    });
    
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details'
    });
  }
});

// Create new order (for testing)
router.post('/create', async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod } = req.body;
    
    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Calculate totals
    let subtotal = 0;
    const processedItems = items.map(item => {
      subtotal += item.price * item.quantity;
      return {
        ...item,
        productId: item.productId || null
      };
    });
    
    const shippingCost = subtotal >= 999 ? 0 : 50; // Free shipping above ₹999
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shippingCost + tax;
    
    // Set expected delivery (5-7 days)
    const expectedDelivery = new Date();
    expectedDelivery.setDate(expectedDelivery.getDate() + 6);
    
    const newOrder = new Order({
      userId,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.contactNumber,
      items: processedItems,
      subtotal,
      shippingCost,
      tax,
      total,
      shippingAddress,
      paymentMethod,
      expectedDelivery
    });
    
    await newOrder.save();
    
    res.json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });
    
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

// Update order status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const updateData = { status };
    
    // Set delivery date if status is delivered
    if (status === 'Delivered') {
      updateData.deliveredDate = new Date();
      updateData.returnWindow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Order status updated',
      order
    });
    
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// Add rating and review
router.patch('/:orderId/review', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating, review } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        rating,
        review: review || '',
        reviewDate: new Date()
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Review added successfully',
      order
    });
    
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review'
    });
  }
});

// Cancel order
router.patch('/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order can be cancelled
    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order after shipping'
      });
    }
    
    order.status = 'Cancelled';
    order.orderNotes = reason || 'Cancelled by customer';
    await order.save();
    
    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
    
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
});

// Get order statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const stats = await Order.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
          statusCounts: {
            $push: '$status'
          }
        }
      }
    ]);
    
    const statusCounts = {};
    if (stats[0]?.statusCounts) {
      stats[0].statusCounts.forEach(status => {
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
    }
    
    res.json({
      success: true,
      stats: {
        totalOrders: stats[0]?.totalOrders || 0,
        totalSpent: stats[0]?.totalSpent || 0,
        averageOrderValue: stats[0]?.averageOrderValue || 0,
        statusBreakdown: statusCounts
      }
    });
    
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics'
    });
  }
});

export default router;