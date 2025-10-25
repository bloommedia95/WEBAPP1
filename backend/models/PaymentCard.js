// models/PaymentCard.js - Payment Card Management Model
import mongoose from 'mongoose';
import crypto from 'crypto';

const paymentCardSchema = new mongoose.Schema({
  // User Reference
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Card Information (Encrypted)
  cardHolderName: { 
    type: String, 
    required: true,
    trim: true 
  },
  cardNumber: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(v.replace(/\s/g, ''));
      },
      message: 'Please enter a valid 16-digit card number'
    }
  },
  maskedCardNumber: { 
    type: String
  },
  expiryMonth: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^(0[1-9]|1[0-2])$/.test(v);
      },
      message: 'Please enter a valid month (01-12)'
    }
  },
  expiryYear: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        const currentYear = new Date().getFullYear();
        const year = parseInt(v);
        return year >= currentYear && year <= currentYear + 20;
      },
      message: 'Please enter a valid expiry year'
    }
  },
  
  // Card Type and Bank
  cardType: {
    type: String,
    enum: ['Visa', 'Mastercard', 'Rupay', 'American Express'],
    required: true
  },
  cardCategory: {
    type: String,
    enum: ['Debit', 'Credit'],
    required: true
  },
  bankName: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  // Security
  cvv: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{3,4}$/.test(v);
      },
      message: 'Please enter a valid CVV'
    }
  },
  
  // Default Card Flag
  isDefault: { 
    type: Boolean, 
    default: false 
  },
  
  // Nickname for card
  nickname: { 
    type: String, 
    default: '',
    trim: true 
  },
  
  // Status
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  // Metadata
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  lastUsed: { 
    type: Date, 
    default: null 
  }
}, {
  timestamps: true
});

// Indexes
paymentCardSchema.index({ userId: 1, isActive: 1 });
paymentCardSchema.index({ userId: 1, isDefault: 1 });

// Pre-save middleware to hash sensitive data and create masked number
paymentCardSchema.pre('save', function(next) {
  if (this.isModified('cardNumber')) {
    // Create masked card number (show last 4 digits)
    const cleanCardNumber = this.cardNumber.replace(/\s/g, '');
    this.maskedCardNumber = '•••• •••• •••• ' + cleanCardNumber.slice(-4);
    
    // Hash the full card number for security
    this.cardNumber = crypto.createHash('sha256').update(cleanCardNumber).digest('hex');
  }
  
  if (this.isModified('cvv')) {
    // Hash CVV
    this.cvv = crypto.createHash('sha256').update(this.cvv).digest('hex');
  }
  
  this.updatedAt = new Date();
  next();
});

// Pre-save middleware to ensure only one default card per user
paymentCardSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// Virtual for formatted expiry
paymentCardSchema.virtual('formattedExpiry').get(function() {
  return `${this.expiryMonth}/${this.expiryYear}`;
});

// Virtual for card display name
paymentCardSchema.virtual('displayName').get(function() {
  return this.nickname || `${this.bankName} ${this.cardType}`;
});

// Method to check if card is expired
paymentCardSchema.methods.isExpired = function() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  const expYear = parseInt(this.expiryYear);
  const expMonth = parseInt(this.expiryMonth);
  
  return expYear < currentYear || (expYear === currentYear && expMonth < currentMonth);
};

// Method to update last used
paymentCardSchema.methods.updateLastUsed = function() {
  this.lastUsed = new Date();
  return this.save();
};

// Static method to find user's default card
paymentCardSchema.statics.findDefaultCard = function(userId) {
  return this.findOne({ userId, isDefault: true, isActive: true });
};

// Static method to get user's active cards
paymentCardSchema.statics.findUserCards = function(userId) {
  return this.find({ userId, isActive: true }).sort({ isDefault: -1, createdAt: -1 });
};

export default mongoose.model('PaymentCard', paymentCardSchema);