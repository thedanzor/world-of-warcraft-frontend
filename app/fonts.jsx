/**
 * FONT CONFIGURATION SYSTEM
 * 
 * This file manages all font configurations for the World of Warcraft application.
 * It uses Next.js font optimization to ensure fast loading and consistent typography.
 * 
 * WHAT THIS DOES:
 * - Loads Google Fonts (Poppins and Jockey One) with proper optimization
 * - Sets up fallback fonts for better user experience
 * - Configures font weights and subsets for performance
 * - Disables preloading to avoid build issues
 * 
 * FONTS INCLUDED:
 * - systemui: Poppins (400, 500, 600 weights) - Main body text and UI elements
 * - jockeyone: Jockey One (400 weight) - Decorative headings and special text
 * 
 * USAGE:
 * Import these fonts in your components like:
 * import { systemui, jockeyone } from '@/app/fonts'
 * 
 * Then apply to elements:
 * <div className={systemui.className}>Regular text</div>
 * <h1 className={jockeyone.className}>Fancy heading</h1>
 * 
 * PERFORMANCE NOTES:
 * - Fonts are loaded with 'swap' display for better perceived performance
 * - Fallbacks ensure text is visible even if custom fonts fail to load
 * - Preloading is disabled to prevent build-time issues
 */

import { Poppins, Jockey_One } from 'next/font/google'

// Create font configurations with fallbacks
export const systemui = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    display: 'swap',
    fallback: ['system-ui', 'arial', 'sans-serif'],
    preload: false, // Disable preloading to avoid build issues
})

export const jockeyone = Jockey_One({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
    fallback: ['system-ui', 'arial', 'sans-serif'],
    preload: false, // Disable preloading to avoid build issues
})
