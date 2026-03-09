'use client';

import { useEffect, useState } from 'react';

// Helper function to capitalize character names
const capitalizeCharacterName = (name) => {
  if (!name) return name;
  // Split by hyphen to handle "name-realm" format, capitalize each part
  return name.split('-').map(part => {
    if (!part) return part;
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  }).join('-');
};

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
  const capitalizedName = capitalizeCharacterName(character.name);

  return (
    <div
      style={{
        width: `calc(${100 / total}% - ${(total - 1) * 16 / total}px)`,
        borderColor: classColor,
        '--card-shadow': `0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px ${classColor}33`,
        '--card-hover-shadow': `0 8px 24px rgba(0, 0, 0, 0.6), 0 0 20px ${classColor}66`,
      }}
      className={`
        min-w-[120px] h-[220px] relative overflow-hidden rounded-lg shrink-0 border-2
        transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]
        [box-shadow:var(--card-shadow)] hover:[box-shadow:var(--card-hover-shadow)]
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}
        hover:-translate-y-2 hover:scale-[1.02] hover:z-10
      `}
    >
      {/* Character Image Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-[center_top]"
        style={{
          backgroundImage: `url(${characterImage})`,
          filter: 'brightness(0.4) contrast(1.2)',
        }}
      />
      
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.95) 100%)`,
        }}
      />

      {/* Role Icon Badge */}
      <div
        className="absolute top-2 right-2 z-[3] text-2xl [text-shadow:0_2px_4px_rgba(0,0,0,0.8)]"
      >
        {roleIcon}
      </div>

      {/* Character Info */}
      <div 
        className="absolute bottom-0 left-0 right-0 p-3 z-[2] flex flex-col gap-1"
      >
        <p
          className="text-[#FFFFFF] font-bold text-[0.9rem] leading-[1.2] whitespace-nowrap overflow-hidden text-ellipsis [text-shadow:0_2px_4px_rgba(0,0,0,0.8)] m-0"
        >
          {capitalizedName}
        </p>
        
        <p
          className="font-semibold text-[0.7rem] whitespace-nowrap overflow-hidden text-ellipsis [text-shadow:0_1px_2px_rgba(0,0,0,0.8)] m-0"
          style={{ color: classColor }}
        >
          {character.metaData?.class || character.class || 'Unknown'}
        </p>
        
        <p
          className="text-[#B0C4DE] text-[0.65rem] whitespace-nowrap overflow-hidden text-ellipsis [text-shadow:0_1px_2px_rgba(0,0,0,0.8)] m-0"
        >
          {spec}
        </p>
        
        {/* Stats */}
        <div className="mt-1 flex flex-col gap-0.5">
          {character.itemLevel && (
            <div className="flex justify-between items-center">
              <span className="text-[#888] text-[0.65rem]">
                iLvl
              </span>
              <span className="text-[#FFD700] font-bold text-[0.7rem]">
                {character.itemLevel}
              </span>
            </div>
          )}
          {character.mplus > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-[#888] text-[0.65rem]">
                M+
              </span>
              <span className="text-[#00D4FF] font-bold text-[0.7rem]">
                {Math.round(character.mplus)}
              </span>
            </div>
          )}
          {character.pvp > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-[#888] text-[0.65rem]">
                PvP
              </span>
              <span className="text-[#FF6B6B] font-bold text-[0.7rem]">
                {Math.round(character.pvp)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
