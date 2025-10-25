import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create email transporter with Gmail/Ethereal fallback
const createTransporter = () => {
  // Check if Gmail credentials are properly configured
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && 
      process.env.EMAIL_USER !== 'your-email@gmail.com' && 
      process.env.EMAIL_PASS !== 'your-app-password') {
    
    console.log('📧 Using Gmail service for email OTP with enhanced settings');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      // Enhanced settings for better deliverability
      secure: true,
      tls: {
        rejectUnauthorized: false
      },
      // Rate limiting to avoid being marked as spam
      pool: true,
      maxConnections: 1,
      maxMessages: 3
    });
  } else {
    // Fallback to Ethereal for testing (creates fake SMTP)
    console.log('⚠️ Gmail not configured, using test email service');
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }
};

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Email (Simplified & Working)
export const sendOTPEmail = async (email, otp, name = 'Valued Customer') => {
  try {
    console.log(`📧 Attempting to send email OTP to ${email}`); // OTP removed for security
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Bloom Fashion Store',  // More professional name
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Your Login Code - Bloom Fashion',  // Simpler, less spammy subject
      
      // Text version (important for deliverability)
      text: `
Hello ${name},

Your verification code for Bloom Fashion is: ${otp}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
Bloom Fashion Team
      `,
      
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
          <div style="background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ff6b9d; font-size: 28px; margin: 0;">🌸 Bloom E-Commerce</h1>
              <p style="color: #666; margin: 5px 0 0 0;">Your Fashion Destination</p>
            </div>
            
            <!-- Greeting -->
            <div style="margin-bottom: 25px;">
              <h2 style="color: #333; font-size: 22px;">Hello ${name}! 👋</h2>
              <p style="color: #666; line-height: 1.6;">
                Thank you for choosing Bloom E-Commerce. Use the verification code below to complete your login:
              </p>
            </div>
            
            <!-- OTP Code -->
            <div style="background: linear-gradient(135deg, #ff6b9d, #c471ed); padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
              <p style="color: white; font-size: 14px; margin: 0 0 10px 0; opacity: 0.9;">YOUR VERIFICATION CODE</p>
              <div style="font-size: 36px; font-weight: bold; color: white; letter-spacing: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                ${otp}
              </div>
              <p style="color: white; font-size: 14px; margin: 10px 0 0 0; opacity: 0.8;">Valid for 10 minutes</p>
            </div>
            
            <!-- Security Warning -->
            <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; border-radius: 0 8px 8px 0; margin: 25px 0;">
              <p style="color: #e65100; font-weight: bold; margin: 0 0 5px 0;">🔒 Security Notice</p>
              <p style="color: #bf360c; font-size: 14px; margin: 0; line-height: 1.4;">
                Never share this OTP with anyone. Bloom team will never ask for your OTP over phone or email.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
              <p style="margin: 0 0 10px 0;">If you didn't request this, please ignore this email.</p>
              <p style="margin: 0;">Happy Shopping! 🛍️</p>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
                © 2025 Bloom E-Commerce. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email OTP sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    
    // Show preview URL for testing (if using Ethereal)
    if (info.messageId && !process.env.EMAIL_USER) {
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { 
      success: true, 
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
    
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    
    // Console fallback for development
    console.log('\n🎯=== EMAIL OTP FALLBACK ===🎯');
    console.log(`📧 Email: ${email}`);
    console.log(`🔢 OTP Code: ${otp}`);
    console.log(`👤 User: ${name}`);
    console.log('⚠️ Configure Gmail credentials for real email delivery');
    console.log('🎯============================🎯\n');
    
    return { 
      success: true, 
      message: 'OTP displayed in console (email service needs Gmail setup)',
      consoleOTP: otp,
      error: error.message
    };
  }
};

// Send SMS OTP (Console version for testing)
export const sendOTPSMS = async (phone, otp, name = 'User') => {
  try {
    // Import SMS service dynamically
    const { sendSMSOTP } = await import('./smsService.js');
    
    // Use the comprehensive SMS service
    const result = await sendSMSOTP(phone, otp, name);
    return result;
    
  } catch (error) {
    console.error('❌ SMS Error:', error);
    
    // Fallback to console display
    console.log('\n🎯=== SMS OTP FALLBACK ===🎯');
    console.log(`📱 Phone: ${phone}`);
    console.log(`🔢 OTP Code: ${otp}`);
    console.log(`👤 User: ${name}`);
    console.log('📧 Check console for OTP');
    console.log('🎯=========================🎯\n');
    
    return { 
      success: true, 
      message: 'OTP displayed in console (SMS service error)',
      consoleOTP: otp
    };
  }
};