import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import ShieldIcon from '@mui/icons-material/Shield'
import HealingIcon from '@mui/icons-material/Healing'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import RoleStatCard from './RoleStatCard'

const RoleDistributionSection = ({ stats }) => (
    <>
        <Typography variant="h2" sx={{ fontSize: '1.5rem', my: 3 }}>
            Current Role Distribution
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
                <RoleStatCard
                    title="Tanks"
                    count={stats.roleCounts?.tanks || 0}
                    backupCount={stats.backupRoleCounts?.tanks || 0}
                    description="Signed tank players"
                    icon={ShieldIcon}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <RoleStatCard
                    title="Healers"
                    count={stats.roleCounts?.healers || 0}
                    backupCount={stats.backupRoleCounts?.healers || 0}
                    description="Signed healer players"
                    icon={HealingIcon}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <RoleStatCard
                    title="DPS"
                    count={stats.roleCounts?.dps || 0}
                    backupCount={stats.backupRoleCounts?.dps || 0}
                    description="Signed DPS players"
                    icon={LocalFireDepartmentIcon}
                />
            </Grid>
        </Grid>
    </>
)

export default RoleDistributionSection 