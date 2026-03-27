import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { classColors } from './constants';

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

const ROLE_BADGE = {
  Tank: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Healer: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  DPS: 'bg-red-500/15 text-red-400 border-red-500/20',
}

const GOAL_BADGE = {
  CE: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  AOTC: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  Social: 'bg-muted text-muted-foreground border-border',
}

const headCells = [
  { id: 'avatar', label: '', width: 56 },
  { id: 'name', label: 'Character', width: 200 },
  { id: 'primaryRole', label: 'Role' },
  { id: 'secondaryRole', label: 'Off-Role' },
  { id: 'itemLevel', label: 'iLvL' },
  { id: 'guildRank', label: 'Rank' },
  { id: 'mplus', label: 'M+ Score' },
  { id: 'pvp', label: 'PvP' },
  { id: 'seasonGoal', label: 'Goal' },
  { id: 'wantToPushKeys', label: 'Keys' },
];

const SeasonsRosterTable = ({ signups, guildData, title, description }) => {
  const rows = useMemo(() => {
    if (!signups) return [];
    return signups.map((entry) => {
      const normalized = normalizeName(entry.currentCharacterName);
      const guildChar = guildData?.find(
        (c) => normalizeName(c.name) === normalized
      );
      const charName = entry.seasonCharacterName || entry.season3CharacterName || entry.currentCharacterName || '';
      const capitalizedName = charName.charAt(0).toUpperCase() + charName.slice(1).toLowerCase();
      const primaryRole = getRoleFromSpec(entry.mainSpec);
      const secondaryRole = entry.offSpec ? getRoleFromSpec(entry.offSpec) : null;
      const goal = entry.seasonGoal || entry.season3Goal;

      return {
        avatar: guildChar?.media?.assets?.[0]?.value || null,
        charName: capitalizedName,
        linkName: guildChar?.name || entry.currentCharacterName || null,
        server: guildChar?.server || null,
        characterClass: entry.characterClass,
        mainSpec: entry.mainSpec,
        primaryRole,
        secondaryRole,
        itemLevel: guildChar?.itemLevel || null,
        guildRank: guildChar?.guildRank ?? null,
        mplus: guildChar?.mplus || null,
        pvp: guildChar?.pvp || null,
        seasonGoal: goal || null,
        wantToPushKeys: entry.wantToPushKeys,
      };
    });
  }, [signups, guildData]);

  const [page, setPage] = useState(0);
  const rowsPerPage = 20;
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  return (
    <div className="space-y-4">
      {title && (
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      )}

      <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                {headCells.map((cell) => (
                  <TableHead
                    key={cell.id}
                    style={{ width: cell.width }}
                    className="text-muted-foreground font-medium text-xs uppercase tracking-wider py-3"
                  >
                    {cell.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
                <TableRow key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <TableCell className="py-3">
                    {row.avatar ? (
                      <img src={row.avatar} alt={row.charName} width={40} height={40} className="rounded-full object-cover border border-border/50" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted border border-border/50 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground font-medium">{row.charName.charAt(0)}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    {row.server && row.linkName ? (
                      <Link href={`/member/${row.server}/${row.linkName}`} className="no-underline block group">
                        <div
                          className="font-bold text-sm transition-opacity group-hover:opacity-70"
                          style={{ color: classColors[row.characterClass] || 'currentColor' }}
                        >
                          {row.charName}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {row.mainSpec} {row.characterClass}
                        </div>
                      </Link>
                    ) : (
                      <>
                        <div
                          className="font-bold text-sm"
                          style={{ color: classColors[row.characterClass] || 'currentColor' }}
                        >
                          {row.charName}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {row.mainSpec} {row.characterClass}
                        </div>
                      </>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className={`text-xs border ${ROLE_BADGE[row.primaryRole] || ''}`}>
                      {row.primaryRole}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    {row.secondaryRole ? (
                      <Badge variant="outline" className={`text-xs border ${ROLE_BADGE[row.secondaryRole] || ''}`}>
                        {row.secondaryRole}
                      </Badge>
                    ) : <span className="text-muted-foreground text-xs">—</span>}
                  </TableCell>
                  <TableCell className="py-3 text-sm font-medium text-muted-foreground">
                    {row.itemLevel || '—'}
                  </TableCell>
                  <TableCell className="py-3 text-sm text-muted-foreground">
                    {row.guildRank !== null ? row.guildRank : '—'}
                  </TableCell>
                  <TableCell className="py-3 text-sm font-semibold text-muted-foreground">
                    {row.mplus || '—'}
                  </TableCell>
                  <TableCell className="py-3 text-sm font-semibold text-muted-foreground">
                    {row.pvp || '—'}
                  </TableCell>
                  <TableCell className="py-3">
                    {row.seasonGoal ? (
                      <Badge variant="outline" className={`text-xs border ${GOAL_BADGE[row.seasonGoal] || ''}`}>
                        {row.seasonGoal}
                      </Badge>
                    ) : <span className="text-muted-foreground text-xs">—</span>}
                  </TableCell>
                  <TableCell className="py-3">
                    <span className={`text-xs font-medium ${row.wantToPushKeys ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                      {row.wantToPushKeys ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-border/50 py-3 px-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className={page === 0 ? 'pointer-events-none opacity-40' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {[...Array(Math.min(totalPages, 7))].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setPage(i)}
                      isActive={page === i}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className={page === totalPages - 1 ? 'pointer-events-none opacity-40' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonsRosterTable;
