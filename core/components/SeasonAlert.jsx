'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useConfig } from '@/core/hooks/useConfig'
import { InfoIcon, X } from 'lucide-react'

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

    if (!seasonAlertEnabled || !showSeasonAlert) {
        return null
    }

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 sm:px-0">
            <Alert className="bg-background shadow-lg border-primary/20 flex items-start">
                <InfoIcon className="h-4 w-4 mt-1 mr-3 text-primary" />
                <div className="flex-1">
                    <AlertTitle className="font-semibold">
                        {seasonAlertTitle}
                    </AlertTitle>
                    <AlertDescription className="text-sm text-muted-foreground mt-1">
                        {seasonAlertMessage}
                    </AlertDescription>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 ml-2 shrink-0 rounded-full" 
                    onClick={handleCloseAlert}
                >
                    <X className="h-4 w-4" />
                </Button>
            </Alert>
        </div>
    )
}
