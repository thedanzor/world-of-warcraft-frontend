/**
 * THEME CONFIGURATION & CONSTANTS
 * 
 * This file contains all theme-related constants and configuration for the World of Warcraft app.
 * It's the central place to control the app's appearance, layout, and behavior.
 * 
 * WHAT THIS DOES:
 * - Defines social media brand colors for consistent theming
 * - Sets layout dimensions (drawer widths, header height, menu limits)
 * - Controls global theme settings like dark/light mode, font families, etc.
 * - Provides a single source of truth for all UI constants
 * 
 * SOCIAL MEDIA COLORS:
 * These are used throughout the app for social media links and sharing features.
 * Keep them updated with current brand guidelines.
 * 
 * LAYOUT DIMENSIONS:
 * - HORIZONTAL_MAX_ITEM: Maximum items that can fit in horizontal menus
 * - DRAWER_WIDTH: Width of the main navigation drawer when expanded
 * - MINI_DRAWER_WIDTH: Width of the collapsed/mini navigation drawer
 * - HEADER_HEIGHT: Height of the main application header
 * 
 * THEME SETTINGS:
 * - fontFamily: Global font family (currently 'Inter var')
 * - i18n: Internationalization language code
 * - menuOrientation: How menus are displayed ('vertical' or 'horizontal')
 * - menuCaption: Whether to show descriptive text in menus
 * - miniDrawer: Use compact navigation drawer
 * - container: Use container-based layout system
 * - mode: Color scheme ('light' or 'dark')
 * - presetColor: Predefined color palette
 * - themeDirection: Text direction ('ltr' for left-to-right)
 * - themeContrast: High contrast mode for accessibility
 * 
 * USAGE:
 * Import specific constants: import { DRAWER_WIDTH, twitterColor } from './config'
 * Import full config: import config from './config'
 * 
 * MODIFICATION NOTES:
 * - Changes here affect the entire application
 * - Test layout changes on different screen sizes
 * - Consider accessibility when changing contrast and color settings
 */

// ---- Social Media Colors ----
export const twitterColor = '#1DA1F2'      // Twitter brand color
export const facebookColor = '#3b5998'     // Facebook brand color
export const linkedInColor = '#0e76a8'     // LinkedIn brand color

// ---- Layout & Sizing ----
export const HORIZONTAL_MAX_ITEM = 7                 // Max items in horizontal menu
export const DRAWER_WIDTH = 280                      // Main drawer width (px)
export const MINI_DRAWER_WIDTH = 90                  // Mini drawer width (px)
export const HEADER_HEIGHT = 74                      // Header height (px)


// ---- Main Theme Config Object ----
// This object is imported by the theme provider and controls global theme settings.
const config = {
    fontFamily: 'Inter var',                 // Default font family
    i18n: 'en',                             // Default language
    menuOrientation: 'vertical', // Menu orientation
    menuCaption: true,                      // Show menu captions
    miniDrawer: false,                      // Use mini drawer
    container: false,                       // Use container layout
    mode: 'dark',                   // Default color mode
    presetColor: 'default',                 // Color preset
    themeDirection: 'ltr',     // Text direction
    themeContrast: false,                   // Use high contrast mode
}

export default config
