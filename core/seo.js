/** Shared app branding for metadata and UI fallbacks */
export const APP_NAME = 'WoW Guild Audit Tool'
export const APP_SHORT_NAME = 'WoW Guild Audit'
export const APP_DESCRIPTION =
    'Audit your World of Warcraft guild for raid readiness — track missing enchants, lockouts, Mythic+ rankings, and PvP standings. Integrates Battle.net, Raider.io, and Warcraft Logs.'
export const APP_KEYWORDS = [
    'World of Warcraft',
    'WoW',
    'guild audit',
    'raid readiness',
    'missing enchants',
    'raid lockouts',
    'mythic plus',
    'Mythic+',
    'Raider.io',
    'Warcraft Logs',
    'guild roster',
    'PvP ratings',
    'Battle.net',
    'guild management',
].join(', ')

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

const seo = {
    title: {
        default: APP_NAME,
        template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    keywords: APP_KEYWORDS,
    metadataBase: new URL(baseUrl),
    alternates: {
        canonical: '/',
    },
    applicationName: APP_NAME,
    authors: [{ name: 'Scott Jones' }],
    creator: 'scottjones.nl',
    publisher: 'scottjones.nl',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: APP_NAME,
        description: APP_DESCRIPTION,
        url: baseUrl,
        siteName: APP_NAME,
        images: [
            {
                url: '/images/og-image.jpg',
                width: 1200,
                height: 630,
                alt: APP_NAME,
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: APP_NAME,
        description: APP_DESCRIPTION,
        images: ['/images/twitter-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

export default seo
