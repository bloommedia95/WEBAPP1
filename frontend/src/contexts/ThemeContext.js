import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(null);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch active theme from backend
  const fetchActiveTheme = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/themes/active');
      if (response.ok) {
        const theme = await response.json();
        setCurrentTheme(theme);
        applyTheme(theme);
      } else {
        console.warn('Failed to fetch active theme, using default');
        applyDefaultTheme();
      }
    } catch (error) {
      console.error('Error fetching active theme:', error);
      applyDefaultTheme();
    } finally {
      setLoading(false);
    }
  };

  // Fetch all available themes
  const fetchAllThemes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/themes');
      if (response.ok) {
        const themesData = await response.json();
        setThemes(themesData);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
    }
  };

  // Apply theme colors to CSS variables
  const applyTheme = (theme) => {
    if (!theme || !theme.colors) return;
    
    const root = document.documentElement;
    
    // Apply color variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
      
      // Map to common CSS variables
      switch(key) {
        case 'primary':
          root.style.setProperty('--primary-color', value);
          root.style.setProperty('--btn-primary-bg', value);
          break;
        case 'secondary':
          root.style.setProperty('--secondary-color', value);
          root.style.setProperty('--btn-secondary-bg', value);
          break;
        case 'accent':
          root.style.setProperty('--accent-color', value);
          root.style.setProperty('--highlight-color', value);
          break;
        case 'background':
          root.style.setProperty('--background-color', value);
          root.style.setProperty('--page-bg', value);
          break;
        case 'surface':
          root.style.setProperty('--surface-color', value);
          root.style.setProperty('--card-bg', value);
          break;
        case 'text':
          root.style.setProperty('--text-color', value);
          root.style.setProperty('--primary-text', value);
          break;
        case 'textSecondary':
          root.style.setProperty('--text-secondary-color', value);
          root.style.setProperty('--secondary-text', value);
          break;
        case 'success':
          root.style.setProperty('--success-color', value);
          break;
        case 'warning':
          root.style.setProperty('--warning-color', value);
          break;
        case 'error':
          root.style.setProperty('--error-color', value);
          break;
        case 'border':
          root.style.setProperty('--border-color', value);
          break;
        case 'shadow':
          root.style.setProperty('--shadow-color', value);
          break;
      }
    });
    
    // Apply gradients
    if (theme.gradients) {
      Object.entries(theme.gradients).forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}-gradient`, value);
        
        switch(key) {
          case 'primary':
            root.style.setProperty('--primary-gradient', value);
            break;
          case 'secondary':
            root.style.setProperty('--secondary-gradient', value);
            break;
          case 'success':
            root.style.setProperty('--success-gradient', value);
            break;
        }
      });
    }
    
    console.log(`🎨 Applied theme: ${theme.displayName || theme.name}`);
  };

  // Use default theme as fallback
  const applyDefaultTheme = () => {
    const defaultTheme = {
      name: 'default',
      displayName: 'Default Blue',
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
      }
    };
    
    setCurrentTheme(defaultTheme);
    applyTheme(defaultTheme);
  };

  // Switch theme
  const switchTheme = async (themeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/themes/activate/${themeId}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        await fetchActiveTheme(); // Refresh active theme
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error switching theme:', error);
      return false;
    }
  };

  // Initialize theme on mount
  useEffect(() => {
    fetchActiveTheme();
    fetchAllThemes();
  }, []);

  // Watch for theme changes (polling every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchActiveTheme();
    }, 30000); // Check for theme changes every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const value = {
    currentTheme,
    themes,
    loading,
    fetchActiveTheme,
    fetchAllThemes,
    switchTheme,
    applyTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;