'use client'

import React, { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import MythicPlusBlock from '@/core/modules/MythicPlusBlock'
import SeasonalLeaderboard from '@/core/modules/SeasonalLeaderboard'
import SeasonalStatistics from '@/core/modules/SeasonalStatistics'
import EnrichmentMplusLeaderboard from '@/core/components/mplus/EnrichmentMplusLeaderboard'
import EnrichmentMplusStats from '@/core/components/mplus/EnrichmentMplusStats'
import PageHero from '@/core/components/PageHero'
import { PageShell, PageContent } from '@/core/components/PageShell'
import { colors } from '@/core/theme'
import { Key } from 'lucide-react'

const MPlus = ({ guildData, allGuildData = [], seasonalData }) => {
    const [activeTab, setActiveTab] = useState('weekly')
    const rosterForStats = Array.isArray(allGuildData) ? allGuildData : (guildData?.data || [])
    const hasSeasonalStats = seasonalData?.stats && Object.keys(seasonalData.stats).length > 0
    const hasMplusCacheData = hasSeasonalStats && (
        (seasonalData.stats.charactersWithMplus ?? 0) > 0 || (seasonalData.stats.totalRuns ?? 0) > 0
    )

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
                    <AlertTitle>Failed to load guild data</AlertTitle>
                    <AlertDescription>{guildData.error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    const heroDescription =
        activeTab === 'weekly'
            ? 'Weekly reset performance from Battle.net for the current lockout period.'
            : activeTab === 'rio'
              ? 'Raider.io enrichment rankings from guild sync.'
              : 'Mythic+ statistics from Battle.net and Raider.io enrichment.'

    return (
        <PageShell>
            <PageHero
                chip="Mythic+ Season Analytics"
                chipColor={colors.warning}
                gradientColor={colors.warning}
                title="M+ Rankings"
                description={heroDescription}
                badges={[{ label: 'Keystone rankings', icon: Key, color: colors.warning }]}
            />
            <PageContent className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="weekly">Weekly Recap</TabsTrigger>
                        <TabsTrigger value="rio">Raider.io Rankings</TabsTrigger>
                        <TabsTrigger value="stats">Statistics</TabsTrigger>
                        {hasSeasonalStats && (
                            <TabsTrigger value="seasonal">
                                Season Cache{!hasMplusCacheData ? ' (empty)' : ''}
                            </TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="weekly">
                        <MythicPlusBlock data={guildData} name="data" />
                    </TabsContent>

                    <TabsContent value="rio">
                        <EnrichmentMplusLeaderboard />
                    </TabsContent>

                    <TabsContent value="stats">
                        <EnrichmentMplusStats guildData={rosterForStats} />
                    </TabsContent>

                    {hasSeasonalStats && (
                        <TabsContent value="seasonal" className="space-y-6">
                            {seasonalData?.errors?.stats ? (
                                <Alert variant="destructive">
                                    <AlertTitle>Failed to load seasonal cache</AlertTitle>
                                    <AlertDescription>{seasonalData.errors.stats}</AlertDescription>
                                </Alert>
                            ) : (
                                <>
                                    <SeasonalStatistics
                                        data={seasonalData.stats}
                                        guildData={guildData}
                                    />
                                    <SeasonalLeaderboard
                                        data={seasonalData.stats}
                                        leaderboardData={seasonalData.leaderboard}
                                        guildData={guildData}
                                    />
                                </>
                            )}
                        </TabsContent>
                    )}
                </Tabs>
            </PageContent>
        </PageShell>
    )
}

export default MPlus
