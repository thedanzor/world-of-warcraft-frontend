import React, { useEffect, useState, useMemo } from 'react'

import {
    filterSearch,
} from '@/tools/guildFetcher/utils'

const useAuditData = (data, filterProps) => {
    const [originalData] = useState(data)

    const [
        query,
        classFilter,
        rankFilter,
        specFilter,
        ilevelFilter,
        instanceIndex,
        lockTimeStamp,
    ] = filterProps

    const [filteredData, setFilteredData] = React.useState({
        all: data,
        onlyMissingEnchants: [],
        heroicLocked: [],
        normalLocked: [],
        mythicLocked: [],
        locked: [],
    })

    useEffect(() => {
        const processData = () => {
            const filterDataBaseOnFilters = originalData.filter((character) =>
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
                const hasLockouts = char.lockStatus?.lockedTo;
                if (!hasLockouts) return false;

                // Format the difficulty names and boss information
                const lockoutInfo = Object.entries(hasLockouts)
                    .filter(([_, status]) => status.completed > 0)
                    .map(([difficulty, status]) => ({
                        difficulty,
                        completed: status.completed,
                        total: status.total,
                        encounters: status.encounters
                    }));

                if (lockoutInfo.length === 0) return false;

                // Create the display string (e.g., "Normal, Heroic")
                char.lockedToString = lockoutInfo
                    .map(info => info.difficulty)
                    .join(', ');

                // Create the tooltip content with boss information
                char.lockedTooltipString = lockoutInfo
                    .map(info => (
                        `${info.difficulty} (${info.completed}/${info.total})\n` +
                        `Bosses:\n${info.encounters.map(boss => `• ${boss}`).join('\n')}`
                    ))
                    .join('\n\n');

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

        const combinedData = processData()
        setFilteredData(combinedData)
    }, [
        originalData,
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
