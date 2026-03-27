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
        <section className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight">Mythic+</h2>
                <p className="text-sm text-muted-foreground">
                    {activeTab === '0'
                        ? 'Weekly reset performance based on current lockout period.'
                        : 'Seasonal statistics and leaderboards for the current Mythic+ season.'}
                </p>
            </div>

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
        </section>
    )
}

export default MPlus
