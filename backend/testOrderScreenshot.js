// Test Updated Order Confirmation Email
import { sendOrderConfirmationEmail } from './config/orderConfirmationService.js';

console.log('🧪 Testing Updated Order Confirmation Email (Screenshot Style)...\n');

const sampleOrderData = {
  orderNumber: 'BLM236333',
  customerName: 'Surabhi Kirar',
  customerEmail: 'test@gmail.com',
  orderDate: '1 October 2025 at 12:00 pm',
  deliveryAddress: 'Surabhi Kirar<br>123 Fashion Street, Model Town<br>Delhi, Delhi - 110009<br>India<br>Phone: +91-9876543210',
  products: [
    {
      name: 'Elegant Summer Dress',
      size: 'M',
      color: 'Blue',
      quantity: 1,
      price: '1299'
    },
    {
      name: 'Designer Handbag',
      size: 'One Size',
      color: 'Black',
      quantity: 1,
      price: '2499'
    },
    {
      name: 'Stylish Sunglasses',
      size: 'One Size', 
      color: 'Gold',
      quantity: 2,
      price: '899'
    }
  ],
  subtotal: '5597',
  tax: '918',
  discount: '500',
  deliveryCharges: '0',
  totalAmount: '6015',
  paymentMethod: 'Credit Card (****1234)',
  estimatedDelivery: 'October 5-7, 2025'
};

(async () => {
  try {
    const result = await sendOrderConfirmationEmail(sampleOrderData);
    
    if (result.success) {
      console.log('✅ Updated Order Confirmation Email sent successfully!');
      console.log(`📬 Message ID: ${result.messageId}`);
      console.log('\n📧 Check your inbox for the new order confirmation design!');
      console.log('🎨 The email now features (like screenshot):');
      console.log('  • Cyan-blue gradient thank you message');
      console.log('  • Order summary with customer email');
      console.log('  • Items ordered with product icons');
      console.log('  • Billing details in yellow box');
      console.log('  • Delivery address in blue box');
      console.log('  • Estimated delivery in gradient');
      console.log('  • Track & Download buttons');
      console.log('  • Support section with contact info');
      console.log('  • Same footer as OTP/welcome emails');
    } else {
      console.log('❌ Failed to send order confirmation email:', result.error);
    }
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
})();