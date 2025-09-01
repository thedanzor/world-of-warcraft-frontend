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

// Material-UI components
import { Typography, Box, Alert, CircularProgress } from '@mui/material'

// Internal components
import PvpBlock from '@/core/modules/RatingBlock'

// Styles
import '@/core/screens/default/scss/pvp.scss'
import '@/core/screens/default/scss/guildAudit.scss'

/**
 * PVP - Rated PvP leaderboard and statistics display
 * Shows PvP ratings and rankings for guild members
 */
const PVP = ({ auditable, guildData }) => {
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
                            <Typography
                                variant="h2"
                                component="h2"
                                sx={{
                                    textTransform: 'capitalize !important',
                                    textAlign: 'left',
                                }}
                            >
                                Rated PVP
                            </Typography>
                            <Typography
                                variant="p"
                                component="p"
                                color="text.secondary"
                                sx={{
                                    mb: 4,
                                    textAlign: 'left',
                                }}
                            >
                                Last audit ran{' '}
                                {guildData.timestamp ? new Date(guildData.timestamp).toLocaleString() : 'Unknown'}
                            </Typography>
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
