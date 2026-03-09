import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Shield, HeartPulse, Swords } from 'lucide-react'

const ROLES = [
    { key: 'tanks', label: 'Tanks', color: '#10b981', icon: Shield },
    { key: 'healers', label: 'Healers', color: '#3b82f6', icon: HeartPulse },
    { key: 'dps', label: 'DPS', color: '#ef4444', icon: Swords },
]

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-border/50 bg-popover px-3 py-2 text-sm shadow-md">
                <p className="font-semibold">{payload[0].name}</p>
                <p className="text-muted-foreground">{payload[0].value} signed</p>
            </div>
        )
    }
    return null
}

const RoleDistributionSection = ({ stats }) => {
    const mainData = ROLES.map(r => ({
        name: r.label,
        value: stats.roleCounts?.[r.key] || 0,
        color: r.color,
    })).filter(d => d.value > 0)

    const total = mainData.reduce((s, d) => s + d.value, 0)

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold tracking-tight">Role Distribution</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Primary role sign-ups for the season</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Donut chart */}
                <div className="rounded-xl border border-border/50 bg-card shadow-sm p-5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Primary Roles</p>
                    {total > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={mainData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {mainData.map((entry, index) => (
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

                {/* Role breakdown cards */}
                <div className="grid grid-cols-1 gap-3">
                    {ROLES.map(({ key, label, color, icon: Icon }) => {
                        const main = stats.roleCounts?.[key] || 0
                        const backup = stats.backupRoleCounts?.[key] || 0
                        const pct = total > 0 ? Math.round((main / total) * 100) : 0

                        return (
                            <div key={key} className="flex items-center gap-4 rounded-xl border border-border/50 bg-card shadow-sm p-4">
                                <div className="p-2.5 rounded-lg shrink-0" style={{ backgroundColor: `${color}18` }}>
                                    <Icon className="w-4 h-4" style={{ color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline justify-between mb-1.5">
                                        <p className="text-sm font-semibold">{label}</p>
                                        <p className="text-2xl font-bold" style={{ color }}>{main}</p>
                                    </div>
                                    {/* Progress bar */}
                                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{ width: `${pct}%`, backgroundColor: color }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1.5">{pct}% of total{backup > 0 ? ` · +${backup} backup` : ''}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default RoleDistributionSection
