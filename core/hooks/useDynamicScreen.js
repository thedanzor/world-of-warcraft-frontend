import { useState, useEffect } from 'react';

/**
 * Custom hook for dynamic screen loading
 * 
 * Provides a consistent way to load screen components dynamically
 * with loading states and error handling.
 * 
 * @param {string} screenName - The name of the screen to load
 * @param {string} theme - The theme directory
 * @returns {Object} - { ScreenComponent, isLoading, error }
 */
export const useDynamicScreen = (screenName, theme = 'default') => {
  const [ScreenComponent, setScreenComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadScreen = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const module = await import(`@/core/screens/${theme}/${screenName}`);
        setScreenComponent(() => module.default);
      } catch (err) {
        console.error(`Failed to load screen: ${screenName}`, err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadScreen();
  }, [screenName, theme]);

  return {
    ScreenComponent,
    isLoading,
    error
  };
};

export default useDynamicScreen;
