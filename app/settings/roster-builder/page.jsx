'use client';

/**
 * @file Admin Roster Builder page - 3-column layout for managing roster
 * @module app/settings/roster-builder/page
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Shield as ShieldIcon,
  LocalHospital as HealerIcon,
  SportsEsports as DpsIcon,
  SwapHoriz as SubstituteIcon,
  People as SocialIcon,
} from '@mui/icons-material';
import { DndProvider, useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { api } from '@/lib/api';
import config from '@/app.config.js';
import CharacterCard from '@/core/components/CharacterCard';
import { calculateRaidBuffs } from '@/core/utils/raidBuffs';
import BuffSummary from '@/core/components/BuffSummary';
import './roster-builder.scss';

const ROLE_TYPES = [
  { id: 'tanks', label: 'Tanks', icon: ShieldIcon, color: '#4CAF50' },
  { id: 'healers', label: 'Healers', icon: HealerIcon, color: '#2196F3' },
  { id: 'dps', label: 'DPS', icon: DpsIcon, color: '#F44336' },
  { id: 'substitutes', label: 'Substitutes', icon: SubstituteIcon, color: '#FF9800' },
  { id: 'socials', label: 'Socials', icon: SocialIcon, color: '#9C27B0' },
];

function DraggableRosterCard({ character, onRemove, roleType }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'ROSTER_CHARACTER',
      item: { characterId: character.name, roleType },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [character.name, roleType]
  );

  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      ref={drag}
      className={`roster-card ${isDragging ? 'dragging' : ''}`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      style={{ opacity: isDragging ? 0.5 : 1, position: 'relative' }}
    >
      <CharacterCard character={character} isDraggable={false} />
      {showDelete && (
        <Tooltip title="Remove from roster">
          <IconButton
            size="small"
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(character.name);
            }}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.1)' },
            }}
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
}

function RosterDropZone({ roleType, activeRoleType, onDrop, children }) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ['CHARACTER', 'ROSTER_CHARACTER'],
      drop: (item) => {
        onDrop(item, roleType);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [roleType, onDrop]
  );

  const isActive = activeRoleType === roleType;

  return (
    <div
      ref={drop}
      className={`roster-drop-zone ${isActive ? 'active' : ''} ${isOver ? 'over' : ''}`}
      style={{
        borderColor: isActive ? ROLE_TYPES.find(r => r.id === roleType)?.color : undefined,
        borderWidth: isActive ? 3 : 1,
        backgroundColor: isOver ? 'rgba(0, 0, 0, 0.05)' : undefined,
      }}
    >
      {children}
    </div>
  );
}

export default function RosterBuilderPage() {
  const [guildData, setGuildData] = useState(null);
  const [roster, setRoster] = useState({
    tanks: [],
    healers: [],
    dps: [],
    substitutes: [],
    socials: [],
  });
  const [activeRoleType, setActiveRoleType] = useState('tanks');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get credentials from sessionStorage
  const getCredentials = () => {
    return {
      username: sessionStorage.getItem('settings_username') || '',
      password: sessionStorage.getItem('settings_password') || '',
    };
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load guild data
        const guildResponse = await api.getFilteredGuildData({
          filter: 'all',
          page: 1,
          limit: 300,
        });
        setGuildData(guildResponse);

        // Load roster
        const rosterResponse = await api.getRoster();
        if (rosterResponse.success && rosterResponse.roster) {
          setRoster(rosterResponse.roster);
        }
      } catch (err) {
        setError('Failed to load data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter main characters
  const mainCharacters = useMemo(() => {
    if (!guildData?.data) return [];
    
    return guildData.data
      .filter(char => config.MAIN_RANKS.includes(char.guildRank))
      .map(char => ({
        ...char,
        primary_role: config.TANKS.includes(char.spec) ? 'tank' : 
                     config.HEALERS.includes(char.spec) ? 'healer' : 'dps',
      }))
      .filter(char => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return char.name.toLowerCase().includes(query) ||
               char.class?.toLowerCase().includes(query) ||
               char.spec?.toLowerCase().includes(query);
      });
  }, [guildData, searchQuery]);

  // Get characters not in roster
  const availableCharacters = useMemo(() => {
    const allAssigned = [
      ...roster.tanks,
      ...roster.healers,
      ...roster.dps,
      ...roster.substitutes,
      ...roster.socials,
    ];
    return mainCharacters.filter(char => !allAssigned.includes(char.name));
  }, [mainCharacters, roster]);

  // Get characters for active role
  const activeRoleCharacters = useMemo(() => {
    const characterNames = roster[activeRoleType] || [];
    return characterNames
      .map(name => mainCharacters.find(char => char.name === name))
      .filter(Boolean);
  }, [roster, activeRoleType, mainCharacters]);

  // Get all assigned characters (excluding substitutes and socials for buff calculation)
  const assignedCharacters = useMemo(() => {
    const allAssigned = [
      ...roster.tanks,
      ...roster.healers,
      ...roster.dps,
    ];
    return allAssigned
      .map(name => mainCharacters.find(char => char.name === name))
      .filter(Boolean)
      .map(char => ({
        ...char,
        metaData: {
          class: char.class,
          primary_role: char.primary_role || 
            (config.TANKS.includes(char.spec) ? 'tank' : 
             config.HEALERS.includes(char.spec) ? 'healer' : 'dps')
        }
      }));
  }, [roster, mainCharacters]);

  // Calculate raid buffs
  const raidBuffs = useMemo(() => {
    return calculateRaidBuffs(assignedCharacters);
  }, [assignedCharacters]);

  // Save roster to API
  const saveRoster = useCallback(async (newRoster) => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const credentials = getCredentials();
      await api.saveRoster(newRoster, credentials);
      
      setRoster(newRoster);
      setSuccess('Roster saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save roster: ' + err.message);
    } finally {
      setSaving(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback(async (item, targetRoleType) => {
    const characterId = item.characterId || item.id || item.name;
    
    // Find character
    const character = mainCharacters.find(char => char.name === characterId);
    if (!character) return;

    // Create new roster state
    const newRoster = { ...roster };

    // Remove from all roles first
    Object.keys(newRoster).forEach(role => {
      newRoster[role] = newRoster[role].filter(id => id !== characterId);
    });

    // Add to target role
    if (!newRoster[targetRoleType].includes(characterId)) {
      newRoster[targetRoleType].push(characterId);
    }

    // Save immediately
    await saveRoster(newRoster);
  }, [roster, mainCharacters, saveRoster]);

  // Handle remove
  const handleRemove = useCallback(async (characterId) => {
    try {
      setSaving(true);
      const credentials = getCredentials();
      await api.removeCharacterFromRoster(characterId, credentials);
      
      // Update local state
      const newRoster = { ...roster };
      Object.keys(newRoster).forEach(role => {
        newRoster[role] = newRoster[role].filter(id => id !== characterId);
      });
      setRoster(newRoster);
      setSuccess('Character removed from roster');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to remove character: ' + err.message);
    } finally {
      setSaving(false);
    }
  }, [roster]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}
        {saving && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Saving roster...
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 200px)', minHeight: 0, overflow: 'hidden', mb: 3 }}>
          {/* Column 1: Character List */}
          <Paper
            sx={{
              flex: '0 0 300px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom>
                Characters
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2,
              }}
            >
              {availableCharacters.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center">
                  {searchQuery ? 'No characters found' : 'All characters are in roster'}
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {availableCharacters.map((character) => (
                    <CharacterCard
                      key={character.name}
                      character={character}
                      isDraggable={true}
                      layout="horizontal"
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Paper>

          {/* Column 2: Role Types */}
          <Paper
            sx={{
              flex: '0 0 200px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom>
                Role Types
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {ROLE_TYPES.map((role) => {
                  const Icon = role.icon;
                  const count = roster[role.id]?.length || 0;
                  const isActive = activeRoleType === role.id;

                  return (
                    <Chip
                      key={role.id}
                      icon={<Icon />}
                      label={`${role.label} (${count})`}
                      onClick={() => setActiveRoleType(role.id)}
                      sx={{
                        justifyContent: 'flex-start',
                        height: 'auto',
                        py: 1.5,
                        backgroundColor: isActive ? `${role.color}20` : undefined,
                        border: isActive ? `2px solid ${role.color}` : '1px solid transparent',
                        '&:hover': {
                          backgroundColor: `${role.color}10`,
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          </Paper>

          {/* Column 3: Active Role Drop Zone */}
          <Paper
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">
                {ROLE_TYPES.find(r => r.id === activeRoleType)?.label || 'Roster'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Drag characters here to add them to this role
              </Typography>
            </Box>
            <RosterDropZone
              roleType={activeRoleType}
              activeRoleType={activeRoleType}
              onDrop={handleDrop}
            >
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  p: 2,
                }}
              >
                {activeRoleCharacters.length === 0 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      border: '2px dashed #ccc',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Drop characters here
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: 2,
                    }}
                  >
                    {activeRoleCharacters.map((character) => (
                      <DraggableRosterCard
                        key={character.name}
                        character={character}
                        roleType={activeRoleType}
                        onRemove={handleRemove}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </RosterDropZone>
          </Paper>
        </Box>

        {/* Buff Summary Section - Full width, below the 3-column layout */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <BuffSummary buffs={raidBuffs} />
        </Paper>
      </Box>
    </DndProvider>
  );
}

