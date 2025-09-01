'use client'
import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';

/**
 * Generic Loading Component
 * 
 * A reusable loading spinner with fade-in animation and customizable text.
 * Designed to prevent layout shifts and provide consistent loading states.
 */
const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 60, 
  thickness = 4,
  color = 'primary',
  showText = true,
  minHeight = '200px',
  fadeIn = true 
}) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: minHeight,
        gap: 2,
        p: 3
      }}
    >
      <CircularProgress
        size={size}
        thickness={thickness}
        color={color}
        sx={{
          animation: 'pulse 2s ease-in-out infinite'
        }}
      />
      {showText && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            fontWeight: 500,
            animation: 'fadeInOut 2s ease-in-out infinite'
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  // Add custom CSS animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.05); }
      }
      
      @keyframes fadeInOut {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (fadeIn) {
    return (
      <Fade in={true} timeout={300}>
        {content}
      </Fade>
    );
  }

  return content;
};

export default LoadingSpinner;
