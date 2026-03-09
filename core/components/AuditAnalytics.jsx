'use client'

import React, { useMemo } from 'react'
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import {
    Shield, HeartPulse, Swords, Sparkles, Lock, Unlock,
    Flame, Zap, Skull, User, Brain, Eye, Wand2, Scissors, Cross, HelpCircle,
} from 'lucide-react'
import { calculateRaidBuffs } from '@/core/utils/raidBuffs'

/* ─── colour map ──────────────────────────────────────────────── */
const CLASS_COLORS = {
    Warrior: '#C79C6E', Paladin: '#F58CBA', Hunter: '#ABD473',
    Rogue: '#FFF569', Priest: '#AAAAAA', 'Death Knight': '#C41E3A',
    Shaman: '#0070DE', Mage: '#69CCF0', Warlock: '#9482C9',
    Monk: '#00FF96', Druid: '#FF7D0A', 'Demon Hunter': '#A330C9',
    Evoker: '#33937F',
}

const BUFF_ICON_MAP = {
    intellect: Flame, attackPower: Shield, stamina: Cross,
    bloodlust: Zap, combatRes: Skull, magicDamage: Eye,
    physicalDamage: Scissors, versatility: Wand2, movementSpeed: User,
    devotionAura: Shield, darkness: Eye, rallyingCry: Shield,
    innervate: Wand2, portalAndCookies: Brain, massDispel: Cross,
    deathGrip: Skull, blessings: Shield, skyfuryWindfury: Zap,
    bossDamageReduction: Scissors, spellwarding: Shield,
}

const formatBuffName = (buff) =>
    buff.split(/(?=[A-Z])/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

/* ─── shared tooltip ─────────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-lg border border-border/50 bg-popover px-3 py-2 text-sm shadow-md">
            {label && <p className="font-semibold mb-0.5">{label}</p>}
            <p className="font-semibold">{payload[0].name || payload[0].dataKey}</p>
            <p className="text-muted-foreground">{payload[0].value} players</p>
        </div>
    )
}

/* ─── small section wrapper ─────────────────────────────────── */
const Section = ({ title, subtitle, children }) => (
    <div className="space-y-4">
        <div>
            <h3 className="text-base font-semibold tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {children}
    </div>
)

/* ─── donut stat ─────────────────────────────────────────────── */
const DonutWithBars = ({ chartData, bars }) => {
    const total = chartData.reduce((s, d) => s + d.value, 0)
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/50 bg-card shadow-sm p-5">
                {total > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%"
                                innerRadius={55} outerRadius={80}
                                paddingAngle={3} dataKey="value">
                                {chartData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} stroke="transparent" />
                                ))}
                            </Pie>
                            <Tooltip content={<ChartTooltip />} />
                            <Legend formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-10">No data</p>
                )}
            </div>
            <div className="grid grid-cols-1 gap-3">
                {bars.map(({ label, value, color, sub, icon: Icon }) => {
                    const pct = total > 0 ? Math.round((value / total) * 100) : 0
                    return (
                        <div key={label} className="flex items-center gap-4 rounded-xl border border-border/50 bg-card shadow-sm p-4">
                            {Icon && (
                                <div className="p-2.5 rounded-lg shrink-0" style={{ backgroundColor: `${color}18` }}>
                                    <Icon className="w-4 h-4" style={{ color }} />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline justify-between mb-1.5">
                                    <p className="text-sm font-semibold">{label}</p>
                                    <p className="text-2xl font-bold ml-2 shrink-0" style={{ color }}>{value}</p>
                                </div>
                                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full rounded-full transition-all"
                                        style={{ width: `${pct}%`, backgroundColor: color }} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {pct}%{sub ? ` · ${sub}` : ''}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

/* ─── main component ─────────────────────────────────────────── */
const AuditAnalytics = ({ players }) => {
    const stats = useMemo(() => {
        if (!players?.length) return null

        /* roles */
        const tanks   = players.filter(p => p.metaData?.role === 'tank').length
        const healers = players.filter(p => p.metaData?.role === 'healer').length
        const dps     = players.filter(p => p.metaData?.role === 'dps').length

        /* enchants */
        const missingEnchants = players.filter(p => p.missingEnchants?.length > 0).length
        const hasEnchants = players.length - missingEnchants

        /* lockouts */
        const anyLocked = players.filter(p => {
            const l = p.lockStatus?.lockedTo
            return l && Object.values(l).some(s => s.completed > 0)
        }).length
        const unlocked = players.length - anyLocked

        /* class counts */
        const classCounts = {}
        players.forEach(p => {
            if (p.class) classCounts[p.class] = (classCounts[p.class] || 0) + 1
        })
        const classData = Object.entries(classCounts)
            .map(([name, value]) => ({
                name,
                shortName: name.replace('Death Knight', 'DK').replace('Demon Hunter', 'DH'),
                value,
                color: CLASS_COLORS[name] || '#888',
            }))
            .sort((a, b) => b.value - a.value)

        /* raid buffs */
        const raidBuffs = calculateRaidBuffs(
            players.map(p => ({ metaData: { class: p.class, primary_role: p.metaData?.role } }))
        )

        return { tanks, healers, dps, missingEnchants, hasEnchants, anyLocked, unlocked, classData, raidBuffs, total: players.length }
    }, [players])

    if (!stats) return null

    const rolePieData = [
        { name: 'Tanks', value: stats.tanks, color: '#10b981' },
        { name: 'Healers', value: stats.healers, color: '#3b82f6' },
        { name: 'DPS', value: stats.dps, color: '#ef4444' },
    ].filter(d => d.value > 0)

    const enchantPieData = [
        { name: 'Ready', value: stats.hasEnchants, color: '#10b981' },
        { name: 'Missing Enchants', value: stats.missingEnchants, color: '#ef4444' },
    ].filter(d => d.value > 0)

    const lockPieData = [
        { name: 'Unlocked', value: stats.unlocked, color: '#10b981' },
        { name: 'Locked', value: stats.anyLocked, color: '#f59e0b' },
    ].filter(d => d.value > 0)

    const buffEntries = Object.entries(stats.raidBuffs)
    const coveredCount = buffEntries.filter(([, v]) => v > 0).length

    return (
        <div className="rounded-xl border border-border/50 bg-card/50 shadow-sm divide-y divide-border/30">
            <div className="px-5 py-4">
                <p className="text-sm font-semibold">Analytics</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stats.total} characters in current view</p>
            </div>

            <div className="p-5 grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* 1. Role distribution */}
                <Section title="Role Distribution" subtitle="Tanks, healers, and DPS breakdown">
                    <DonutWithBars
                        chartData={rolePieData}
                        bars={[
                            { label: 'Tanks', value: stats.tanks, color: '#10b981', icon: Shield },
                            { label: 'Healers', value: stats.healers, color: '#3b82f6', icon: HeartPulse },
                            { label: 'DPS', value: stats.dps, color: '#ef4444', icon: Swords },
                        ]}
                    />
                </Section>

                {/* 2. Enchant readiness */}
                <Section title="Enchant Readiness" subtitle="Players fully enchanted vs. missing enchants">
                    <DonutWithBars
                        chartData={enchantPieData}
                        bars={[
                            { label: 'Fully Enchanted', value: stats.hasEnchants, color: '#10b981', icon: Sparkles },
                            { label: 'Missing Enchants', value: stats.missingEnchants, color: '#ef4444', icon: Sparkles, sub: `${Math.round((stats.missingEnchants / stats.total) * 100)}% need attention` },
                        ]}
                    />
                </Section>

                {/* 3. Lockout status */}
                <Section title="Raid Lockout Status" subtitle="Players locked to current raid vs. available">
                    <DonutWithBars
                        chartData={lockPieData}
                        bars={[
                            { label: 'Available', value: stats.unlocked, color: '#10b981', icon: Unlock },
                            { label: 'Has Lockout', value: stats.anyLocked, color: '#f59e0b', icon: Lock },
                        ]}
                    />
                </Section>

                {/* 4. Class distribution */}
                <Section title="Class Distribution" subtitle="Guild composition by class">
                    <div className="rounded-xl border border-border/50 bg-card shadow-sm p-5">
                        {stats.classData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={stats.classData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="shortName"
                                        tick={{ fontSize: 10, fill: 'hsl(240 5% 65%)' }}
                                        axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: 'hsl(240 5% 65%)' }}
                                        axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={36}>
                                        {stats.classData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-10">No data</p>
                        )}
                    </div>
                    {/* Class pill grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-3">
                        {stats.classData.map(({ name, shortName, value, color }) => (
                            <div key={name}
                                className="flex items-center gap-2 rounded-lg border border-border/40 bg-card p-2.5">
                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                <div className="min-w-0">
                                    <p className="text-xs font-medium truncate" style={{ color }}>{shortName}</p>
                                    <p className="text-base font-bold text-foreground leading-none mt-0.5">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>

            {/* 5. Raid buffs */}
            <div className="p-5 space-y-4">
                <div className="flex items-baseline justify-between">
                    <div>
                        <h3 className="text-base font-semibold tracking-tight">Raid Buffs &amp; Utilities</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Coverage from current filtered roster</p>
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">
                        {coveredCount}/{buffEntries.length} covered
                    </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                    {buffEntries.map(([buff, count]) => {
                        const Icon = BUFF_ICON_MAP[buff] || HelpCircle
                        const has = count > 0
                        return (
                            <div key={buff}
                                className={`flex items-center gap-2.5 rounded-lg border p-3 transition-opacity ${
                                    has ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-border/30 bg-muted/10 opacity-50'
                                }`}>
                                <Icon className={`w-4 h-4 shrink-0 ${has ? 'text-emerald-400' : 'text-muted-foreground'}`} />
                                <div className="min-w-0">
                                    <p className="text-xs font-medium truncate">{formatBuffName(buff)}</p>
                                    <p className={`text-xs ${has ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                                        {has ? `×${count}` : 'Missing'}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default AuditAnalytics
