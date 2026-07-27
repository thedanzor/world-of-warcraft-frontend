/** Shared app branding — defaults; live values come from DB via /api/config */
export const APP_NAME = 'WoW Guild Audit Tool'
export const APP_SHORT_NAME = 'WoW Guild Audit'
export const APP_DESCRIPTION =
  'Audit your World of Warcraft guild for raid readiness — track missing enchants, lockouts, Mythic+ rankings, and PvP standings.'
export const APP_KEYWORDS =
  'World of Warcraft, WoW, guild audit, raid readiness, mythic plus, Raider.io, Warcraft Logs'

import { buildMetadataFromConfig, SEO_DEFAULTS } from '@/lib/buildMetadata'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

const seo = buildMetadataFromConfig({
  SITE_NAME: SEO_DEFAULTS.SITE_NAME,
  SITE_DESCRIPTION: SEO_DEFAULTS.SITE_DESCRIPTION,
  SITE_KEYWORDS: SEO_DEFAULTS.SITE_KEYWORDS,
  OG_IMAGE_URL: SEO_DEFAULTS.OG_IMAGE_URL,
  TWITTER_IMAGE_URL: SEO_DEFAULTS.TWITTER_IMAGE_URL,
}, baseUrl)

export default seo
