import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import RoleStatCard from './RoleStatCard'

const MythicPlusSection = ({ stats }) => (
    <>
        <Typography variant="h2" sx={{ fontSize: '1.5rem', my: 3 }}>
            Mythic+ Participation
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
                <RoleStatCard
                    title="Want to Push Keys"
                    count={stats.wantToPushKeysCount || 0}
                    description="Players interested in pushing keys"
                    icon={LocalFireDepartmentIcon}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <RoleStatCard
                    title="Not Interested"
                    count={stats.notWantToPushKeysCount || 0}
                    description="Players not interested in keys"
                    icon={HelpOutlineIcon}
                />
            </Grid>
        </Grid>
    </>
)

export default MythicPlusSection 