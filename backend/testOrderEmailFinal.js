// Test Order Confirmation Email with real data
import { sendOrderConfirmationEmail } from './config/orderConfirmationService.js';

console.log('🧪 Testing Order Confirmation Email with Table Layout...\n');

const sampleOrderData = {
  orderNumber: 'BLM376097',
  customerName: 'Surabhi',
  customerEmail: 'test@gmail.com',
  orderDate: 'October 3, 2025',
  deliveryAddress: 'Surabhi Kirar<br>123 Fashion Street<br>Mumbai, Maharashtra 400001<br>Phone: +91 98765 43210',
  products: [
    {
      name: 'Floral Summer Dress',
      size: 'M',
      quantity: 1,
      price: '2499'
    },
    {
      name: 'Denim Jacket',
      size: 'L',
      quantity: 1,
      price: '1999'
    },
    {
      name: 'Cotton Casual Top',
      size: 'S',
      quantity: 2,
      price: '1517'
    }
  ],
  subtotal: '5515',
  tax: '500',
  discount: '200',
  deliveryCharges: '200',
  totalAmount: '6015',
  paymentMethod: 'Credit Card (****1234)',
  estimatedDelivery: 'October 5-7, 2025'
};

(async () => {
  try {
    const result = await sendOrderConfirmationEmail(sampleOrderData);
    
    if (result.success) {
      console.log('✅ Order Confirmation Email sent successfully!');
      console.log(`📬 Message ID: ${result.messageId}`);
      console.log('\n📧 Check your inbox for the updated order confirmation email!');
      console.log('🎨 The email now features:');
      console.log('  • Table-based HTML structure (same as welcome & OTP emails)');
      console.log('  • Purple gradient header matching brand colors');
      console.log('  • Social media icons from Wikipedia Commons');
      console.log('  • Professional footer with policy links');
      console.log('  • Clean order details and billing summary');
      console.log('  • No attachment visibility in Gmail');
    } else {
      console.log('❌ Failed to send order confirmation email:', result.error);
    }
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
})();