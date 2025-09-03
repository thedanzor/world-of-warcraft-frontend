/**
 * SEASON 3 RAID PLANNING SCREEN
 * 
 * This screen manages Season 3 raid planning, player signups, and roster analysis
 * for the upcoming raid tier. It provides comprehensive tools for guild officers
 * to plan and organize their Season 3 raiding team.
 * 
 * WHAT THIS DOES:
 * - Manages Season 3 raid signups and player commitments
 * - Shows class distribution and role breakdown for the new season
 * - Displays raid requirements and buff coverage analysis
 * - Provides tabbed interface for different aspects of season planning
 * - Integrates with guild data to show current vs. signed-up players
 * - Calculates raid buffs and team composition optimization
 * 
 * KEY FEATURES:
 * - Season 3 signup form for player commitments
 * - Class distribution analysis and visualization
 * - Role-based roster planning (tanks, healers, DPS)
 * - Raid requirements display and compliance tracking
 * - Mythic+ and raiding environment statistics
 * - Tabbed interface for organized information display
 * 
 * DATA INTEGRATION:
 * - guildData: Current guild roster and player information
 * - season3Data: Season 3 specific signup and commitment data
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
 * - Player commitment tracking for Season 3
 * - Character name validation and cleanup
 * - Return-to-raid status tracking
 * - Integration with guild roster data
 * 
 * USAGE:
 * Primary tool for Season 3 raid planning and player management.
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
import TabPanel from '@/core/components/Season3Stats/TabPanel'
import SignUpForm from '@/core/components/Season3SignUp/SignUpForm'
import { classIcons, classColors } from '@/core/components/Season3Stats/constants'
import { calculateRaidBuffs } from '@/core/utils/raidBuffs'
import { clientApi } from '@/lib/clientApi'

// Main Season 3 Component
const Season3Section = ({ guildData, season3Data }) => {
    const [tabValue, setTabValue] = useState(0)
    const [signUpOpen, setSignUpOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    // Handle case where guildData might be null
    const safeGuildData = guildData?.data || []
    const safeSeason3Data = season3Data || []

    const handleSignUpSubmit = async (formData) => {
        setLoading(true)
        setError('')
        
        try {
            const result = await clientApi.submitSeason3Signup(formData)

            if(result.success) {
                setSuccessMessage('Successfully signed up for Season 3!')
                setSignUpOpen(false)
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

    // Update headCells for Season 3 data
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
        { id: 'season3Goal', label: 'Season 3 Goal' },
        { id: 'wantToPushKeys', label: 'Push Keys' },
    ];

    // Calculate statistics for active dataset
    const getActiveData = (tabValue) => {
        // Use Season 3 signup data directly instead of processed guild data
        const activeData = safeSeason3Data

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

        // Season 3 goal counts
        const season3GoalCounts = activeData.reduce((acc, player) => {
            const goal = player.season3Goal
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
            season3GoalCounts,
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
                            Season 3
                        </Typography>
                        <Typography
                            variant="p"
                            component="p"
                            color="text.secondary"
                            sx={{ mb: 2, textAlign: 'left' }}
                        >
                            Information about the upcoming season, based on the
                            form the members have filled out.
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
                            Sign Up for Season 3
                        </Button>
                    </div>

                    {/* Tabs */}
                    <Box sx={{ width: '100%', mb: 4 }}>

                        {/* Tab Panels */}
                        <div role="tabpanel" hidden={tabValue !== 0}>
                            {tabValue === 0 && (
                                <TabPanel
                                    data={safeSeason3Data}
                                    stats={activeStats}
                                    totalClassCounts={activeStats.classCounts}
                                    headCells={headCells}
                                    title="Registered Applications"
                                    description="Registered Applications are players who are looking to continue raiding in season 3, this doesn't however *yet* mean that they have secured a spot."
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

export default Season3Section
