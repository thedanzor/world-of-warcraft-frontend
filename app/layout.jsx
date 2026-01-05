import StyledComponentsRegistry from '../lib/registry'

import { systemui } from '@/app/fonts'
import BaseLayout from '@/core/layout'
import seo from '@/core/seo'

export const metadata = seo

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <meta name="theme-color" content="#0a1628" />
                
                {/* Google Fonts - Telex */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Telex:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
                
                {/* Preload critical styles to prevent FOUC */}
                <link 
                    rel="preload" 
                    href="/_next/static/css/app.css" 
                    as="style" 
                    onLoad="this.onload=null;this.rel='stylesheet'"
                />
                <noscript>
                    <link rel="stylesheet" href="/_next/static/css/app.css" />
                </noscript>
            </head>
            <body>
                <div className={`${systemui.className} applicationWrapper`}>
                    <StyledComponentsRegistry>
                        <BaseLayout>{children}</BaseLayout>
                    </StyledComponentsRegistry>
                </div>
            </body>
        </html>
    )
}
