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

// Shadcn & Lucide
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { Users, Wrench, Lock, Star, Trophy } from 'lucide-react'

// Components
import AuditBlock from '@/core/modules/auditBlock'
import useAuditData from '@/core/hooks/useAuditData'
import getPreviousWednesdayAt1AM from '@/core/utils/currentLockout'
import StatCard from '@/core/components/StatCard'
import TopPlayersTable from '@/core/components/TopPlayersTable'
import RoleDistribution from '@/core/components/RoleDistribution'


// Dashboard
const Dashboard = ({ guildData }) => {
    const [isDataLoaded, setIsDataLoaded] = React.useState(false)

    console.log('guildData', guildData, isDataLoaded)
    
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
            <div className="flex justify-center items-center h-[50vh]">
                <Spinner />
            </div>
        )
    }

    if (guildData.error) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertTitle className="text-md">Failed to load guild data</AlertTitle>
                    <AlertDescription className="text-sm">{guildData.error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    const guildDataToUse = guildData.data || []

    console.log('guildDataToUse', guildDataToUse, isDataLoaded)

    const auditData = useAuditData(guildDataToUse, [
        query,
        classFilter,
        rankFilter,
        specFilter,
        ilevelFilter,
        instanceIndex,
        lockTimeStamp,
    ])

    console.log('auditData', auditData, isDataLoaded)

    const data = useMemo(() => {
        const allPlayers = guildDataToUse || []

        // Use pagination from API response
        const pagination = guildData.pagination || {};
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

    // Set data loaded when data is available
    React.useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            setIsDataLoaded(true)
        }
    }, [data])

    console.log('data', data, isDataLoaded)

    if (!isDataLoaded) {
        return null
    }

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Guild Overview and Statistics
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard
                    title="Total Characters"
                    value={data.totalMembers}
                    description="Active guild characters"
                    icon={Users}
                />
                <StatCard
                    title="Missing Enchants"
                    value={data.missingEnchants}
                    description="Players need attention"
                    icon={Wrench}
                />
                <StatCard
                    title="Raid Locked"
                    value={data.raidLocked}
                    description="Players with lockouts"
                    icon={Lock}
                />
                <StatCard
                    title="M+ Score"
                    value={Math.round(data.avgTopMplus)}
                    description="Average of top 5"
                    icon={Star}
                />
                <StatCard
                    title="PvP Rating"
                    value={Math.round(data.avgTopPvp)}
                    description="Average of top 5"
                    icon={Trophy}
                />
            </div>

            {/* Top Players Tables */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TopPlayersTable
                    data={data.topMplus}
                    title="Top Mythic+ Players"
                    scoreKey="score"
                />
                <TopPlayersTable
                    data={data.topPvp}
                    title="Top PvP Players"
                    scoreKey="pvp"
                />
            </div>

            {/* Missing Enchants Table */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Missing Enchants</h2>
                <AuditBlock
                    data={{ all: data.missingEnchantsPlayers }}
                    name="all"
                />
            </div>
        </section>
    )
}

export default Dashboard
