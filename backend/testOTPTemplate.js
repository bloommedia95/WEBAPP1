// Test the updated OTP email template
import { sendEmailOTP } from './config/emailOTPService.js';

console.log('🧪 Testing Updated OTP Email Template...\n');

(async () => {
  try {
    // Send test OTP email
    const result = await sendEmailOTP(
      'test@gmail.com', 
      '987654', 
      'Surabhi', 
      'login'
    );
    
    if (result.success) {
      console.log('✅ OTP Email sent successfully!');
      console.log(`📬 Message ID: ${result.messageId}`);
      console.log(`🎯 Provider: ${result.provider}`);
      console.log('\n📧 Check your inbox for the updated table-based OTP email design!');
      console.log('🎨 The email should now match the welcome email layout with:');
      console.log('  • Table-based HTML structure');
      console.log('  • Same gradient colors (#667eea to #764ba2)');
      console.log('  • Social media icons from Wikipedia Commons');
      console.log('  • Professional footer with policy links');
      console.log('  • No attachment visibility in Gmail');
    } else {
      console.log('❌ Failed to send OTP email:', result.error);
    }
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
})();