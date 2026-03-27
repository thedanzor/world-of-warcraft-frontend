'use client'
import React from 'react';

const WoWLoadingScreen = ({
  message = 'Loading guild data...',
  subtitle = 'Guild Audit',
  showProgressBar = true,
  showDots = true,
}) => {
  return (
    <div style={{
      backgroundColor: 'hsl(240 10% 3.9%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans, "Nunito Sans", system-ui, sans-serif)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Ambient radial glow behind the icon */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -60%)',
        width: '480px',
        height: '480px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,215,0,0.055) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>

        {/* Shield icon */}
        <div style={{
          width: '76px',
          height: '76px',
          marginBottom: '28px',
          position: 'relative',
          animation: 'wowShieldPulse 3s ease-in-out infinite',
        }}>
          <svg viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="wowShieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE566" />
                <stop offset="45%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#A87000" />
              </linearGradient>
              <linearGradient id="wowShieldFace" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
              </linearGradient>
              <filter id="wowGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer shield — gold */}
            <path
              d="M38 5 L65 17 L65 40 C65 55 53 66 38 72 C23 66 11 55 11 40 L11 17 Z"
              fill="url(#wowShieldGold)"
              filter="url(#wowGlow)"
            />

            {/* Inner shield face — subtle highlight */}
            <path
              d="M38 10 L61 21 L61 40 C61 53 50 63 38 68 C26 63 15 53 15 40 L15 21 Z"
              fill="url(#wowShieldFace)"
            />

            {/* Thin rim divider */}
            <path
              d="M38 10 L61 21 L61 40 C61 53 50 63 38 68 C26 63 15 53 15 40 L15 21 Z"
              fill="none"
              stroke="rgba(255,235,100,0.18)"
              strokeWidth="1"
            />

            {/* "GA" monogram */}
            <text
              x="38"
              y="46"
              textAnchor="middle"
              fill="rgba(15,15,22,0.82)"
              fontSize="18"
              fontWeight="800"
              fontFamily="var(--font-sans, 'Nunito Sans', system-ui, sans-serif)"
              letterSpacing="-0.5"
            >
              GA
            </text>
          </svg>

          {/* Soft gold halo ring */}
          <div style={{
            position: 'absolute',
            inset: '-12px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,215,0,0.12) 0%, transparent 68%)',
            animation: 'wowHaloPulse 3s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        </div>

        {/* App title */}
        <div style={{
          fontSize: '1.6rem',
          fontWeight: '700',
          color: 'hsl(0 0% 97%)',
          letterSpacing: '-0.04em',
          lineHeight: '1.1',
          marginBottom: '6px',
        }}>
          {subtitle}
        </div>

        {/* Loading message */}
        <div style={{
          fontSize: '0.875rem',
          fontWeight: '400',
          color: 'hsl(240 5% 50%)',
          letterSpacing: '0.01em',
          marginBottom: '32px',
        }}>
          {message}
        </div>

        {/* Progress bar */}
        {showProgressBar && (
          <div style={{
            width: '200px',
            height: '3px',
            background: 'hsl(240 3.7% 15.9%)',
            borderRadius: '999px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '60%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.5) 30%, #FFD700 50%, rgba(255,215,0,0.5) 70%, transparent 100%)',
              borderRadius: '999px',
              animation: 'wowShimmer 1.9s ease-in-out infinite',
            }} />
          </div>
        )}

        {/* Loading dots */}
        {showDots && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '16px',
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#FFD700',
                animation: 'wowDot 1.6s ease-in-out infinite',
                animationDelay: `${i * 0.22}s`,
              }} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes wowShieldPulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.25));
          }
          50% {
            transform: scale(1.04);
            filter: drop-shadow(0 0 18px rgba(255, 215, 0, 0.45));
          }
        }

        @keyframes wowHaloPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }

        @keyframes wowShimmer {
          0%   { transform: translateX(-200%); }
          100% { transform: translateX(380%); }
        }

        @keyframes wowDot {
          0%, 80%, 100% { transform: scale(0.65); opacity: 0.25; }
          40%            { transform: scale(1.25); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default WoWLoadingScreen;
