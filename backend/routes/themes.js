import express from 'express';
const router = express.Router();
import Theme from '../models/Theme.js';

// Get all themes
router.get('/', async (req, res) => {
  try {
    const themes = await Theme.find().sort({ createdAt: -1 });
    console.log('📋 Themes found:', themes.length);
    res.json(themes); // Return simple array instead of wrapped object
  } catch (error) {
    console.error('❌ Error fetching themes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching themes',
      error: error.message
    });
  }
});

// Get active theme
router.get('/active', async (req, res) => {
  try {
    let activeTheme = await Theme.findOne({ isActive: true });
    
    // If no active theme, return default theme
    if (!activeTheme) {
      activeTheme = {
        name: 'default',
        displayName: 'Default Theme',
        description: 'Default blue theme',
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
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    
    console.log('🎨 Active theme:', activeTheme.displayName);
    res.json(activeTheme); // Return simple object instead of wrapped
  } catch (error) {
    console.error('❌ Error fetching active theme:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active theme',
      error: error.message
    });
  }
});

// Create new theme
router.post('/', async (req, res) => {
  try {
    const {
      name,
      displayName,
      colors,
      gradients,
      description,
      isActive
    } = req.body;

    // Check if theme with same name exists
    const existingTheme = await Theme.findOne({ name });
    if (existingTheme) {
      return res.status(400).json({
        success: false,
        message: 'Theme with this name already exists'
      });
    }

    const newTheme = new Theme({
      name,
      displayName,
      colors,
      gradients,
      description,
      isActive: isActive || false
    });

    await newTheme.save();

    res.status(201).json({
      success: true,
      data: newTheme,
      message: 'Theme created successfully'
    });
  } catch (error) {
    console.error('Error creating theme:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating theme',
      error: error.message
    });
  }
});

// Update theme
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTheme = await Theme.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTheme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }

    res.json({
      success: true,
      data: updatedTheme,
      message: 'Theme updated successfully'
    });
  } catch (error) {
    console.error('Error updating theme:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating theme',
      error: error.message
    });
  }
});

// Activate theme
router.post('/activate/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Deactivate all themes
    await Theme.updateMany({}, { isActive: false });

    // Activate selected theme
    const activatedTheme = await Theme.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!activatedTheme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }

    res.json({
      success: true,
      data: activatedTheme,
      message: 'Theme activated successfully'
    });
  } catch (error) {
    console.error('Error activating theme:', error);
    res.status(500).json({
      success: false,
      message: 'Error activating theme',
      error: error.message
    });
  }
});

// Delete theme
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const theme = await Theme.findById(id);
    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }

    // Prevent deletion of active theme
    if (theme.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active theme. Please activate another theme first.'
      });
    }

    await Theme.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Theme deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting theme:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting theme',
      error: error.message
    });
  }
});

// Get theme by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const theme = await Theme.findById(id);

    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }

    res.json({
      success: true,
      data: theme,
      message: 'Theme retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching theme:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching theme',
      error: error.message
    });
  }
});

export default router;