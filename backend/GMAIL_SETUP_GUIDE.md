# 🌸 Bloom E-Commerce - Gmail OTP Setup Guide

## 📧 Gmail SMTP Configuration for Real Email OTP

### Step 1: Enable 2-Factor Authentication
1. Go to **Google Account Settings**: https://myaccount.google.com/
2. Click **Security** in left sidebar
3. Enable **2-Step Verification** if not already enabled
4. Verify with your phone number

### Step 2: Generate App Password
1. Still in **Security** section
2. Look for **App passwords** (appears only after 2FA is enabled)
3. Click **App passwords**
4. Select app: **Mail**
5. Select device: **Windows Computer** (or Other - Custom name)
6. Name it: **Bloom E-Commerce OTP**
7. Click **GENERATE**
8. **COPY the 16-character password** (like: abcd efgh ijkl mnop)

### Step 3: Update Environment Variables
Add these to your `.env` file:

```env
# Gmail SMTP Configuration for OTP
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

### Step 4: Test Email Sending
Run the test script to verify configuration:

```bash
node testProductionEmail.js
```

## 🔐 Security Notes:
- ✅ App Password is safer than regular password
- ✅ Can be revoked anytime from Google Account
- ✅ Only works with SMTP, not for login
- ✅ Keeps your main password secure

## 📱 Alternative Free Email Services:
If Gmail doesn't work, we can use:
1. **Ethereal Email** (Testing - free)
2. **Outlook/Hotmail** (Free tier)
3. **Yahoo Mail** (App password method)

## 🚀 After Setup:
- Real emails will be sent to users
- Beautiful HTML templates included
- Professional OTP experience
- No more console fallback needed

---
**Need help? Follow the steps above or ask for assistance!**