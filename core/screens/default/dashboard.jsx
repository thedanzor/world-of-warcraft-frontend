/**
 * DASHBOARD SCREEN
 * 
 * This is the main landing page that provides an overview of the guild's status and performance.
 * It displays key metrics, statistics, and quick access to important guild information.
 * 
 * WHAT THIS DOES:
 * - Shows guild overview with key performance indicators
 * - Displays player statistics (item levels, raid lockouts, missing enchants)
 * - Provides role distribution visualization (tanks, healers, DPS)
 * - Shows top players in Mythic+ and PvP
 * - Integrates with audit system for raid readiness
 * - Handles loading states and error conditions gracefully
 * 
 * KEY FEATURES:
 * - Guild statistics dashboard with visual cards
 * - Player count and role distribution charts
 * - Top performers table for Mythic+ and PvP
 * - Audit block showing raid readiness status
 * - Responsive grid layout for different screen sizes
 * 
 * DATA SOURCES:
 * - guildData: Main guild information from API
 * - useAuditData: Hook for raid lockout and readiness data
 * - Statistics from backend (missing enchants, role counts, top players)
 * 
 * COMPONENTS USED:
 * - StatCard: Individual metric display cards
 * - TopPlayersTable: Table showing best performers
 * - RoleDistribution: Visual chart of role breakdown
 * - AuditBlock: Raid readiness and lockout information
 * 
 * FILTERING:
 * - Uses static filters for consistent data display
 * - Integrates with global filter system
 * - Shows data based on current lockout period
 * 
 * USAGE:
 * This screen is the main entry point for guild leaders and officers.
 * It provides quick insights into guild health and performance.
 * 
 * MODIFICATION NOTES:
 * - Keep statistics calculations accurate and performant
 * - Ensure responsive design works on all devices
 * - Test with various guild sizes and data scenarios
 * - Consider adding more metrics based on guild needs
 */

'use client'
import React, { useMemo } from 'react'

// Config
import config from '@/app.config.js'

// Material Components
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// Icons
import GroupIcon from '@mui/icons-material/Group'
import BuildIcon from '@mui/icons-material/Build'
import LockIcon from '@mui/icons-material/Lock'
import StarIcon from '@mui/icons-material/Star'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

// Components
import './scss/dashboard.scss'
import AuditBlock from '@/core/modules/auditBlock'
import useAuditData from '@/core/hooks/useAuditData'
import getPreviousWednesdayAt1AM from '@/core/utils/currentLockout'
import StatCard from '@/core/components/StatCard'
import TopPlayersTable from '@/core/components/TopPlayersTable'
import RoleDistribution from '@/core/components/RoleDistribution'


// Dashboard
const Dashboard = ({ guildData }) => {
    const [isDataLoaded, setIsDataLoaded] = React.useState(false)
    
    // These values are static and only used in hook dependencies
    const query = ''
    const classFilter = []
    const rankFilter = 'all'
    const specFilter = 'all'
    const ilevelFilter = config.INITIAL_FILTERS.defaultItemLevel
    const instanceIndex = config.INITIAL_FILTERS.instanceIndex
    const lockTimeStamp = getPreviousWednesdayAt1AM(Date.now())

    // Handle loading and error states
    if (!guildData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    if (guildData.error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    <Typography variant="h6">Failed to load guild data</Typography>
                    <Typography variant="body2">{guildData.error}</Typography>
                </Alert>
            </Box>
        )
    }

    const guildDataToUse = guildData.data || []

    const auditData = useAuditData(guildDataToUse, [
        query,
        classFilter,
        rankFilter,
        specFilter,
        ilevelFilter,
        instanceIndex,
        lockTimeStamp,
    ])

    const data = useMemo(() => {
        const allPlayers = guildDataToUse || []

        // Use statistics from API response
        const statistics = guildData.statistics || {};
        const missingEnchants = guildData.missingEnchants || { all: 0, mains: 0, alts: 0 };
        const topPvp = guildData.topPvp || [];
        const topPve = guildData.topPve || [];
        const roleCounts = guildData.roleCounts || { tanks: 0, healers: 0, dps: 0 };

        // Calculate averages from top players
        const avgTopMplus = topPve.length > 0 
            ? topPve.reduce((acc, p) => acc + (p.score || 0), 0) / topPve.length 
            : 0
        const avgTopPvp = topPvp.length > 0 
            ? topPvp.reduce((acc, p) => acc + (p.rating || 0), 0) / topPvp.length 
            : 0

        // Count players with raid lockouts using auditData
        const totalLocked = (auditData.locked || []).length

        // Get players with missing enchants from the optimized data
        const missingEnchantsPlayers = allPlayers.filter(player => 
            player.missingEnchants && player.missingEnchants.length > 0
        )

        setIsDataLoaded(true)

        return {
            totalMembers: allPlayers.length,
            missingEnchants: missingEnchants.all || 0,
            raidLocked: totalLocked,
            avgTopMplus: avgTopMplus,
            avgTopPvp: avgTopPvp,
            topMplus: topPve,
            topPvp: topPvp,
            missingEnchantsPlayers: missingEnchantsPlayers,
            tanks: roleCounts.tanks || 0,
            healers: roleCounts.healers || 0,
            dps: roleCounts.dps || 0,
        }
    }, [auditData, guildData])

    if (!isDataLoaded) {
        return null
    }

    return (
        <section className="dashboard">
            <Box>
                <div className="logoHolder">
                    <Typography
                        variant="h2"
                        component="h2"
                        className="logoHolder-title"
                    >
                        Dashboard
                    </Typography>
                    <Typography
                        variant="p"
                        component="p"
                        color="text.secondary"
                        className="logoHolder-description"
                    >
                        Guild Overview and Statistics
                    </Typography>
                </div>

                {/* Stats Cards */}
                <Grid container spacing={2} className="stats-cards">
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            title="Total Characters"
                            value={data.totalMembers}
                            description="Active guild characters"
                            icon={GroupIcon}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            title="Missing Enchants"
                            value={data.missingEnchants}
                            description="Players need attention"
                            icon={BuildIcon}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            title="Raid Locked"
                            value={data.raidLocked}
                            description="Players with lockouts"
                            icon={LockIcon}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            title="M+ Score"
                            value={Math.round(data.avgTopMplus)}
                            description="Average of top 5"
                            icon={StarIcon}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            title="PvP Rating"
                            value={Math.round(data.avgTopPvp)}
                            description="Average of top 5"
                            icon={EmojiEventsIcon}
                        />
                    </Grid>
                </Grid>

                {/* Top Players Tables */}
                <Grid container spacing={2} className="top-players">
                    <Grid item xs={12} md={6}>
                        <TopPlayersTable
                            data={data.topMplus}
                            title="Top Mythic+ Players"
                            scoreKey="score"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TopPlayersTable
                            data={data.topPvp}
                            title="Top PvP Players"
                            scoreKey="pvp"
                        />
                    </Grid>
                </Grid>

                {/* Missing Enchants Table */}
                <Typography
                    variant="h2"
                    component="h2"
                    className="missing-enchants-title"
                >
                    Missing Enchants
                </Typography>
                <AuditBlock
                    data={{ all: data.missingEnchantsPlayers }}
                    name="all"
                />

                {/* Role Distribution */}
                {/* <RoleDistribution tanks={data.tanks} healers={data.healers} dps={data.dps} /> */}
            </Box>
        </section>
    )
}

export default Dashboard
