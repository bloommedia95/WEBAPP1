// routes/addresses.js - Complete Address Management API
import express from 'express';
import mongoose from 'mongoose';
import Address from '../models/Address.js';
import User from '../models/profileuser.js';

const router = express.Router();

// Get all addresses for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    const addresses = await Address.find({ 
      userId, 
      isActive: true 
    }).sort({ isDefault: -1, createdAt: -1 });
    
    // Format addresses for frontend
    const formattedAddresses = addresses.map(address => ({
      id: address._id,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      landmark: address.landmark,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      addressType: address.addressType,
      isDefault: address.isDefault,
      deliveryInstructions: address.deliveryInstructions,
      formattedAddress: address.formattedAddress,
      shortAddress: address.shortAddress,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt
    }));
    
    res.json({
      success: true,
      addresses: formattedAddresses,
      count: formattedAddresses.length
    });
    
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses'
    });
  }
});

// Add new address
router.post('/add', async (req, res) => {
  try {
    const {
      userId,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      pincode,
      country,
      addressType,
      isDefault,
      deliveryInstructions
    } = req.body;
    
    console.log('Add address request:', req.body);
    
    // Validate required fields
    if (!userId || !fullName || !phoneNumber || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: Full Name, Phone, Address Line 1, City, State, Pincode'
      });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If this is set as default, unset others
    if (isDefault) {
      await Address.updateMany(
        { userId },
        { $set: { isDefault: false } }
      );
    }
    
    // Create new address
    const newAddress = new Address({
      userId,
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.replace(/[\s\-\(\)]/g, ''),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2?.trim() || '',
      landmark: landmark?.trim() || '',
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      country: country?.trim() || 'India',
      addressType: addressType || 'Home',
      isDefault: isDefault || false,
      deliveryInstructions: deliveryInstructions?.trim() || ''
    });
    
    const savedAddress = await newAddress.save();
    
    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      address: savedAddress
    });
    
  } catch (error) {
    console.error('Add address error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to add address'
    });
  }
});

// Update address
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate address ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address ID'
      });
    }
    
    const address = await Address.findById(id);
    if (!address || !address.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // If updating to default, unset others
    if (updateData.isDefault) {
      await Address.updateMany(
        { userId: address.userId, _id: { $ne: id } },
        { $set: { isDefault: false } }
      );
    }
    
    // Update address
    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Address updated successfully',
      address: updatedAddress
    });
    
  } catch (error) {
    console.error('Update address error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update address'
    });
  }
});

// Delete address (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate address ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address ID'
      });
    }
    
    const address = await Address.findById(id);
    
    if (!address || !address.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Soft delete
    await Address.findByIdAndUpdate(id, { 
      isActive: false,
      updatedAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete address'
    });
  }
});

// Set default address
router.patch('/:id/set-default', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate address ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address ID'
      });
    }
    
    const address = await Address.findById(id);
    
    if (!address || !address.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Unset all other default addresses for this user
    await Address.updateMany(
      { userId: address.userId },
      { $set: { isDefault: false } }
    );
    
    // Set this address as default
    await Address.findByIdAndUpdate(id, { 
      isDefault: true,
      updatedAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Default address updated successfully'
    });
    
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set default address'
    });
  }
});

export default router;