import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Theme from './models/Theme.js';

dotenv.config();

// Seed themes function
async function seedThemes() {
  try {
    console.log('🎨 Starting theme seeding process...');
    
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Define themes
    const themes = [
      {
        name: 'green-nature',
        displayName: 'Green Nature',
        description: 'Fresh green theme inspired by nature - eco-friendly vibes',
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
        description: 'Warm orange theme like a beautiful sunset - energetic and vibrant',
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
        description: 'Deep ocean blue theme - calm and professional for business',
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
        description: 'Luxurious red theme with gold accents - premium and elegant',
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
        description: 'Soft pink theme with rose accents - feminine and elegant',
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
        description: 'Modern cyberpunk theme with mint accents - futuristic design',
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

    // Check existing themes
    const existingThemes = await Theme.find({});
    const existingThemeNames = existingThemes.map(theme => theme.name);
    
    console.log(`📋 Found ${existingThemes.length} existing themes:`, existingThemeNames);

    // Filter new themes
    const newThemes = themes.filter(theme => !existingThemeNames.includes(theme.name));
    
    if (newThemes.length === 0) {
      console.log('✅ All themes already exist in the database!');
    } else {
      // Insert new themes
      const insertedThemes = await Theme.insertMany(newThemes);
      console.log(`🎉 Successfully added ${insertedThemes.length} new themes:`);
      
      insertedThemes.forEach((theme, index) => {
        console.log(`   ${index + 1}. 🎨 ${theme.displayName} (${theme.name})`);
        console.log(`      Description: ${theme.description}`);
        console.log(`      Primary Color: ${theme.colors.primary}`);
        console.log('');
      });
    }

    // Display all themes summary
    const allThemes = await Theme.find({}).sort({ createdAt: -1 });
    console.log(`\n📊 Theme Database Summary:`);
    console.log(`   Total Themes: ${allThemes.length}`);
    console.log(`   Active Theme: ${allThemes.find(t => t.isActive)?.displayName || 'None'}`);
    console.log(`   Available Themes:`);
    
    allThemes.forEach((theme, index) => {
      const status = theme.isActive ? '🟢 ACTIVE' : '⚪ Available';
      console.log(`     ${index + 1}. ${status} ${theme.displayName}`);
      console.log(`        ${theme.description}`);
    });

    console.log('\n🎨 Theme seeding completed successfully!');
    console.log('💡 You can now switch between themes in the Theme Manager.');
    
    // Disconnect
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error seeding themes:', error);
    throw error;
  }
}

// Run the seeder
console.log('🚀 Bloom E-Commerce Theme Seeder');
console.log('================================');

seedThemes()
  .then(() => {
    console.log('\n✅ Seeding process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding process failed:', error);
    process.exit(1);
  });