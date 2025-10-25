// Test if images exist and are readable
import fs from 'fs';
import path from 'path';

const imagePath = 'c:/Users/surabhi/Desktop/bloom-e-commerce-main/bloom-e-commerce-main/frontend/public/img';

console.log('Checking image files...');

const files = ['insta.png', 'facebook.png', 'youtube.png', 'twitter.png'];

files.forEach(file => {
  try {
    const filePath = path.join(imagePath, file);
    const stats = fs.statSync(filePath);
    const base64 = fs.readFileSync(filePath, 'base64');
    console.log(`✅ ${file}: ${stats.size} bytes, base64 length: ${base64.length}`);
  } catch (error) {
    console.log(`❌ ${file}: Error - ${error.message}`);
  }
});