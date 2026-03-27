'use client'
import React from 'react';
import { Loader2 } from 'lucide-react';
import WoWLoadingScreen from './WoWLoadingScreen';

const sizeMap = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-8',
};

/**
 * Reusable loading component.
 *
 * - `fullScreen` / `useWoWTheme`: renders the full WoWLoadingScreen
 * - Default: compact centered spinner that matches the app's dark theme
 */
const LoadingSpinner = ({
  message = 'Loading...',
  size = 'lg',
  showText = true,
  minHeight = '200px',
  fadeIn = true,
  useWoWTheme = false,
  fullScreen = false,
}) => {
  if (useWoWTheme || fullScreen) {
    return (
      <WoWLoadingScreen
        message={message}
        subtitle="Guild Audit"
      />
    );
  }

  const iconSize = sizeMap[size] ?? sizeMap.lg;

  const content = (
    <div
      className="flex flex-col items-center justify-center gap-3 p-6"
      style={{ minHeight }}
    >
      <Loader2
        className={`${iconSize} animate-spin text-[#FFD700]`}
        aria-label="Loading"
        role="status"
      />
      {showText && (
        <span className="text-xs text-muted-foreground font-medium tracking-wide">
          {message}
        </span>
      )}
    </div>
  );

  if (fadeIn) {
    return (
      <div className="animate-in fade-in duration-300">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
