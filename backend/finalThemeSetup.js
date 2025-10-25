import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Theme from './models/Theme.js';

dotenv.config();

// Final update for Bloom Default theme with proper color mapping
async function finalThemeUpdate() {
  try {
    console.log('🎨 Final update for Bloom Default theme...');
    
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Update Bloom Default theme with the light blue color as primary
    const bloomDefaultUpdate = {
      colors: {
        primary: '#D6EAF8',      // Light blue - will be used for both sections
        secondary: '#C3E4F7',    // Slightly darker blue
        accent: '#ff6b9d',       // Pink accent
        background: '#ffffff',   // White background
        surface: '#f8faff',     // Very light blue surface
        text: '#333333',        // Dark text
        textSecondary: '#666666', // Secondary text
        success: '#28a745',     // Green for success
        warning: '#ffc107',     // Yellow for warnings
        error: '#dc3545',       // Red for errors
        border: '#e9ecef',      // Light border
        shadow: 'rgba(0, 0, 0, 0.1)' // Subtle shadow
      },
      gradients: {
        primary: 'linear-gradient(135deg, #D6EAF8, #C3E4F7)',
        secondary: 'linear-gradient(135deg, #ff6b9d, #f472b6)',
        success: 'linear-gradient(135deg, #28a745, #20c997)'
      },
      updatedAt: new Date()
    };

    // Update the Bloom Default theme
    const result = await Theme.updateOne(
      { name: 'bloom-default' },
      { $set: bloomDefaultUpdate }
    );

    if (result.modifiedCount > 0 || result.matchedCount > 0) {
      console.log('✅ Bloom Default theme updated successfully!');
      
      // Display current theme
      const currentTheme = await Theme.findOne({ name: 'bloom-default' });
      console.log('\n🎨 Bloom Default Theme:');
      console.log(`   Primary (Both Sections): ${currentTheme.colors.primary}`);
      console.log(`   Secondary: ${currentTheme.colors.secondary}`);
      console.log(`   Accent: ${currentTheme.colors.accent}`);
      console.log(`   Status: ${currentTheme.isActive ? '🟢 ACTIVE' : '⚪ Inactive'}`);
      
      console.log('\n🎯 Now configured:');
      console.log('   ✅ Bloom Default: Both sections = #D6EAF8');
      console.log('   ✅ Other themes: Both sections = theme.primary color');
      console.log('   ✅ Always consistent between top banner & brands');
      
      // Show example of how other themes will work
      const otherThemes = await Theme.find({ name: { $ne: 'bloom-default' } }).limit(3);
      console.log('\n🌈 Example with other themes:');
      otherThemes.forEach(theme => {
        console.log(`   ${theme.displayName}: Both sections = ${theme.colors.primary}`);
      });
      
    } else {
      console.log('❌ No theme was updated.');
    }
    
    // Disconnect
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error updating theme:', error);
    throw error;
  }
}

// Run the function
console.log('🚀 Final Bloom Theme Configuration');
console.log('===================================');

finalThemeUpdate()
  .then(() => {
    console.log('\n✅ Configuration completed!');
    console.log('🎨 Theme system now works perfectly:');
    console.log('   • Bloom Default: Light blue sections');
    console.log('   • Other themes: Sections match theme colors');
    console.log('   • Both sections always same color');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Configuration failed:', error);
    process.exit(1);
  });