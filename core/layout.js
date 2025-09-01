'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import config from '@/app.config.js'

// Import all screen SCSS files 
import '@/core/screens/default/scss/dashboard.scss'
import '@/core/screens/default/scss/roster.scss'
import '@/core/screens/default/scss/recruitment.scss'
import '@/core/screens/default/scss/guildAudit.scss'
import '@/core/screens/default/scss/team.scss'
import '@/core/screens/default/scss/peerOverview.scss'
import '@/core/screens/default/scss/header.scss'
import '@/core/screens/default/scss/mrt.scss'
import '@/core/screens/default/scss/activities.scss'
import '@/core/screens/default/scss/pvp.scss'
import '@/core/screens/default/scss/mplus.scss'

// Dynamic import using React.lazy
const ThemeProvider = lazy(() => import(`@/core/themes/${config.THEME}`))

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
        <Suspense fallback={
            <LoadingSpinner 
                message="Loading Application..." 
                minHeight="100vh"
                size={80}
                color="primary"
            />
        }>
            <ThemeProvider>
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
            </ThemeProvider>
        </Suspense>
    )
}
