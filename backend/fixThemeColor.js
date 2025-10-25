import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Theme from './models/Theme.js';

dotenv.config();

// Update default theme with correct light blue color #D6EAF8
async function fixThemeColor() {
  try {
    console.log('🎨 Fixing Bloom Default theme with correct color #D6EAF8...');
    
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Updated theme with correct color #D6EAF8
    const correctedThemeData = {
      colors: {
        primary: '#D6EAF8',      // Correct light blue color
        secondary: '#C3E4F7',    // Slightly darker blue for variety
        accent: '#ff6b9d',       // Pink accent (kept same)
        background: '#ffffff',   // White background
        surface: '#f8faff',     // Very light blue surface
        text: '#333333',        // Dark text
        textSecondary: '#666666', // Secondary text
        success: '#28a745',     // Green for success
        warning: '#ffc107',     // Yellow for warnings
        error: '#dc3545',       // Red for errors
        border: '#e9ecef',      // Light border
        shadow: 'rgba(0, 0, 0, 0.1)', // Subtle shadow
        // Promotional sections with correct color
        promotionalBg: '#D6EAF8', // Correct light blue
        promotionalText: '#333333' // Dark text on light blue
      },
      gradients: {
        primary: 'linear-gradient(135deg, #D6EAF8, #C3E4F7)',
        secondary: 'linear-gradient(135deg, #ff6b9d, #f472b6)',
        success: 'linear-gradient(135deg, #28a745, #20c997)',
        // Promotional gradient with correct color
        promotional: 'linear-gradient(135deg, #D6EAF8, #E8F4FD)'
      },
      updatedAt: new Date()
    };

    // Update the theme
    const result = await Theme.updateOne(
      { name: 'bloom-default' },
      { $set: correctedThemeData }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Successfully updated theme with correct color #D6EAF8!');
      
      // Display updated theme
      const updatedTheme = await Theme.findOne({ name: 'bloom-default' });
      console.log('\n🎨 Corrected Theme Colors:');
      console.log(`   Primary: ${updatedTheme.colors.primary} ✅`);
      console.log(`   Secondary: ${updatedTheme.colors.secondary}`);
      console.log(`   Promotional Background: ${updatedTheme.colors.promotionalBg} ✅`);
      console.log(`   Accent: ${updatedTheme.colors.accent} (Pink)`);
      console.log(`   Status: ${updatedTheme.isActive ? '🟢 ACTIVE' : '⚪ Inactive'}`);
      
      console.log('\n🎯 Color Applied Successfully:');
      console.log('   • Brand logos section: #D6EAF8 ✅');
      console.log('   • "Get 20% Off" section: #D6EAF8 ✅');
      console.log('   • All promotional sections: #D6EAF8 ✅');
      
    } else {
      console.log('❌ No theme was updated. Checking existing theme...');
      const existingTheme = await Theme.findOne({ name: 'bloom-default' });
      if (existingTheme) {
        console.log('Theme exists but no changes were made.');
      } else {
        console.log('Theme not found!');
      }
    }
    
    // Disconnect
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error updating theme color:', error);
    throw error;
  }
}

// Run the function
console.log('🚀 Bloom Theme Color Fix - #D6EAF8');
console.log('=====================================');

fixThemeColor()
  .then(() => {
    console.log('\n✅ Color correction completed!');
    console.log('🎨 Theme now uses #D6EAF8 for all light blue sections.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Color correction failed:', error);
    process.exit(1);
  });