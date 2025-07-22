// ==============================|| THEME CONFIGURATION & CONSTANTS ||============================== //
// This file contains all theme-related constants and configuration for the app's UI.
// It is imported by the main theme provider and other theme utilities.

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
