import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { classColors } from './constants'

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-border/50 bg-popover px-3 py-2 text-sm shadow-md">
                <p className="font-semibold">{label}</p>
                <p className="text-muted-foreground">{payload[0].value} signed up</p>
            </div>
        )
    }
    return null
}

const ClassDistributionSection = ({ stats, totalCounts, classIcons }) => {
    const data = (stats.classCounts || [])
        .filter(c => c.count > 0)
        .sort((a, b) => b.count - a.count)
        .map(c => ({
            name: c.name,
            value: c.count,
            shortName: c.name.replace('Death Knight', 'DK').replace('Demon Hunter', 'DH'),
            color: classColors[c.name] || '#888',
        }))

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold tracking-tight">Class Distribution</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Sign-ups broken down by class</p>
            </div>

            <div className="rounded-xl border border-border/50 bg-card shadow-sm p-5">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <XAxis
                                dataKey="shortName"
                                tick={{ fontSize: 10, fill: 'hsl(240 5% 65%)' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: 'hsl(240 5% 65%)' }}
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={36}>
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-10">No sign-ups yet</p>
                )}
            </div>

            {/* Class pills grid */}
            {data.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {data.map(({ name, value, color }) => {
                        const Icon = classIcons?.[name]
                        return (
                            <div
                                key={name}
                                className="flex items-center gap-2 rounded-lg border border-border/40 bg-card p-3"
                            >
                                {Icon && (
                                    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                                )}
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold truncate" style={{ color }}>
                                        {name.replace('Death Knight', 'DK').replace('Demon Hunter', 'DH')}
                                    </p>
                                    <p className="text-lg font-bold text-foreground leading-none mt-0.5">{value}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default ClassDistributionSection
