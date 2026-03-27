import React, { useEffect, useState, useMemo } from 'react'

import {
    filterSearch,
} from '@/tools/guildFetcher/utils'

const useAuditData = (data, filterProps) => {
    const [
        query,
        classFilter,
        rankFilter,
        specFilter,
        ilevelFilter,
        instanceIndex,
        lockTimeStamp,
    ] = filterProps

    const filteredData = useMemo(() => {
        const processData = () => {
            const filterDataBaseOnFilters = data.filter((character) =>
                filterSearch(
                    character,
                    query,
                    classFilter,
                    specFilter,
                    rankFilter,
                    ilevelFilter
                )
            )

            // Process lock status for the new data structure
            const normalLocked = filterDataBaseOnFilters.filter(char => {
                const normalStatus = char.lockStatus?.lockedTo?.Normal;
                return normalStatus && normalStatus.completed > 0;
            });

            const heroicLocked = filterDataBaseOnFilters.filter(char => {
                const heroicStatus = char.lockStatus?.lockedTo?.Heroic;
                return heroicStatus && heroicStatus.completed > 0;
            });

            const mythicLocked = filterDataBaseOnFilters.filter(char => {
                const mythicStatus = char.lockStatus?.lockedTo?.Mythic;
                return mythicStatus && mythicStatus.completed > 0;
            });

            const lockedOnlyArray = filterDataBaseOnFilters.filter(char => {
                const hasRaidLockouts = char.lockStatus?.raids;
                const hasLockouts = char.lockStatus?.lockedTo;
                if (!hasLockouts) return false;

                const hasAnyLock = Object.values(hasLockouts).some(s => s.completed > 0);
                if (!hasAnyLock) return false;

                // Use per-raid structure if available (new format)
                if (hasRaidLockouts && Object.keys(hasRaidLockouts).length > 0) {
                    // Compact display: "Voidspire N:6/6 H:4/6 | Dreamrift H:1/1"
                    const diffOrder = ['LFR', 'Raid Finder', 'Normal', 'Heroic', 'Mythic'];
                    const diffAbbr = { 'LFR': 'LFR', 'Raid Finder': 'LFR', 'Normal': 'N', 'Heroic': 'H', 'Mythic': 'M' };

                    char.lockedToString = Object.entries(hasRaidLockouts)
                        .map(([raidName, raidData]) => {
                            const shortName = raidName.replace(/^The /, '');
                            const diffs = diffOrder
                                .filter(d => raidData.difficulties[d])
                                .map(d => `${diffAbbr[d]}:${raidData.difficulties[d].completed}/${raidData.difficulties[d].total}`)
                                .join(' ');
                            return `${shortName}: ${diffs}`;
                        })
                        .join(' | ');

                    char.lockedTooltipString = Object.entries(hasRaidLockouts)
                        .map(([raidName, raidData]) =>
                            diffOrder
                                .filter(d => raidData.difficulties[d])
                                .map(d => {
                                    const info = raidData.difficulties[d];
                                    return (
                                        `${raidName} — ${d} (${info.completed}/${info.total})\n` +
                                        info.encounters.map(boss => `• ${boss}`).join('\n')
                                    );
                                })
                                .join('\n\n')
                        )
                        .filter(Boolean)
                        .join('\n\n');
                } else {
                    // Fallback for legacy data
                    const lockoutInfo = Object.entries(hasLockouts)
                        .filter(([_, status]) => status.completed > 0)
                        .map(([difficulty, status]) => ({ difficulty, completed: status.completed, total: status.total, encounters: status.encounters }));

                    char.lockedToString = lockoutInfo.map(info => info.difficulty).join(', ');
                    char.lockedTooltipString = lockoutInfo
                        .map(info => (
                            `${info.difficulty} (${info.completed}/${info.total})\n` +
                            `Bosses:\n${info.encounters.map(boss => `• ${boss}`).join('\n')}`
                        ))
                        .join('\n\n');
                }

                return true;
            });

            // Filter characters with missing enchants (now an array)
            const updatedNotEnchanted = filterDataBaseOnFilters.filter(
                (character) => character.missingEnchants && character.missingEnchants.length > 0
            );

            const addProgressInfo = (characters, difficulty) => {
                return characters.map(char => ({
                    ...char,
                    lockoutProgress: {
                        completed: char.lockStatus?.lockedTo[difficulty]?.completed || 0,
                        total: char.lockStatus?.lockedTo[difficulty]?.total || 0,
                        lastKill: char.lockStatus?.lockedTo[difficulty]?.lastKill,
                        encounters: char.lockStatus?.lockedTo[difficulty]?.encounters || [],
                        displayText: `${difficulty}: ${char.lockStatus?.lockedTo[difficulty]?.completed || 0}/${char.lockStatus?.lockedTo[difficulty]?.total || 0}`,
                        tooltip: char.lockStatus?.lockedTo[difficulty]?.encounters?.join(', ') || 'No encounters'
                    }
                }));
            };

            return {
                onlyMissingEnchants: updatedNotEnchanted,
                heroicLocked: addProgressInfo(heroicLocked, 'Heroic'),
                normalLocked: addProgressInfo(normalLocked, 'Normal'),
                mythicLocked: addProgressInfo(mythicLocked, 'Mythic'),
                locked: lockedOnlyArray,
                all: filterDataBaseOnFilters,
            }
        }

        return processData()
    }, [
        data,
        query,
        classFilter,
        rankFilter,
        specFilter,
        ilevelFilter,
        instanceIndex,
        lockTimeStamp,
    ])

    return filteredData
}

export default useAuditData
