/**
 * FONT CONFIGURATION — Inter (matches tntaiaudit)
 */

import { Inter } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
})

// Legacy export name used by layout
export const nunitoSans = inter
