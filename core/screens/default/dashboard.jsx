'use client'

import React, { useMemo, useEffect, useState } from 'react'
import appConfig from '@/app.config.js'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import {
  Users, Wrench, Lock, Star, Trophy, Skull, Key, Database, Sparkles,
} from 'lucide-react'
import { api } from '@/lib/api'
import useAuditData from '@/core/hooks/useAuditData'
import getPreviousWednesdayAt1AM from '@/core/utils/currentLockout'
import PageHero from '@/core/components/PageHero'
import SectionHeading from '@/core/components/SectionHeading'
import { PageShell, PageContent } from '@/core/components/PageShell'
import GuildTopRanks from '@/core/components/GuildTopRanks'
import TopPlayersTable from '@/core/components/TopPlayersTable'
import DashboardSpotlight from '@/core/components/dashboard/DashboardSpotlight'
import AnimatedMetric from '@/core/components/dashboard/AnimatedMetric'
import { useConfig } from '@/core/hooks/useConfig'
import { colors } from '@/core/theme'

const { INITIAL_FILTERS } = appConfig

const Dashboard = ({ guildData, rankingsData }) => {
  const { config: guildConfig } = useConfig()
  const guildTitle = guildConfig?.GUILD_NAME?.replace(/-/g, ' ') || 'Guild Dashboard'

  const [liveRankings, setLiveRankings] = useState(rankingsData)
  const query = ''
  const classFilter = []
  const rankFilter = 'all'
  const specFilter = 'all'
  const ilevelFilter = INITIAL_FILTERS.defaultItemLevel
  const instanceIndex = INITIAL_FILTERS.instanceIndex
  const lockTimeStamp = getPreviousWednesdayAt1AM(Date.now())
  const guildDataToUse = Array.isArray(guildData?.data) ? guildData.data : []

  useEffect(() => {
    if (rankingsData?.combined?.length) return
    api.getRankings()
      .then((data) => setLiveRankings(data))
      .catch(() => {})
  }, [rankingsData])

  const auditData = useAuditData(guildDataToUse, [
    query, classFilter, rankFilter, specFilter, ilevelFilter, instanceIndex, lockTimeStamp,
  ])

  const data = useMemo(() => {
    const allPlayers = guildDataToUse
    const missingEnchants = guildData?.missingEnchants || { all: 0 }
    const topPvp = Array.isArray(guildData?.topPvp) ? guildData.topPvp : []
    const topPve = Array.isArray(guildData?.topPve) ? guildData.topPve : []

    const avgTopMplus = topPve.length
      ? topPve.reduce((acc, p) => acc + (p.score || 0), 0) / topPve.length
      : 0
    const avgTopPvp = topPvp.length
      ? topPvp.reduce((acc, p) => acc + (p.rating || 0), 0) / topPvp.length
      : 0

    return {
      totalMembers: allPlayers.length,
      missingEnchants: missingEnchants.all || 0,
      raidLocked: (auditData?.locked || []).length,
      avgTopMplus,
      avgTopPvp,
      topMplus: topPve,
      topPvp,
    }
  }, [auditData, guildData, guildDataToUse])

  const spotlightPlayers = useMemo(() => {
    const combined = liveRankings?.combined || []
    if (!combined.length) {
      return guildDataToUse
        .filter((p) => p.media?.assets?.length)
        .sort((a, b) => b.itemLevel - a.itemLevel)
        .slice(0, 4)
    }
    return combined.slice(0, 4).map((ranked) => {
      const roster = guildDataToUse.find(
        (p) => p.name?.toLowerCase() === ranked.name?.toLowerCase()
      )
      return {
        ...ranked,
        media: roster?.media,
        mplus: roster?.mplus,
        class: ranked.className || roster?.class,
        spec: ranked.spec || roster?.spec,
      }
    })
  }, [liveRankings, guildDataToUse])

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
            <AlertTitle>Failed to load guild data</AlertTitle>
            <AlertDescription>{guildData.error}</AlertDescription>
          </Alert>
        </PageContent>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <PageHero
        chip="Command Center"
        chipColor={colors.neonPurple}
        gradientColor={colors.neonPurple}
        title={guildTitle}
        description="Live guild pulse — raid readiness, enrichment rankings, and roster highlights at a glance."
        badges={[
          { label: 'Warcraft Logs', icon: Skull, color: colors.accent },
          { label: 'Raider.io', icon: Key, color: colors.warning },
          { label: 'Battle.net', icon: Database, color: '#4fc3f7' },
        ]}
      />

      <PageContent className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <AnimatedMetric title="Roster" value={data.totalMembers} subtitle="Active characters" icon={Users} delay={0} />
          <AnimatedMetric title="Need enchants" value={data.missingEnchants} subtitle="Require attention" icon={Wrench} color={colors.danger} delay={60} />
          <AnimatedMetric title="Raid locked" value={data.raidLocked} subtitle="With lockouts" icon={Lock} color={colors.warning} delay={120} />
          <AnimatedMetric title="Avg top M+" value={Math.round(data.avgTopMplus)} subtitle="Top 5 average" icon={Star} color={colors.warning} delay={180} />
          <AnimatedMetric title="Avg top PvP" value={Math.round(data.avgTopPvp)} subtitle="Top 5 average" icon={Trophy} color={colors.success} delay={240} />
        </div>

        <div className="space-y-3">
          <SectionHeading icon={Sparkles} label="Spotlight" color={colors.neonPurple} />
          <DashboardSpotlight players={spotlightPlayers} />
        </div>

        <div className="space-y-4">
          <SectionHeading icon={Trophy} label="Guild Conquest" color={colors.warning} />
          <GuildTopRanks compact />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TopPlayersTable data={data.topMplus} title="Top Mythic+ Players" scoreKey="score" />
          <TopPlayersTable data={data.topPvp} title="Top PvP Players" scoreKey="pvp" />
        </div>
      </PageContent>
    </PageShell>
  )
}

export default Dashboard
