import React, { useMemo, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { classIcons, classColors } from './constants';

function normalizeName(name) {
  return name?.toLowerCase().normalize('NFKD').replace(/\u0300-\u036f/g, '') || '';
}

function getRoleFromSpec(spec) {
  const tankSpecs = ['Protection', 'Blood', 'Guardian', 'Brewmaster', 'Vengeance'];
  const healerSpecs = ['Holy', 'Discipline', 'Restoration', 'Mistweaver', 'Preservation'];
  if (tankSpecs.includes(spec)) return 'Tank';
  if (healerSpecs.includes(spec)) return 'Healer';
  return 'DPS';
}

function processHasWaist(missingWaist) {
  return (
    <Tooltip
      title={
        !missingWaist
          ? 'Has "Durable Information Securing Container"'
          : 'Missing "Durable Information Securing Container"'
      }
      placement="top"
    >
      <span>
        {!missingWaist ? (
          <span style={{ color: 'green' }}>⬤</span>
        ) : (
          <span style={{ color: 'red' }}>✕</span>
        )}
      </span>
    </Tooltip>
  );
}

function processHasCloak(missingCloak) {
  return (
    <Tooltip
      title={
        !missingCloak ? 'Has "Reshii Wraps"' : 'Missing "Reshii Wraps"'
      }
      placement="top"
    >
      <span>
        {!missingCloak ? (
          <span style={{ color: 'green' }}>⬤</span>
        ) : (
          <span style={{ color: 'red' }}>✕</span>
        )}
      </span>
    </Tooltip>
  );
}

const headCells = [
  { id: 'avatar', label: '', width: 60 },
  { id: 'name', label: 'Name & Spec', width: 240 },
  { id: 'nextSeasonClass', label: 'Next Season Class' },
  { id: 'primaryRole', label: 'Primary Role' },
  { id: 'secondaryRole', label: 'Secondary Role' },
  { id: 'itemLevel', label: 'ILvL' },
  { id: 'guildRank', label: 'Guild Rank' },
  { id: 'mplus', label: 'M+ Score' },
  { id: 'pvp', label: 'PvP Rating' },
  { id: 'season3Goal', label: 'Season 3 Goal' },
  { id: 'wantToPushKeys', label: 'Push Keys' },
  { id: 'hasWaist', label: 'Waist' },
  { id: 'hasCloak', label: 'Cloak' },
];

const Season3RosterTable = ({ signups, guildData, title, description }) => {
  // Merge signup with guildData
  const rows = useMemo(() => {
    if (!signups) return [];
    return signups.map((entry) => {
      const normalized = normalizeName(entry.currentCharacterName);
      const guildChar = guildData?.find(
        (c) => normalizeName(c.name) === normalized
      );
      return {
        avatar: guildChar?.media?.assets?.[0]?.value || null,
        name: (
          <Box>
            <Typography
              variant="body1"
              sx={{
                color: classColors[entry.characterClass] || '#fff',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {entry.season3CharacterName || entry.currentCharacterName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {entry.mainSpec} {entry.characterClass}
            </Typography>
          </Box>
        ),
        nextSeasonClass: entry.characterClass,
        primaryRole: getRoleFromSpec(entry.mainSpec),
        secondaryRole: entry.offSpec ? getRoleFromSpec(entry.offSpec) : '-',
        itemLevel: guildChar?.itemLevel || '-',
        guildRank: guildChar?.guildRank || '-',
        mplus: guildChar?.mplus || '-',
        pvp: guildChar?.pvp || '-',
        season3Goal: entry.season3Goal || '-',
        wantToPushKeys: entry.wantToPushKeys ? 'Yes' : 'No',
        hasWaist: processHasWaist(guildChar?.missingWaist),
        hasCloak: processHasCloak(guildChar?.missingCloak),
      };
    });
  }, [signups, guildData]);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: '1.5rem', my: 2 }}>{title}</Typography>
      <Typography variant="p" sx={{ mb: 1, pb: 1, display: 'block' }}>{description}</Typography>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                {headCells.map((cell) => (
                  <TableCell key={cell.id} sx={{ width: cell.width }}>{cell.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    {row.avatar ? (
                      <img src={row.avatar} alt="avatar" width={48} height={48} style={{ borderRadius: 8 }} />
                    ) : (
                      <Box sx={{ width: 48, height: 48, borderRadius: 8, bgcolor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="caption" color="text.secondary">?</Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.nextSeasonClass}</TableCell>
                  <TableCell>{row.primaryRole}</TableCell>
                  <TableCell>{row.secondaryRole}</TableCell>
                  <TableCell>{row.itemLevel}</TableCell>
                  <TableCell>{row.guildRank}</TableCell>
                  <TableCell>{row.mplus}</TableCell>
                  <TableCell>{row.pvp}</TableCell>
                  <TableCell>{row.season3Goal}</TableCell>
                  <TableCell>{row.wantToPushKeys}</TableCell>
                  <TableCell>{row.hasWaist}</TableCell>
                  <TableCell>{row.hasCloak}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default Season3RosterTable; 