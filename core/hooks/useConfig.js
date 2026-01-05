'use client';

import { useState, useEffect } from 'react';
import { getConfig } from '@/lib/config';

/**
 * React hook to get app configuration
 * @returns {Object} Config object and loading state
 */
export function useConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    getConfig()
      .then((configData) => {
        if (mounted) {
          setConfig(configData);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { config, loading, error };
}

export default useConfig;

