import StyledComponentsRegistry from '../lib/registry'
import './global.css'

import { nunitoSans } from '@/app/fonts'
import { Theme } from "@radix-ui/themes";
import BaseLayout from '@/core/layout'
import seo from '@/core/seo'

export const metadata = seo

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <meta name="theme-color" content="#09090b" />
            </head>
            <body className={`${nunitoSans.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
                <div className="applicationWrapper">
                    <Theme size="3">
                        <StyledComponentsRegistry>
                            <BaseLayout>{children}</BaseLayout>
                        </StyledComponentsRegistry>
                    </Theme>
                </div>
            </body>
        </html>
    )
}
