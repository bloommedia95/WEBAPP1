import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Theme from './models/Theme.js';

dotenv.config();

// Update default theme with consistent light blue color
async function updateDefaultTheme() {
  try {
    console.log('🎨 Updating Bloom Default theme colors...');
    
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Updated theme with consistent light blue color from brand section
    const updatedThemeData = {
      colors: {
        primary: '#d6eafb',      // Light blue (same as brands section)
        secondary: '#c3e4f7',    // Slightly darker blue for variety
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
        // New color for promotional sections
        promotionalBg: '#d6eafb', // Same light blue as brands section
        promotionalText: '#333333' // Dark text on light blue
      },
      gradients: {
        primary: 'linear-gradient(135deg, #d6eafb, #c3e4f7)',
        secondary: 'linear-gradient(135deg, #ff6b9d, #f472b6)',
        success: 'linear-gradient(135deg, #28a745, #20c997)',
        // New gradient for promotional sections
        promotional: 'linear-gradient(135deg, #d6eafb, #e8f4fd)'
      },
      updatedAt: new Date()
    };

    // Update the theme
    const result = await Theme.updateOne(
      { name: 'bloom-default' },
      { $set: updatedThemeData }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Successfully updated Bloom Default theme colors!');
      
      // Display updated theme
      const updatedTheme = await Theme.findOne({ name: 'bloom-default' });
      console.log('\n🎨 Updated Theme Colors:');
      console.log(`   Primary: ${updatedTheme.colors.primary} (Light Blue)`);
      console.log(`   Secondary: ${updatedTheme.colors.secondary} (Darker Blue)`);
      console.log(`   Promotional Background: ${updatedTheme.colors.promotionalBg} (Same as brands section)`);
      console.log(`   Accent: ${updatedTheme.colors.accent} (Pink)`);
      console.log(`   Status: ${updatedTheme.isActive ? '🟢 ACTIVE' : '⚪ Inactive'}`);
      
      console.log('\n💡 Now both sections will have the same light blue color:');
      console.log('   • Brand logos section: #d6eafb');
      console.log('   • "Get 20% Off" section: #d6eafb');
      
    } else {
      console.log('❌ No theme was updated. Please check if bloom-default theme exists.');
    }
    
    // Disconnect
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error updating default theme:', error);
    throw error;
  }
}

// Run the function
console.log('🚀 Bloom Default Theme Color Update');
console.log('===================================');

updateDefaultTheme()
  .then(() => {
    console.log('\n✅ Theme color update completed!');
    console.log('🎨 Both sections now have consistent light blue color.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Theme update failed:', error);
    process.exit(1);
  });