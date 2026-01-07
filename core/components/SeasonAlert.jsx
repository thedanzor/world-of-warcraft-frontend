'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertTitle, Snackbar } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useConfig } from '@/core/hooks/useConfig'

/**
 * Season Alert Component
 * 
 * Client-side component that handles the season alert functionality
 * This allows the parent layout to remain a server component
 */
export default function SeasonAlert() {
    const { config } = useConfig()
    const [showSeasonAlert, setShowSeasonAlert] = useState(false)

    // Get configurable content from settings
    const seasonTitle = config?.SEASON_TITLE || 'Current Season'
    const seasonAlertTitle = config?.SEASON_ALERT_TITLE || seasonTitle
    const seasonAlertMessage = config?.SEASON_ALERT_MESSAGE || `${seasonTitle} applications are now open. With limited spots available for progression raiding, please submit your application soon to be considered.`
    const seasonAlertEnabled = config?.SEASON_ALERT_ENABLED !== false // Default to true if not set

    useEffect(() => {
        if (!seasonAlertEnabled) {
            setShowSeasonAlert(false)
            return
        }
        
        // Check if user has seen the alert using localStorage instead of cookies
        const alertKey = `season_alert_seen_${seasonTitle.replace(/\s+/g, '_')}`
        const hasSeenAlert = localStorage.getItem(alertKey)
        if (!hasSeenAlert) {
            setShowSeasonAlert(true)
        }
    }, [seasonAlertEnabled, seasonTitle])

    const handleCloseAlert = () => {
        setShowSeasonAlert(false)
        // Store in localStorage instead of setting a cookie
        const alertKey = `season_alert_seen_${seasonTitle.replace(/\s+/g, '_')}`
        localStorage.setItem(alertKey, 'true')
    }

    if (!seasonAlertEnabled) {
        return null
    }

    return (
        <Snackbar
            open={showSeasonAlert}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            className="season-alert-snackbar"
        >
            <Alert 
                onClose={handleCloseAlert}
                severity="info"
                className="season-alert"
            >
                <AlertTitle className="season-alert-title">
                    {seasonAlertTitle}
                </AlertTitle>
                <Typography variant="body2">
                    {seasonAlertMessage}
                </Typography>
            </Alert>
        </Snackbar>
    )
}
