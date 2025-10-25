// testOrderConfirmationEmail.js - Test order confirmation email with sample data
import 'dotenv/config';
import { sendOrderConfirmationEmail } from './config/orderConfirmationService.js';

const testOrderConfirmation = async () => {
  try {
    console.log('🧪 Testing Order Confirmation Email');
    console.log('===================================');
    
    // Sample order data (जैसे real order में होगा)
    const sampleOrderData = {
      orderNumber: 'BLM' + Date.now().toString().slice(-6),
      customerName: 'Surabhi Kirar',
      customerEmail: 'test.order@bloom.com',
      orderDate: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      deliveryAddress: {
        name: 'Surabhi Kirar',
        street: '123 Fashion Street, Model Town',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110009',
        country: 'India',
        phone: '+91-9876543210'
      },
      products: [
        {
          name: 'Elegant Summer Dress',
          size: 'M',
          color: 'Blue',
          quantity: 1,
          price: 1299,
          image: '👗'
        },
        {
          name: 'Designer Handbag',
          size: 'One Size',
          color: 'Black',
          quantity: 1,
          price: 2499,
          image: '👜'
        },
        {
          name: 'Stylish Sunglasses',
          size: 'One Size',
          color: 'Gold',
          quantity: 2,
          price: 899,
          image: '🕶️'
        }
      ],
      subtotal: 5597,
      discount: 500, // WELCOME20 discount
      tax: 918, // 18% GST on discounted amount
      deliveryCharges: 0, // Free delivery
      totalAmount: 6015,
      paymentMethod: 'Credit Card (****1234)',
      estimatedDelivery: 'October 5-7, 2025'
    };
    
    console.log('📦 Sample Order Details:');
    console.log('========================');
    console.log(`Order Number: ${sampleOrderData.orderNumber}`);
    console.log(`Customer: ${sampleOrderData.customerName}`);
    console.log(`Email: ${sampleOrderData.customerEmail}`);
    console.log(`Items: ${sampleOrderData.products.length} products`);
    console.log(`Total: ₹${sampleOrderData.totalAmount}`);
    console.log(`Payment: ${sampleOrderData.paymentMethod}`);
    console.log(`Delivery: ${sampleOrderData.estimatedDelivery}`);
    
    console.log('\n📧 Email Content Will Include:');
    console.log('==============================');
    console.log('✅ Order confirmation message');
    console.log('✅ Complete order summary');
    console.log('✅ Product details with images');
    console.log('✅ Billing breakdown (subtotal, tax, discount, total)');
    console.log('✅ Delivery address');
    console.log('✅ Estimated delivery date');
    console.log('✅ Track order button');
    console.log('✅ Download invoice button');
    console.log('✅ Customer support information');
    
    console.log('\n🚀 Sending order confirmation email...');
    
    const result = await sendOrderConfirmationEmail(sampleOrderData);
    
    if (result.success) {
      console.log('\n✅ SUCCESS: Order confirmation email sent!');
      console.log('📬 Message ID:', result.messageId);
      console.log('📧 Order Number:', result.orderNumber);
      console.log('\n🎉 Perfect! Email template is ready for integration');
      console.log('📋 Next Steps:');
      console.log('   1. Add payment gateway integration');
      console.log('   2. Connect with frontend order placement');
      console.log('   3. Add order tracking system');
      console.log('   4. Add invoice generation');
    } else {
      console.log('❌ FAILED:', result.error);
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    process.exit(1);
  }
};

testOrderConfirmation();