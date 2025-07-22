import { useState, useMemo, useCallback } from 'react';
import config from '@/app.config.js';

export function useClientSideFiltering(data = []) {
    const [filters, setFilters] = useState({
        search: '',
        rankFilter: 'all',
        classFilter: [],
        specFilter: 'all',
        minItemLevel: 0,
        filter: 'all'
    });

    // Apply all filters
    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];

        return data.filter(character => {
            // Search filter
            if (filters.search && !character.name.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }

            // Rank filter
            if (filters.rankFilter !== 'all') {
                if (filters.rankFilter === 'mains' && !config.MAIN_RANKS.includes(character.guildRank)) {
                    return false;
                }
                if (filters.rankFilter === 'alts' && !config.ALT_RANKS.includes(character.guildRank)) {
                    return false;
                }
            }

            // Class filter
            if (filters.classFilter.length > 0 && !filters.classFilter.includes(character.class)) {
                return false;
            }

            // Spec filter
            if (filters.specFilter !== 'all') {
                const isTank = config.TANKS.includes(character.spec);
                const isHealer = config.HEALERS.includes(character.spec);
                const isDps = !isTank && !isHealer;

                if (filters.specFilter === 'tanks' && !isTank) return false;
                if (filters.specFilter === 'healers' && !isHealer) return false;
                if (filters.specFilter === 'dps' && !isDps) return false;
            }

            // Item level filter
            if (character.itemLevel < filters.minItemLevel) {
                return false;
            }

            // Special filters
            switch (filters.filter) {
                case 'missing-enchants':
                    return character.missingEnchants && character.missingEnchants.length > 0;
                case 'locked-normal':
                    return character.lockStatus?.lockedTo?.Normal?.completed > 0;
                case 'locked-heroic':
                    return character.lockStatus?.lockedTo?.Heroic?.completed > 0;
                case 'locked-mythic':
                    return character.lockStatus?.lockedTo?.Mythic?.completed > 0;
                case 'missing-tier':
                    return !character.hasTierSet;
                case 'not-ready':
                    return !character.ready;
                case 'active-season2':
                    return character.isActiveInSeason2;
                case 'has-pvp-rating':
                    return character.pvp > 0;
                case 'has-mplus-score':
                    return character.mplus > 0;
                default:
                    return true;
            }
        });
    }, [data, filters]);

    // Update specific filter
    const updateFilter = useCallback((key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    // Update multiple filters at once
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    }, []);

    // Reset all filters
    const resetFilters = useCallback(() => {
        setFilters({
            search: '',
            rankFilter: 'all',
            classFilter: [],
            specFilter: 'all',
            minItemLevel: 0,
            filter: 'all'
        });
    }, []);

    // Get available classes from data
    const availableClasses = useMemo(() => {
        const classes = [...new Set(data.map(char => char.class))];
        return classes.sort();
    }, [data]);

    // Calculate counts for different categories
    const counts = useMemo(() => {
        const allData = data || [];
        
        const altData = allData.filter(char => config.ALT_RANKS.includes(char.guildRank));
        const mainData = allData.filter(char => config.MAIN_RANKS.includes(char.guildRank));
        
        const tankData = allData.filter(char => config.TANKS.includes(char.spec));
        const healerData = allData.filter(char => config.HEALERS.includes(char.spec));
        const dpsData = allData.filter(char => !config.TANKS.includes(char.spec) && !config.HEALERS.includes(char.spec));

        return {
            all: allData.length,
            mains: mainData.length,
            alts: altData.length,
            tanks: tankData.length,
            healers: healerData.length,
            dps: dpsData.length
        };
    }, [data]);

    return {
        filteredData,
        filters,
        updateFilter,
        updateFilters,
        resetFilters,
        availableClasses,
        counts
    };
} 