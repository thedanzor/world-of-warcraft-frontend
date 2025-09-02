'use client'

import { useState, useEffect } from 'react'
import config from '@/app.config.js'

// Dynamic theme loader with direct imports
import DynamicThemeLoader from '@/core/dynamicThemeLoader'

// Material UI Components
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Alert, AlertTitle, Snackbar } from '@mui/material'

import { P } from '@/core/components/typography'
import Nav from '@/core/components/nav'
import LoadingSpinner from '@/core/components/LoadingSpinner'

export default function AuditLayout({ children }) {
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
        <DynamicThemeLoader>
            <Box className="layout-root">
                {/* Navigation */}
                <Nav />
                {/* Main content area */}
                <Box className="layout-content">
                    {children}
                    <div className="copyright">
                        <p className="copyright-text">
                            &copy; 2025 Holybarryz (Scott Jones). All rights reserved.
                        </p>
                    </div>
                </Box>
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
            </Box>
        </DynamicThemeLoader>
    )
}
