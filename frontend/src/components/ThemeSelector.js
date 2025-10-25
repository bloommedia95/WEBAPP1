import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeSelector.css';

const ThemeSelector = () => {
  const { currentTheme, themes, switchTheme, loading } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleThemeSwitch = async (themeId) => {
    setSwitching(true);
    const success = await switchTheme(themeId);
    if (success) {
      setIsOpen(false);
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'theme-notification success';
      notification.textContent = '🎨 Theme changed successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    } else {
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'theme-notification error';
      notification.textContent = '❌ Failed to change theme';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
    setSwitching(false);
  };

  if (loading) {
    return (
      <div className="theme-selector loading">
        <div className="theme-icon">🎨</div>
      </div>
    );
  }

  return (
    <div className={`theme-selector ${isOpen ? 'open' : ''}`}>
      <button
        className="theme-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Change Theme"
      >
        <span className="theme-icon">🎨</span>
        <span className="theme-label">Themes</span>
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          <div className="theme-dropdown-header">
            <h3>🎨 Choose Theme</h3>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="current-theme">
            <h4>Current Theme</h4>
            {currentTheme && (
              <div className="theme-preview">
                <div className="theme-colors">
                  <span 
                    className="color-dot" 
                    style={{ backgroundColor: currentTheme.colors?.primary }}
                  ></span>
                  <span 
                    className="color-dot" 
                    style={{ backgroundColor: currentTheme.colors?.secondary }}
                  ></span>
                  <span 
                    className="color-dot" 
                    style={{ backgroundColor: currentTheme.colors?.accent }}
                  ></span>
                </div>
                <span className="theme-name">{currentTheme.displayName}</span>
              </div>
            )}
          </div>

          <div className="themes-list">
            <h4>Available Themes</h4>
            {themes.length > 0 ? (
              themes.map((theme) => (
                <div
                  key={theme._id}
                  className={`theme-item ${theme.isActive ? 'active' : ''} ${switching ? 'disabled' : ''}`}
                  onClick={() => !theme.isActive && !switching && handleThemeSwitch(theme._id)}
                >
                  <div className="theme-colors">
                    <span 
                      className="color-dot" 
                      style={{ backgroundColor: theme.colors?.primary }}
                    ></span>
                    <span 
                      className="color-dot" 
                      style={{ backgroundColor: theme.colors?.secondary }}
                    ></span>
                    <span 
                      className="color-dot" 
                      style={{ backgroundColor: theme.colors?.accent }}
                    ></span>
                  </div>
                  <div className="theme-info">
                    <span className="theme-name">{theme.displayName}</span>
                    <span className="theme-desc">{theme.description}</span>
                  </div>
                  {theme.isActive && <span className="active-badge">✓ Active</span>}
                </div>
              ))
            ) : (
              <div className="no-themes">
                <p>No themes available</p>
                <small>Contact admin to add themes</small>
              </div>
            )}
          </div>

          {switching && (
            <div className="switching-overlay">
              <div className="spinner"></div>
              <span>Switching theme...</span>
            </div>
          )}
        </div>
      )}

      {isOpen && <div className="theme-overlay" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
};

export default ThemeSelector;