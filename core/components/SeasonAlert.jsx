'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertTitle, Snackbar } from '@mui/material'
import Typography from '@mui/material/Typography'

/**
 * Season Alert Component
 * 
 * Client-side component that handles the season alert functionality
 * This allows the parent layout to remain a server component
 */
export default function SeasonAlert() {
    const [showSeasonAlert, setShowSeasonAlert] = useState(false)

    useEffect(() => {
        // Check if user has seen the alert using localStorage instead of cookies
        const hasSeenAlert = localStorage.getItem('season2_alert_seen')
        if (!hasSeenAlert) {
            setShowSeasonAlert(true)
        }
    }, [])

    const handleCloseAlert = () => {
        setShowSeasonAlert(false)
        // Store in localStorage instead of setting a cookie
        localStorage.setItem('season2_alert_seen', 'true')
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
                    Season 3
                </AlertTitle>
                <Typography variant="body2">
                    Season 3 applications are now open. With limited spots available 
                    for progression raiding, please submit your application soon to be considered.
                </Typography>
            </Alert>
        </Snackbar>
    )
}
