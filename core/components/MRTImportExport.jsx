import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// Utility functions for converting data
function convertArrayToString(arr) {
  return arr
    .map((item) => {
      if (item.isBreak && !item.ability) return '// new phase';
      if (!item.ability) return null;
      const assignees = Array.isArray(item?.primary)
        ? item.primary.map((p) => p.label).join(', ')
        : '';
      if (!assignees.length) {
        return `{time:${item.time || '00:00'}} ${item.ability} - Unassigned`;
      }
      return `{time:${item.time || '00:00'}} ${item.ability} - ${assignees}`;
    })
    .filter(Boolean)
    .join('\n');
}

function convertStringToArray(str) {
  return str
    .split('\n')
    .filter((line) => !line.startsWith('//'))
    .map((line) => {
      const timeMatch = line.match(/{time:(\d{2}:\d{2})}/);
      const abilityMatch = line.match(/\} (.+?) -/);
      const assigneesMatch = line.match(/- (.+?)$/);
      const assignees =
        assigneesMatch && assigneesMatch[1] !== 'Unassigned'
          ? assigneesMatch[1].split(',').map((a) => ({
              label: a.trim(),
              id: a.trim(),
            }))
          : [];
      return {
        time: timeMatch ? timeMatch[1] : null,
        ability: abilityMatch ? abilityMatch[1] : null,
        primary: assignees,
        isBreak: !timeMatch,
      };
    });
}

const MRTImportExport = ({ handleToggle, data }) => {
  const [importData, setImportData] = useState(convertArrayToString(data));

  useEffect(() => {
    setImportData(convertArrayToString(data));
  }, [data]);

  const saveAndClose = () => {
    const parsedData = convertStringToArray(importData);
    handleToggle(parsedData);
  };

  return (
    <Stack spacing={2} className="mrt-import-stack">
      <TextField
        multiline
        fullWidth
        minRows={10}
        maxRows={20}
        value={importData}
        onChange={(e) => setImportData(e.target.value)}
        className="mrt-import-textfield"
      />
      <Box className="mrt-import-actions">
        <Button variant="contained" onClick={saveAndClose}>
          Save & Close
        </Button>
      </Box>
    </Stack>
  );
};

export default MRTImportExport; 