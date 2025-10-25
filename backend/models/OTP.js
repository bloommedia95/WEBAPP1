import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  identifier: { 
    type: String, 
    required: true, 
    index: true // email या phone number
  },
  otp: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['email', 'phone'], 
    required: true 
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
  attempts: { 
    type: Number, 
    default: 0,
    max: 3 // Maximum 3 attempts
  },
  expiresAt: { 
    type: Date, 
    default: Date.now
    // expires handled by index below
  }
}, { 
  timestamps: true 
});

// Single index for expiry - removes duplicate warning
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 600 });

// Clean up old OTPs before creating new one
otpSchema.statics.cleanupAndCreate = async function(identifier, otp, type) {
  // Remove any existing OTPs for this identifier
  await this.deleteMany({ identifier });
  
  // Create new OTP
  return await this.create({
    identifier,
    otp,
    type,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
  });
};

// Verify OTP method
otpSchema.statics.verifyOTP = async function(identifier, otp) {
  const otpDoc = await this.findOne({ 
    identifier, 
    verified: false,
    expiresAt: { $gt: new Date() }
  });
  
  if (!otpDoc) {
    return { success: false, message: 'OTP expired or not found' };
  }
  
  // Increment attempts
  otpDoc.attempts += 1;
  await otpDoc.save();
  
  if (otpDoc.attempts > 3) {
    await otpDoc.deleteOne();
    return { success: false, message: 'Maximum attempts exceeded. Please request new OTP.' };
  }
  
  if (otpDoc.otp !== otp) {
    return { success: false, message: `Invalid OTP. ${4 - otpDoc.attempts} attempts remaining.` };
  }
  
  // Mark as verified and remove from database
  await otpDoc.deleteOne();
  return { success: true, message: 'OTP verified successfully' };
};

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;