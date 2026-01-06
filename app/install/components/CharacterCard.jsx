'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';

const CharacterCard = ({ character, index, total = 10 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const characterImage = character?.media?.assets?.[0]?.value || 
                        character?.media?.assets?.[1]?.value || 
                        '/images/logo-without-text.png';

  const getClassColor = (className) => {
    const classColors = {
      'Death Knight': '#C41E3A',
      'Demon Hunter': '#A330C9',
      'Druid': '#FF7C0A',
      'Evoker': '#33937F',
      'Hunter': '#AAD372',
      'Mage': '#3FC7EB',
      'Monk': '#00FF98',
      'Paladin': '#F48CBA',
      'Priest': '#FFFFFF',
      'Rogue': '#FFF468',
      'Shaman': '#0070DD',
      'Warlock': '#8788EE',
      'Warrior': '#C69B6D',
    };
    return classColors[className] || '#FFFFFF';
  };

  const getRoleIcon = (spec) => {
    const tankSpecs = ['Blood', 'Vengeance', 'Guardian', 'Brewmaster', 'Protection'];
    const healerSpecs = ['Preservation', 'Mistweaver', 'Holy', 'Discipline', 'Restoration', 'Augmentation'];
    
    if (tankSpecs.includes(spec)) return '🛡️';
    if (healerSpecs.includes(spec)) return '💚';
    return '⚔️';
  };

  const classColor = getClassColor(character.metaData?.class || character.class);
  const spec = character.metaData?.spec || character.spec || 'Unknown';
  const roleIcon = getRoleIcon(spec);

  return (
    <Box
      sx={{
        width: `calc(${100 / total}% - ${(total - 1) * 16 / total}px)`,
        minWidth: '120px',
        height: '220px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        border: `2px solid ${classColor}`,
        boxShadow: `0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px ${classColor}33`,
        flexShrink: 0,
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: `0 8px 24px rgba(0, 0, 0, 0.6), 0 0 20px ${classColor}66`,
          zIndex: 10,
        }
      }}
    >
      {/* Character Image Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${characterImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          filter: 'brightness(0.4) contrast(1.2)',
          zIndex: 0,
        }}
      />
      
      {/* Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.95) 100%)`,
          zIndex: 1,
        }}
      />

      {/* Role Icon Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 3,
          fontSize: '1.5rem',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
        }}
      >
        {roleIcon}
      </Box>

      {/* Character Info */}
      <Box 
        sx={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 1.5, 
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: '#FFFFFF',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            fontSize: '0.9rem',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {character.name}
        </Typography>
        
        <Typography
          variant="caption"
          sx={{
            color: classColor,
            fontWeight: 600,
            fontSize: '0.7rem',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {character.metaData?.class || character.class || 'Unknown'}
        </Typography>
        
        <Typography
          variant="caption"
          sx={{
            color: '#B0C4DE',
            fontSize: '0.65rem',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {spec}
        </Typography>
        
        {/* Stats */}
        <Box sx={{ mt: 0.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {character.itemLevel && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#888', fontSize: '0.65rem' }}>
                iLvl
              </Typography>
              <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 700, fontSize: '0.7rem' }}>
                {character.itemLevel}
              </Typography>
            </Box>
          )}
          {character.mplus > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#888', fontSize: '0.65rem' }}>
                M+
              </Typography>
              <Typography variant="caption" sx={{ color: '#00D4FF', fontWeight: 700, fontSize: '0.7rem' }}>
                {Math.round(character.mplus)}
              </Typography>
            </Box>
          )}
          {character.pvp > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#888', fontSize: '0.65rem' }}>
                PvP
              </Typography>
              <Typography variant="caption" sx={{ color: '#FF6B6B', fontWeight: 700, fontSize: '0.7rem' }}>
                {Math.round(character.pvp)}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CharacterCard;

