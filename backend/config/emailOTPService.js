import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * PRODUCTION-GRADE EMAIL OTP SERVICE
 * 
 * Features:
 * - Professional email templates
 * - Multiple email providers (Gmail, Outlook, custom SMTP)
 * - Delivery tracking
 * - Rate limiting
 * - Brand customization
 * - Analytics
 */

class EmailOTPService {
  constructor() {
    this.dailyEmailCount = 0;
    this.monthlyEmailCount = 0;
    this.successRate = 100;
    this.failureCount = 0;
    
    // Gmail limits: 500 emails/day for free accounts
    this.dailyLimit = 450; // Keep some buffer
  }

  // Create email transporter (supports multiple providers)
  createTransporter(provider = 'gmail') {
    const configs = {
      gmail: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      },
      outlook: {
        service: 'hotmail',
        auth: {
          user: process.env.OUTLOOK_USER,
          pass: process.env.OUTLOOK_PASS
        }
      },
      custom: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      }
    };

    return nodemailer.createTransport(configs[provider]);
  }

  // Professional OTP Email Template
  createOTPEmailTemplate(otp, name, purpose = 'login') {
    const templates = {
      login: {
        subject: '🔐 Your Bloom E-Commerce Login Code',
        title: 'Login Verification',
        message: 'Use this code to complete your login process:'
      },
      signup: {
        subject: '🌸 Welcome to Bloom E-Commerce - Verify Your Account',
        title: 'Account Verification',
        message: 'Welcome to Bloom! Use this code to verify your new account:'
      },
      transaction: {
        subject: '💳 Transaction Verification - Bloom E-Commerce',
        title: 'Transaction Security',
        message: 'Verify this transaction with your code:'
      }
    };

    const template = templates[purpose] || templates.login;

    return {
      subject: template.subject,
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${template.title} - Bloom E-Commerce</title>
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
        <h2 style="font-size: 24px; color: #333; margin: 0 0 20px 0; font-weight: 700;">🔐 Your Login Otp Code</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 30px;">
          Hello ${name}! 👋<br><br>
          ${template.message}
        </p>

        <!-- OTP Section -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f3f4f6; border-radius: 15px; margin: 25px 0; border-left: 4px solid #8b7cf6;">
          <tr>
            <td style="padding: 30px; text-align: center;">
              <p style="color: #333; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">Your Verification Code</p>
              <div style="font-size: 36px; font-weight: bold; color: #333; letter-spacing: 8px; margin: 10px 0; font-family: 'Courier New', monospace;">${otp}</div>
              <p style="color: #666; font-size: 12px; margin: 10px 0 0 0;">Valid for 10 minutes</p>
            </td>
          </tr>
        </table>

        <!-- Security Info -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f3f4f6; border-radius: 15px; margin: 25px 0; border-left: 4px solid #8b7cf6;">
          <tr>
            <td style="padding: 20px;">
              <h3 style="font-size: 16px; color: #333; margin: 0 0 10px 0; text-align: center;">🔒 Security Notice</h3>
              <p style="font-size: 14px; color: #333; text-align: center; line-height: 1.6; margin: 0;">
                Never share this OTP with anyone. Bloom team will never ask for your OTP over phone or email.
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
          <a href="http://localhost:3000/help" style="color: black; text-decoration: none; margin: 0 15px; font-size: 14px;">Help Center</a>
          <a href="http://localhost:3000/privacy" style="color: black; text-decoration: none; margin: 0 15px; font-size: 14px;">Privacy Policy</a>
          <a href="http://localhost:3000/terms" style="color: black; text-decoration: none; margin: 0 15px; font-size: 14px;">Terms & Conditions</a>
          <a href="http://localhost:3000/no-refund" style="color: black; text-decoration: none; margin: 0 15px; font-size: 14px;">No Refund Policy</a>
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
        <a href="https://x.com" style="display: inline-block; margin: 0 6px;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/64px-X_logo_2023.svg.png" alt="X (Twitter)" width="30" height="30" style="border-radius: 6px; vertical-align: middle;">
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

  // Send OTP Email with analytics
  async sendOTP(email, otp, name = 'Valued Customer', purpose = 'login') {
    try {
      // Check daily limit
      if (this.dailyEmailCount >= this.dailyLimit) {
        return {
          success: false,
          error: 'Daily email limit reached. Please try SMS OTP.',
          code: 'RATE_LIMIT_EXCEEDED'
        };
      }

      console.log(`📧 Sending ${purpose} OTP to ${email}`); // No OTP shown for security
      
      const transporter = this.createTransporter('gmail');
      const emailContent = this.createOTPEmailTemplate(otp, name, purpose);
      
      const mailOptions = {
        from: {
          name: 'Bloom E-Commerce',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: emailContent.subject,
        html: emailContent.html
      };

      const info = await transporter.sendMail(mailOptions);
      
      // Track success
      this.dailyEmailCount++;
      this.monthlyEmailCount++;
      
      console.log(`✅ Email sent successfully: ${info.messageId}`);
      
      return {
        success: true,
        messageId: info.messageId,
        service: 'Email',
        cost: 0,
        provider: 'Gmail'
      };

    } catch (error) {
      this.failureCount++;
      this.successRate = ((this.dailyEmailCount - this.failureCount) / this.dailyEmailCount) * 100;
      
      console.error('❌ Email sending failed:', error.message);
      
      return {
        success: false,
        error: error.message,
        service: 'Email'
      };
    }
  }

  // Get email analytics
  getAnalytics() {
    return {
      dailySent: this.dailyEmailCount,
      monthlySent: this.monthlyEmailCount,
      successRate: this.successRate,
      dailyLimit: this.dailyLimit,
      remainingToday: this.dailyLimit - this.dailyEmailCount,
      totalCost: 0, // Always free!
      costSaved: this.monthlyEmailCount * 0.15 // vs SMS cost
    };
  }
}

// Create singleton instance
const emailService = new EmailOTPService();

// Export functions
export const sendEmailOTP = (email, otp, name, purpose) => 
  emailService.sendOTP(email, otp, name, purpose);

export const getEmailAnalytics = () => 
  emailService.getAnalytics();

export default emailService;