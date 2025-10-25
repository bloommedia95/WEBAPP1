// Simple base64 test email
import 'dotenv/config';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const testSimpleBase64 = async () => {
  try {
    const imagePath = 'c:/Users/surabhi/Desktop/bloom-e-commerce-main/bloom-e-commerce-main/frontend/public/img';
    const instagramBase64 = fs.readFileSync(path.join(imagePath, 'insta.png'), 'base64');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      secure: true,
      tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
      from: { name: 'Bloom E-Commerce', address: process.env.EMAIL_USER },
      to: 'surabhikirar@gmail.com',
      subject: 'Test Base64 Image',
      html: `
        <div style="text-align: center; padding: 20px;">
          <h2>Base64 Image Test</h2>
          <p>If you see the Instagram icon below, base64 is working:</p>
          <img src="data:image/png;base64,${instagramBase64}" alt="Instagram" style="width: 50px; height: 50px; border: 1px solid #ccc;">
          <p>End of test</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent:', info.messageId);
    console.log('📧 Check if Instagram icon displays');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testSimpleBase64();