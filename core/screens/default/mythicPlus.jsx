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
import React, { useState, useEffect } from 'react'

// Material-UI components
import { Typography, Box, Alert, CircularProgress, Tabs, Tab, Paper } from '@mui/material'

// Internal components
import MythicPlusBlock from '@/core/modules/MythicPlusBlock'
import SeasonalLeaderboard from '@/core/modules/SeasonalLeaderboard'
import SeasonalStatistics from '@/core/modules/SeasonalStatistics'

// Styles
import '@/core/screens/default/scss/mplus.scss'
import '@/core/screens/default/scss/guildAudit.scss'

/**
 * MPlus - Mythic+ dungeon leaderboard and statistics display
 * Shows Mythic+ scores and rankings for guild members in a detailed table format
 * with individual dungeon scores displayed as columns
 */
const MPlus = ({ auditable, guildData, seasonalData }) => {
    const [activeTab, setActiveTab] = useState(0)

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

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

    const renderTabContent = () => {
        switch (activeTab) {
            case 0: // Weekly Recap
                return (
                    <MythicPlusBlock
                        data={guildData}
                        name="data"
                    />
                )
            case 1: // Leaderboard
                if (seasonalData?.errors?.players) {
                    return (
                        <Alert severity="error">
                            <Typography variant="h6">Failed to load leaderboard</Typography>
                            <Typography variant="body2">{seasonalData.errors.players}</Typography>
                        </Alert>
                    )
                }
                return (
                    <SeasonalLeaderboard 
                        data={seasonalData?.stats} 
                        leaderboardData={seasonalData?.leaderboard}
                        guildData={guildData}
                    />
                )
            case 2: // Statistics
                if (seasonalData?.errors?.stats) {
                    return (
                        <Alert severity="error">
                            <Typography variant="h6">Failed to load statistics</Typography>
                            <Typography variant="body2">{seasonalData.errors.stats}</Typography>
                        </Alert>
                    )
                }
                return (
                    <SeasonalStatistics 
                        data={seasonalData?.stats}
                        guildData={guildData}
                    />
                )
            default:
                return null
        }
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
                                {activeTab === 0 
                                    ? "This information is based on each weekly reset."
                                    : "Seasonal statistics and leaderboards for current Mythic+ season."
                                }
                            </Typography>
                        </div>
                        
                        {/* Tabs */}
                        <Paper sx={{ 
                            mb: 3,
                            backgroundColor: 'rgba(17, 17, 17, 0.8)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}>
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                sx={{
                                    '& .MuiTab-root': {
                                        color: '#B0C4DE',
                                        fontWeight: '600',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        '&.Mui-selected': {
                                            color: '#FFFFFF'
                                        }
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: '#FFD700'
                                    }
                                }}
                            >
                                <Tab label="Weekly Recap" />
                                <Tab label="Leaderboard" />
                                <Tab label="Statistics" />
                            </Tabs>
                        </Paper>

                        {/* Tab Content */}
                        <div className="">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </>
        </section>
    )
}

export default MPlus
