// seedPayments.js - Sample Payment Methods Data
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PaymentCard from './models/PaymentCard.js';
import UPI from './models/UPI.js';
import User from './models/profileuser.js';

dotenv.config();

async function seedPaymentMethods() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 Connected to MongoDB');
    
    // Find a user to associate with payment methods
    const users = await User.find({}).limit(2);
    
    if (users.length === 0) {
      console.log('❌ No users found. Please create a user first.');
      process.exit(1);
    }
    
    const user1 = users[0];
    const user2 = users.length > 1 ? users[1] : users[0];
    
    console.log(`👤 Found user: ${user1.name} (${user1.email})`);
    
    // Clear existing payment methods
    await PaymentCard.deleteMany({ userId: { $in: [user1._id, user2._id] } });
    await UPI.deleteMany({ userId: { $in: [user1._id, user2._id] } });
    console.log('🗑️ Cleared existing payment methods');
    
    // Sample Cards Data
    const sampleCards = [
      {
        userId: user1._id,
        cardHolderName: user1.name,
        cardNumber: '4532123456789012', // Visa test number
        expiryMonth: '12',
        expiryYear: '2027',
        cvv: '123',
        cardType: 'Visa',
        cardCategory: 'Credit',
        bankName: 'HDFC Bank',
        nickname: 'Primary Card',
        isDefault: true
      },
      {
        userId: user1._id,
        cardHolderName: user1.name,
        cardNumber: '5555123456789012', // Mastercard test number
        expiryMonth: '08',
        expiryYear: '2026',
        cvv: '456',
        cardType: 'Mastercard',
        cardCategory: 'Debit',
        bankName: 'ICICI Bank',
        nickname: 'Salary Account',
        isDefault: false
      },
      {
        userId: user1._id,
        cardHolderName: user1.name,
        cardNumber: '6076123456789012', // Rupay test number
        expiryMonth: '03',
        expiryYear: '2028',
        cvv: '789',
        cardType: 'Rupay',
        cardCategory: 'Debit',
        bankName: 'SBI',
        nickname: 'Savings Card',
        isDefault: false
      }
    ];
    
    // Sample UPI Data
    const sampleUPIs = [
      {
        userId: user1._id,
        upiId: `${user1.email.split('@')[0]}@paytm`,
        provider: 'Paytm',
        accountHolderName: user1.name,
        mobileNumber: user1.contactNumber || '9876543210',
        nickname: 'Paytm UPI',
        isDefault: true,
        isVerified: true
      },
      {
        userId: user1._id,
        upiId: `${user1.contactNumber || '9876543210'}@ybl`,
        provider: 'PhonePe',
        accountHolderName: user1.name,
        mobileNumber: user1.contactNumber || '9876543210',
        nickname: 'PhonePe UPI',
        isDefault: false,
        isVerified: true
      },
      {
        userId: user1._id,
        upiId: `${user1.email.split('@')[0]}@oksbi`,
        provider: 'GooglePay',
        accountHolderName: user1.name,
        mobileNumber: user1.contactNumber || '9876543210',
        nickname: 'Google Pay',
        isDefault: false,
        isVerified: false
      }
    ];
    
    // Add some payment methods for second user if exists
    if (users.length > 1) {
      sampleCards.push({
        userId: user2._id,
        cardHolderName: user2.name,
        cardNumber: '4111123456789012',
        expiryMonth: '06',
        expiryYear: '2029',
        cvv: '321',
        cardType: 'Visa',
        cardCategory: 'Credit',
        bankName: 'Axis Bank',
        nickname: 'Travel Card',
        isDefault: true
      });
      
      sampleUPIs.push({
        userId: user2._id,
        upiId: `${user2.email.split('@')[0]}@okaxis`,
        provider: 'GooglePay',
        accountHolderName: user2.name,
        mobileNumber: '8765432109',
        nickname: 'Google Pay',
        isDefault: true,
        isVerified: true
      });
    }
    
    // Insert sample cards
    for (const cardData of sampleCards) {
      const card = new PaymentCard(cardData);
      await card.save();
      console.log(`✅ Created card: ${card.bankName} ${card.cardType} - ${card.maskedCardNumber}`);
    }
    
    // Insert sample UPIs
    for (const upiData of sampleUPIs) {
      const upi = new UPI(upiData);
      await upi.save();
      console.log(`✅ Created UPI: ${upi.provider} - ${upi.maskedUpiId}`);
    }
    
    console.log('\n🎉 Sample payment methods created successfully!');
    
    // Summary
    const totalCards = await PaymentCard.countDocuments({ userId: user1._id });
    const totalUPIs = await UPI.countDocuments({ userId: user1._id });
    const defaultCard = await PaymentCard.findOne({ userId: user1._id, isDefault: true });
    const defaultUPI = await UPI.findOne({ userId: user1._id, isDefault: true });
    
    console.log(`📊 Total cards for ${user1.name}: ${totalCards}`);
    console.log(`💳 Total UPIs for ${user1.name}: ${totalUPIs}`);
    console.log(`🏆 Default Card: ${defaultCard ? `${defaultCard.bankName} ${defaultCard.cardType}` : 'None'}`);
    console.log(`🏆 Default UPI: ${defaultUPI ? defaultUPI.displayName : 'None'}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

seedPaymentMethods();