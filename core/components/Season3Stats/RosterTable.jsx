import React from 'react'
import Typography from '@mui/material/Typography'
import AuditBlock from '@/core/modules/rosterBlock'

const RosterTable = ({ data, title, description, headCells }) => (
    <>
        <Typography variant="h2" sx={{ fontSize: '1.5rem', my: 2 }}>
            {title}
        </Typography>
        <div>
            <Typography variant="p" sx={{ mb: 1, pb: 1, display: 'block' }}>
                {description}
            </Typography>
        </div>
        <AuditBlock
            data={{ all: data }}
            name="all"
            customHeadCells={headCells}
        />
    </>
)

export default RosterTable 