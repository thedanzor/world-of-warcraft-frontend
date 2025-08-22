import StyledComponentsRegistry from '../lib/registry'

import '@/core/themes/base.scss'

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
                <meta name="theme-color" content="#1a1a1a" />
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
