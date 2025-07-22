import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TimelapseIcon from '@mui/icons-material/Timelapse'
import BalanceIcon from '@mui/icons-material/Balance'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'
import RoleStatCard from './RoleStatCard'

const Season3GoalsSection = ({ stats }) => (
    <>
        <Typography variant="h2" sx={{ fontSize: '1.5rem', my: 3 }}>
            Season 3 Goals
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
                <RoleStatCard
                    title="AOTC"
                    count={stats.season3GoalCounts?.['AOTC'] || 0}
                    description="Ahead of the Curve"
                    icon={TimelapseIcon}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <RoleStatCard
                    title="CE"
                    count={stats.season3GoalCounts?.['CE'] || 0}
                    description="Cutting Edge"
                    icon={BalanceIcon}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <RoleStatCard
                    title="Social"
                    count={stats.season3GoalCounts?.['Social'] || 0}
                    description="Social Raiding"
                    icon={SentimentSatisfiedAltIcon}
                />
            </Grid>
        </Grid>
    </>
)

export default Season3GoalsSection 