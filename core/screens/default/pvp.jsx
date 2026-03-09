/**
 * RATED PVP SCREEN
 * 
 * This screen displays rated PvP performance statistics, ratings, and leaderboards
 * for guild members. It provides insights into PvP performance and competitive rankings.
 * 
 * WHAT THIS DOES:
 * - Shows rated PvP ratings and rankings for guild members
 * - Displays PvP performance statistics and leaderboards
 * - Integrates with guild data to show current PvP standings
 * - Provides timestamp information for last data update
 * - Uses RatingBlock component for consistent data display
 * 
 * KEY FEATURES:
 * - PvP rating leaderboards and rankings
 * - Performance statistics and comparisons
 * - Last audit timestamp display
 * - Responsive layout with proper typography
 * - Integration with guild audit system
 * 
 * DATA DISPLAY:
 * - PvP ratings and rankings
 * - Player performance comparisons
 * - Historical performance tracking
 * - Guild-wide PvP statistics
 * - Arena and battleground performance
 * 
 * COMPONENT INTEGRATION:
 * - Uses PvpBlock (RatingBlock) for data display
 * - Integrates with guild data system
 * - Consistent styling with other audit screens
 * - Error handling and loading states
 * 
 * LAYOUT STRUCTURE:
 * - Header with title and timestamp
 * - Main content area with PvP data
 * - Responsive design for different screen sizes
 * - Consistent typography and spacing
 * 
 * PVP CONTENT:
 * - Arena ratings and rankings
 * - Battleground performance
 * - PvP gear and progression
 * - Competitive statistics
 * 
 * USAGE:
 * Primary tool for guild members to track PvP performance.
 * Essential for PvP-focused players and team leaders.
 * 
 * MODIFICATION NOTES:
 * - Ensure PvP data is properly formatted
 * - Test responsive design on various devices
 * - Consider adding filtering and sorting options
 * - Validate timestamp display accuracy
 * - Consider adding PvP-specific metrics
 */

'use client'

// React
import React from 'react'

// Shadcn UI components
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'

// Internal components
import PvpBlock from '@/core/modules/RatingBlock'

// Styles

/**
 * PVP - Rated PvP leaderboard and statistics display
 * Shows PvP ratings and rankings for guild members
 */
const PVP = ({ auditable, guildData }) => {
    // Handle loading and error states
    if (!guildData) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Spinner size="lg" />
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

    //
    // Render
    return (
        <section className="guildAudit">
            <>
                <div className={`bodyContent sidebarclosed`}>
                    <div className="mainContent">
                        <div
                            className="logoHolder"
                            style={{ marginTop: '40px', padding: '0 16px' }}
                        >
                            <h2 className="text-4xl font-bold capitalize text-left mb-2">
                                Rated PVP
                            </h2>
                            <p className="text-muted-foreground text-left mb-8">
                                Last audit ran{' '}
                                {guildData.timestamp ? new Date(guildData.timestamp).toLocaleString() : 'Unknown'}
                            </p>
                        </div>
                        <div>
                            <PvpBlock data={guildData} name="data" type="pvp" />
                        </div>
                    </div>
                </div>
            </>
        </section>
    )
}

export default PVP
