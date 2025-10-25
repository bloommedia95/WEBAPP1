import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
🌸 BLOOM E-COMMERCE - GMAIL SETUP 🌸
=====================================

📧 Let's setup Gmail for sending real OTP emails!

Follow these steps:
1. Enable 2-Factor Authentication on your Gmail
2. Generate App Password from Google Account
3. Enter your Gmail and App Password below

📝 Detailed guide: GMAIL_SETUP_GUIDE.md
`);

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupGmail() {
  try {
    console.log('\n🔧 Gmail Configuration Setup\n');
    
    const email = await askQuestion('Enter your Gmail address: ');
    const appPassword = await askQuestion('Enter your Gmail App Password (16 characters): ');
    
    // Validate email
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Please enter a valid Gmail address');
      process.exit(1);
    }
    
    // Validate app password (remove spaces)
    const cleanPassword = appPassword.replace(/\s/g, '');
    if (cleanPassword.length !== 16) {
      console.log('❌ App Password should be 16 characters');
      console.log('💡 Format: abcd efgh ijkl mnop (spaces are optional)');
      process.exit(1);
    }
    
    // Read current .env file
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add email configuration
    const lines = envContent.split('\n');
    let emailUserUpdated = false;
    let emailPassUpdated = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('EMAIL_USER=')) {
        lines[i] = `EMAIL_USER=${email}`;
        emailUserUpdated = true;
      }
      if (lines[i].startsWith('EMAIL_PASS=')) {
        lines[i] = `EMAIL_PASS=${cleanPassword}`;
        emailPassUpdated = true;
      }
    }
    
    // Add if not found
    if (!emailUserUpdated) {
      lines.push(`EMAIL_USER=${email}`);
    }
    if (!emailPassUpdated) {
      lines.push(`EMAIL_PASS=${cleanPassword}`);
    }
    
    // Write back to .env
    fs.writeFileSync(envPath, lines.join('\n'));
    
    console.log('\n✅ Gmail configuration saved successfully!');
    console.log('\n📧 Configuration:');
    console.log(`   Email: ${email}`);
    console.log(`   App Password: ${'*'.repeat(16)} (hidden for security)`);
    
    console.log('\n🚀 Next steps:');
    console.log('1. Restart your server: node server.js');
    console.log('2. Test email sending: node testProductionEmail.js');
    console.log('3. OTP emails will now be sent to real email addresses!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setupGmail();