/**
 * ROSTER DISPLAY SCREEN
 * 
 * Public read-only display of the roster built by admins
 */

'use client'

import { useMemo } from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import {
  Shield as ShieldIcon,
  LocalHospital as HealerIcon,
  SportsEsports as DpsIcon,
  SwapHoriz as SubstituteIcon,
  People as SocialIcon,
} from '@mui/icons-material'
import CharacterCard from '@/core/components/CharacterCard'
import config from '@/app.config.js'
import '@/core/screens/default/scss/roster.scss'

const ROLE_TYPES = [
  { id: 'tanks', label: 'Tanks', icon: ShieldIcon, color: '#4CAF50' },
  { id: 'healers', label: 'Healers', icon: HealerIcon, color: '#2196F3' },
  { id: 'dps', label: 'DPS', icon: DpsIcon, color: '#F44336' },
  { id: 'substitutes', label: 'Substitutes', icon: SubstituteIcon, color: '#FF9800' },
  { id: 'socials', label: 'Socials', icon: SocialIcon, color: '#9C27B0' },
];

const RosterDisplay = ({ roster, guildData, error }) => {
  // Create a map of character names to character data
  const characterMap = useMemo(() => {
    if (!guildData || !Array.isArray(guildData)) return {};
    
    const map = {};
    guildData.forEach(char => {
      map[char.name] = {
        ...char,
        primary_role: config.TANKS.includes(char.spec) ? 'tank' : 
                     config.HEALERS.includes(char.spec) ? 'healer' : 'dps',
      };
    });
    return map;
  }, [guildData]);

  // Get characters for a role
  const getRoleCharacters = (roleId) => {
    const characterNames = roster[roleId] || [];
    return characterNames
      .map(name => characterMap[name])
      .filter(Boolean);
  };

  if (error) {
    return (
      <div className="roster-display" style={{ padding: '2rem' }}>
        <Typography variant="h4" color="error">
          Error loading roster: {error}
        </Typography>
      </div>
    );
  }

  const hasAnyRoster = Object.values(roster || {}).some(
    characters => Array.isArray(characters) && characters.length > 0
  );

  if (!hasAnyRoster) {
    return (
      <div className="roster-display" style={{ padding: '2rem' }}>
        <div className="logoHolder" style={{ marginTop: '40px', padding: '0 0px' }}>
          <Typography variant="h2" component="h2" sx={{ textTransform: 'capitalize !important', textAlign: 'left' }}>
            Roster
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            No roster has been configured yet. Please check back later.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="roster-display" style={{ paddingBottom: '4rem' }}>
      <section>
        <div className="logoHolder" style={{ marginTop: '40px', padding: '0 0px' }}>
          <Typography variant="h2" component="h2" sx={{ textTransform: 'capitalize !important', textAlign: 'left' }}>
            Roster
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Current raid roster composition
          </Typography>
        </div>
      </section>

      <section className="role-sections">
        {ROLE_TYPES.map((role) => {
          const characters = getRoleCharacters(role.id);
          const Icon = role.icon;

          if (characters.length === 0) return null;

          return (
            <div key={role.id} className="role-group" style={{ marginBottom: '3rem' }}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Icon sx={{ color: role.color }} />
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                    {role.label} ({characters.length})
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {characters.map((character) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={character.name}>
                      <CharacterCard
                        character={character}
                        isDraggable={false}
                        layout="horizontal"
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default RosterDisplay;

