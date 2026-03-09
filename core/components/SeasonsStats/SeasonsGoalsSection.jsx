import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Trophy, Star, Users } from 'lucide-react'

const GOALS = [
    { key: 'CE', label: 'Cutting Edge', color: '#eab308', icon: Trophy, desc: 'Full mythic clear' },
    { key: 'AOTC', label: 'AOTC', color: '#a855f7', icon: Star, desc: 'Ahead of the Curve' },
    { key: 'Social', label: 'Social', color: '#6b7280', icon: Users, desc: 'Casual raiding' },
]

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-border/50 bg-popover px-3 py-2 text-sm shadow-md">
                <p className="font-semibold">{payload[0].name}</p>
                <p className="text-muted-foreground">{payload[0].value} players</p>
            </div>
        )
    }
    return null
}

const SeasonsGoalsSection = ({ stats }) => {
    const goalCounts = stats.seasonGoalCounts || stats.season3GoalCounts || {}
    const data = GOALS.map(g => ({
        name: g.label,
        value: goalCounts[g.key] || 0,
        color: g.color,
    })).filter(d => d.value > 0)

    const total = data.reduce((s, d) => s + d.value, 0)

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold tracking-tight">Season Goals</h3>
                <p className="text-sm text-muted-foreground mt-0.5">What players are aiming for this season</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chart */}
                <div className="rounded-xl border border-border/50 bg-card shadow-sm p-5">
                    {total > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} stroke="transparent" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-10">No sign-ups yet</p>
                    )}
                </div>

                {/* Goal cards */}
                <div className="grid grid-cols-1 gap-3">
                    {GOALS.map(({ key, label, color, icon: Icon, desc }) => {
                        const count = goalCounts[key] || 0
                        const pct = total > 0 ? Math.round((count / total) * 100) : 0

                        return (
                            <div key={key} className="flex items-center gap-4 rounded-xl border border-border/50 bg-card shadow-sm p-4">
                                <div className="p-2.5 rounded-lg shrink-0" style={{ backgroundColor: `${color}18` }}>
                                    <Icon className="w-4 h-4" style={{ color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline justify-between mb-1.5">
                                        <div>
                                            <p className="text-sm font-semibold">{label}</p>
                                            <p className="text-xs text-muted-foreground">{desc}</p>
                                        </div>
                                        <p className="text-2xl font-bold ml-2 shrink-0" style={{ color }}>{count}</p>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{ width: `${pct}%`, backgroundColor: color }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{pct}% of sign-ups</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default SeasonsGoalsSection
