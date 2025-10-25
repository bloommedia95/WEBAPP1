# 🎨 Theme Controller System - Backend API Documentation

## Overview
Complete backend theme management system for Bloom E-commerce platform. This system enables dynamic color theme changes from the backend that can be consumed by the frontend.

## 📁 Files Structure
```
dashtar-dashboard-node/
├── models/Theme.js          # MongoDB schema for themes
├── routes/themes.js         # API routes for theme CRUD operations
├── seedThemes.js           # Default themes seeder
├── testThemeController.js  # Test file for theme functionality
└── server.js              # Main server with theme routes mounted
```

## 🚀 Getting Started

### 1. Seed Default Themes
```bash
npm run seed-themes
```
This creates 6 beautiful default themes:
- Default Blue (Active)
- Dark Purple
- Green Nature
- Sunset Orange
- Ocean Blue
- Royal Red

### 2. Test Theme Controller
```bash
npm run test-themes
```
Validates all theme operations and API functionality.

## 📊 Database Schema

### Theme Model Structure
```javascript
{
  name: String,           // Unique theme identifier (e.g., 'dark-purple')
  displayName: String,    // Human readable name (e.g., 'Dark Purple')
  description: String,    // Theme description
  colors: {
    primary: String,      // Main brand color
    secondary: String,    // Secondary color
    accent: String,       // Accent/highlight color
    background: String,   // Page background
    surface: String,      // Card/component surface
    text: String,         // Primary text color
    textSecondary: String,// Secondary text color
    success: String,      // Success state color
    warning: String,      // Warning state color
    error: String,        // Error state color
    border: String,       // Border color
    shadow: String        // Shadow color (rgba)
  },
  gradients: {
    primary: String,      // Primary gradient
    secondary: String,    // Secondary gradient
    success: String       // Success gradient
  },
  isActive: Boolean,      // Only one theme can be active
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠 API Endpoints

### Base URL: `/api/themes`

#### 1. Get All Themes
```
GET /api/themes
```
**Response:**
```javascript
[
  {
    "_id": "...",
    "name": "default",
    "displayName": "Default Blue",
    "description": "Classic blue theme with professional look",
    "colors": { ... },
    "gradients": { ... },
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

#### 2. Get Active Theme
```
GET /api/themes/active
```
**Response:**
```javascript
{
  "_id": "...",
  "name": "default",
  "displayName": "Default Blue",
  "colors": { ... },
  "gradients": { ... },
  "isActive": true
}
```

#### 3. Create New Theme
```
POST /api/themes
Content-Type: application/json

{
  "name": "custom-theme",
  "displayName": "Custom Theme",
  "description": "My custom theme",
  "colors": {
    "primary": "#ff0000",
    "secondary": "#00ff00",
    // ... other required colors
  },
  "gradients": {
    "primary": "linear-gradient(135deg, #ff0000, #ff4444)",
    // ... other gradients
  }
}
```

#### 4. Update Theme
```
PUT /api/themes/:id
Content-Type: application/json

{
  "displayName": "Updated Theme Name",
  "colors": { ... }
}
```

#### 5. Activate Theme
```
POST /api/themes/activate/:id
```
**Note:** Automatically deactivates all other themes.

#### 6. Delete Theme
```
DELETE /api/themes/:id
```
**Note:** Cannot delete active theme.

## 🎯 Frontend Integration Guide

### 1. Fetch Active Theme
```javascript
// Get current active theme
const response = await fetch('/api/themes/active');
const activeTheme = await response.json();

// Apply theme colors to CSS variables
document.documentElement.style.setProperty('--primary-color', activeTheme.colors.primary);
document.documentElement.style.setProperty('--secondary-color', activeTheme.colors.secondary);
// ... apply all colors
```

### 2. Switch Themes
```javascript
// Get all available themes
const response = await fetch('/api/themes');
const themes = await response.json();

// Activate a specific theme
const activateTheme = async (themeId) => {
  await fetch(`/api/themes/activate/${themeId}`, {
    method: 'POST'
  });
  // Refresh active theme
  window.location.reload(); // or update state
};
```

### 3. CSS Variables Integration
```css
:root {
  --primary-color: var(--theme-primary, #2c4691);
  --secondary-color: var(--theme-secondary, #5a7bd5);
  --accent-color: var(--theme-accent, #ff4444);
  --background-color: var(--theme-background, #ffffff);
  --surface-color: var(--theme-surface, #f8faff);
  --text-color: var(--theme-text, #333333);
  --text-secondary-color: var(--theme-text-secondary, #666666);
  --success-color: var(--theme-success, #4caf50);
  --warning-color: var(--theme-warning, #ff9800);
  --error-color: var(--theme-error, #f44336);
  --border-color: var(--theme-border, #e0e0e0);
  --shadow-color: var(--theme-shadow, rgba(0, 0, 0, 0.1));
  
  --primary-gradient: var(--theme-primary-gradient, linear-gradient(135deg, #2c4691, #5a7bd5));
  --secondary-gradient: var(--theme-secondary-gradient, linear-gradient(135deg, #ff4444, #ff6666));
  --success-gradient: var(--theme-success-gradient, linear-gradient(135deg, #4caf50, #66bb6a));
}
```

## 🎨 Available Default Themes

### 1. Default Blue
- **Primary:** #2c4691 (Professional blue)
- **Secondary:** #5a7bd5 (Light blue)
- **Best for:** Corporate, professional websites

### 2. Dark Purple
- **Primary:** #6f2c91 (Deep purple)
- **Secondary:** #9c5bd5 (Light purple)
- **Best for:** Modern, creative websites

### 3. Green Nature
- **Primary:** #2e7d32 (Forest green)
- **Secondary:** #4caf50 (Fresh green)
- **Best for:** Eco-friendly, organic products

### 4. Sunset Orange
- **Primary:** #e65100 (Warm orange)
- **Secondary:** #ff9800 (Bright orange)
- **Best for:** Food, lifestyle brands

### 5. Ocean Blue
- **Primary:** #006064 (Deep teal)
- **Secondary:** #0097a7 (Aqua blue)
- **Best for:** Travel, water-related businesses

### 6. Royal Red
- **Primary:** #c62828 (Rich red)
- **Secondary:** #e53935 (Bright red)
- **Best for:** Luxury, fashion brands

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Seed default themes
npm run seed-themes

# Test theme functionality
npm run test-themes

# Start production server
npm start
```

## 🚨 Important Notes

1. **Single Active Theme:** Only one theme can be active at a time. When activating a theme, all others are automatically deactivated.

2. **Required Colors:** All color properties in the schema are required when creating a new theme.

3. **Unique Names:** Theme names must be unique and follow kebab-case convention.

4. **Cannot Delete Active Theme:** Active themes cannot be deleted. Activate another theme first.

5. **Frontend Integration:** Frontend needs to fetch active theme on load and apply CSS variables.

## 🎯 Next Steps for Frontend Integration

1. **Create Theme Context:** React context to manage current theme state
2. **Theme Selector Component:** UI component to switch between themes
3. **CSS Variables Integration:** Apply theme colors to CSS custom properties
4. **Persistent Theme:** Store user's theme preference in localStorage
5. **Theme Preview:** Show theme preview before activation

## 📝 Example Frontend Implementation

```javascript
// ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(null);
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    fetchActiveTheme();
    fetchAllThemes();
  }, []);

  const fetchActiveTheme = async () => {
    const response = await fetch('/api/themes/active');
    const theme = await response.json();
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  const fetchAllThemes = async () => {
    const response = await fetch('/api/themes');
    const themesData = await response.json();
    setThemes(themesData);
  };

  const switchTheme = async (themeId) => {
    await fetch(`/api/themes/activate/${themeId}`, { method: 'POST' });
    fetchActiveTheme();
  };

  const applyTheme = (theme) => {
    if (!theme) return;
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--theme-${key}`, value);
    });
    
    Object.entries(theme.gradients).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--theme-${key}-gradient`, value);
    });
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, themes, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## ✅ Status
Backend theme controller system is **COMPLETE** and ready for frontend integration! 🎉