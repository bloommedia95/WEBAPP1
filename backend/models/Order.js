import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  brand: { type: String, default: '' },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  size: { type: String, default: '' },
  color: { type: String, default: '' },
  category: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
  // User Information
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  
  // Order Items
  items: [orderItemSchema],
  
  // Pricing
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  
  // Order Status
  status: { 
    type: String, 
    enum: ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Processing' 
  },
  
  // Tracking
  orderNumber: { type: String, unique: true, required: true },
  trackingNumber: { type: String, default: '' },
  
  // Dates
  orderDate: { type: Date, default: Date.now },
  expectedDelivery: { type: Date },
  deliveredDate: { type: Date },
  
  // Address
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  
  // Payment
  paymentMethod: { 
    type: String, 
    enum: ['COD', 'Card', 'UPI', 'Wallet', 'Net Banking'],
    default: 'COD' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending' 
  },
  transactionId: { type: String, default: '' },
  
  // Return/Exchange
  returnEligible: { type: Boolean, default: true },
  returnWindow: { type: Date },
  returnReason: { type: String, default: '' },
  
  // Reviews
  rating: { type: Number, min: 1, max: 5, default: null },
  review: { type: String, default: '' },
  reviewDate: { type: Date },
  
  // Notes
  orderNotes: { type: String, default: '' },
  internalNotes: { type: String, default: '' }
}, { 
  timestamps: true 
});

// Generate unique order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `BLM${timestamp}${random}`;
  }
  
  // Set return window (30 days from delivery)
  if (!this.returnWindow && this.status === 'Delivered') {
    this.returnWindow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
