import React from 'react'
import Season3GoalsSection from './Season3GoalsSection'
import MythicPlusSection from './MythicPlusSection'
import RaidingEnvironmentSection from './RaidingEnvironmentSection'
import RoleDistributionSection from './RoleDistributionSection'
import Season3RosterTable from './Season3RosterTable'
import ClassDistributionSection from './ClassDistributionSection'
import RaidBuffsSection from './RaidBuffsSection'

const TabPanel = ({
    data,
    stats,
    totalClassCounts,
    headCells,
    title,
    description,
    classIcons,
    guildData
}) => (
    <>
        <Season3RosterTable
            signups={data}
            guildData={guildData}
            title={title}
            description={description}
        />
        <Season3GoalsSection stats={stats} />
        <MythicPlusSection stats={stats} />
        {/* Only render RaidingEnvironmentSection if raidingEnvCounts exists */}
        {stats.raidingEnvCounts && <RaidingEnvironmentSection stats={stats} />}
        <RoleDistributionSection stats={stats} />
        <ClassDistributionSection
            stats={stats}
            totalCounts={totalClassCounts}
            classIcons={classIcons}
        />
        {/* Only render RaidBuffsSection if raidBuffs exists */}
        {stats.raidBuffs && <RaidBuffsSection stats={stats} />}
    </>
)

export default TabPanel 