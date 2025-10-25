const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: String,
  referrer: String,
  landingPage: String,
  visitedPages: [String],
  timeOnSite: Number, // in seconds
  isReturning: {
    type: Boolean,
    default: false
  },
  converted: {
    type: Boolean,
    default: false
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Visitor', visitorSchema);