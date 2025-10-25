console.log(`
🌸 BLOOM E-COMMERCE - GMAIL SETUP 🌸
=====================================

❌ Gmail credentials not configured yet!

🔧 TO SETUP GMAIL FOR REAL EMAIL OTP:

Step 1: Generate Gmail App Password
-----------------------------------
1. Go to: https://myaccount.google.com/security
2. Enable "2-Step Verification" if not enabled
3. Go to "App passwords" section  
4. Select App: "Mail"
5. Select Device: "Other (Custom name)" → Type: "Bloom OTP"
6. Click "GENERATE"
7. Copy the 16-character password (like: abcd efgh ijkl mnop)

Step 2: Update .env file
------------------------
Open the .env file and replace:

FROM:
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password

TO (example):
EMAIL_USER=surabhi@gmail.com
EMAIL_PASS=abcdefghijklmnop

Step 3: Test Email
------------------
After updating .env file, run:
node testEmailSetup.js

Step 4: Restart Server
----------------------
node server.js

🎯 IMPORTANT NOTES:
- Use YOUR real Gmail address
- Use App Password, NOT your regular Gmail password
- App Password should be 16 characters (remove spaces)
- Make sure 2-Step Verification is enabled on Gmail

🚀 After setup, users will receive beautiful OTP emails!
`);

// Check current configuration
import dotenv from 'dotenv';
dotenv.config();

if (process.env.EMAIL_USER === 'your-gmail@gmail.com') {
  console.log('\n❌ Current Status: Gmail NOT configured');
  console.log('📝 Action Required: Update .env file with your real Gmail credentials');
} else {
  console.log(`\n✅ Gmail User Found: ${process.env.EMAIL_USER}`);
  console.log('📝 Next: Run "node testEmailSetup.js" to test');
}