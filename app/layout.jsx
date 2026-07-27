import StyledComponentsRegistry from '../lib/registry'
import './global.css'

import { nunitoSans } from '@/app/fonts'
import { Theme } from "@radix-ui/themes";
import BaseLayout from '@/core/layout'
import { getServerConfig } from '@/lib/serverConfig'
import { buildMetadataFromConfig } from '@/lib/buildMetadata'

export async function generateMetadata() {
  const config = await getServerConfig()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return buildMetadataFromConfig(config, baseUrl)
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <meta name="theme-color" content="#090f18" />
            </head>
            <body className={`${nunitoSans.variable} font-sans antialiased min-h-screen text-foreground`}>
                <div className="applicationWrapper min-h-screen bg-[#090f18]">
                    <Theme appearance="dark" accentColor="blue" radius="medium" scaling="100%" hasBackground={false}>
                        <StyledComponentsRegistry>
                            <BaseLayout>{children}</BaseLayout>
                        </StyledComponentsRegistry>
                    </Theme>
                </div>
            </body>
        </html>
    )
}
