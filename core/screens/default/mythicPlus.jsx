/**
 * MYTHIC+ DUNGEON SCREEN
 * 
 * This screen displays Mythic+ dungeon performance statistics, rankings, and leaderboards
 * for guild members. It provides insights into dungeon performance and competitive rankings.
 * 
 * WHAT THIS DOES:
 * - Shows Mythic+ dungeon scores and rankings for guild members
 * - Displays performance statistics and leaderboards
 * - Integrates with guild data to show current Mythic+ standings
 * - Provides timestamp information for last data update
 * - Uses RatingBlock component for consistent data display
 * 
 * KEY FEATURES:
 * - Mythic+ score leaderboards and rankings
 * - Performance statistics and comparisons
 * - Last audit timestamp display
 * - Responsive layout with proper typography
 * - Integration with guild audit system
 * 
 * DATA DISPLAY:
 * - Mythic+ scores and rankings
 * - Player performance comparisons
 * - Historical performance tracking
 * - Guild-wide Mythic+ statistics
 * 
 * COMPONENT INTEGRATION:
 * - Uses MPlusBlock (RatingBlock) for data display
 * - Integrates with guild data system
 * - Consistent styling with other audit screens
 * - Error handling and loading states
 * 
 * LAYOUT STRUCTURE:
 * - Header with title and timestamp
 * - Main content area with Mythic+ data
 * - Responsive design for different screen sizes
 * - Consistent typography and spacing
 * 
 * USAGE:
 * Primary tool for guild members to track Mythic+ performance.
 * Essential for competitive players and raid leaders.
 * 
 * MODIFICATION NOTES:
 * - Ensure Mythic+ data is properly formatted
 * - Test responsive design on various devices
 * - Consider adding filtering and sorting options
 * - Validate timestamp display accuracy
 */

'use client'

// React
import React, { useState } from 'react'

// Shadcn components
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

// Internal components
import MythicPlusBlock from '@/core/modules/MythicPlusBlock'
import SeasonalLeaderboard from '@/core/modules/SeasonalLeaderboard'
import SeasonalStatistics from '@/core/modules/SeasonalStatistics'
import PageHero from '@/core/components/PageHero'
import { PageShell, PageContent } from '@/core/components/PageShell'
import { colors } from '@/core/theme'
import { Key } from 'lucide-react'

// Styles

/**
 * MPlus - Mythic+ dungeon leaderboard and statistics display
 * Shows Mythic+ scores and rankings for guild members in a detailed table format
 * with individual dungeon scores displayed as columns
 */
const MPlus = ({ auditable, guildData, seasonalData }) => {
    const [activeTab, setActiveTab] = useState('0')

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

    return (
        <PageShell>
            <PageHero
                chip="Mythic+ Season Analytics"
                chipColor={colors.warning}
                gradientColor={colors.warning}
                title="M+ Rankings"
                description={
                    activeTab === '0'
                        ? 'Weekly reset performance based on the current lockout period.'
                        : 'Seasonal statistics and leaderboards for the current Mythic+ season.'
                }
                badges={[{ label: 'Keystone rankings', icon: Key, color: colors.warning }]}
            />
            <PageContent className="space-y-6">
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
            >
                <TabsList>
                    <TabsTrigger value="0">Weekly Recap</TabsTrigger>
                    <TabsTrigger value="1">Leaderboard</TabsTrigger>
                    <TabsTrigger value="2">Statistics</TabsTrigger>
                </TabsList>

                <TabsContent value="0">
                    <MythicPlusBlock data={guildData} name="data" />
                </TabsContent>
                <TabsContent value="1">
                    {seasonalData?.errors?.players ? (
                        <Alert variant="destructive">
                            <AlertTitle className="text-md">Failed to load leaderboard</AlertTitle>
                            <AlertDescription className="text-sm">{seasonalData.errors.players}</AlertDescription>
                        </Alert>
                    ) : (
                        <SeasonalLeaderboard
                            data={seasonalData?.stats}
                            leaderboardData={seasonalData?.leaderboard}
                            guildData={guildData}
                        />
                    )}
                </TabsContent>
                <TabsContent value="2">
                    {seasonalData?.errors?.stats ? (
                        <Alert variant="destructive">
                            <AlertTitle className="text-md">Failed to load statistics</AlertTitle>
                            <AlertDescription className="text-sm">{seasonalData.errors.stats}</AlertDescription>
                        </Alert>
                    ) : (
                        <SeasonalStatistics
                            data={seasonalData?.stats}
                            guildData={guildData}
                        />
                    )}
                </TabsContent>
            </Tabs>
            </PageContent>
        </PageShell>
    )
}

export default MPlus
