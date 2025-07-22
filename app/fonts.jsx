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
