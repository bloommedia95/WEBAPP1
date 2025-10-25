// Test Welcome Email for Surbhi
import 'dotenv/config';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const testSurabhiEmail = async () => {
  try {
    console.log('📧 Testing Welcome Email for Surbhi');
    console.log('=====================================');
    
    const testUser = {
      name: 'Surbhi',
      email: 'surabhikirar@gmail.com'
    };
    
    // Read social media images and convert to base64
    const imagePath = 'c:/Users/surabhi/Desktop/bloom-e-commerce-main/bloom-e-commerce-main/frontend/public/img';
    
    let instagramBase64, facebookBase64, youtubeBase64, twitterBase64;
    
    try {
      instagramBase64 = fs.readFileSync(path.join(imagePath, 'insta.png'), 'base64');
      facebookBase64 = fs.readFileSync(path.join(imagePath, 'facebook.png'), 'base64');
      youtubeBase64 = fs.readFileSync(path.join(imagePath, 'youtube.png'), 'base64');
      twitterBase64 = fs.readFileSync(path.join(imagePath, 'twitter.png'), 'base64');
      
      console.log('✅ All social media images loaded successfully');
    } catch (error) {
      console.log('❌ Could not load images:', error.message);
      return;
    }
    
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
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }
    .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
    .tagline { opacity: 0.9; font-size: 16px; }
    .content { padding: 40px 30px; }
    .welcome-title {
      font-size: 28px;
      color: #333;
      text-align: center;
      margin-bottom: 20px;
      font-weight: 700;
    }
    .welcome-message {
      text-align: center;
      font-size: 16px;
      line-height: 1.6;
      color: #555;
      margin-bottom: 30px;
    }
    .benefits {
      background: #f8f9fa;
      border-radius: 15px;
      padding: 25px;
      margin: 25px 0;
    }
    .benefits-title {
      font-size: 18px;
      color: #333;
      margin-bottom: 15px;
      text-align: center;
      font-weight: 600;
    }
    .benefit-item {
      display: flex;
      align-items: center;
      margin: 12px 0;
      font-size: 14px;
      color: #555;
    }
    .benefit-icon {
      font-size: 18px;
      margin-right: 12px;
      width: 25px;
    }
    .cta-container { text-align: center; margin: 30px 0; }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 15px 35px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
    }
    .footer {
      background: #f8f9fa;
      color: #333;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer-links { margin: 20px 0; }
    .footer-links a {
      color: #74b9ff;
      text-decoration: none;
      margin: 0 15px;
      font-size: 14px;
    }
    .social-links {
      margin: 20px 0;
      display: flex;
      justify-content: center;
      gap: 20px;
    }
    .social-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
    }
    .copyright {
      color: #6c757d;
      font-size: 12px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">🌸 Bloom E-Commerce</div>
      <div class="tagline">Your Premium Fashion Destination</div>
    </div>
    
    <div class="content">
      <div class="welcome-title">Welcome to Bloom! 🎉</div>
      <div class="welcome-message">
        Hi <strong>${testUser.name}</strong>! 👋<br><br>
        We're absolutely thrilled to welcome you to Bloom E-Commerce! 
        Your account has been successfully created and you're now part of our fashion-forward community.
        Get ready to discover the latest trends, exclusive collections, and amazing deals!
      </div>

      <div class="benefits">
        <div class="benefits-title">✨ What You Get as a Bloom Member:</div>
        <div class="benefit-item">
          <span class="benefit-icon">🔄</span>
          Easy 7-day returns & exchanges
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">⚡</span>
          Early access to sales & new collections
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">💝</span>
          Exclusive member-only discounts
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">📱</span>
          24/7 customer support via chat/email
        </div>
      </div>

      <div class="cta-container">
        <a href="http://localhost:3000" class="cta-button">
          Start Shopping Now 🛍️
        </a>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-links">
        <a href="http://localhost:3000/help">Help Center</a>
        <a href="http://localhost:3000/privacy">Privacy Policy</a>
        <a href="http://localhost:3000/terms">Terms & Conditions</a>
        <a href="http://localhost:3000/no-refund">No Refund Policy</a>
      </div>
      
      <div class="social-links">
        ${instagramBase64 ? `<a href="https://instagram.com"><img src="data:image/png;base64,${instagramBase64}" alt="Instagram" class="social-icon"></a>` : ''}
        ${facebookBase64 ? `<a href="https://facebook.com"><img src="data:image/png;base64,${facebookBase64}" alt="Facebook" class="social-icon"></a>` : ''}
        ${youtubeBase64 ? `<a href="https://youtube.com"><img src="data:image/png;base64,${youtubeBase64}" alt="YouTube" class="social-icon"></a>` : ''}
        ${twitterBase64 ? `<a href="https://twitter.com"><img src="data:image/png;base64,${twitterBase64}" alt="Twitter" class="social-icon"></a>` : ''}
      </div>
      
      <div class="copyright">
        © 2025 Bloom E-Commerce. All rights reserved.<br>
        Made with 💝 for fashion lovers in India
      </div>
    </div>
  </div>
</body>
</html>`
    };

    const mailOptions = {
      from: { 
        name: 'Bloom E-Commerce', 
        address: process.env.EMAIL_USER 
      },
      to: testUser.email,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ SUCCESS! Welcome email sent to Surbhi!');
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log('🎉 Email features included:');
    console.log('   - Welcome to Bloom! title');
    console.log('   - Social media icons');
    console.log('   - Member benefits');
    console.log('   - Policy footer links');
    
  } catch (error) {
    console.error('💥 Error during email test:', error.message);
  }
};

// Run the test
testSurabhiEmail();