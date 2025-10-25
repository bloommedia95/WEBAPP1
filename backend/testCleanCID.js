// Clean CID test - no visible attachments
import 'dotenv/config';
import nodemailer from 'nodemailer';
import path from 'path';

const testCleanCID = async () => {
  try {
    const imagePath = 'c:/Users/surabhi/Desktop/bloom-e-commerce-main/bloom-e-commerce-main/frontend/public/img';
    
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
      subject: '🌸 Welcome to Bloom E-Commerce - Clean Icons Test',
      html: `
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea, #764ba2); color: white;">
          <h2>🌸 Bloom E-Commerce</h2>
          <p>Social Media Icons Test:</p>
          <div style="margin: 20px 0; gap: 12px; display: inline-block;">
            <img src="cid:instagram" alt="Instagram" style="width: 30px; height: 30px; margin: 0 6px; border-radius: 6px;">
            <img src="cid:facebook" alt="Facebook" style="width: 30px; height: 30px; margin: 0 6px; border-radius: 6px;">
            <img src="cid:youtube" alt="YouTube" style="width: 30px; height: 30px; margin: 0 6px; border-radius: 6px;">
            <img src="cid:twitter" alt="Twitter" style="width: 30px; height: 30px; margin: 0 6px; border-radius: 6px;">
          </div>
          <p>© 2025 Bloom E-Commerce</p>
        </div>
      `,
      attachments: [
        {
          path: path.join(imagePath, 'insta.png'),
          cid: 'instagram'
        },
        {
          path: path.join(imagePath, 'facebook.png'),
          cid: 'facebook'
        },
        {
          path: path.join(imagePath, 'youtube.png'),
          cid: 'youtube'
        },
        {
          path: path.join(imagePath, 'twitter.png'),
          cid: 'twitter'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Clean CID email sent:', info.messageId);
    console.log('📧 Check if icons display without attachment names');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testCleanCID();