// Simple image server to host social media icons
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Serve images from the img folder
const imagePath = 'c:/Users/surabhi/Desktop/bloom-e-commerce-main/bloom-e-commerce-main/frontend/public/img';
app.use('/icons', express.static(imagePath));

// CORS headers for email clients
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  res.send(`
    <h2>Social Media Icons Server</h2>
    <p>Icons available at:</p>
    <ul>
      <li><a href="/icons/insta.png">Instagram</a></li>
      <li><a href="/icons/facebook.png">Facebook</a></li>
      <li><a href="/icons/youtube.png">YouTube</a></li>
      <li><a href="/icons/twitter.png">Twitter</a></li>
    </ul>
  `);
});

app.listen(PORT, () => {
  console.log(`🖼️ Image server running at http://localhost:${PORT}`);
  console.log(`📷 Instagram: http://localhost:${PORT}/icons/insta.png`);
  console.log(`📘 Facebook: http://localhost:${PORT}/icons/facebook.png`);
  console.log(`▶️ YouTube: http://localhost:${PORT}/icons/youtube.png`);
  console.log(`✖️ Twitter: http://localhost:${PORT}/icons/twitter.png`);
});