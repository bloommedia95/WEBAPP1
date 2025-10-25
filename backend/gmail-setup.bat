@echo off
title Bloom E-Commerce - Gmail Setup Helper
color 0A

echo.
echo     🌸 BLOOM E-COMMERCE - Gmail OTP Setup Helper 🌸
echo     =============================================
echo.

echo Step 1: Gmail Account Setup
echo ----------------------------------------
echo 1. Open: https://myaccount.google.com/security
echo 2. Enable "2-Step Verification" if not already done
echo 3. Look for "App passwords" section
echo 4. Click "App passwords"
echo 5. Select app: Mail
echo 6. Select device: Other (Custom name)
echo 7. Name it: "Bloom OTP System"
echo 8. Click "GENERATE"
echo 9. Copy the 16-character password (like: abcd efgh ijkl mnop)
echo.

echo Step 2: Update .env File
echo ----------------------------------------
echo Open your .env file and replace:
echo.
echo EMAIL_USER=your-email@gmail.com
echo EMAIL_PASS=your-app-password
echo.
echo With your actual Gmail credentials:
echo EMAIL_USER=your-actual-email@gmail.com
echo EMAIL_PASS=your-16-character-app-password
echo.

echo Step 3: Test Configuration
echo ----------------------------------------
echo After updating .env, run:
echo   node testGmailSetup.js
echo.

echo 🔒 Security Notes:
echo - App password is safer than regular password
echo - Can be revoked anytime from Google Account
echo - Only works with SMTP, not for Gmail login
echo.

pause
echo.
echo Opening Gmail Security Settings...
start https://myaccount.google.com/security

echo.
echo Opening .env file for editing...
notepad .env

echo.
echo Ready to test? Press any key to run Gmail test...
pause > nul

echo Testing Gmail configuration...
node testGmailSetup.js

pause