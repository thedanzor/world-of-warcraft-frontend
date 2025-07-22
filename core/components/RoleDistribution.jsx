import React from 'react'
import Grid from '@mui/material/Grid'
import StatCard from './StatCard'
import ShieldIcon from '@mui/icons-material/Shield'
import HealingIcon from '@mui/icons-material/Healing'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'

const RoleDistribution = ({ tanks, healers, dps }) => (
    <Grid container spacing={2} className="role-distribution">
        <Grid item xs={12} sm={4}>
            <StatCard
                title="Tanks"
                value={tanks}
                description="Active tank players"
                icon={ShieldIcon}
            />
        </Grid>
        <Grid item xs={12} sm={4}>
            <StatCard
                title="Healers"
                value={healers}
                description="Active healer players"
                icon={HealingIcon}
            />
        </Grid>
        <Grid item xs={12} sm={4}>
            <StatCard
                title="DPS"
                value={dps}
                description="Active DPS players"
                icon={LocalFireDepartmentIcon}
            />
        </Grid>
    </Grid>
)

export default RoleDistribution 