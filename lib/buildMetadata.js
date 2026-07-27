const DEFAULTS = {
  SITE_NAME: 'WoW Guild Audit Tool',
  SITE_SHORT_NAME: 'WoW Guild Audit',
  SITE_DESCRIPTION:
    'Audit your World of Warcraft guild for raid readiness — track missing enchants, lockouts, Mythic+ rankings, and PvP standings.',
  SITE_KEYWORDS:
    'World of Warcraft, WoW, guild audit, raid readiness, mythic plus, Raider.io, Warcraft Logs',
  OG_IMAGE_URL: '/images/og-image.jpg',
  TWITTER_IMAGE_URL: '/images/twitter-image.jpg',
}

export function buildMetadataFromConfig(config = {}, baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000') {
  const siteName = config.SITE_NAME || DEFAULTS.SITE_NAME
  const description = config.SITE_DESCRIPTION || DEFAULTS.SITE_DESCRIPTION
  const keywords = config.SITE_KEYWORDS || DEFAULTS.SITE_KEYWORDS
  const ogImage = config.OG_IMAGE_URL || DEFAULTS.OG_IMAGE_URL
  const twitterImage = config.TWITTER_IMAGE_URL || DEFAULTS.TWITTER_IMAGE_URL

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    keywords,
    metadataBase: new URL(baseUrl),
    alternates: { canonical: '/' },
    applicationName: siteName,
    authors: [{ name: 'Scott Jones' }],
    creator: 'scottjones.nl',
    publisher: 'scottjones.nl',
    openGraph: {
      title: siteName,
      description,
      url: baseUrl,
      siteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description,
      images: [twitterImage],
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
}

export { DEFAULTS as SEO_DEFAULTS }
