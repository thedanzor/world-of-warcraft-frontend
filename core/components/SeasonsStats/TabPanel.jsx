import React from 'react'
import { Users, Shield, HeartPulse, Swords } from 'lucide-react'
import SeasonsGoalsSection from './SeasonsGoalsSection'
import MythicPlusSection from './MythicPlusSection'
import RaidingEnvironmentSection from './RaidingEnvironmentSection'
import RoleDistributionSection from './RoleDistributionSection'
import SeasonsRosterTable from './SeasonsRosterTable'
import ClassDistributionSection from './ClassDistributionSection'
import RaidBuffsSection from './RaidBuffsSection'

const SummaryPill = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card shadow-sm px-5 py-4">
        <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: `${color}18` }}>
            <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div>
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
            <p className="text-2xl font-bold leading-none mt-0.5" style={{ color }}>{value}</p>
        </div>
    </div>
)

const Divider = () => <div className="h-px bg-border/30 my-2" />

const TabPanel = ({
    data,
    stats,
    totalClassCounts,
    headCells,
    title,
    description,
    classIcons,
    guildData,
}) => {
    const total = (stats.roleCounts?.tanks || 0) + (stats.roleCounts?.healers || 0) + (stats.roleCounts?.dps || 0)

    return (
        <div className="space-y-8">
            {/* Summary overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <SummaryPill icon={Users} label="Total Sign-ups" value={total} color="#6366f1" />
                <SummaryPill icon={Shield} label="Tanks" value={stats.roleCounts?.tanks || 0} color="#10b981" />
                <SummaryPill icon={HeartPulse} label="Healers" value={stats.roleCounts?.healers || 0} color="#3b82f6" />
                <SummaryPill icon={Swords} label="DPS" value={stats.roleCounts?.dps || 0} color="#ef4444" />
            </div>

            <Divider />

            {/* Goals + M+ */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <SeasonsGoalsSection stats={stats} />
                <MythicPlusSection stats={stats} />
            </div>

            <Divider />

            {/* Role Distribution */}
            <RoleDistributionSection stats={stats} />

            <Divider />

            {/* Class Distribution */}
            <ClassDistributionSection
                stats={stats}
                totalCounts={totalClassCounts}
                classIcons={classIcons}
            />

            {stats.raidingEnvCounts && (
                <>
                    <Divider />
                    <RaidingEnvironmentSection stats={stats} />
                </>
            )}

            {stats.raidBuffs && (
                <>
                    <Divider />
                    <RaidBuffsSection stats={stats} />
                </>
            )}

            <Divider />

            {/* Roster Table */}
            <SeasonsRosterTable
                signups={data}
                guildData={guildData}
                title={title}
                description={description}
            />
        </div>
    )
}

export default TabPanel
