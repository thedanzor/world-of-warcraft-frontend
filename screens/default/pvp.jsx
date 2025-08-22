'use client'

// React
import React from 'react'

// Material-UI components
import { Typography, Box, Alert, CircularProgress } from '@mui/material'

// Internal components
import PvpBlock from '@/core/modules/RatingBlock'

// Styles
import '@/core/sections/scss/guildAudit.scss'

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
