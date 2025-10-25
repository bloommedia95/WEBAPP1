// models/Address.js - User Address Management Model
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  // User Reference
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Address Information
  fullName: { 
    type: String, 
    required: true,
    trim: true 
  },
  phoneNumber: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        const cleaned = v.replace(/[\s\-\(\)\+]/g, '');
        return /^\d{10,}$/.test(cleaned);
      },
      message: 'Please enter a valid phone number'
    }
  },
  
  // Address Details
  addressLine1: { 
    type: String, 
    required: true,
    trim: true 
  },
  addressLine2: { 
    type: String, 
    default: '',
    trim: true 
  },
  landmark: { 
    type: String, 
    default: '',
    trim: true 
  },
  city: { 
    type: String, 
    required: true,
    trim: true 
  },
  state: { 
    type: String, 
    required: true,
    trim: true 
  },
  pincode: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v);
      },
      message: 'Please enter a valid 6-digit pincode'
    }
  },
  country: { 
    type: String, 
    default: 'India',
    trim: true 
  },
  
  // Address Type
  addressType: {
    type: String,
    enum: ['Home', 'Work', 'Other'],
    default: 'Home'
  },
  
  // Default Address Flag
  isDefault: { 
    type: Boolean, 
    default: false 
  },
  
  // Additional Info
  deliveryInstructions: { 
    type: String, 
    default: '',
    maxlength: 200,
    trim: true 
  },
  
  // Geolocation (Optional)
  coordinates: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null }
  },
  
  // Status
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

// Compound index for user and default address
addressSchema.index({ userId: 1, isDefault: 1 });

// Ensure only one default address per user
addressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    // Remove default flag from other addresses of the same user
    await this.constructor.updateMany(
      { 
        userId: this.userId, 
        _id: { $ne: this._id },
        isDefault: true 
      },
      { isDefault: false }
    );
  }
  
  // If this is the user's first address, make it default
  if (this.isNew) {
    const addressCount = await this.constructor.countDocuments({ userId: this.userId });
    if (addressCount === 0) {
      this.isDefault = true;
    }
  }
  
  next();
});

// Virtual for formatted address
addressSchema.virtual('formattedAddress').get(function() {
  let address = this.addressLine1;
  if (this.addressLine2) address += ', ' + this.addressLine2;
  if (this.landmark) address += ', Near ' + this.landmark;
  address += ', ' + this.city + ', ' + this.state + ' - ' + this.pincode;
  if (this.country !== 'India') address += ', ' + this.country;
  return address;
});

// Virtual for short address (for cards)
addressSchema.virtual('shortAddress').get(function() {
  let address = this.addressLine1.substring(0, 30);
  if (this.addressLine1.length > 30) address += '...';
  address += ', ' + this.city + ', ' + this.state + ' - ' + this.pincode;
  return address;
});

// Ensure virtual fields are serialized
addressSchema.set('toJSON', { virtuals: true });
addressSchema.set('toObject', { virtuals: true });

const Address = mongoose.model('Address', addressSchema);

export default Address;