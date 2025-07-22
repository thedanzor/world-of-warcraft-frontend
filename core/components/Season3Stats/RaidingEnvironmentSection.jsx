import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TimelapseIcon from '@mui/icons-material/Timelapse'
import BalanceIcon from '@mui/icons-material/Balance'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import RoleStatCard from './RoleStatCard'

const RaidingEnvironmentSection = ({ stats }) => {
    // Check if raidingEnvCounts exists, if not, don't render this section
    if (!stats.raidingEnvCounts) {
        return null;
    }

    return (
        <>
            <Typography variant="h2" sx={{ fontSize: '1.5rem', my: 3 }}>
                Raiding Environment
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <RoleStatCard
                        title="Progression Focused"
                        count={
                            stats.raidingEnvCounts['Progression as a primary goal'] || 0
                        }
                        description="Primary goal is progression"
                        icon={TimelapseIcon}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <RoleStatCard
                        title="Balanced"
                        count={
                            stats.raidingEnvCounts[
                                'Progression and fun in equal balance'
                            ] || 0
                        }
                        description="Balance of fun and progression"
                        icon={BalanceIcon}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <RoleStatCard
                        title="Fun Focus"
                        count={
                            stats.raidingEnvCounts[
                                'Looking for fun, low stress environment'
                            ] || 0
                        }
                        description="Low stress environment"
                        icon={SentimentSatisfiedAltIcon}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <RoleStatCard
                        title="Other"
                        count={stats.raidingEnvCounts['Other'] || 0}
                        description="Other preferences"
                        icon={HelpOutlineIcon}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default RaidingEnvironmentSection 