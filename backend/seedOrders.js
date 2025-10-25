// seedOrders.js - Add sample orders for testing
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Order from './models/Order.js';
import User from './models/profileuser.js';

dotenv.config();

const sampleOrders = [
  {
    items: [
      {
        name: "Women Open Toe Flats",
        brand: "Bata Store",
        image: "/img/footwear1.png",
        price: 1299,
        quantity: 1,
        size: "UK7",
        category: "Footwear"
      }
    ],
    status: "Delivered",
    shippingAddress: {
      street: "123 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001"
    },
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderDate: new Date('2025-08-05'),
    deliveredDate: new Date('2025-08-11'),
    returnEligible: false
  },
  {
    items: [
      {
        name: "Floral Print Fit & Flare Midi Dress",
        brand: "Lifestyle Store",
        image: "/img/clothing6.png",
        price: 2199,
        quantity: 1,
        size: "L",
        category: "Clothing"
      }
    ],
    status: "Delivered",
    shippingAddress: {
      street: "456 Park Street",
      city: "Kolkata",
      state: "West Bengal",
      zipCode: "700016"
    },
    paymentMethod: "Card",
    paymentStatus: "Paid",
    orderDate: new Date('2025-07-10'),
    deliveredDate: new Date('2025-07-17'),
    returnEligible: false
  },
  {
    items: [
      {
        name: "High-Rise Stretchable Wide Leg Jeans",
        brand: "H&M",
        image: "/img/clothing7.png",
        price: 2999,
        quantity: 1,
        size: "32",
        category: "Clothing"
      }
    ],
    status: "Delivered",
    shippingAddress: {
      street: "789 Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110001"
    },
    paymentMethod: "COD",
    paymentStatus: "Paid",
    orderDate: new Date('2025-06-20'),
    deliveredDate: new Date('2025-06-27'),
    returnEligible: false
  },
  {
    items: [
      {
        name: "Cotton Casual T-Shirt",
        brand: "Myntra Lifestyle",
        image: "/img/clothing1.png",
        price: 599,
        quantity: 2,
        size: "M",
        category: "Clothing"
      },
      {
        name: "Denim Jacket",
        brand: "Levi's",
        image: "/img/clothing2.png",
        price: 3499,
        quantity: 1,
        size: "L",
        category: "Clothing"
      }
    ],
    status: "Shipped",
    shippingAddress: {
      street: "321 Brigade Road",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001"
    },
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    trackingNumber: "BLM1234567890",
    expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  },
  {
    items: [
      {
        name: "Running Sneakers",
        brand: "Nike",
        image: "/img/footwear2.png",
        price: 5999,
        quantity: 1,
        size: "UK9",
        category: "Footwear"
      }
    ],
    status: "Processing",
    shippingAddress: {
      street: "654 FC Road",
      city: "Pune",
      state: "Maharashtra",
      zipCode: "411005"
    },
    paymentMethod: "Net Banking",
    paymentStatus: "Paid",
    expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  }
];

const seedOrders = async () => {
  try {
    await connectDB();
    console.log('🔌 Connected to MongoDB');
    
    // Find a user to assign orders to
    const user = await User.findOne().limit(1);
    if (!user) {
      console.log('❌ No user found. Please create a user first.');
      process.exit(1);
    }
    
    console.log(`👤 Found user: ${user.name} (${user.email})`);
    
    // Clear existing orders for this user
    await Order.deleteMany({ userId: user._id });
    console.log('🗑️ Cleared existing orders');
    
    // Create sample orders
    for (const orderData of sampleOrders) {
      // Calculate pricing
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shippingCost = subtotal >= 999 ? 0 : 50;
      const tax = Math.round(subtotal * 0.18);
      const total = subtotal + shippingCost + tax;
      
      // Set return window for delivered orders
      let returnWindow = null;
      if (orderData.status === 'Delivered' && orderData.deliveredDate) {
        returnWindow = new Date(orderData.deliveredDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      }
      
      const order = new Order({
        userId: user._id,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.contactNumber,
        items: orderData.items,
        subtotal,
        shippingCost,
        tax,
        total,
        status: orderData.status,
        orderNumber: `BLM${Date.now()}${Math.floor(Math.random() * 1000)}`, // Generate unique order number
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentStatus,
        orderDate: orderData.orderDate || new Date(),
        deliveredDate: orderData.deliveredDate || null,
        expectedDelivery: orderData.expectedDelivery || null,
        trackingNumber: orderData.trackingNumber || '',
        returnEligible: orderData.returnEligible !== false,
        returnWindow
      });
      
      await order.save();
      console.log(`✅ Created order: ${order.orderNumber} (${order.status})`);
    }
    
    console.log('🎉 Sample orders created successfully!');
    console.log(`📊 Total orders for ${user.name}: ${sampleOrders.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    process.exit(1);
  }
};

// Run the seed function
seedOrders();