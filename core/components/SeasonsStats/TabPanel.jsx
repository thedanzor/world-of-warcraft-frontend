import React from 'react'
import SeasonsGoalsSection from './SeasonsGoalsSection'
import MythicPlusSection from './MythicPlusSection'
import RaidingEnvironmentSection from './RaidingEnvironmentSection'
import RoleDistributionSection from './RoleDistributionSection'
import SeasonsRosterTable from './SeasonsRosterTable'
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
        <SeasonsRosterTable
            signups={data}
            guildData={guildData}
            title={title}
            description={description}
        />
        <SeasonsGoalsSection stats={stats} />
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