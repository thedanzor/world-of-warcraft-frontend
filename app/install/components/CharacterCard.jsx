'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const CharacterCard = ({ character, index, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const characterImage = character?.media?.assets?.[0]?.value || 
                        character?.media?.assets?.[1]?.value || 
                        '/images/logo-without-text.png';

  return (
    <Paper
      sx={{
        minWidth: 280,
        maxWidth: 280,
        height: 360,
        background: 'linear-gradient(135deg, rgba(21, 48, 52, 0.95) 0%, rgba(26, 61, 66, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        transform: isVisible ? 'translateX(0)' : 'translateX(100px)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        '&:hover': {
          transform: 'translateX(0) translateY(-8px)',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6)',
        }
      }}
    >
      {/* Character Image */}
      <Box
        sx={{
          width: '100%',
          height: 200,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)',
        }}
      >
        <img
          src={characterImage}
          alt={character.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.9) contrast(1.1)',
          }}
        />
        {/* Gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
          }}
        />
      </Box>

      {/* Character Info */}
      <Box sx={{ p: 2, position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#FFFFFF',
            fontWeight: 700,
            mb: 0.5,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            fontSize: '1.1rem',
          }}
        >
          {character.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#A3A3A3',
            mb: 1,
            fontSize: '0.85rem',
          }}
        >
          {character.metaData?.class || character.class || 'Unknown'} • {character.metaData?.spec || character.spec || 'Unknown'}
        </Typography>
        
        {/* Stats */}
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {character.itemLevel && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#888' }}>
                Item Level
              </Typography>
              <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600 }}>
                {character.itemLevel}
              </Typography>
            </Box>
          )}
          {character.mplus > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#888' }}>
                Mythic+ Score
              </Typography>
              <Typography variant="body2" sx={{ color: '#00D4FF', fontWeight: 600 }}>
                {Math.round(character.mplus)}
              </Typography>
            </Box>
          )}
          {character.pvp > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#888' }}>
                PvP Rating
              </Typography>
              <Typography variant="body2" sx={{ color: '#FF6B6B', fontWeight: 600 }}>
                {Math.round(character.pvp)}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default CharacterCard;

