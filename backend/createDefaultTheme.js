import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Theme from './models/Theme.js';

dotenv.config();

// Create default theme based on the current design
async function createDefaultTheme() {
  try {
    console.log('🎨 Creating default theme from current design...');
    
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Define the default theme based on screenshot colors
    const defaultTheme = {
      name: 'bloom-default',
      displayName: 'Bloom Default',
      description: 'Default Bloom E-Commerce theme - Pink rose aesthetic with modern touches',
      colors: {
        primary: '#d6eafb',      // Light blue background color from screenshot
        secondary: '#f8d7da',    // Light pink accent
        accent: '#ff6b9d',       // Pink accent color
        background: '#ffffff',   // White background
        surface: '#f9f9f9',     // Light gray surface
        text: '#333333',        // Dark text
        textSecondary: '#666666', // Secondary text
        success: '#28a745',     // Green for success
        warning: '#ffc107',     // Yellow for warnings
        error: '#dc3545',       // Red for errors
        border: '#e9ecef',      // Light border
        shadow: 'rgba(0, 0, 0, 0.1)' // Subtle shadow
      },
      gradients: {
        primary: 'linear-gradient(135deg, #d6eafb, #f8d7da)',
        secondary: 'linear-gradient(135deg, #ff6b9d, #f472b6)',
        success: 'linear-gradient(135deg, #28a745, #20c997)'
      },
      isActive: true
    };

    // Check if default theme already exists
    const existingDefault = await Theme.findOne({ name: 'bloom-default' });
    
    if (existingDefault) {
      // Update existing default theme
      await Theme.updateOne(
        { name: 'bloom-default' },
        { 
          ...defaultTheme,
          updatedAt: new Date()
        }
      );
      console.log('✅ Updated existing Bloom Default theme');
    } else {
      // Deactivate all other themes first
      await Theme.updateMany({}, { isActive: false });
      
      // Create new default theme
      const newTheme = new Theme(defaultTheme);
      await newTheme.save();
      console.log('✅ Created new Bloom Default theme');
    }

    // Ensure this is the only active theme
    await Theme.updateMany({ name: { $ne: 'bloom-default' } }, { isActive: false });
    await Theme.updateOne({ name: 'bloom-default' }, { isActive: true });

    // Display theme info
    const activeTheme = await Theme.findOne({ name: 'bloom-default' });
    console.log('\n🎨 Default Theme Created:');
    console.log(`   Name: ${activeTheme.displayName}`);
    console.log(`   Description: ${activeTheme.description}`);
    console.log(`   Primary Color: ${activeTheme.colors.primary}`);
    console.log(`   Secondary Color: ${activeTheme.colors.secondary}`);
    console.log(`   Accent Color: ${activeTheme.colors.accent}`);
    console.log(`   Status: ${activeTheme.isActive ? '🟢 ACTIVE' : '⚪ Inactive'}`);

    // Show all themes
    const allThemes = await Theme.find({}).sort({ isActive: -1, createdAt: -1 });
    console.log(`\n📊 All Themes (${allThemes.length} total):`);
    allThemes.forEach((theme, index) => {
      const status = theme.isActive ? '🟢 ACTIVE' : '⚪ Available';
      console.log(`   ${index + 1}. ${status} ${theme.displayName} (${theme.name})`);
    });

    console.log('\n🎉 Default theme setup completed!');
    console.log('💡 This theme will remain active unless you manually switch themes.');
    
    // Disconnect
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error creating default theme:', error);
    throw error;
  }
}

// Run the function
console.log('🚀 Bloom E-Commerce Default Theme Creator');
console.log('==========================================');

createDefaultTheme()
  .then(() => {
    console.log('\n✅ Default theme creation completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Default theme creation failed:', error);
    process.exit(1);
  });