// Table-Based Welcome Email Service - With Original Images
import 'dotenv/config';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export const sendWelcomeEmail = async (name, email) => {
  try {
    console.log(`📧 Sending Welcome Email with Original Images to: ${email}`);
    
    const imagePath = 'c:/Users/surabhi/Desktop/bloom-e-commerce-main/bloom-e-commerce-main/frontend/public/img';
    
    console.log('📧 Preparing email with hosted social media icons...');
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      secure: true,
      tls: {
        rejectUnauthorized: false
      }
    });

    const emailContent = {
      subject: '🌸 Welcome to Bloom E-Commerce - Your Fashion Journey Begins!',
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Bloom E-Commerce</title>
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
      <td style="padding: 40px 30px;">
        <h2 style="font-size: 28px; color: #333; text-align: center; margin: 0 0 20px 0; font-weight: 700;">Welcome to Bloom! 🎉</h2>
        
        <p style="text-align: center; font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 30px;">
          Hi <strong>${name}</strong>! 👋<br><br>
          We're absolutely thrilled to welcome you to Bloom E-Commerce! 
          Your account has been successfully created and you're now part of our fashion-forward community.
          Get ready to discover the latest trends, exclusive collections, and amazing deals!
        </p>

        <!-- Benefits Section -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; border-radius: 15px; margin: 25px 0;">
          <tr>
            <td style="padding: 25px;">
              <h3 style="font-size: 18px; color: #333; margin: 0 0 15px 0; text-align: center; font-weight: 600;">✨ What You Get as a Bloom Member:</h3>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #555;">
                    <span style="font-size: 18px; margin-right: 12px; width: 25px; display: inline-block;">🔄</span>
                    Easy 7-day returns & exchanges
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #555;">
                    <span style="font-size: 18px; margin-right: 12px; width: 25px; display: inline-block;">⚡</span>
                    Early access to sales & new collections
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #555;">
                    <span style="font-size: 18px; margin-right: 12px; width: 25px; display: inline-block;">💝</span>
                    Exclusive member-only discounts
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #555;">
                    <span style="font-size: 18px; margin-right: 12px; width: 25px; display: inline-block;">📱</span>
                    24/7 customer support via chat/email
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- CTA Button -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
          <tr>
            <td style="text-align: center;">
              <a href="http://localhost:3000" style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Start Shopping Now 🛍️
              </a>
            </td>
          </tr>
        </table>
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

    const mailOptions = {
      from: {
        name: 'Bloom E-Commerce',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Clean welcome email sent successfully - NO ATTACHMENTS!');
    console.log(`📬 Message ID: ${info.messageId}`);
    
    return { 
      success: true, 
      messageId: info.messageId 
    };
    
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

export default { sendWelcomeEmail };