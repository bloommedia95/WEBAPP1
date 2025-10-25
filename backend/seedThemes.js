import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Theme from './models/Theme.js';
import connectDB from './config/db.js';

dotenv.config();

// Connect to database
connectDB();

const themes = [
  {
    name: 'default',
    displayName: 'Default Blue',
    description: 'Classic blue theme with professional look',
    colors: {
      primary: '#2c4691',
      secondary: '#5a7bd5',
      accent: '#ff4444',
      background: '#ffffff',
      surface: '#f8faff',
      text: '#333333',
      textSecondary: '#666666',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      border: '#e0e0e0',
      shadow: 'rgba(0, 0, 0, 0.1)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #2c4691, #5a7bd5)',
      secondary: 'linear-gradient(135deg, #ff4444, #ff6666)',
      success: 'linear-gradient(135deg, #4caf50, #66bb6a)'
    },
    isActive: true
  },
  {
    name: 'dark-purple',
    displayName: 'Dark Purple Elite',
    description: 'Elegant dark theme with purple accents - perfect for night browsing',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a855f7',
      accent: '#f59e0b',
      background: '#1a1a2e',
      surface: '#16213e',
      text: '#ffffff',
      textSecondary: '#b4b4b4',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      border: '#374151',
      shadow: 'rgba(139, 92, 246, 0.2)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
      secondary: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      success: 'linear-gradient(135deg, #10b981, #34d399)'
    },
    isActive: false
  },
  {
    name: 'green-nature',
    displayName: 'Green Nature',
    description: 'Fresh green theme inspired by nature - eco-friendly vibes for sustainable shopping',
    colors: {
      primary: '#22c55e',
      secondary: '#16a34a',
      accent: '#ef4444',
      background: '#f0fdf4',
      surface: '#dcfce7',
      text: '#1a1a1a',
      textSecondary: '#4b5563',
      success: '#15803d',
      warning: '#ea580c',
      error: '#dc2626',
      border: '#bbf7d0',
      shadow: 'rgba(34, 197, 94, 0.15)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #22c55e, #16a34a)',
      secondary: 'linear-gradient(135deg, #ef4444, #f87171)',
      success: 'linear-gradient(135deg, #15803d, #22c55e)'
    },
    isActive: false
  },
  {
    name: 'sunset-orange',
    displayName: 'Sunset Orange',
    description: 'Warm orange theme like a beautiful sunset - energetic and vibrant shopping experience',
    colors: {
      primary: '#ea580c',
      secondary: '#fb923c',
      accent: '#8b5cf6',
      background: '#fff7ed',
      surface: '#fed7aa',
      text: '#1a1a1a',
      textSecondary: '#6b7280',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      border: '#fde68a',
      shadow: 'rgba(234, 88, 12, 0.15)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #ea580c, #fb923c)',
      secondary: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
      success: 'linear-gradient(135deg, #059669, #10b981)'
    },
    isActive: false
  },
  {
    name: 'ocean-blue',
    displayName: 'Ocean Blue',
    description: 'Deep ocean blue theme - calm and professional for business and corporate users',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#f59e0b',
      background: '#f0f9ff',
      surface: '#e0f2fe',
      text: '#0c4a6e',
      textSecondary: '#475569',
      success: '#059669',
      warning: '#ea580c',
      error: '#dc2626',
      border: '#bae6fd',
      shadow: 'rgba(14, 165, 233, 0.15)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
      secondary: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      success: 'linear-gradient(135deg, #059669, #10b981)'
    },
    isActive: false
  },
  {
    name: 'royal-red',
    displayName: 'Royal Red',
    description: 'Luxurious red theme with gold accents - premium and elegant for fashion brands',
    colors: {
      primary: '#dc2626',
      secondary: '#ef4444',
      accent: '#f59e0b',
      background: '#fef2f2',
      surface: '#fee2e2',
      text: '#7f1d1d',
      textSecondary: '#6b7280',
      success: '#059669',
      warning: '#d97706',
      error: '#b91c1c',
      border: '#fecaca',
      shadow: 'rgba(220, 38, 38, 0.15)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #dc2626, #ef4444)',
      secondary: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      success: 'linear-gradient(135deg, #059669, #10b981)'
    },
    isActive: false
  },
  {
    name: 'pink-rose',
    displayName: 'Pink Rose',
    description: 'Soft pink theme with rose accents - feminine and elegant for beauty and fashion',
    colors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#8b5cf6',
      background: '#fdf2f8',
      surface: '#fce7f3',
      text: '#831843',
      textSecondary: '#6b7280',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      border: '#fbcfe8',
      shadow: 'rgba(236, 72, 153, 0.15)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #ec4899, #f472b6)',
      secondary: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
      success: 'linear-gradient(135deg, #059669, #10b981)'
    },
    isActive: false
  },
  {
    name: 'cyber-mint',
    displayName: 'Cyber Mint',
    description: 'Modern cyberpunk theme with mint accents - futuristic and tech-savvy design',
    colors: {
      primary: '#06d6a0',
      secondary: '#118ab2',
      accent: '#ffd166',
      background: '#0a0a0a',
      surface: '#1a1a1a',
      text: '#00f5ff',
      textSecondary: '#a0a0a0',
      success: '#06ffa5',
      warning: '#ffd166',
      error: '#ff4081',
      border: '#2a2a2a',
      shadow: 'rgba(6, 214, 160, 0.2)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #06d6a0, #118ab2)',
      secondary: 'linear-gradient(135deg, #ffd166, #ff8500)',
      success: 'linear-gradient(135deg, #06ffa5, #06d6a0)'
    },
    isActive: false
  }
];

async function seedThemes() {
  try {
    // Clear existing themes
    await Theme.deleteMany({});
    console.log('Existing themes cleared');

    // Insert new themes
    await Theme.insertMany(themes);
    console.log('Default themes created successfully!');
    
    console.log('\nAvailable themes:');
    themes.forEach((theme, index) => {
      console.log(`${index + 1}. ${theme.displayName} (${theme.name}) ${theme.isActive ? '- ACTIVE' : ''}`);
    });
    
    console.log('\nTheme API endpoints:');
    console.log('GET /api/themes - Get all themes');
    console.log('GET /api/themes/active - Get active theme');
    console.log('POST /api/themes/activate/:id - Activate theme');
    console.log('POST /api/themes - Create new theme');
    console.log('PUT /api/themes/:id - Update theme');
    console.log('DELETE /api/themes/:id - Delete theme');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding themes:', error);
    process.exit(1);
  }
}

seedThemes();