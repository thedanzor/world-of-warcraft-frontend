import React from 'react';
import config from '@/app.config.js';

// Direct imports for all theme providers
import DefaultThemeProvider from './themes/default';

// Theme provider mapping
const themeProviders = {
  default: DefaultThemeProvider,
  // Add more themes here as needed
  // custom: CustomThemeProvider,
};

/**
 * Helper function to register a new theme provider
 * @param {string} themeName - Name of the theme
 * @param {Component} themeProvider - Theme provider component
 */
export const registerThemeProvider = (themeName, themeProvider) => {
  if (themeProviders[themeName]) {
    console.warn(`Theme provider '${themeName}' already exists. Overwriting...`);
  }
  themeProviders[themeName] = themeProvider;
};

/**
 * Helper function to get available theme providers
 * @returns {Array} Array of available theme provider names
 */
export const getAvailableThemeProviders = () => {
  return Object.keys(themeProviders);
};

/**
 * Dynamic Theme Loader
 * 
 * A theme-aware component selector that renders the appropriate theme provider
 * based on the current theme configuration. Uses direct imports for optimal performance.
 * 
 * @param {Object} props - Props to pass to the theme provider (typically children)
 * @param {string} theme - Optional theme override (defaults to config.THEME)
 */
const DynamicThemeLoader = ({ 
  children,
  theme = null
}) => {
  const currentTheme = theme || config.THEME || 'default';
  
  const ThemeProvider = themeProviders[currentTheme];
  
  if (!ThemeProvider) {
    console.error(`Theme provider '${currentTheme}' not found. Available themes:`, Object.keys(themeProviders));
    
    // Fallback to default theme
    const DefaultThemeProvider = themeProviders.default;
    if (DefaultThemeProvider) {
      console.log(`Falling back to default theme provider`);
      return <DefaultThemeProvider>{children}</DefaultThemeProvider>;
    }
    
    // Last resort - render children without theme provider
    console.error('No theme providers available, rendering without theme');
    return <>{children}</>;
  }

  return <ThemeProvider>{children}</ThemeProvider>;
};

export default DynamicThemeLoader;
