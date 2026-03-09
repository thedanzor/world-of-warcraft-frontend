'use client';

/**
 * @file Admin Roster Builder page - 3-column layout for managing roster
 * @module app/settings/roster-builder/page
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Trash2,
  Shield,
  HeartPulse,
  Swords,
  ArrowLeftRight,
  Users,
} from 'lucide-react';
import { DndProvider, useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { api } from '@/lib/api';
import config from '@/app.config.js';
import CharacterCard from '@/core/components/CharacterCard';
import { calculateRaidBuffs } from '@/core/utils/raidBuffs';
import BuffSummary from '@/core/components/BuffSummary';

// Shadcn UI Components
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const ROLE_TYPES = [
  { id: 'tanks', label: 'Tanks', icon: Shield, color: '#4CAF50' },
  { id: 'healers', label: 'Healers', icon: HeartPulse, color: '#2196F3' },
  { id: 'dps', label: 'DPS', icon: Swords, color: '#F44336' },
  { id: 'substitutes', label: 'Substitutes', icon: ArrowLeftRight, color: '#FF9800' },
  { id: 'socials', label: 'Socials', icon: Users, color: '#9C27B0' },
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
      className={`roster-card ${isDragging ? 'opacity-50' : 'opacity-100'} relative cursor-grab active:cursor-grabbing`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <CharacterCard character={character} isDraggable={false} />
      {showDelete && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 bg-background/90 hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(character.name);
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove from roster</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
  const activeColor = ROLE_TYPES.find(r => r.id === roleType)?.color;

  return (
    <div
      ref={drop}
      className={`roster-drop-zone flex-1 overflow-y-auto p-4 transition-colors ${isActive ? 'active' : ''} ${isOver ? 'bg-black/5' : ''}`}
      style={{
        borderColor: isActive ? activeColor : undefined,
        borderWidth: isActive ? 3 : 1,
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
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col">
        {error && (
          <Alert variant="destructive" className="mb-4 cursor-pointer" onClick={() => setError('')}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 border-green-500 text-green-700 bg-green-50 cursor-pointer" onClick={() => setSuccess('')}>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {saving && (
          <Alert className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
            <AlertDescription>Saving roster...</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4 h-[calc(100vh-200px)] min-h-0 overflow-hidden mb-6">
          {/* Column 1: Character List */}
          <div className="flex-[0_0_300px] flex flex-col overflow-hidden bg-card text-card-foreground border">
            <div className="p-4 border-b">
              <h2 className="text-md font-semibold mb-4">Characters</h2>
              <div className="relative">
                <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="w-full pl-8"
                  placeholder="Search characters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {availableCharacters.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">
                  {searchQuery ? 'No characters found' : 'All characters are in roster'}
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {availableCharacters.map((character) => (
                    <CharacterCard
                      key={character.name}
                      character={character}
                      isDraggable={true}
                      layout="horizontal"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Role Types */}
          <div className="flex-[0_0_200px] flex flex-col overflow-hidden bg-card text-card-foreground border">
            <div className="p-4 border-b">
              <h2 className="text-md font-semibold">Role Types</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-2">
                {ROLE_TYPES.map((role) => {
                  const Icon = role.icon;
                  const count = roster[role.id]?.length || 0;
                  const isActive = activeRoleType === role.id;

                  return (
                    <Badge
                      key={role.id}
                      variant="outline"
                      className={`justify-start py-2 px-3 cursor-pointer text-sm font-normal transition-colors border-2 ${
                        isActive ? '' : 'border-transparent hover:bg-muted'
                      }`}
                      onClick={() => setActiveRoleType(role.id)}
                      style={{
                        backgroundColor: isActive ? `${role.color}20` : undefined,
                        borderColor: isActive ? role.color : undefined,
                      }}
                    >
                      <Icon className="mr-2 h-4 w-4" style={{ color: role.color }} />
                      {role.label} ({count})
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 3: Active Role Drop Zone */}
          <div className="flex-1 flex flex-col overflow-hidden bg-card text-card-foreground border">
            <div className="p-4 border-b">
              <h2 className="text-md font-semibold">
                {ROLE_TYPES.find(r => r.id === activeRoleType)?.label || 'Roster'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Drag characters here to add them to this role
              </p>
            </div>
            <RosterDropZone
              roleType={activeRoleType}
              activeRoleType={activeRoleType}
              onDrop={handleDrop}
            >
              {activeRoleCharacters.length === 0 ? (
                <div className="flex items-center justify-center h-full border-2 border-dashed border-border rounded-lg">
                  <p className="text-sm text-muted-foreground">Drop characters here</p>
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                  {activeRoleCharacters.map((character) => (
                    <DraggableRosterCard
                      key={character.name}
                      character={character}
                      roleType={activeRoleType}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              )}
            </RosterDropZone>
          </div>
        </div>

        {/* Buff Summary Section - Full width, below the 3-column layout */}
        <div className="p-6 mb-8 bg-card text-card-foreground border">
          <BuffSummary buffs={raidBuffs} />
        </div>
      </div>
    </DndProvider>
  );
}
