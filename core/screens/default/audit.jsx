/**
 * GUILD AUDIT SCREEN
 * 
 * This is a comprehensive guild analysis and audit tool that allows officers and leaders
 * to examine guild member data, filter by various criteria, and assess raid readiness.
 * 
 * WHAT THIS DOES:
 * - Provides advanced filtering by class, spec, rank, item level, and more
 * - Shows detailed audit information for raid preparation
 * - Displays missing enchants and consumables for guild members
 * - Tracks raid lockouts and availability
 * - Offers multiple view modes (all players, missing enchants, locked players)
 * - Generates comprehensive guild statistics and role breakdowns
 * 
 * KEY FEATURES:
 * - Multi-tab interface for different audit views
 * - Advanced filtering system with real-time search
 * - Visual indicators for missing requirements
 * - Role distribution analysis (tanks, healers, DPS)
 * - Item level requirements and compliance tracking
 * - Rank-based filtering (mains vs alts)
 * 
 * FILTERING CAPABILITIES:
 * - Text search across character names
 * - Class and specialization filtering
 * - Guild rank filtering (mains, alts, specific ranks)
 * - Item level threshold filtering
 * - Instance-specific filtering
 * - Raid lockout status filtering
 * 
 * AUDIT VIEWS:
 * - All Players: Complete guild roster with audit status
 * - Missing Enchants: Players needing enchantments
 * - Locked Players: Characters with active raid lockouts
 * - Statistics: Guild composition and role breakdowns
 * 
 * DATA INTEGRATION:
 * - Uses useAuditData hook for filtered data processing
 * - Integrates with guild data from API
 * - Real-time filtering and search capabilities
 * - Configurable thresholds and requirements
 * 
 * USAGE:
 * Primary tool for guild officers to assess raid readiness and member compliance.
 * Essential for raid planning and guild management.
 * 
 * MODIFICATION NOTES:
 * - Filter logic is complex; test thoroughly when modifying
 * - Performance considerations for large guilds
 * - Ensure all filter combinations work correctly
 * - Consider adding export functionality for reports
 */

'use client'

// React
import React, { useMemo } from 'react'

// Material-UI components
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Badge from '@mui/material/Badge'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'

// Internal components
import AuditBlock from '@/core/modules/auditBlock'
import { P } from '@/core/components/typography'

// Internal utilities and config
import getPreviousWednesdayAt1AM from '@/core/utils/currentLockout'
import { buildInitialClassList } from '@/tools/guildFetcher/utils'
import useAuditData from '@/core/hooks/useAuditData'
import config from '@/app.config.js'

// Styles
import '@/core/screens/default/scss/guildAudit.scss'

// Static variables
const {
    MAIN_RANKS,
    ALT_RANKS,
    INITIAL_FILTERS,
    MIN_CHECK_CAP,
    MAX_CHECK_CAP,
    ITEM_LEVEL_REQUIREMENT,
} = config

/**
 * GuildAudit - Comprehensive guild audit and analysis tool
 * Provides filtering, analysis, and reporting for guild member data
 */
const GuildAudit = ({ auditable, initialData }) => {
    const [loading, isLoading] = React.useState(false)
    const [data, setData] = React.useState(initialData.data)
    const [query, setQuery] = React.useState('')
    const [rankFilter, setRankFilter] = React.useState(
        INITIAL_FILTERS.rankFilter
    )
    const [activeTab, setActiveTab] = React.useState(INITIAL_FILTERS.activeTab)
    const [classFilter, setClassFilter] = React.useState([])
    const [specFilter, setSpecFilter] = React.useState(
        INITIAL_FILTERS.specFilter
    )
    const [ilevelFilter, setIlevelFilter] = React.useState(
        INITIAL_FILTERS.defaultItemLevel
    )
    const [instanceIndex, setInstanceIndex] = React.useState(
        INITIAL_FILTERS.instanceIndex
    )
    const [lockTimeStamp, setLockTimeStamp] = React.useState(
        getPreviousWednesdayAt1AM(Date.now())
    )

    const builtClassList = useMemo(() => buildInitialClassList(data), [data])
    const dataToUse = useAuditData(data, [
        query,
        classFilter,
        rankFilter,
        specFilter,
        ilevelFilter,
        instanceIndex,
        lockTimeStamp,
    ])

    const useQueryData =
        (query && query?.length > 0) ||
        classFilter.length > 0 ||
        rankFilter !== 'all'
    const hasReadyData = dataToUse?.all?.length
    const hasMissingEnchantData = dataToUse?.onlyMissingEnchants?.length
    const hasLockedData = dataToUse?.locked?.length
    const showSearchError =
        useQueryData &&
        !hasReadyData &&
        !hasMissingEnchantData &&
        !hasLockedData

    const {
        numbOfMains,
        numbOfAlts,
        numbOfTanks,
        numbOfHealers,
        numbOfDps,
        numbOfCombinedMainsAndAlts,
    } = useMemo(() => {
        const filteredData = data || []
        const altData = filteredData.filter(
            (item) => ALT_RANKS.includes(item.guildRank)
        )
        const mainData = filteredData.filter(
            (item) => MAIN_RANKS.includes(item.guildRank)
        )
        const tankData = filteredData.filter(
            (item) => item.metaData?.role === 'tank'
        )
        const healerData = filteredData.filter(
            (item) => item.metaData?.role === 'healer'
        )
        const dpsData = filteredData.filter(
            (item) => item.metaData?.role === 'dps'
        )

        return {
            numbOfCombinedMainsAndAlts: filteredData.length,
            numbOfMains: mainData.length,
            numbOfAlts: altData.length,
            numbOfTanks: tankData.length,
            numbOfHealers: healerData.length,
            numbOfDps: dpsData.length,
        }
    }, [data])

    return (
        <section className="guildAudit">
            <>
                <div className={`bodyContent`}>
                    <div className="mainContent">
                        <div className="scrollerContainer">
                            <div
                                className="logoHolder"
                                style={{ marginTop: '40px', padding: '0 16px' }}
                            >
                                <Typography
                                    variant="h2"
                                    component="h2"
                                    sx={{
                                        textTransform: 'capitalize !important',
                                        textAlign: 'left',
                                    }}
                                >
                                    Audit
                                </Typography>
                                <Typography
                                    variant="p"
                                    component="p"
                                    color="text.secondary"
                                    sx={{ mb: 4 }}
                                >
                                    Last audit ran{' '}
                                    {new Date(
                                        initialData.timestamp
                                    ).toLocaleString()}
                                </Typography>
                            </div>

                            <Box sx={{ padding: '0 16px' }}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        mb: 2,
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{ fontSize: '1.15rem' }}
                                    >
                                        Character Search
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Search for specific characters by name
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Search by Character Name"
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(
                                                e.target.value.replace(
                                                    /\s/g,
                                                    ''
                                                )
                                            )
                                        }
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Paper>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <Paper
                                        sx={{
                                            width: {
                                                xs: '100%',
                                                sm: 'calc(50% - 8px)',
                                                md: 'calc(25% - 12px)',
                                            },
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'background.paper',
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontSize: '1.15rem' }}
                                        >
                                            Item Level Filter
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom
                                        >
                                            Filter characters by minimum item
                                            level
                                        </Typography>
                                        <Slider
                                            value={ilevelFilter}
                                            onChange={(e, newValue) =>
                                                setIlevelFilter(newValue)
                                            }
                                            valueLabelDisplay="auto"
                                            min={MIN_CHECK_CAP}
                                            max={MAX_CHECK_CAP}
                                            marks
                                        />
                                    </Paper>

                                    <Paper
                                        sx={{
                                            width: {
                                                xs: '100%',
                                                sm: 'calc(50% - 8px)',
                                                md: 'calc(25% - 12px)',
                                            },
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'background.paper',
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontSize: '1.15rem' }}
                                        >
                                            Rank Filter
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom
                                        >
                                            Filter characters by their guild
                                            rank
                                        </Typography>
                                        <FormControl fullWidth>
                                            <Select
                                                value={rankFilter}
                                                onChange={(e) =>
                                                    setRankFilter(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <MenuItem value="all">
                                                    All (
                                                    {numbOfCombinedMainsAndAlts}
                                                    )
                                                </MenuItem>
                                                <MenuItem value="mains">
                                                    Mains ({numbOfMains})
                                                </MenuItem>
                                                <MenuItem value="alts">
                                                    Alts ({numbOfAlts})
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Paper>

                                    <Paper
                                        sx={{
                                            width: {
                                                xs: '100%',
                                                sm: 'calc(50% - 8px)',
                                                md: 'calc(25% - 12px)',
                                            },
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'background.paper',
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontSize: '1.15rem' }}
                                        >
                                            Spec Filter
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom
                                        >
                                            Filter characters by their role
                                            specialization
                                        </Typography>
                                        <FormControl fullWidth>
                                            <Select
                                                value={specFilter}
                                                onChange={(e) =>
                                                    setSpecFilter(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <MenuItem value="all">
                                                    All
                                                </MenuItem>
                                                <MenuItem value="tanks">
                                                    Tanks
                                                </MenuItem>
                                                <MenuItem value="healers">
                                                    Healers
                                                </MenuItem>
                                                <MenuItem value="dps">
                                                    DPS
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Paper>

                                    <Paper
                                        sx={{
                                            width: {
                                                xs: '100%',
                                                sm: 'calc(50% - 8px)',
                                                md: 'calc(25% - 12px)',
                                            },
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'background.paper',
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontSize: '1.15rem' }}
                                        >
                                            Class Filter
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom
                                        >
                                            Filter characters by their class
                                        </Typography>
                                        <FormControl fullWidth>
                                            <Select
                                                multiple
                                                value={classFilter}
                                                onChange={(e) =>
                                                    setClassFilter(
                                                        e.target.value
                                                    )
                                                }
                                                input={<OutlinedInput />}
                                                renderValue={(selected) => (
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            gap: 0.5,
                                                        }}
                                                    >
                                                        {selected.map(
                                                            (value) => (
                                                                <Chip
                                                                    key={value}
                                                                    label={
                                                                        value
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </Box>
                                                )}
                                            >
                                                {builtClassList.map(
                                                    (className) => (
                                                        <MenuItem
                                                            key={className}
                                                            value={className}
                                                        >
                                                            {className}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Paper>
                                </Box>

                                {!loading && showSearchError && (
                                    <div className="auditResponse">
                                        <P
                                            style={{
                                                fontWeight: 'bold',
                                                maxWidth: '900px',
                                                paddingTop: '200px',
                                            }}
                                        >
                                            No characters could be found with
                                            that search query, the character may
                                            not be in the guild or too far
                                            behind in progression to be audited.{' '}
                                            <br />
                                            Please reach out to an officer if
                                            you believe this to be an error or
                                            mistake.
                                        </P>
                                    </div>
                                )}

                                {!loading && !showSearchError && (
                                    <div className="auditResponse">
                                        <Paper
                                            sx={{
                                                width: '100%',
                                                mb: 2,
                                                overflowX: 'auto',
                                            }}
                                        >
                                            <Tabs
                                                value={activeTab}
                                                onChange={(e, newValue) =>
                                                    setActiveTab(newValue)
                                                }
                                                variant="scrollable"
                                                scrollButtons={true}
                                                allowScrollButtonsMobile
                                                sx={{
                                                    '.MuiTabs-scrollButtons': {
                                                        '&.Mui-disabled': {
                                                            opacity: 0.3,
                                                        },
                                                    },
                                                }}
                                            >
                                                <Tab
                                                    label={
                                                        <Badge
                                                            badgeContent={
                                                                dataToUse?.all
                                                                    ?.length ||
                                                                0
                                                            }
                                                            color="primary"
                                                            sx={{
                                                                position:
                                                                    'relative',
                                                                padding: '8px',
                                                            }}
                                                        >
                                                            All
                                                        </Badge>
                                                    }
                                                    value="all"
                                                />
                                                <Tab
                                                    label={
                                                        <Badge
                                                            badgeContent={
                                                                dataToUse
                                                                    ?.onlyMissingEnchants
                                                                    ?.length ||
                                                                0
                                                            }
                                                            color="primary"
                                                            sx={{
                                                                position:
                                                                    'relative',
                                                                padding: '8px',
                                                            }}
                                                        >
                                                            Missing Enchants
                                                        </Badge>
                                                    }
                                                    value="enchants"
                                                />
                                                {dataToUse?.normalLocked
                                                    ?.length > 0 && (
                                                    <Tab
                                                        label={
                                                            <Badge
                                                                badgeContent={
                                                                    dataToUse
                                                                        ?.normalLocked
                                                                        ?.length ||
                                                                    0
                                                                }
                                                                color="primary"
                                                                sx={{
                                                                    position:
                                                                        'relative',
                                                                    padding:
                                                                        '8px',
                                                                }}
                                                            >
                                                                Locked (Normal)
                                                            </Badge>
                                                        }
                                                        value="lockedNormal"
                                                    />
                                                )}
                                                {dataToUse?.heroicLocked
                                                    ?.length > 0 && (
                                                    <Tab
                                                        label={
                                                            <Badge
                                                                badgeContent={
                                                                    dataToUse
                                                                        ?.heroicLocked
                                                                        ?.length ||
                                                                    0
                                                                }
                                                                color="primary"
                                                                sx={{
                                                                    position:
                                                                        'relative',
                                                                    padding:
                                                                        '8px',
                                                                }}
                                                            >
                                                                Locked (Heroic)
                                                            </Badge>
                                                        }
                                                        value="lockedHeroic"
                                                    />
                                                )}
                                                {dataToUse?.mythicLocked
                                                    ?.length > 0 && (
                                                    <Tab
                                                        label={
                                                            <Badge
                                                                badgeContent={
                                                                    dataToUse
                                                                        ?.mythicLocked
                                                                        ?.length ||
                                                                    0
                                                                }
                                                                color="primary"
                                                                sx={{
                                                                    position:
                                                                        'relative',
                                                                    padding:
                                                                        '8px',
                                                                }}
                                                            >
                                                                Locked (Mythic)
                                                            </Badge>
                                                        }
                                                        value="lockedMythic"
                                                    />
                                                )}
                                            </Tabs>
                                        </Paper>
                                        <Box sx={{ overflowX: 'auto' }}>
                                            {activeTab === 'all' && (
                                                <AuditBlock
                                                    data={dataToUse}
                                                    name="all"
                                                />
                                            )}
                                            {activeTab === 'enchants' && (
                                                <AuditBlock
                                                    data={dataToUse}
                                                    name="onlyMissingEnchants"
                                                />
                                            )}
                                            {activeTab === 'lockedNormal' && (
                                                <AuditBlock
                                                    data={dataToUse}
                                                    name="normalLocked"
                                                />
                                            )}
                                            {activeTab === 'lockedHeroic' && (
                                                <AuditBlock
                                                    data={dataToUse}
                                                    name="heroicLocked"
                                                />
                                            )}
                                            {activeTab === 'lockedMythic' && (
                                                <AuditBlock
                                                    data={dataToUse}
                                                    name="mythicLocked"
                                                />
                                            )}
                                        </Box>
                                    </div>
                                )}
                            </Box>
                        </div>
                    </div>
                </div>
            </>
        </section>
    )
}

export default GuildAudit 