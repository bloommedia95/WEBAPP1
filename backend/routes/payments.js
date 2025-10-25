// routes/payments.js - Payment Methods API (Cards & UPI)
import express from 'express';
import mongoose from 'mongoose';
import PaymentCard from '../models/PaymentCard.js';
import UPI from '../models/UPI.js';
import User from '../models/profileuser.js';

const router = express.Router();

// ============== PAYMENT CARDS ROUTES ==============

// Get all cards for a user
router.get('/cards/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    const cards = await PaymentCard.find({ 
      userId, 
      isActive: true 
    }).sort({ isDefault: -1, createdAt: -1 });
    
    // Format cards for frontend (remove sensitive data)
    const formattedCards = cards.map(card => ({
      id: card._id,
      cardHolderName: card.cardHolderName,
      maskedCardNumber: card.maskedCardNumber,
      cardType: card.cardType,
      cardCategory: card.cardCategory,
      bankName: card.bankName,
      formattedExpiry: card.formattedExpiry,
      isDefault: card.isDefault,
      nickname: card.nickname,
      displayName: card.displayName,
      isExpired: card.isExpired(),
      lastUsed: card.lastUsed,
      createdAt: card.createdAt
    }));
    
    res.json({
      success: true,
      cards: formattedCards,
      count: formattedCards.length
    });
    
  } catch (error) {
    console.error('Get cards error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cards'
    });
  }
});

// Add new card
router.post('/cards/add', async (req, res) => {
  try {
    const {
      userId,
      cardHolderName,
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      cardType,
      cardCategory,
      bankName,
      nickname,
      isDefault
    } = req.body;
    
    console.log('Add card request:', { userId, cardHolderName, bankName, cardType });
    
    // Validate required fields
    if (!userId || !cardHolderName || !cardNumber || !expiryMonth || !expiryYear || !cvv || !cardType || !cardCategory || !bankName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
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
    
    // Create new card
    const newCard = new PaymentCard({
      userId,
      cardHolderName: cardHolderName.trim(),
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiryMonth,
      expiryYear,
      cvv,
      cardType,
      cardCategory,
      bankName: bankName.trim(),
      nickname: nickname?.trim() || '',
      isDefault: isDefault || false
    });
    
    const savedCard = await newCard.save();
    
    res.status(201).json({
      success: true,
      message: 'Card added successfully',
      card: {
        id: savedCard._id,
        cardHolderName: savedCard.cardHolderName,
        maskedCardNumber: savedCard.maskedCardNumber,
        cardType: savedCard.cardType,
        cardCategory: savedCard.cardCategory,
        bankName: savedCard.bankName,
        formattedExpiry: savedCard.formattedExpiry,
        isDefault: savedCard.isDefault,
        nickname: savedCard.nickname
      }
    });
    
  } catch (error) {
    console.error('Add card error:', error);
    
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
      message: 'Failed to add card'
    });
  }
});

// Delete card
router.delete('/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid card ID'
      });
    }
    
    const card = await PaymentCard.findById(id);
    
    if (!card || !card.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }
    
    // Soft delete
    await PaymentCard.findByIdAndUpdate(id, { 
      isActive: false,
      updatedAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Card removed successfully'
    });
    
  } catch (error) {
    console.error('Delete card error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove card'
    });
  }
});

// Set default card
router.patch('/cards/:id/set-default', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid card ID'
      });
    }
    
    const card = await PaymentCard.findById(id);
    
    if (!card || !card.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }
    
    // Unset all other default cards for this user
    await PaymentCard.updateMany(
      { userId: card.userId },
      { $set: { isDefault: false } }
    );
    
    // Set this card as default
    await PaymentCard.findByIdAndUpdate(id, { 
      isDefault: true,
      updatedAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Default card updated successfully'
    });
    
  } catch (error) {
    console.error('Set default card error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set default card'
    });
  }
});

// ============== UPI ROUTES ==============

// Get all UPIs for a user
router.get('/upi/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    const upis = await UPI.find({ 
      userId, 
      isActive: true 
    }).sort({ isDefault: -1, createdAt: -1 });
    
    // Format UPIs for frontend
    const formattedUPIs = upis.map(upi => ({
      id: upi._id,
      upiId: upi.upiId,
      maskedUpiId: upi.maskedUpiId,
      provider: upi.provider,
      accountHolderName: upi.accountHolderName,
      mobileNumber: upi.mobileNumber,
      isDefault: upi.isDefault,
      nickname: upi.nickname,
      displayName: upi.displayName,
      isVerified: upi.isVerified,
      lastUsed: upi.lastUsed,
      createdAt: upi.createdAt
    }));
    
    res.json({
      success: true,
      upis: formattedUPIs,
      count: formattedUPIs.length
    });
    
  } catch (error) {
    console.error('Get UPIs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch UPI IDs'
    });
  }
});

// Add new UPI
router.post('/upi/add', async (req, res) => {
  try {
    const {
      userId,
      upiId,
      provider,
      accountHolderName,
      mobileNumber,
      nickname,
      isDefault
    } = req.body;
    
    console.log('Add UPI request:', { userId, upiId, provider });
    
    // Validate required fields
    if (!userId || !upiId || !provider || !accountHolderName || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
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
    
    // Create new UPI
    const newUPI = new UPI({
      userId,
      upiId: upiId.trim().toLowerCase(),
      provider,
      accountHolderName: accountHolderName.trim(),
      mobileNumber: mobileNumber.replace(/[\s\-\(\)]/g, ''),
      nickname: nickname?.trim() || '',
      isDefault: isDefault || false
    });
    
    const savedUPI = await newUPI.save();
    
    res.status(201).json({
      success: true,
      message: 'UPI ID added successfully',
      upi: {
        id: savedUPI._id,
        upiId: savedUPI.upiId,
        maskedUpiId: savedUPI.maskedUpiId,
        provider: savedUPI.provider,
        accountHolderName: savedUPI.accountHolderName,
        isDefault: savedUPI.isDefault,
        nickname: savedUPI.nickname
      }
    });
    
  } catch (error) {
    console.error('Add UPI error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This UPI ID is already registered'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to add UPI ID'
    });
  }
});

// Delete UPI
router.delete('/upi/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid UPI ID'
      });
    }
    
    const upi = await UPI.findById(id);
    
    if (!upi || !upi.isActive) {
      return res.status(404).json({
        success: false,
        message: 'UPI ID not found'
      });
    }
    
    // Soft delete
    await UPI.findByIdAndUpdate(id, { 
      isActive: false,
      updatedAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'UPI ID removed successfully'
    });
    
  } catch (error) {
    console.error('Delete UPI error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove UPI ID'
    });
  }
});

// Set default UPI
router.patch('/upi/:id/set-default', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid UPI ID'
      });
    }
    
    const upi = await UPI.findById(id);
    
    if (!upi || !upi.isActive) {
      return res.status(404).json({
        success: false,
        message: 'UPI ID not found'
      });
    }
    
    // Unset all other default UPIs for this user
    await UPI.updateMany(
      { userId: upi.userId },
      { $set: { isDefault: false } }
    );
    
    // Set this UPI as default
    await UPI.findByIdAndUpdate(id, { 
      isDefault: true,
      updatedAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Default UPI updated successfully'
    });
    
  } catch (error) {
    console.error('Set default UPI error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set default UPI'
    });
  }
});

export default router;