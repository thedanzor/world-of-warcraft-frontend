'use client'

// React
import { use, useEffect, useMemo, useState } from 'react'

// Next.js
import Link from 'next/link'

// Material-UI components
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

// Internal components
import MRTAbilityList from '@/core/components/MRTAbilityList'
import MRTImportExport from '@/core/components/MRTImportExport'

// Internal utilities
import { classAbilityList } from '@/tools/mrt/utils'

// Timer data imports
import vexie from '@/tools/mrt/season2/1.json'
import rikReverb from '@/tools/mrt/season2/2.json'
import stixBunkjunker from '@/tools/mrt/season2/3.json'
import cauldronOfCarnage from '@/tools/mrt/season2/4.json'
import chromeKingGallywix from '@/tools/mrt/season2/5.json'
import mugZeeHeadsOfSecurity from '@/tools/mrt/season2/6.json'
import sprocketmongerLockenstock from '@/tools/mrt/season2/7.json'
import theOneArmedBandit from '@/tools/mrt/season2/8.json'

// Styles
import '@/core/sections/scss/mrt.scss'

// Season 2 timer configurations
const season2Timers = {
    Vexie: vexie,
    RikReverb: rikReverb,
    StixBunkjunker: stixBunkjunker,
    CauldronOfCarnage: cauldronOfCarnage,
    ChromeKingGallywix: chromeKingGallywix,
    MugZeeHeadsOfSecurity: mugZeeHeadsOfSecurity,
    SprocketmongerLockenstock: sprocketmongerLockenstock,
    TheOneArmedBandit: theOneArmedBandit,
}

const bossOptions = [
    { label: 'Vexie', id: 'Vexie', timers: season2Timers['Vexie'] },
    { label: 'Rik Reverb', id: 'RikReverb', timers: season2Timers['RikReverb'] },
    { label: 'Stix Bunkjunker', id: 'StixBunkjunker', timers: season2Timers['StixBunkjunker'] },
    { label: 'Cauldron of Carnage', id: 'CauldronOfCarnage', timers: season2Timers['CauldronOfCarnage'] },
    { label: 'Chrome King Gallywix', id: 'ChromeKingGallywix', timers: season2Timers['ChromeKingGallywix'] },
    { label: 'Mug\'Zee Heads of Security', id: 'MugZeeHeadsOfSecurity', timers: season2Timers['MugZeeHeadsOfSecurity'] },
    { label: 'Sprocketmonger Lockenstock', id: 'SprocketmongerLockenstock', timers: season2Timers['SprocketmongerLockenstock'] },
    { label: 'The One Armed Bandit', id: 'TheOneArmedBandit', timers: season2Timers['TheOneArmedBandit'] },
]

/**
 * MRTContent - Ability list display component for MRT tool
 * Renders the ability table with boss timer data
 */
const MRTContent = ({ bossTimerData, setbossTimerData, hoveredIndex, setHoveredIndex, finalOptions }) => {
    return (
        <MRTAbilityList
            bossTimerData={bossTimerData}
            setbossTimerData={setbossTimerData}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            finalOptions={finalOptions}
        />
    );
};

/**
 * MRTTOOL - Mythic Raid Timer tool for managing boss abilities
 * Provides interface for selecting bosses and managing ability timers
 */
const MRTTOOL = ({ guildData }) => {
    const [mounted, setMounted] = useState(false);
    const [selectedBoss, setSelectedBoss] = useState(bossOptions[0]);
    const [bossTimerData, setbossTimerData] = useState([]);
    const [importExportScreen, toggleImportExportScreen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [forceRefresh, setForceRefresh] = useState(0);

    // Utility function to capitalize strings
    const capitalize = (str) => {
        if (str && str.length > 0) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        return str;
    };

    // Generate options from guild data
    const options = useMemo(() => {
        if (!guildData || !guildData.data) return [];
        return guildData.data
            .map((item) => {
                if (classAbilityList[item.class]) {
                    return {
                        label: item.name,
                        id: item.name,
                        class: item.class,
                        abilities: classAbilityList[item.class],
                    };
                }
                return null;
            })
            .filter((option) => option !== null);
    }, [guildData]);

    // Rest of the component logic would continue here...
    // For brevity, showing the key structure and imports

    return (
        <div>
            {/* Component JSX would go here */}
            <MRTContent 
                bossTimerData={bossTimerData}
                setbossTimerData={setbossTimerData}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
                finalOptions={options}
            />
        </div>
    );
};

export default MRTTOOL
