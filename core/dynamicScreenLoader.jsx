import React, { lazy, Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import config from '@/app.config.js';

/**
 * Dynamic Screen Loader
 * 
 * A wrapper component that handles dynamic imports of screen components
 * using React.lazy and Suspense for optimal performance.
 * CSS is handled by Next.js in the layout file.
 * 
 * @param {string} screenName - The name of the screen to load (e.g., 'dashboard', 'roster')
 * @param {Object} props - Props to pass to the loaded screen component
 * @param {string} loadingMessage - Custom loading message
 * @param {string} minHeight - Minimum height for the loading spinner
 */
const DynamicScreenLoader = ({ 
  screenName, 
  props = {}, 
  loadingMessage = 'Loading...',
  minHeight = '50vh'
}) => {
  const theme = config.THEME || 'default';
  
  // Create lazy-loaded component
  const LazyScreen = lazy(() => import(`@/core/screens/${theme}/${screenName}`));

  return (
    <Suspense 
      fallback={
        <LoadingSpinner 
          message={loadingMessage}
          minHeight={minHeight}
          size={80}
          color="primary"
        />
      }
    >
      <LazyScreen {...props} />
    </Suspense>
  );
};

export default DynamicScreenLoader;
