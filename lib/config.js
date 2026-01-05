/**
 * @file Configuration utility that loads settings from API
 * @module lib/config
 */

let cachedConfig = null;
let configPromise = null;

/**
 * Get app config from API, with caching
 * @returns {Promise<Object>} Config object
 */
export async function getConfig() {
  // Return cached config if available
  if (cachedConfig) {
    return cachedConfig;
  }

  // If a request is already in progress, return that promise
  if (configPromise) {
    return configPromise;
  }

  // Fetch config from API
  configPromise = fetch('/api/config', {
    cache: 'no-store',
  })
    .then(async (response) => {
      const data = await response.json();
      if (data.success && data.config) {
        cachedConfig = data.config;
        return cachedConfig;
      }
      // Fallback to default config if API fails
      const defaultConfig = await import('@/app.config.js');
      cachedConfig = defaultConfig.default;
      return cachedConfig;
    })
    .catch(async (error) => {
      console.error('Error fetching config from API:', error);
      // Fallback to default config on error
      const defaultConfig = await import('@/app.config.js');
      cachedConfig = defaultConfig.default;
      return cachedConfig;
    })
    .finally(() => {
      // Clear promise so we can retry if needed
      configPromise = null;
    });

  return configPromise;
}

/**
 * Check if app is installed
 * @returns {Promise<boolean>} True if app is installed
 */
export async function isInstalled() {
  try {
    const response = await fetch('/api/config', {
      cache: 'no-store',
    });
    const data = await response.json();
    return data.installed === true;
  } catch (error) {
    console.error('Error checking installation status:', error);
    return false;
  }
}

/**
 * Clear the cached config (useful after updates)
 */
export function clearConfigCache() {
  cachedConfig = null;
  configPromise = null;
}

export default getConfig;

