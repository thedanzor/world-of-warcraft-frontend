import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import AutoComplete from './MRTAutoComplete';

const MRTAbilityList = ({ bossTimerData, setbossTimerData, hoveredIndex, setHoveredIndex, finalOptions }) => {
  return (
    <Box className="mrt-ability-list" sx={{ width: '100%' }}>
      <Box className="mrt-ability-list-header" sx={{ display: 'flex', width: '100%', fontWeight: 700, mb: 1 }}>
        <Box sx={{ width: 100, flexShrink: 0, p: 1 }}>Time</Box>
        <Box sx={{ flex: 1, p: 1 }}>Ability</Box>
        <Box sx={{ flex: 2, p: 1 }}>Assigned Players</Box>
      </Box>
      {Array.isArray(bossTimerData) ? bossTimerData.map((item, index) => {
        if (item.isBreak) {
          return <Divider key={index} sx={{ my: 1 }} />;
        }
        if (!item.ability) return null;
        return (
          <Box
            key={index}
            className={`mrt-ability-list-row${item.isEnrage ? ' mrt-is-enrage' : ''}${item.needsCD ? ' mrt-needs-cd' : ''}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              background: hoveredIndex === index ? 'rgba(255,255,255,0.04)' : undefined,
              transition: 'background 0.2s',
              py: 1,
              borderBottom: '1px solid #23243a',
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Box sx={{ width: 100, flexShrink: 0, p: 1, fontWeight: 500 }}>{item.time || ''}</Box>
            <Box sx={{ flex: 1, p: 1, fontWeight: item.isEnrage ? 700 : 400, color: item.isEnrage ? '#f44336' : undefined }}>{item.ability}</Box>
            <Box sx={{ flex: 2, p: 1 }}>
              <AutoComplete
                placeholder="Assign players"
                value={item.primary || []}
                onChange={(e, value) => {
                  setbossTimerData((oldState) => {
                    const newState = [...oldState];
                    newState[index].primary = value;
                    return newState;
                  });
                }}
                finalOptions={finalOptions}
              />
            </Box>
          </Box>
        );
      }) : (
        <Typography>No timer data available</Typography>
      )}
    </Box>
  );
};

export default MRTAbilityList; 