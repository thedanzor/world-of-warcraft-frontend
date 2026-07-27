'use client'
import React, { useMemo } from 'react'

import appConfig from '@/app.config.js'
import { getCharacterRole } from '@/core/utils/roleFromSpec'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import {
    Users,
    Wrench,
    Lock,
    Star,
    Trophy,
    BarChart,
    Skull,
    Key,
    Database,
} from 'lucide-react'

import AuditBlock from '@/core/modules/auditBlock'
import useAuditData from '@/core/hooks/useAuditData'
import getPreviousWednesdayAt1AM from '@/core/utils/currentLockout'
import StatCard from '@/core/components/StatCard'
import TopPlayersTable from '@/core/components/TopPlayersTable'
import GuildTopRanks from '@/core/components/GuildTopRanks'
import PageHero from '@/core/components/PageHero'
import SectionHeading from '@/core/components/SectionHeading'
import { PageShell, PageContent } from '@/core/components/PageShell'
import { useConfig } from '@/core/hooks/useConfig'
import { colors } from '@/core/theme'

const {
    INITIAL_FILTERS,
} = appConfig

const Dashboard = ({ guildData }) => {
    const { config: guildConfig } = useConfig()
    const guildTitle = guildConfig?.GUILD_NAME?.replace(/-/g, ' ') || 'Guild Dashboard'

    const query = ''
    const classFilter = []
    const rankFilter = 'all'
    const specFilter = 'all'
    const ilevelFilter = INITIAL_FILTERS.defaultItemLevel
    const instanceIndex = INITIAL_FILTERS.instanceIndex
    const lockTimeStamp = getPreviousWednesdayAt1AM(Date.now())

    const guildDataToUse = Array.isArray(guildData?.data) ? guildData.data : []

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
        const allPlayers = guildDataToUse
        const missingEnchants = guildData?.missingEnchants || { all: 0, mains: 0, alts: 0 }
        const topPvp = Array.isArray(guildData?.topPvp) ? guildData.topPvp : []
        const topPve = Array.isArray(guildData?.topPve) ? guildData.topPve : []

        const roleCounts = allPlayers.reduce(
            (acc, player) => {
                const role = getCharacterRole(player, appConfig)
                if (role === 'tank') acc.tanks += 1
                else if (role === 'healer') acc.healers += 1
                else acc.dps += 1
                return acc
            },
            { tanks: 0, healers: 0, dps: 0 }
        )

        const avgTopMplus = topPve.length > 0
            ? topPve.reduce((acc, p) => acc + (p.score || 0), 0) / topPve.length
            : 0
        const avgTopPvp = topPvp.length > 0
            ? topPvp.reduce((acc, p) => acc + (p.rating || 0), 0) / topPvp.length
            : 0

        const totalLocked = (auditData?.locked || []).length

        const missingEnchantsPlayers = allPlayers.filter(
            (player) => player.missingEnchants && player.missingEnchants.length > 0
        )

        return {
            totalMembers: allPlayers.length,
            missingEnchants: missingEnchants.all || 0,
            raidLocked: totalLocked,
            avgTopMplus,
            avgTopPvp,
            topMplus: topPve,
            topPvp,
            missingEnchantsPlayers,
            tanks: roleCounts.tanks || 0,
            healers: roleCounts.healers || 0,
            dps: roleCounts.dps || 0,
        }
    }, [auditData, guildData, guildDataToUse])

    if (!guildData) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Spinner />
            </div>
        )
    }

    if (guildData.error) {
        return (
            <PageShell>
                <PageContent>
                    <Alert variant="destructive">
                        <AlertTitle className="text-md">Failed to load guild data</AlertTitle>
                        <AlertDescription className="text-sm">{guildData.error}</AlertDescription>
                    </Alert>
                </PageContent>
            </PageShell>
        )
    }

    return (
        <PageShell>
            <PageHero
                chip="Guild Overview"
                chipColor={colors.accent}
                gradientColor={colors.accent}
                title={guildTitle}
                description="Live guild statistics from Battle.net, enriched with Warcraft Logs raid parses and Raider.io Mythic+ rankings."
                badges={[
                    { label: 'Warcraft Logs', icon: Skull, color: colors.accent },
                    { label: 'Raider.io', icon: Key, color: colors.warning },
                    { label: 'Battle.net', icon: Database, color: '#4fc3f7' },
                ]}
            />

            <PageContent className="space-y-8">
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

                <div className="space-y-3">
                    <SectionHeading icon={Trophy} label="Guild Rankings" color={colors.warning} />
                    <GuildTopRanks compact />
                </div>

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

                <div className="space-y-3">
                    <SectionHeading icon={BarChart} label="Missing Enchants" color={colors.danger} />
                    <AuditBlock
                        data={{ all: data.missingEnchantsPlayers }}
                        name="all"
                    />
                </div>
            </PageContent>
        </PageShell>
    )
}

export default Dashboard
