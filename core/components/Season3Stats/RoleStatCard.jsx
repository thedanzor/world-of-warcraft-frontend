import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

const RoleStatCard = ({
    title,
    count,
    backupCount,
    description,
    icon: Icon,
}) => (
    <Paper sx={{ p: 2, height: '100%', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Icon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                {title}
            </Typography>
        </Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
            {count}
        </Typography>
        {backupCount !== undefined && (
            <Typography variant="body1" sx={{ mb: 1 }}>
                +{backupCount} backup
            </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
            {description}
        </Typography>
    </Paper>
)

export default RoleStatCard 