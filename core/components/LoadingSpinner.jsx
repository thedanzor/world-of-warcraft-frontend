'use client'
import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import WoWLoadingScreen from './WoWLoadingScreen';

/**
 * Generic Loading Component
 * 
 * A reusable loading spinner with fade-in animation and customizable text.
 * Designed to prevent layout shifts and provide consistent loading states.
 * 
 * By default, uses the WoW-themed loading screen for full-screen loading.
 * Falls back to Shadcn spinner for inline loading states.
 */
const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 'lg', 
  showText = true,
  minHeight = '200px',
  fadeIn = true,
  useWoWTheme = false,
  fullScreen = false
}) => {
  // Use WoW theme for full-screen loading or when explicitly requested
  if (useWoWTheme || fullScreen) {
    return (
      <WoWLoadingScreen 
        message={message}
        subtitle={fullScreen ? 'Application by ScottJones.nl' : undefined}
      />
    );
  }

  const content = (
    <div
      className="flex flex-col items-center justify-center gap-4 p-6"
      style={{ minHeight }}
    >
      <Spinner size={size} />
      {showText && (
        <div className="text-muted-foreground font-medium text-center animate-pulse">
          {message}
        </div>
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
