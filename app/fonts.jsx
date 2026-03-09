/**
 * FONT CONFIGURATION SYSTEM
 * 
 * This file manages all font configurations for the application.
 */

import { Nunito_Sans } from 'next/font/google'

export const nunitoSans = Nunito_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    display: 'swap',
    variable: '--font-sans',
})
