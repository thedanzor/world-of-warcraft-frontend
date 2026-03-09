import React from 'react'
import StatCard from './StatCard'
import { Shield, HeartPulse, Flame } from 'lucide-react'

const RoleDistribution = ({ tanks, healers, dps }) => (
    <div className="role-distribution grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
            <StatCard
                title="Tanks"
                value={tanks}
                description="Active tank players"
                icon={Shield}
            />
        </div>
        <div>
            <StatCard
                title="Healers"
                value={healers}
                description="Active healer players"
                icon={HeartPulse}
            />
        </div>
        <div>
            <StatCard
                title="DPS"
                value={dps}
                description="Active DPS players"
                icon={Flame}
            />
        </div>
    </div>
)

export default RoleDistribution 