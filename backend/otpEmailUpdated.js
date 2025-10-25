// Updated OTP Email Service with Welcome Email Layout
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailOTPService {
  constructor() {
    this.dailyEmailCount = 0;
    this.monthlyEmailCount = 0;
    this.successRate = 100;
    this.failureCount = 0;
    this.dailyLimit = 450;
  }

  createTransporter(provider = 'gmail') {
    const configs = {
      gmail: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      }
    };

    return nodemailer.createTransporter(configs[provider]);
  }

  generateOTPEmailTemplate(email, otp, expiryMinutes = 10) {
    return {
      subject: '🔐 Your Bloom E-Commerce Login Code',
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Login Code - Bloom E-Commerce</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px; color: #333; margin: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <tr>
      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea, #764ba2); color: white;">
        <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: bold;">🌸 Bloom E-Commerce</h1>
        <p style="margin: 0; opacity: 0.9; font-size: 16px;">Your Premium Fashion Destination</p>
      </td>
    </tr>

    <!-- Main Content -->
    <tr>
      <td style="padding: 40px 30px; text-align: center;">
        <h2 style="font-size: 24px; color: #333; margin: 0 0 20px 0; font-weight: 700;">🔐 Your Login Code</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 30px;">
          Hi there! 👋<br><br>
          Here's your secure login code for Bloom E-Commerce. 
          Enter this code to access your account and continue your fashion journey!
        </p>

        <!-- OTP Section -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 15px; margin: 25px 0;">
          <tr>
            <td style="padding: 30px; text-align: center;">
              <p style="color: white; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0; opacity: 0.9;">Your Login Code</p>
              <div style="font-size: 36px; font-weight: bold; color: white; letter-spacing: 8px; margin: 10px 0; font-family: 'Courier New', monospace;">${otp}</div>
              <p style="color: white; font-size: 12px; margin: 10px 0 0 0; opacity: 0.8;">Valid for ${expiryMinutes} minutes</p>
            </td>
          </tr>
        </table>

        <!-- Security Info -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; border-radius: 15px; margin: 25px 0;">
          <tr>
            <td style="padding: 20px;">
              <h3 style="font-size: 16px; color: #333; margin: 0 0 10px 0; text-align: center;">🔒 Security Information</h3>
              <p style="font-size: 14px; color: #555; margin: 5px 0; text-align: left;">
                • This code expires in ${expiryMinutes} minutes
              </p>
              <p style="font-size: 14px; color: #555; margin: 5px 0; text-align: left;">
                • Don't share this code with anyone
              </p>
              <p style="font-size: 14px; color: #555; margin: 5px 0; text-align: left;">
                • If you didn't request this, please ignore this email
              </p>
            </td>
          </tr>
        </table>

        <p style="font-size: 14px; color: #999; margin-top: 30px;">
          Having trouble? Contact our support team at support@bloom.com
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 30px; text-align: center; background: #f8f9fa; border-top: 1px solid #e9ecef;">
        <!-- Footer Links -->
        <p style="margin: 0 0 20px 0;">
          <a href="http://localhost:3000/help" style="color: #74b9ff; text-decoration: none; margin: 0 15px; font-size: 14px;">Help Center</a>
          <a href="http://localhost:3000/privacy" style="color: #74b9ff; text-decoration: none; margin: 0 15px; font-size: 14px;">Privacy Policy</a>
          <a href="http://localhost:3000/terms" style="color: #74b9ff; text-decoration: none; margin: 0 15px; font-size: 14px;">Terms & Conditions</a>
          <a href="http://localhost:3000/no-refund" style="color: #74b9ff; text-decoration: none; margin: 0 15px; font-size: 14px;">No Refund Policy</a>
        </p>
        
        <!-- Social Media Icons -->
        <p style="margin: 20px 0; font-size: 13px; color: #777;">Follow us on</p>
        <a href="https://instagram.com" style="display: inline-block; margin: 0 6px;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/64px-Instagram_icon.png" alt="Instagram" width="30" height="30" style="border-radius: 6px; vertical-align: middle;">
        </a>
        <a href="https://facebook.com" style="display: inline-block; margin: 0 6px;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/64px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook" width="30" height="30" style="border-radius: 6px; vertical-align: middle;">
        </a>
        <a href="https://youtube.com" style="display: inline-block; margin: 0 6px;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/64px-YouTube_full-color_icon_%282017%29.svg.png" alt="YouTube" width="30" height="30" style="border-radius: 6px; vertical-align: middle;">
        </a>
        <a href="https://twitter.com" style="display: inline-block; margin: 0 6px;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/64px-Logo_of_Twitter.svg.png" alt="Twitter" width="30" height="30" style="border-radius: 6px; vertical-align: middle;">
        </a>
        
        <p style="font-size: 12px; margin: 20px 0 0 0; color: #6c757d;">
          © 2025 Bloom E-Commerce. All rights reserved.<br>
          Made with 💝 for fashion lovers in India
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
    };
  }

  async sendOTP(email, otp, expiryMinutes = 10) {
    try {
      console.log(`📧 Sending OTP email to: ${email}`);
      
      const transporter = this.createTransporter('gmail');
      const emailTemplate = this.generateOTPEmailTemplate(email, otp, expiryMinutes);
      
      const mailOptions = {
        from: {
          name: 'Bloom E-Commerce',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      };

      const info = await transporter.sendMail(mailOptions);
      
      console.log('✅ OTP email sent successfully!');
      console.log(`📬 Message ID: ${info.messageId}`);
      
      this.dailyEmailCount++;
      
      return {
        success: true,
        messageId: info.messageId,
        provider: 'gmail'
      };
      
    } catch (error) {
      console.error('❌ Failed to send OTP email:', error.message);
      this.failureCount++;
      
      return {
        success: false,
        error: error.message
      };
    }
  }
}

const emailOTPService = new EmailOTPService();

export const sendOTPEmail = (email, otp, expiryMinutes = 10) =>
  emailOTPService.sendOTP(email, otp, expiryMinutes);

export default emailOTPService;