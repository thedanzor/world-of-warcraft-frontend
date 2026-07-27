/**
 * Server-side config fetch for metadata generation.
 */
export async function getServerConfig() {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL
  if (!baseUrl) {
    const defaultConfig = await import('@/app.config.js')
    return defaultConfig.default
  }

  try {
    const response = await fetch(`${baseUrl}/api/config`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await response.json()
    if (data.success && data.config) return data.config
  } catch (error) {
    console.error('getServerConfig failed:', error.message)
  }

  const defaultConfig = await import('@/app.config.js')
  return defaultConfig.default
}
