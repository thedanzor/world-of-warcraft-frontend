'use client'

import { use, useEffect, useMemo, useState } from 'react'

import Link from 'next/link'

// MUI
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import './scss/mrt.scss'

import { classAbilityList } from '@/tools/mrt/utils'

// timers
import vexie from '../../tools/mrt/season2/1.json'
import rikReverb from '../../tools/mrt/season2/2.json'
import stixBunkjunker from '../../tools/mrt/season2/3.json'
import cauldronOfCarnage from '../../tools/mrt/season2/4.json'
import chromeKingGallywix from '../../tools/mrt/season2/5.json'
import mugZeeHeadsOfSecurity from '../../tools/mrt/season2/6.json'
import sprocketmongerLockenstock from '../../tools/mrt/season2/7.json'
import theOneArmedBandit from '../../tools/mrt/season2/8.json'

import MRTAbilityList from '../components/MRTAbilityList';
import MRTImportExport from '../components/MRTImportExport';

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

// Extracted MRTContent to use AbilityTable
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

const MRTTOOL = ({ guildData }) => {
    const [mounted, setMounted] = useState(false);
    const [selectedBoss, setSelectedBoss] = useState(bossOptions[0]);
    const [bossTimerData, setbossTimerData] = useState([]);
    const [importExportScreen, toggleImportExportScreen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [forceRefresh, setForceRefresh] = useState(0);

    // Move these inside the component so guildData is available
    const capitalize = (str) => {
        if (str && str.length > 0) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        return str;
    };

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

    const finalOptions = useMemo(() => {
        return options.flatMap((item) => {
            const result = [{ ...item, label: capitalize(item.label) }];
            if (classAbilityList[item.class]) {
                classAbilityList[item.class].forEach((ability) => {
                    result.push({
                        ...item,
                        label: `${capitalize(item.label)} (${ability})`,
                    });
                });
            }
            return result;
        });
    }, [options]);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Function to clear cache and reload data
    const clearCacheAndReload = () => {
        setForceRefresh((prev) => prev + 1);
        setbossTimerData([...selectedBoss.timers]);
    };

    // New boss selected, reset the data
    useEffect(() => {
        if (!mounted) return;
        const freshTimers = JSON.parse(JSON.stringify(selectedBoss.timers));
        setbossTimerData(freshTimers);
    }, [selectedBoss, mounted, forceRefresh]);

    return <div className='mrt'>
        <Box className="mrt-tool-root">
            <Paper className="mrt-tool-paper">
                <Stack spacing={3}>
                    {/* First Box: Title, Boss Select, Actions, Import/Export */}
                    <Box className="mrt-tool-controls" sx={{ mb: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Raid Timer Tool
                        </Typography>
                        <Autocomplete
                            options={bossOptions}
                            getOptionLabel={(option) => option.label}
                            value={selectedBoss}
                            onChange={(e, newValue) => {
                                if (newValue) {
                                    setSelectedBoss(newValue);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Boss"
                                    variant="outlined"
                                />
                            )}
                            sx={{ mb: 2 }}
                        />
                        <Box className="mrt-tool-actions" sx={{ mb: 2 }}>
                            <Button
                                variant="contained"
                                onClick={() => toggleImportExportScreen(!importExportScreen)}
                            >
                                {importExportScreen ? 'Back to Timer' : 'Import / Export'}
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={clearCacheAndReload}
                                sx={{ ml: 2 }}
                            >
                                Reset Timer
                            </Button>
                        </Box>
                        {importExportScreen && (
                            <MRTImportExport
                                handleToggle={(newData) => {
                                    if (newData) {
                                        setbossTimerData(newData);
                                    }
                                    toggleImportExportScreen(false);
                                }}
                                data={bossTimerData}
                            />
                        )}
                    </Box>
                    {/* Second Box: Table (only if not in import/export mode) */}
                    {!importExportScreen && (
                        <Box className="mrt-tool-table">
                            <MRTContent
                                bossTimerData={bossTimerData}
                                setbossTimerData={setbossTimerData}
                                hoveredIndex={hoveredIndex}
                                setHoveredIndex={setHoveredIndex}
                                finalOptions={finalOptions}
                            />
                        </Box>
                    )}
                </Stack>
            </Paper>
        </Box>
    </div>;
};

export default MRTTOOL
