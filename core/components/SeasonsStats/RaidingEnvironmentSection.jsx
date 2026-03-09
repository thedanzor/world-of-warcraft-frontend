import React from 'react'
import { Timer, Scale, Smile, HelpCircle } from 'lucide-react'
import RoleStatCard from './RoleStatCard'

const RaidingEnvironmentSection = ({ stats }) => {
    // Check if raidingEnvCounts exists, if not, don't render this section
    if (!stats.raidingEnvCounts) {
        return null;
    }

    return (
        <>
            <h2 className="text-2xl font-semibold my-6">
                Raiding Environment
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <RoleStatCard
                    title="Progression Focused"
                    count={
                        stats.raidingEnvCounts['Progression as a primary goal'] || 0
                    }
                    description="Primary goal is progression"
                    icon={Timer}
                />
                <RoleStatCard
                    title="Balanced"
                    count={
                        stats.raidingEnvCounts[
                            'Progression and fun in equal balance'
                        ] || 0
                    }
                    description="Balance of fun and progression"
                    icon={Scale}
                />
                <RoleStatCard
                    title="Fun Focus"
                    count={
                        stats.raidingEnvCounts[
                            'Looking for fun, low stress environment'
                        ] || 0
                    }
                    description="Low stress environment"
                    icon={Smile}
                />
                <RoleStatCard
                    title="Other"
                    count={stats.raidingEnvCounts['Other'] || 0}
                    description="Other preferences"
                    icon={HelpCircle}
                />
            </div>
        </>
    )
}

export default RaidingEnvironmentSection
