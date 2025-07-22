import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import ClassStatCard from './ClassStatCard'

const ClassDistributionSection = ({ stats, totalCounts, classIcons }) => (
    <>
        <Typography variant="h2" sx={{ fontSize: '1.5rem', my: 3 }}>
            Current Class Distribution
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
            {(stats.classCounts || []).map((classInfo) => (
                <Grid item xs={12} sm={6} md={3} key={classInfo.name}>
                    <ClassStatCard
                        title={classInfo.name}
                        signedCount={classInfo.count || 0}
                        totalCount={
                            totalCounts?.find((c) => c.name === classInfo.name)
                                ?.current || 0
                        }
                        icon={
                            classIcons[classInfo.name] ||
                            LocalFireDepartmentIcon
                        }
                    />
                </Grid>
            ))}
        </Grid>
    </>
)

export default ClassDistributionSection 