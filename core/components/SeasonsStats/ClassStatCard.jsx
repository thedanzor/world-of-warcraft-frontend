import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

const ClassStatCard = ({ title, signedCount, totalCount, icon: Icon }) => (
    <Paper sx={{ p: 2, height: '100%', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Icon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                {title}
            </Typography>
        </Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
            {signedCount}/{totalCount}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            Signed up for next season
        </Typography>
    </Paper>
)

export default ClassStatCard 