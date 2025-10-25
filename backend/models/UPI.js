// models/UPI.js - UPI Payment Method Model
import mongoose from 'mongoose';

const upiSchema = new mongoose.Schema({
  // User Reference
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // UPI Information
  upiId: { 
    type: String, 
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[\w\.\-]+@[\w\.\-]+$/.test(v);
      },
      message: 'Please enter a valid UPI ID (e.g., user@paytm, user@gpay)'
    }
  },
  
  // UPI Provider
  provider: {
    type: String,
    enum: ['GooglePay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay', 'WhatsApp Pay', 'Other'],
    required: true
  },
  
  // Account Holder Name
  accountHolderName: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  // Linked Mobile Number
  mobileNumber: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        const cleaned = v.replace(/[\s\-\(\)]/g, '');
        return /^\d{10,}$/.test(cleaned);
      },
      message: 'Please enter a valid mobile number'
    }
  },
  
  // Default UPI Flag
  isDefault: { 
    type: Boolean, 
    default: false 
  },
  
  // Nickname for UPI
  nickname: { 
    type: String, 
    default: '',
    trim: true 
  },
  
  // Verification Status
  isVerified: { 
    type: Boolean, 
    default: false 
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
upiSchema.index({ userId: 1, isActive: 1 });
upiSchema.index({ userId: 1, isDefault: 1 });
upiSchema.index({ upiId: 1 }, { unique: true });

// Pre-save middleware to ensure only one default UPI per user
upiSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  this.updatedAt = new Date();
  next();
});

// Virtual for display name
upiSchema.virtual('displayName').get(function() {
  return this.nickname || `${this.provider} (${this.upiId})`;
});

// Virtual for masked UPI ID
upiSchema.virtual('maskedUpiId').get(function() {
  const parts = this.upiId.split('@');
  if (parts.length === 2) {
    const username = parts[0];
    const provider = parts[1];
    const maskedUsername = username.length > 4 
      ? username.substring(0, 2) + '***' + username.slice(-2)
      : username;
    return `${maskedUsername}@${provider}`;
  }
  return this.upiId;
});

// Method to update last used
upiSchema.methods.updateLastUsed = function() {
  this.lastUsed = new Date();
  return this.save();
};

// Static method to find user's default UPI
upiSchema.statics.findDefaultUPI = function(userId) {
  return this.findOne({ userId, isDefault: true, isActive: true });
};

// Static method to get user's active UPIs
upiSchema.statics.findUserUPIs = function(userId) {
  return this.find({ userId, isActive: true }).sort({ isDefault: -1, createdAt: -1 });
};

export default mongoose.model('UPI', upiSchema);