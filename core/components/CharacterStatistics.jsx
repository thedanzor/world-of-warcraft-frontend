'use client'

import React, { useMemo } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Shield, Zap } from 'lucide-react'

const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-lg border border-border/50 bg-popover px-3 py-2 text-sm shadow-md">
            {label && <p className="font-semibold mb-0.5">{label}</p>}
            <p className="text-muted-foreground">
                {typeof payload[0].value === 'number'
                    ? payload[0].value.toLocaleString(undefined, { maximumFractionDigits: 1 })
                    : payload[0].value}
                {payload[0].unit ? ` ${payload[0].unit}` : ''}
            </p>
        </div>
    )
}

const formatNumber = (value) => {
    if (value == null || Number.isNaN(value)) return '—'
    return Math.round(value).toLocaleString()
}

const formatPercent = (value) => {
    if (value == null || Number.isNaN(value)) return '—'
    return `${value.toFixed(1)}%`
}

/**
 * Displays character statistics from the Blizzard statistics endpoint.
 */
const CharacterStatistics = ({ statistics }) => {
    const secondaryStats = useMemo(() => {
        if (!statistics) return []

        const entries = [
            { name: 'Crit', value: statistics.spell_crit?.value ?? statistics.melee_crit?.value ?? 0 },
            { name: 'Haste', value: statistics.spell_haste?.value ?? statistics.melee_haste?.value ?? 0 },
            { name: 'Mastery', value: statistics.mastery?.value ?? 0 },
            { name: 'Versatility', value: statistics.versatility ?? 0 },
            { name: 'Speed', value: statistics.speed?.rating_bonus ?? 0 },
        ]

        return entries.filter((e) => e.value > 0)
    }, [statistics])

    const primaryStats = useMemo(() => {
        if (!statistics) return []

        const isCaster = (statistics.spell_power ?? 0) > (statistics.attack_power ?? 0)

        return [
            { label: 'Health', value: formatNumber(statistics.health), icon: Shield },
            { label: isCaster ? 'Spell Power' : 'Attack Power', value: formatNumber(isCaster ? statistics.spell_power : statistics.attack_power), icon: Zap },
            { label: 'Stamina', value: formatNumber(statistics.stamina?.effective), icon: Activity },
            { label: 'Armor', value: formatNumber(statistics.armor?.effective), icon: Shield },
            { label: 'Intellect', value: formatNumber(statistics.intellect?.effective), icon: Activity },
            { label: 'Versatility', value: formatPercent(statistics.versatility_damage_done_bonus), icon: Zap },
        ].filter((s) => s.value !== '—' && s.value !== '0')
    }, [statistics])

    const ratingBars = useMemo(() => {
        if (!statistics) return []

        return [
            { stat: 'Crit', rating: statistics.spell_crit?.rating_normalized ?? statistics.melee_crit?.rating_normalized ?? 0, bonus: statistics.spell_crit?.rating_bonus ?? 0 },
            { stat: 'Haste', rating: statistics.spell_haste?.rating_normalized ?? statistics.melee_haste?.rating_normalized ?? 0, bonus: statistics.spell_haste?.rating_bonus ?? 0 },
            { stat: 'Mastery', rating: statistics.mastery?.rating_normalized ?? 0, bonus: statistics.mastery?.rating_bonus ?? 0 },
            { stat: 'Versatility', rating: statistics.versatility ?? 0, bonus: statistics.versatility_damage_done_bonus ?? 0 },
            { stat: 'Avoidance', rating: statistics.avoidance?.rating_normalized ?? 0, bonus: statistics.avoidance?.rating_bonus ?? 0 },
            { stat: 'Leech', rating: statistics.lifesteal?.rating_normalized ?? 0, bonus: statistics.lifesteal?.rating_bonus ?? 0 },
        ].filter((s) => s.rating > 0)
    }, [statistics])

    if (!statistics) return null

    return (
        <div className="space-y-4">
            <Card className="border-border/50 shadow-sm bg-card/80">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        Character Statistics
                        {statistics.power_type?.name && (
                            <span className="text-xs font-normal text-muted-foreground ml-auto">
                                {statistics.power_type.name} · {formatNumber(statistics.power)}
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {primaryStats.map(({ label, value, icon: Icon }) => (
                            <div key={label} className="rounded-lg border border-border/40 bg-muted/20 p-3">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                                    <Icon className="h-3 w-3" />
                                    {label}
                                </div>
                                <p className="text-lg font-bold">{value}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {secondaryStats.length > 0 && (
                    <Card className="border-border/50 shadow-sm bg-card/80">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Secondary Stats</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={260}>
                                <RadarChart data={secondaryStats}>
                                    <PolarGrid stroke="hsl(var(--border))" />
                                    <PolarAngleAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                    <PolarRadiusAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                                    <Radar
                                        name="Value"
                                        dataKey="value"
                                        stroke="hsl(var(--primary))"
                                        fill="hsl(var(--primary))"
                                        fillOpacity={0.35}
                                    />
                                    <Tooltip content={<ChartTooltip />} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {ratingBars.length > 0 && (
                    <Card className="border-border/50 shadow-sm bg-card/80">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Rating Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={ratingBars} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="stat" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                                    <Tooltip content={<ChartTooltip />} />
                                    <Bar dataKey="rating" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}
            </div>

            {(statistics.main_hand_dps > 0 || statistics.dodge?.value > 0) && (
                <Card className="border-border/50 shadow-sm bg-card/80">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Combat Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {statistics.main_hand_dps > 0 && (
                            <div className="rounded-lg border border-border/40 bg-muted/20 p-3">
                                <p className="text-xs text-muted-foreground">Weapon DPS</p>
                                <p className="text-lg font-bold">{statistics.main_hand_dps.toFixed(1)}</p>
                            </div>
                        )}
                        {statistics.dodge?.value > 0 && (
                            <div className="rounded-lg border border-border/40 bg-muted/20 p-3">
                                <p className="text-xs text-muted-foreground">Dodge</p>
                                <p className="text-lg font-bold">{formatPercent(statistics.dodge.value)}</p>
                            </div>
                        )}
                        {statistics.parry?.value > 0 && (
                            <div className="rounded-lg border border-border/40 bg-muted/20 p-3">
                                <p className="text-xs text-muted-foreground">Parry</p>
                                <p className="text-lg font-bold">{formatPercent(statistics.parry.value)}</p>
                            </div>
                        )}
                        {statistics.block?.value > 0 && (
                            <div className="rounded-lg border border-border/40 bg-muted/20 p-3">
                                <p className="text-xs text-muted-foreground">Block</p>
                                <p className="text-lg font-bold">{formatPercent(statistics.block.value)}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default CharacterStatistics
