import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

console.log('🧪 Testing Gmail SMTP Configuration...\n');

// Test Gmail SMTP Setup
async function testGmailSetup() {
  console.log('📋 Environment Check:');
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set' : '❌ Missing'}`);
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing'}\n`);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ Gmail credentials missing!');
    console.log('📖 Please check GMAIL_SETUP_GUIDE.md for setup instructions\n');
    return false;
  }

  try {
    console.log('🔧 Creating Gmail transporter...');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('✅ Transporter created successfully!');
    console.log('🔍 Verifying SMTP connection...');

    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP Connection verified!');

    // Send test email
    console.log('📧 Sending test OTP email...\n');

    const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    const mailOptions = {
      from: {
        name: '🌸 Bloom E-Commerce',
        address: process.env.EMAIL_USER
      },
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: '🧪 Test OTP - Bloom E-Commerce Setup',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
          <div style="background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ff6b9d; font-size: 28px; margin: 0;">🌸 Bloom E-Commerce</h1>
              <p style="color: #666; margin: 5px 0 0 0;">Gmail SMTP Test Successful!</p>
            </div>
            
            <!-- Test Message -->
            <div style="margin-bottom: 25px;">
              <h2 style="color: #333; font-size: 22px;">🧪 Configuration Test</h2>
              <p style="color: #666; line-height: 1.6;">
                Great news! Your Gmail SMTP configuration is working perfectly. 
                Here's your test OTP:
              </p>
            </div>
            
            <!-- Test OTP -->
            <div style="background: linear-gradient(135deg, #ff6b9d, #c471ed); padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
              <p style="color: white; font-size: 14px; margin: 0 0 10px 0; opacity: 0.9;">TEST OTP CODE</p>
              <div style="font-size: 36px; font-weight: bold; color: white; letter-spacing: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                ${testOTP}
              </div>
              <p style="color: white; font-size: 14px; margin: 10px 0 0 0; opacity: 0.8;">System Ready for Production!</p>
            </div>
            
            <!-- Success Message -->
            <div style="background: #e8f5e8; border-left: 4px solid #4caf50; padding: 15px; border-radius: 0 8px 8px 0; margin: 25px 0;">
              <p style="color: #2e7d32; font-weight: bold; margin: 0 0 5px 0;">🎉 Setup Complete!</p>
              <p style="color: #388e3c; font-size: 14px; margin: 0; line-height: 1.4;">
                Your Bloom E-Commerce OTP system is now ready to send real emails to customers.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
              <p style="margin: 0 0 10px 0;">Email configuration test completed successfully! 🚀</p>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
                © 2025 Bloom E-Commerce. Gmail SMTP Integration Test
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('🎉 Test Email Sent Successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📬 Check your email: ${process.env.EMAIL_USER}`);
    console.log(`🔢 Test OTP: ${testOTP}\n`);
    
    console.log('✅ Gmail SMTP Configuration is working perfectly!');
    console.log('🚀 Your OTP system is ready for production use!');
    
    return true;

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Fix suggestions:');
      console.log('1. Make sure 2-Factor Authentication is enabled on Gmail');
      console.log('2. Generate a new App Password (not regular password)');
      console.log('3. Use the 16-character app password in EMAIL_PASS');
    }
    
    return false;
  }
}

// Run the test
testGmailSetup()
  .then((success) => {
    if (success) {
      console.log('\n🎯 Next Steps:');
      console.log('1. Your email OTP system is ready!');
      console.log('2. Test it on your frontend application');
      console.log('3. Users will receive beautiful OTP emails');
    } else {
      console.log('\n🔧 Setup Required:');
      console.log('1. Follow GMAIL_SETUP_GUIDE.md');
      console.log('2. Update your .env file');
      console.log('3. Run this test again');
    }
    
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });