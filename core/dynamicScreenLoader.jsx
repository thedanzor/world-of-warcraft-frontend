import React from 'react';
import { getConfig } from '@/lib/config';

// Direct imports for all screen components by theme
// Default theme imports
import Dashboard from './screens/default/dashboard';
import RosterBuilder from './screens/default/rosterBuilder';
import RosterDisplay from './screens/default/rosterDisplay';
import MythicPlus from './screens/default/mythicPlus';
import MemberDetail from './screens/default/memberDetail';
import Pvp from './screens/default/pvp';
import Audit from './screens/default/audit';
import Recruitment from './screens/default/recruitment';
import Seasons from './screens/default/seasons';
import Error from './screens/default/error';
import NotFound from './screens/default/not-found';

// Screen component mapping by theme
const screenComponents = {
  default: {
    dashboard: Dashboard,
    rosterBuilder: RosterBuilder,
    rosterDisplay: RosterDisplay,
    mythicPlus: MythicPlus,
    memberDetail: MemberDetail,
    pvp: Pvp,
    audit: Audit,
    recruitment: Recruitment,
    seasons: Seasons,
    season3: Seasons, // Legacy support
    error: Error,
    notFound: NotFound,
  },
  // Add more themes here as needed
  // custom: {
  //   dashboard: CustomDashboard,
  //   rosterBuilder: CustomRosterBuilder,
  //   // ... other custom screens
  // }
};

/**
 * Helper function to register a new theme
 * @param {string} themeName - Name of the theme
 * @param {Object} screens - Object containing screen components for the theme
 */
export const registerTheme = (themeName, screens) => {
  if (screenComponents[themeName]) {
    console.warn(`Theme '${themeName}' already exists. Overwriting...`);
  }
  screenComponents[themeName] = screens;
};

/**
 * Helper function to get available themes
 * @returns {Array} Array of available theme names
 */
export const getAvailableThemes = () => {
  return Object.keys(screenComponents);
};

/**
 * Helper function to get available screens for a theme
 * @param {string} themeName - Name of the theme
 * @returns {Array} Array of available screen names for the theme
 */
export const getAvailableScreens = (themeName) => {
  const theme = screenComponents[themeName];
  return theme ? Object.keys(theme) : [];
};

/**
 * Dynamic Screen Loader
 * 
 * A theme-aware component selector that renders the appropriate screen component
 * based on the screenName prop and current theme configuration. Uses direct imports
 * for optimal performance at both build time and runtime.
 * 
 * @param {string} screenName - The name of the screen to load (e.g., 'dashboard', 'roster')
 * @param {Object} props - Props to pass to the loaded screen component
 * @param {string} theme - Optional theme override (defaults to config.THEME)
 */
const DynamicScreenLoader = async ({ 
  screenName, 
  props = {},
  theme = null
}) => {
  const config = await getConfig();
  const currentTheme = theme || config.THEME || 'default';
  
  // Get the screen components for the current theme
  const themeScreens = screenComponents[currentTheme];
  
  if (!themeScreens) {
    console.error(`Theme '${currentTheme}' not found. Available themes:`, Object.keys(screenComponents));
    // Fallback to default theme
    const defaultScreens = screenComponents.default;
    const ScreenComponent = defaultScreens[screenName];
    
    if (!ScreenComponent) {
      console.error(`Screen component '${screenName}' not found in default theme`);
      return <Error />;
    }
    
    return <ScreenComponent {...props} />;
  }
  
  const ScreenComponent = themeScreens[screenName];
  
  if (!ScreenComponent) {
    console.error(`Screen component '${screenName}' not found in theme '${currentTheme}'`);
    
    // Fallback to default theme for this screen
    const defaultScreens = screenComponents.default;
    const DefaultScreenComponent = defaultScreens[screenName];
    
    if (DefaultScreenComponent) {
      console.log(`Falling back to default theme for screen '${screenName}'`);
      return <DefaultScreenComponent {...props} />;
    }
    
    return <Error />;
  }

  return <ScreenComponent {...props} />;
};

export default DynamicScreenLoader;
