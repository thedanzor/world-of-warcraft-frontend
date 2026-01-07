/**
 * SEASONS RAID PLANNING SCREEN
 * 
 * This screen manages season raid planning, player signups, and roster analysis
 * for the upcoming raid tier. It provides comprehensive tools for guild officers
 * to plan and organize their raiding team.
 * 
 * WHAT THIS DOES:
 * - Manages season raid signups and player commitments
 * - Shows class distribution and role breakdown for the new season
 * - Displays raid requirements and buff coverage analysis
 * - Provides tabbed interface for different aspects of season planning
 * - Integrates with guild data to show current vs. signed-up players
 * - Calculates raid buffs and team composition optimization
 * 
 * KEY FEATURES:
 * - Season signup form for player commitments
 * - Class distribution analysis and visualization
 * - Role-based roster planning (tanks, healers, DPS)
 * - Raid requirements display and compliance tracking
 * - Mythic+ and raiding environment statistics
 * - Tabbed interface for organized information display
 * 
 * DATA INTEGRATION:
 * - guildData: Current guild roster and player information
 * - seasonsData: Season specific signup and commitment data
 * - Real-time data processing and analysis
 * - Integration with raid buff calculation utilities
 * 
 * TAB INTERFACES:
 * - Overview: General season statistics and signup status
 * - Class Distribution: Visual breakdown of class representation
 * - Role Distribution: Tank/healer/DPS balance analysis
 * - Raid Buffs: Buff coverage and optimization suggestions
 * - Mythic+: Mythic+ performance and goals
 * - Raiding Environment: Raid-specific requirements and setup
 * 
 * SIGNUP SYSTEM:
 * - Player commitment tracking for seasons
 * - Character name validation and cleanup
 * - Return-to-raid status tracking
 * - Integration with guild roster data
 * 
 * USAGE:
 * Primary tool for season raid planning and player management.
 * Essential for guild officers preparing for new content.
 * 
 * MODIFICATION NOTES:
 * - Ensure signup data validation is robust
 * - Test class and role detection logic thoroughly
 * - Consider adding export functionality for raid planning
 * - Validate character name matching with guild data
 */

'use client'
import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import AddIcon from '@mui/icons-material/Add'

import RaidRequirements from '@/core/components/RaidRequirements'
import TabPanel from '@/core/components/SeasonsStats/TabPanel'
import SignUpForm from '@/core/components/SeasonsSignUp/SignUpForm'
import { classIcons, classColors } from '@/core/components/SeasonsStats/constants'
import { calculateRaidBuffs } from '@/core/utils/raidBuffs'
import { clientApi } from '@/lib/clientApi'
import { useConfig } from '@/core/hooks/useConfig'

// Main Seasons Component
const SeasonsSection = ({ guildData, seasonsData }) => {
    const { config } = useConfig()
    const [tabValue, setTabValue] = useState(0)
    const [signUpOpen, setSignUpOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    // Get configurable content from settings
    const seasonTitle = config?.SEASON_TITLE || 'Current Season'
    const seasonPageTitle = config?.SEASON_PAGE_TITLE || seasonTitle
    const seasonPageDescription = config?.SEASON_PAGE_DESCRIPTION || 'Information about the upcoming season, based on the form the members have filled out.'
    const seasonSignupButtonText = config?.SEASON_SIGNUP_BUTTON_TEXT || `Sign Up for ${seasonTitle}`
    const seasonSignupSuccessMessage = config?.SEASON_SIGNUP_SUCCESS_MESSAGE || `Successfully signed up for ${seasonTitle}!`
    const seasonRosterTableTitle = config?.SEASON_ROSTER_TABLE_TITLE || 'Registered Applications'
    const seasonRosterTableDescription = config?.SEASON_ROSTER_TABLE_DESCRIPTION || 'Registered Applications are players who are looking to continue raiding, this doesn\'t however *yet* mean that they have secured a spot.'

    // Handle case where guildData might be null
    const safeGuildData = guildData?.data || []
    const safeSeasonsData = seasonsData || []

    const handleSignUpSubmit = async (formData) => {
        setLoading(true)
        setError('')
        
        try {
            const result = await clientApi.submitSeasonsSignup(formData)

            if(result.success) {
                setSuccessMessage(seasonSignupSuccessMessage)
                setSignUpOpen(false)
                // Force a page refresh to show the new signup
                setTimeout(() => {
                    window.location.reload()
                }, 1500)
            } else {
                setError(result.message)
            }
        } catch (error) {
            console.error('Error submitting sign-up:', error)
            setError(error.message || 'Failed to sign up. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const getRoleFromSpec = (spec) => {
        const tankSpecs = ['Protection', 'Blood', 'Guardian', 'Brewmaster', 'Vengeance']
        const healerSpecs = ['Holy', 'Discipline', 'Restoration', 'Mistweaver', 'Preservation']
        
        if (tankSpecs.includes(spec)) return 'Tank'
        if (healerSpecs.includes(spec)) return 'Healer'
        return 'DPS'
    }

    // Update headCells for seasons data
    const headCells = [
        { id: 'ilvl', label: 'ILVL' },
        { id: 'name', label: 'Name' },
        { id: 'spec', label: 'Spec' },
        { id: 'nextSeasonClass', label: 'Next Season Class' },
        { id: 'primaryRole', label: 'Primary Role' },
        { id: 'secondaryRole', label: 'Secondary Role' },
        { id: 'guildRank', label: 'Guild Rank' },
        { id: 'mplus', label: 'M+ Score' },
        { id: 'pvp', label: 'PVP Rating' },
        { id: 'seasonGoal', label: `${seasonTitle} Goal` },
        { id: 'wantToPushKeys', label: 'Push Keys' },
    ];

    // Calculate statistics for active dataset
    const getActiveData = (tabValue) => {
        // Use seasons signup data directly instead of processed guild data
        const activeData = safeSeasonsData

        // Role counts calculation
        const roleCounts = activeData.reduce(
            (acc, player) => {
                if (player.mainSpec) {
                    const role = getRoleFromSpec(player.mainSpec)
                    if (role === 'Tank') acc.tanks++
                    else if (role === 'Healer') acc.healers++
                    else if (role === 'DPS') acc.dps++
                }
                return acc
            },
            { tanks: 0, healers: 0, dps: 0 }
        )
        
        // Backup role counts calculation
        const backupRoleCounts = activeData.reduce(
            (acc, player) => {
                if (player.offSpec) {
                    const role = getRoleFromSpec(player.offSpec)
                    if (role === 'Tank') acc.tanks++
                    else if (role === 'Healer') acc.healers++
                    else if (role === 'DPS') acc.dps++
                }
                return acc
            },
            { tanks: 0, healers: 0, dps: 0 }
        )

        // Calculate class counts for active dataset
        const classCounts = Object.keys(classIcons).map((className) => ({
            name: className,
            count: activeData.filter((p) => p.characterClass === className)
                .length,
        }))

        // Calculate raid buffs for active dataset
        const raidBuffs = calculateRaidBuffs(
            activeData.map((player) => ({
                metaData: {
                    class: player.characterClass,
                    primary_role: getRoleFromSpec(player.mainSpec),
                },
            }))
        )

        // Season goal counts (support both old and new field names)
        const seasonGoalCounts = activeData.reduce((acc, player) => {
            const goal = player.seasonGoal || player.season3Goal
            if (goal) {
                acc[goal] = (acc[goal] || 0) + 1
            }
            return acc
        }, {})

        // Mythic+ key pushing counts
        const wantToPushKeysCount = activeData.filter(player => player.wantToPushKeys).length
        const notWantToPushKeysCount = activeData.filter(player => !player.wantToPushKeys).length

        const result = {
            roleCounts,
            backupRoleCounts,
            classCounts,
            raidBuffs,
            seasonGoalCounts,
            season3GoalCounts: seasonGoalCounts, // Legacy support
            wantToPushKeysCount,
            notWantToPushKeysCount,
        }
        
        return result
    }

    const activeStats = getActiveData(tabValue)

    return (
        <section className="dashboard">
            <>
                <Box sx={{ padding: { xs: '0 8px', sm: '0 16px' }, pb: 8 }}>
                    {/* Header */}
                    <div className="logoHolder" style={{ marginTop: '40px' }}>
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                textTransform: 'capitalize !important',
                                textAlign: 'left',
                                fontSize: { xs: '1.75rem', sm: '2rem' },
                            }}
                        >
                            {seasonPageTitle}
                        </Typography>
                        <Typography
                            variant="p"
                            component="p"
                            color="text.secondary"
                            sx={{ mb: 2, textAlign: 'left' }}
                        >
                            {seasonPageDescription}
                        </Typography>
                        
                        {/* Sign Up Button */}
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => setSignUpOpen(true)}
                            sx={{ 
                                mb: 3,
                                px: 3,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                borderRadius: 0.5,
                                textTransform: 'none',
                                backgroundColor: '#153034',
                                color: '#ffffff',
                                '&:hover': {
                                    backgroundColor: '#1a3d42',
                                    transform: 'translateY(-1px)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {seasonSignupButtonText}
                        </Button>
                    </div>

                    {/* Tabs */}
                    <Box sx={{ width: '100%', mb: 4 }}>

                        {/* Tab Panels */}
                        <div role="tabpanel" hidden={tabValue !== 0}>
                            {tabValue === 0 && (
                                <TabPanel
                                    data={safeSeasonsData}
                                    stats={activeStats}
                                    totalClassCounts={activeStats.classCounts}
                                    headCells={headCells}
                                    title={seasonRosterTableTitle}
                                    description={seasonRosterTableDescription}
                                    classIcons={classIcons}
                                    guildData={safeGuildData}
                                />
                            )}
                        </div>

                        <div role="tabpanel" hidden={tabValue !== 2}>
                            {tabValue === 2 && <RaidRequirements />}
                        </div>
                    </Box>
                </Box>

                {/* Sign Up Form Dialog */}
                <SignUpForm
                    open={signUpOpen}
                    onClose={() => setSignUpOpen(false)}
                    onSubmit={handleSignUpSubmit}
                    loading={loading}
                    error={error}
                    guildData={safeGuildData}
                />

                {/* Success Message */}
                <Snackbar
                    open={!!successMessage}
                    autoHideDuration={6000}
                    onClose={() => setSuccessMessage('')}
                >
                    <Alert 
                        onClose={() => setSuccessMessage('')} 
                        severity="success"
                    >
                        {successMessage} - It may take a few minutes for the application to be processed.
                    </Alert>
                </Snackbar>
            </>
        </section>
    )
}

export default SeasonsSection
