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
import React from 'react'

// Material-UI components
import { Typography, Box, Alert, CircularProgress } from '@mui/material'

// Internal components
import MPlusBlock from '@/core/modules/RatingBlock'

// Styles
import '@/core/screens/default/scss/mplus.scss'
import '@/core/screens/default/scss/guildAudit.scss'

/**
 * MPlus - Mythic+ dungeon leaderboard and statistics display
 * Shows Mythic+ scores and rankings for guild members
 */
const MPlus = ({ auditable, guildData }) => {
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
                                Mythic+
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
                        <div className="">
                            <MPlusBlock
                                data={guildData}
                                name="data"
                                type="mplus"
                            />
                        </div>
                    </div>
                </div>
            </>
        </section>
    )
}

export default MPlus
