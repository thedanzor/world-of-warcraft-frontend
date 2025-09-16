'use client'
import React from 'react';

/**
 * WoW Guild Audit App Loading Screen
 * 
 * A beautiful, animated loading screen with WoW-themed colors and animations.
 * Features a pulsing logo, animated dots, and progress bar.
 */
const WoWLoadingScreen = ({ 
  message = 'Loading WoW Guild Audit App',
  subtitle = 'Application by ScottJones.nl',
  showProgressBar = true,
  showDots = true
}) => {
  return (
    <div style={{ 
      backgroundColor: 'none', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{ 
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Animated logo/icon */}
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 24px',
          position: 'relative',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #B08D5A 0%, #D4A574 50%, #E8D4B8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 2s ease-in-out infinite',
          boxShadow: '0 8px 32px rgba(176, 141, 90, 0.3)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '6px',
            position: 'relative',
            animation: 'rotate 3s linear infinite'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '16px',
              height: '16px',
              background: '#B08D5A',
              borderRadius: '3px'
            }}></div>
          </div>
        </div>
        
        {/* Loading text */}
        <div style={{ 
          color: '#FFFFFF', 
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '8px',
          letterSpacing: '-0.025em'
        }}>
          {message}
        </div>
        
        {/* Subtitle text */}
        <div style={{ 
          color: '#A3A3A3', 
          fontSize: '0.875rem',
          fontWeight: '400',
          marginBottom: '16px',
          letterSpacing: '-0.025em'
        }}>
          {subtitle}
        </div>
        
        {/* Animated dots */}
        {showDots && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '4px',
            marginTop: '8px'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#B08D5A',
              animation: 'bounce 1.4s ease-in-out infinite both',
              animationDelay: '0s'
            }}></div>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#B08D5A',
              animation: 'bounce 1.4s ease-in-out infinite both',
              animationDelay: '0.16s'
            }}></div>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#B08D5A',
              animation: 'bounce 1.4s ease-in-out infinite both',
              animationDelay: '0.32s'
            }}></div>
          </div>
        )}
        
        {/* Progress bar */}
        {showProgressBar && (
          <div style={{
            width: '200px',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '1px',
            margin: '24px auto 0',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #B08D5A, #D4A574)',
              borderRadius: '1px',
              animation: 'progress 2s ease-in-out infinite',
              transformOrigin: 'left'
            }}></div>
          </div>
        )}
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        
        @keyframes rotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default WoWLoadingScreen;
