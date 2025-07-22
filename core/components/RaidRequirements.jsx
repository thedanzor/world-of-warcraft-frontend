import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const RaidRequirements = () => (
    <div>
        <Typography variant="h2" sx={{ fontSize: '1.5rem', my: 3 }}>
            Raid Requirements
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Everything here is subject to change, as we get more information and feedback.
        </Typography>
        
        <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                628 item level or higher is the ideal target
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                Must obtain "Durable Information Securing Container" (waist) and "Reshii Wraps" (cloak)
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                Required to study all posted mechanical breakdowns, videos, and raid summaries
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                All standard raid addons must be installed and configured
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                Pre-check starts at 7:45, pull time at 8:00 sharp - unprepared raiders will be temporarily removed
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                Raid-locking during progression raids is discouraged and may impact future invites
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                All gear must be enchanted for Heroic progression (any level enchants acceptable)
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                Tier gear acquisition strategy TBD - items are harder to obtain but provide significant power increase (normal vs heroic)
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                [Pending Renown System] Maintain relevant raid renown track for buffs and token access
            </Typography>
        </Box>
    </div>
)

export default RaidRequirements 