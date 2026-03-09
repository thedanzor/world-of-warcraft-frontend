import React from 'react'
import AuditBlock from '@/core/modules/rosterBlock'

const RosterTable = ({ data, title, description, headCells }) => (
    <>
        <h2 className="text-2xl font-semibold my-4">
            {title}
        </h2>
        <div>
            <p className="mb-2 pb-2 block">
                {description}
            </p>
        </div>
        <AuditBlock
            data={{ all: data }}
            name="all"
            customHeadCells={headCells}
        />
    </>
)

export default RosterTable
