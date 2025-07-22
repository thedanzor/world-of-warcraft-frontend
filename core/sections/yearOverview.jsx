'use client'
import React, { useMemo } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import ThemeProvider from '@/core/themes'
import guildData from '@/data/guildData.json'
import config from '@/app.config.js'
import useAuditData from '@/core/hooks/useAuditData'
import getPreviousWednesdayAt1AM from '@/core/utils/currentLockout'
import YearOverviewTable from '@/core/modules/yearOverviewTable'
import Tooltip from '@mui/material/Tooltip'

// Icons
import GroupIcon from '@mui/icons-material/Group'
import StarIcon from '@mui/icons-material/Star'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import Link from 'next/link'
import './scss/peerOverview.scss'

import getRatingColor from '@/core/utils/getRatingColor'

const StatCard = ({ title, value, description, icon: Icon }) => (
    <Paper sx={{ p: 2, height: '100%', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Icon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                {title}
            </Typography>
        </Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
            {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {description}
        </Typography>
    </Paper>
)

const PlayerCard = ({ player }) => {
    const getLatestStats = (player) => {
        const timestamps = Object.keys(player?.stats || {})
        const latestTimestamp = Math.max(...timestamps.map(Number))
        return player?.stats?.[latestTimestamp] || {}
    }

    const latestStats = getLatestStats(player)

    const getColorForParse = (parse) => {
        if (parse > 90) return getRatingColor(2900, 'mplus') // Orange/Elite
        if (parse > 70) return getRatingColor(2200, 'mplus') // Purple/Duelist
        if (parse > 60) return getRatingColor(1400, 'mplus') // Blue/Rival
        if (parse > 40) return getRatingColor(1000, 'mplus') // Green/Challenger
        return getRatingColor(0, 'mplus') // Gray/Unranked
    }

    const getParseBreakdown = (stats) => {
        // Filter out the total_parse and create a formatted string for each parse type
        const breakdown = Object.entries(stats)
            .filter(([key]) => key !== 'total_parse')
            .map(([key, value]) => {
                const formattedKey = key
                    .replace('_parse', ' Score')
                    .replace('_', ' ')
                return `${formattedKey}: ${value || 0}`
            })
            .join('\n')
        return breakdown || 'No score data available'
    }

    return (
        <Paper
            elevation={3}
            sx={{
                backgroundColor: '#060d12',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                borderRadius: 1,
            }}
        >
            <Link
                href={`/2024/${player.name}`}
                className="itemcard"
            >
                <Box
                    sx={{
                        width: '100%',
                        overflow: 'hidden',
                        marginBottom: 1.5,
                    }}
                >
                    {player?.media?.assets?.length ? (
                        <img
                            src={player?.media?.assets[1]?.value}
                            alt={player.name}
                            style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                            }}
                        />
                    ) : (
                        <img
                            style={{
                                width: '100%',
                                height: 'auto',
                                opacity: '0.4',
                                display: 'block',
                            }}
                            src={'/images/logo-without-text.png'}
                            alt={player.name}
                        />
                    )}
                </Box>
                <Box sx={{ padding: 2, width: '100%' }}>
                    <Typography
                        variant="h6"
                        className={`name ${player.class}`}
                        sx={{
                            fontSize: '1.1rem',
                            textTransform: 'capitalize',
                            mb: 1,
                        }}
                    >
                        {player.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: '1.1rem',
                        }}
                    >
                        Total score:{' '}
                        <Tooltip
                            title={
                                <pre
                                    style={{
                                        margin: 0,
                                        whiteSpace: 'pre-line',
                                    }}
                                >
                                    {getParseBreakdown(
                                        latestStats['2024'] || {}
                                    )}
                                </pre>
                            }
                            arrow
                            placement="top"
                        >
                            <strong
                                style={{
                                    color: getColorForParse(
                                        latestStats['2024']?.total_parse || 0
                                    ),
                                    cursor: 'help', // Moved cursor style to the hoverable element
                                }}
                            >
                                {latestStats['2024']?.total_parse || 0}
                            </strong>
                        </Tooltip>
                    </Typography>
                </Box>
            </Link>
        </Paper>
    )
}

const TopPlayersTable = ({ data, title, type }) => {
    return (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                {title}
            </Typography>
            <YearOverviewTable data={data.slice(0, 5)} type={type} />
        </Paper>
    )
}

const Dashboard = () => {
    const [isDataLoaded, setIsDataLoaded] = React.useState(false)
    const [query, setQuery] = React.useState('')
    const [classFilter, setClassFilter] = React.useState([])
    const [rankFilter, setRankFilter] = React.useState('all')
    const [specFilter, setSpecFilter] = React.useState('all')
            const [ilevelFilter, setIlevelFilter] = React.useState(
            config.INITIAL_FILTERS.defaultItemLevel
        )
        const [instanceIndex, setInstanceIndex] = React.useState(
            config.INITIAL_FILTERS.instanceIndex
        )
    const [lockTimeStamp, setLockTimeStamp] = React.useState(
        getPreviousWednesdayAt1AM(Date.now())
    )

    const auditData = useAuditData(guildData.data, [
        query,
        classFilter,
        rankFilter,
        specFilter,
        ilevelFilter,
        instanceIndex,
        lockTimeStamp,
    ])

    const data = useMemo(() => {
        const allPlayers = guildData.data || []

        // Get the latest timestamp for each player
        const getLatestStats = (player) => {
            const timestamps = Object.keys(player?.stats || {})
            const latestTimestamp = Math.max(...timestamps.map(Number))
            return player?.stats?.[latestTimestamp] || {}
        }

        // Sort by total parse 2024
        const parsePlayers = [...allPlayers].sort((a, b) => {
            const aStats = getLatestStats(a)
            const bStats = getLatestStats(b)
            return (
                (bStats['2024']?.total_parse || 0) -
                (aStats['2024']?.total_parse || 0)
            )
        })

        // Sort by M+ parse 2024
        const mplusPlayers = [...allPlayers].sort((a, b) => {
            const aStats = getLatestStats(a)
            const bStats = getLatestStats(b)
            return (
                (bStats['2024']?.mplus_parse || 0) -
                (aStats['2024']?.mplus_parse || 0)
            )
        })

        // Sort by PvP parse 2024
        const pvpPlayers = [...allPlayers].sort((a, b) => {
            const aStats = getLatestStats(a)
            const bStats = getLatestStats(b)
            return (
                (bStats['2024']?.pvp_parse || 0) -
                (aStats['2024']?.pvp_parse || 0)
            )
        })

        // Sort by itemlevel parse 2024
        const ilvlPlayers = [...allPlayers].sort((a, b) => {
            const aStats = getLatestStats(a)
            const bStats = getLatestStats(b)
            return (
                (bStats['2024']?.itemlevel_parse || 0) -
                (aStats['2024']?.itemlevel_parse || 0)
            )
        })

        // Filter players with missing enchants - only for players above 615 ilvl
        const playersWithMissingEnchants = auditData.onlyMissingEnchants || []

        // Count players with raid lockouts using auditData
        const totalLocked = (auditData.locked || []).length

        // Calculate role counts based on spec
        const roleCounts = allPlayers.reduce(
            (acc, player) => {
                const spec = player.spec
                if (TANKS.includes(spec)) acc.tanks++
                else if (HEALERS.includes(spec)) acc.healers++
                else acc.dps++
                return acc
            },
            { tanks: 0, healers: 0, dps: 0 }
        )

        setIsDataLoaded(true)

        return {
            totalMembers: allPlayers.length,
            missingEnchants: playersWithMissingEnchants.length,
            raidLocked: totalLocked,
            avgTopMplus:
                mplusPlayers
                    .slice(0, 5)
                    .reduce(
                        (acc, p) =>
                            acc +
                            (p?.mplus || 0),
                        0
                    ) / 5,
            avgTopPvp:
                pvpPlayers
                    .slice(0, 5)
                    .reduce((acc, p) => acc + (p?.pvp || 0), 0) / 5,
            topMplus: mplusPlayers,
            topPvp: pvpPlayers,
            missingEnchantsPlayers: playersWithMissingEnchants,
            tanks: roleCounts.tanks,
            healers: roleCounts.healers,
            dps: roleCounts.dps,
            topParses: parsePlayers,
            topIlvl: ilvlPlayers,
            topRaid: parsePlayers,
        }
    }, [auditData])

    if (!isDataLoaded) {
        return null
    }

    return (
        <section className="dashboard">
            <ThemeProvider>
                <Box sx={{ padding: { xs: '0 8px', sm: '0 16px' }, pb: 8 }}>
                    <div className="logoHolder" style={{ marginTop: '40px' }}>
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                textTransform: 'capitalize !important',
                                textAlign: 'left',
                                fontSize: { xs: '1.75rem', sm: '2rem' },
                            }}
                        >
                            Year 2024 Summary
                        </Typography>
                        <Typography
                            variant="p"
                            component="p"
                            color="text.secondary"
                            sx={{ mb: 4, textAlign: 'left' }}
                        >
                            A look back at the year and how everyone has done
                        </Typography>
                    </div>

                    {/* Stats Cards - Now 3 columns */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                title="Total Characters"
                                value={data.totalMembers}
                                description="Active guild characters"
                                icon={GroupIcon}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                title="Top M+ Score"
                                value={Math.round(data.avgTopMplus)}
                                description="Average of top 5"
                                icon={StarIcon}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                title="Top PvP Rating"
                                value={Math.round(data.avgTopPvp)}
                                description="Average of top 5"
                                icon={EmojiEventsIcon}
                            />
                        </Grid>
                    </Grid>

                    <Typography
                        variant="h2"
                        component="h2"
                        sx={{
                            fontSize: '1.5rem',
                            mb: 2,
                            mt: 4,
                            textTransform: 'capitalize !important',
                        }}
                    >
                        Top 3 Players
                    </Typography>

                    <Typography
                        variant="p"
                        component="p"
                        color="text.secondary"
                        sx={{ mb: 4, textAlign: 'left' }}
                    >
                        These players have been the top performing across M+,
                        Raids, PvP and ItemLevel.
                    </Typography>

                    {/* Top 3 Parse Players */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {data.topParses.slice(0, 3).map((player, index) => (
                            <Grid item xs={12} md={4} key={player.name}>
                                <PlayerCard player={player} />
                            </Grid>
                        ))}
                    </Grid>

                    <Typography
                        variant="h2"
                        component="h2"
                        sx={{
                            fontSize: '1.5rem',
                            mb: 2,
                            mt: 4,
                            textTransform: 'capitalize !important',
                        }}
                    >
                        Top 5 players across various categories
                    </Typography>
                    <Typography
                        variant="p"
                        component="p"
                        color="text.secondary"
                        sx={{ mb: 4, textAlign: 'left' }}
                    >
                        Further breakdown on how players are performing across
                        various activities
                    </Typography>

                    {/* Tables */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={6}>
                            <TopPlayersTable
                                data={data.topRaid}
                                title="Top 5 Players"
                                type="parse"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TopPlayersTable
                                data={data.topMplus}
                                title="Top Mythic+ Players"
                                type="score"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TopPlayersTable
                                data={data.topPvp}
                                title="Top PvP Players"
                                type="pvp"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TopPlayersTable
                                data={data.topIlvl}
                                title="Top Item Level"
                                type="ilvl"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider>
        </section>
    )
}

export default Dashboard
