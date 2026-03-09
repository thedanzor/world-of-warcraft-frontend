import React from 'react'
import {
    Flame, Shield, Scissors, Cross, Eye, Wand2,
    Zap, Skull, User, Brain, HelpCircle, CheckCircle, XCircle
} from 'lucide-react'

const BUFF_ICON_MAP = {
    intellect: Flame, attackPower: Shield, physicalDamage: Scissors,
    stamina: Cross, devotionAura: Shield, magicDamage: Eye,
    versatility: Wand2, bloodlust: Zap, combatRes: Skull,
    movementSpeed: User, portalAndCookies: Brain, massDispel: Cross,
    innervate: Wand2, deathGrip: Skull, blessings: Shield,
    rallyingCry: Shield, darkness: Eye, skyfuryWindfury: Zap,
    bossDamageReduction: Scissors, spellwarding: Shield,
}

const formatBuffName = (buff) =>
    buff.split(/(?=[A-Z])/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

const RaidBuffsSection = ({ stats }) => {
    if (!stats.raidBuffs) return null

    const entries = Object.entries(stats.raidBuffs)
    const covered = entries.filter(([, v]) => v > 0).length
    const total = entries.length

    return (
        <div className="space-y-4">
            <div className="flex items-baseline justify-between">
                <div>
                    <h3 className="text-lg font-semibold tracking-tight">Raid Buffs &amp; Utilities</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Buff coverage from signed-up players</p>
                </div>
                <span className="text-sm font-semibold text-muted-foreground">
                    {covered}/{total} covered
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {entries.map(([buff, count]) => {
                    const Icon = BUFF_ICON_MAP[buff] || HelpCircle
                    const hasBuff = count > 0
                    return (
                        <div
                            key={buff}
                            className={`flex items-center gap-2.5 rounded-lg border p-3 ${
                                hasBuff
                                    ? 'border-emerald-500/20 bg-emerald-500/5'
                                    : 'border-border/40 bg-muted/20 opacity-50'
                            }`}
                        >
                            <Icon className={`w-4 h-4 shrink-0 ${hasBuff ? 'text-emerald-400' : 'text-muted-foreground'}`} />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium truncate">{formatBuffName(buff)}</p>
                                <p className={`text-xs ${hasBuff ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                                    {hasBuff ? `×${count}` : 'Missing'}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default RaidBuffsSection
