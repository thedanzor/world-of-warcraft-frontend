'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, Shield, Activity, Timer, Hash, Sword, Zap, Lock, Star, Trophy, Clock } from 'lucide-react'

import getRatingColor from '@/core/utils/getRatingColor'
import { EnrichmentScores } from '@/core/components/GuildTopRanks'
import PageHero from '@/core/components/PageHero'
import { PageShell, PageContent } from '@/core/components/PageShell'
import { colors } from '@/core/theme'

// ─── Constants ────────────────────────────────────────────────────────────────

const DIFF_ORDER = ['LFR', 'Raid Finder', 'Normal', 'Heroic', 'Mythic']
const DIFF_LABEL = { 'LFR': 'LFR', 'Raid Finder': 'LFR', 'Normal': 'Normal', 'Heroic': 'Heroic', 'Mythic': 'Mythic' }
const DIFF_STYLES = {
    'LFR':         { bar: 'bg-slate-400',   text: 'text-slate-400',   badge: 'bg-slate-400/10 text-slate-400 border-slate-400/30' },
    'Raid Finder': { bar: 'bg-slate-400',   text: 'text-slate-400',   badge: 'bg-slate-400/10 text-slate-400 border-slate-400/30' },
    'Normal':      { bar: 'bg-green-500',   text: 'text-green-500',   badge: 'bg-green-500/10 text-green-500 border-green-500/30' },
    'Heroic':      { bar: 'bg-blue-400',    text: 'text-blue-400',    badge: 'bg-blue-400/10 text-blue-400 border-blue-400/30' },
    'Mythic':      { bar: 'bg-purple-400',  text: 'text-purple-400',  badge: 'bg-purple-400/10 text-purple-400 border-purple-400/30' },
}

const DIFF_COLOR = {
    'Normal': 'text-green-500',
    'Heroic': 'text-blue-400',
    'Mythic': 'text-purple-400',
    'LFR': 'text-slate-400',
    'Raid Finder': 'text-slate-400',
}

const SLOT_NAMES = {
    HEAD: 'Head',
    NECK: 'Neck',
    SHOULDER: 'Shoulder',
    BACK: 'Cloak',
    CHEST: 'Chest',
    SHIRT: 'Shirt',
    TABARD: 'Tabard',
    WRIST: 'Wrist',
    HANDS: 'Hands',
    WAIST: 'Waist',
    LEGS: 'Legs',
    FEET: 'Feet',
    FINGER_1: 'Ring 1',
    FINGER_2: 'Ring 2',
    TRINKET_1: 'Trinket 1',
    TRINKET_2: 'Trinket 2',
    MAIN_HAND: 'Main Hand',
    OFF_HAND: 'Off Hand',
}

// Tier set slots (standard 5-piece set)
const TIER_SLOTS = ['HEAD', 'SHOULDER', 'CHEST', 'HANDS', 'LEGS']

const BRACKET_LABELS = {
    'ranked-2v2': '2v2 Arena',
    'ranked-3v3': '3v3 Arena',
    'rated-solo-shuffle': 'Solo Shuffle',
    'rated-battleground': 'Rated Battleground',
    'battlegrounds': 'Battlegrounds',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Raid overview card for the current expansion showing progress per instance and difficulty.
 */
const RaidOverview = ({ raidHistory }) => {
    if (!raidHistory?.instances?.length) return null

    const expansionName = raidHistory.expansion?.name || 'Current Expansion'

    return (
        <Card className="border-border/50 shadow-sm bg-card/80">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Sword className="h-4 w-4 text-muted-foreground" />
                    {expansionName} — Raid Progress
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {raidHistory.instances.map(({ instance, modes }) => {
                        if (!instance || !modes?.length) return null

                        const activeModes = DIFF_ORDER
                            .map(d => modes.find(m => m.difficulty.name === d || (d === 'LFR' && m.difficulty.name === 'Raid Finder')))
                            .filter(Boolean)
                            .filter(m => m.progress?.completed_count > 0)

                        if (activeModes.length === 0) return null

                        const bestMode = [...activeModes].sort((a, b) => {
                            const order = ['Mythic', 'Heroic', 'Normal', 'Raid Finder', 'LFR']
                            return order.indexOf(a.difficulty.name) - order.indexOf(b.difficulty.name)
                        })[0]

                        const bestStyle = DIFF_STYLES[bestMode?.difficulty?.name] || DIFF_STYLES['Normal']

                        return (
                            <div key={instance.id} className="rounded-lg border border-border/40 bg-muted/20 p-4 space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-semibold text-sm text-foreground truncate">{instance.name}</h4>
                                    {bestMode && (
                                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${bestStyle.badge} shrink-0`}>
                                            {bestMode.difficulty.name}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    {activeModes.map(mode => {
                                        const diff = mode.difficulty.name
                                        const style = DIFF_STYLES[diff] || DIFF_STYLES['Normal']
                                        const completed = mode.progress?.completed_count ?? 0
                                        const total = mode.progress?.total_count ?? 0
                                        const pct = total > 0 ? Math.round((completed / total) * 100) : 0
                                        const encounters = mode.progress?.encounters ?? []
                                        const killedNames = encounters
                                            .filter(e => e.completed_count > 0)
                                            .map(e => e.encounter.name)

                                        return (
                                            <TooltipProvider key={diff}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="cursor-default space-y-1">
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className={`font-medium ${style.text}`}>{DIFF_LABEL[diff] || diff}</span>
                                                                <span className="text-muted-foreground font-mono">
                                                                    {completed}/{total}
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full transition-all ${style.bar}`}
                                                                    style={{ width: `${pct}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </TooltipTrigger>
                                                    {killedNames.length > 0 && (
                                                        <TooltipContent className="p-2 text-xs max-w-[220px]">
                                                            <p className={`font-bold mb-1 ${style.text}`}>{diff} kills</p>
                                                            {killedNames.map(name => (
                                                                <p key={name} className="text-muted-foreground">• {name}</p>
                                                            ))}
                                                        </TooltipContent>
                                                    )}
                                                </Tooltip>
                                            </TooltipProvider>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

/**
 * Shows tier piece slots and enchant status per slot.
 */
const EquipmentSection = ({ equipement }) => {
    if (!equipement?.length) return null

    const tierPieces = equipement.filter(item => item.isTierItem)
    const tierBySlot = Object.fromEntries(tierPieces.map(item => [item.type, item]))
    const enchantableItems = equipement.filter(item => item.needsEnchant)
    const enchantedCount = enchantableItems.filter(item => item.hasEnchant).length

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tier Set */}
            <Card className="border-border/50 shadow-sm bg-card/80">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        Tier Set
                        <Badge
                            variant="outline"
                            className={`ml-auto text-xs ${tierPieces.length >= 4
                                ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
                                : tierPieces.length >= 2
                                    ? 'text-blue-400 border-blue-400/30 bg-blue-400/10'
                                    : 'text-muted-foreground border-border'}`}
                        >
                            {tierPieces.length}/5 pieces
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                    {TIER_SLOTS.map(slot => {
                        const item = tierBySlot[slot]
                        return (
                            <div key={slot} className="flex items-center justify-between py-1 border-b border-border/30 last:border-0">
                                <span className="text-sm text-muted-foreground">{SLOT_NAMES[slot]}</span>
                                {item ? (
                                    <div className="flex items-center gap-2 min-w-0">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-sm font-medium text-yellow-400 truncate max-w-[160px] cursor-help">
                                                        {item.name}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{item.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <Badge variant="outline" className="text-xs shrink-0">
                                            {item.level}
                                        </Badge>
                                    </div>
                                ) : (
                                    <span className="text-xs text-muted-foreground/40">— Not equipped</span>
                                )}
                            </div>
                        )
                    })}
                    {tierPieces.length >= 2 && (
                        <div className="pt-2 text-xs text-muted-foreground">
                            {tierPieces.length >= 4
                                ? <span className="text-yellow-400 font-semibold">✦ 4-piece bonus active</span>
                                : <span className="text-blue-400 font-semibold">✦ 2-piece bonus active</span>}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Enchant Status */}
            <Card className="border-border/50 shadow-sm bg-card/80">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        Enchants
                        <Badge
                            variant="outline"
                            className={`ml-auto text-xs ${enchantedCount === enchantableItems.length
                                ? 'text-green-500 border-green-500/30 bg-green-500/10'
                                : 'text-destructive border-destructive/30 bg-destructive/10'}`}
                        >
                            {enchantedCount}/{enchantableItems.length} enchanted
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                    {enchantableItems.map(item => (
                        <div key={item.type} className="flex items-center justify-between py-1 border-b border-border/30 last:border-0">
                            <span className="text-sm text-muted-foreground">{SLOT_NAMES[item.type] || item.type}</span>
                            {item.hasEnchant ? (
                                <span className="text-xs font-semibold text-green-500">✓ Enchanted</span>
                            ) : (
                                <span className="text-xs font-semibold text-destructive">✗ Missing</span>
                            )}
                        </div>
                    ))}
                    {enchantableItems.length === 0 && (
                        <p className="text-sm text-muted-foreground">No enchantable slots found.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

/**
 * Weekly raid lockout breakdown — shows bosses killed this reset per instance.
 */
const LockoutsSection = ({ lockStatus }) => {
    const hasLockouts = lockStatus?.raids && Object.keys(lockStatus.raids).length > 0

    return (
        <Card className="border-border/50 shadow-sm bg-card/80">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Weekly Raid Lockouts
                    {hasLockouts ? (
                        <Badge variant="outline" className="ml-auto text-xs text-destructive border-destructive/30 bg-destructive/10">
                            Locked
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="ml-auto text-xs text-green-500 border-green-500/30 bg-green-500/10">
                            Clean
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!hasLockouts ? (
                    <p className="text-sm text-muted-foreground">No lockouts this week — ready to raid!</p>
                ) : (
                    <div className="space-y-5">
                        {Object.entries(lockStatus.raids).map(([raidName, raidData]) => (
                            <div key={raidName}>
                                <h4 className="text-sm font-semibold mb-2 text-foreground">{raidName}</h4>
                                <div className="space-y-2">
                                    {DIFF_ORDER.filter(d => raidData.difficulties[d]).map(diff => {
                                        const info = raidData.difficulties[diff]
                                        return (
                                            <div key={diff} className="rounded-lg border border-border/40 bg-muted/20 p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`text-xs font-bold ${DIFF_COLOR[diff] || 'text-foreground'}`}>
                                                        {diff}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground font-mono">
                                                        {info.completed}/{info.total} bosses killed
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {info.encounters.map(boss => (
                                                        <span
                                                            key={boss}
                                                            className="text-xs bg-muted/60 border border-border/50 rounded px-1.5 py-0.5 text-muted-foreground"
                                                        >
                                                            {boss}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

/**
 * Current season M+ best run per dungeon.
 */
const BestRunsSection = ({ currentSeason, getScoreColor }) => {
    const runs = currentSeason?.best_runs
    if (!runs?.length) return null

    const sortedRuns = [...runs].sort((a, b) => b.keystone_level - a.keystone_level)

    const formatDuration = (ms) => {
        if (!ms) return '—'
        const mins = Math.floor(ms / 60000)
        const secs = Math.floor((ms % 60000) / 1000)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <Card className="border-border/50 shadow-sm bg-card/80">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Season Best Runs
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-border hover:bg-transparent">
                                <TableHead className="text-muted-foreground font-medium text-sm pl-6">Dungeon</TableHead>
                                <TableHead className="text-muted-foreground font-medium text-sm">Key Level</TableHead>
                                <TableHead className="text-muted-foreground font-medium text-sm">Time</TableHead>
                                <TableHead className="text-muted-foreground font-medium text-sm pr-6">Rating</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedRuns.map((run, i) => (
                                <TableRow key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-semibold text-foreground pl-6">{run.dungeon?.name || '—'}</TableCell>
                                    <TableCell>
                                        <span className={`font-bold text-base ${run.is_completed_within_time ? 'text-green-500' : 'text-muted-foreground'}`}>
                                            +{run.keystone_level}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-sm font-medium ${run.is_completed_within_time ? 'text-green-500' : 'text-destructive'}`}>
                                            {formatDuration(run.duration)}{' '}
                                            {run.is_completed_within_time ? '✓ Timed' : '✗ Depleted'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="pr-6">
                                        <span className="font-semibold" style={{ color: getScoreColor(run.mythic_rating?.rating) }}>
                                            {Math.round(run.mythic_rating?.rating || 0)}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

/**
 * PvP bracket ratings and win/loss record.
 */
const PvPSection = ({ pvp }) => {
    if (!pvp || (pvp.rating <= 0 && !pvp.summary?.honor_level)) return null

    const activeBrackets = Object.entries(pvp)
        .filter(([key, val]) => BRACKET_LABELS[key] && val?.rating > 0)

    if (activeBrackets.length === 0 && !pvp.summary?.honor_level) return null

    return (
        <Card className="border-border/50 shadow-sm bg-card/80">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    PvP
                    {pvp.rating > 0 && (
                        <span className="text-sm font-normal text-muted-foreground ml-auto">
                            Highest:{' '}
                            <span className="font-bold" style={{ color: getRatingColor(pvp.rating, 'pvp') }}>
                                {pvp.rating}
                            </span>
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {activeBrackets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeBrackets.map(([key, data]) => (
                            <div key={key} className="rounded-lg border border-border/40 bg-muted/20 p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">{BRACKET_LABELS[key]}</span>
                                    <span
                                        className="font-bold text-base"
                                        style={{ color: getRatingColor(data.rating, 'pvp') }}
                                    >
                                        {data.rating}
                                    </span>
                                </div>
                                {data.season_match_statistics && (
                                    <div className="flex gap-3 text-xs text-muted-foreground">
                                        <span>
                                            Played:{' '}
                                            <span className="font-medium text-foreground">
                                                {data.season_match_statistics.played}
                                            </span>
                                        </span>
                                        <span className="text-green-500">
                                            Won:{' '}
                                            <span className="font-medium">
                                                {data.season_match_statistics.won}
                                            </span>
                                        </span>
                                        <span className="text-destructive">
                                            Lost:{' '}
                                            <span className="font-medium">
                                                {data.season_match_statistics.lost}
                                            </span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {pvp.summary?.honor_level > 0 && (
                            <p className="text-sm text-muted-foreground">
                                Honor Level:{' '}
                                <span className="font-semibold text-foreground">{pvp.summary.honor_level}</span>
                            </p>
                        )}
                        <p className="text-sm text-muted-foreground">No rated PvP activity this season.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const MemberDetail = ({ auditable, memberData, realm, character }) => {
    const router = useRouter()

    const decodedCharacter = decodeURIComponent(character)
    const decodedRealm = decodeURIComponent(realm)

    const seasonalData = memberData?.seasonalData
    const characterData = memberData?.characterData
    const error = memberData?.error

    const getScoreColor = (score) => {
        if (!score) return undefined
        return getRatingColor(score, 'mplus')
    }

    if (!memberData) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Spinner />
            </div>
        )
    }

    if (memberData.error) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertTitle>Failed to load member data</AlertTitle>
                    <AlertDescription>{memberData.error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    const sanitizedClass = characterData?.metaData?.class?.toLowerCase().replace(/\s+/g, '') || ''
    const capitalizedName = decodedCharacter.charAt(0).toUpperCase() + decodedCharacter.slice(1).toLowerCase()

    return (
        <PageShell>
            <PageHero
                chip={`${characterData?.metaData?.spec || 'Character'} ${characterData?.metaData?.class || ''}`.trim()}
                chipColor={colors.accentLt}
                gradientColor={colors.accent}
                title={capitalizedName}
                description={`${decodedRealm} — detailed raid, Mythic+, and enrichment data.`}
                actions={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.back()}
                        className="gap-2 shrink-0"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                }
            />

            <PageContent className="space-y-6">
            {/* Character showcase */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f1923] min-h-[280px] sm:min-h-[340px]">
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: `radial-gradient(ellipse 70% 80% at 30% 100%, ${colors.accent}44 0%, transparent 65%)`,
                    }}
                />
                <div className="relative flex flex-col lg:flex-row items-end gap-6 p-6 sm:p-8 min-h-[280px] sm:min-h-[340px]">
                    <div className="flex-1 flex items-end justify-center lg:justify-start min-h-[200px] lg:min-h-[300px]">
                        {characterData?.media?.assets?.length ? (
                            <img
                                src={
                                    characterData.media.assets.find((a) => a.key === 'main-raw')?.value
                                    || characterData.media.assets[0].value
                                }
                                alt={capitalizedName}
                                className="max-h-[260px] sm:max-h-[320px] w-auto object-contain object-bottom drop-shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
                            />
                        ) : (
                            <img
                                src="/images/logo-without-text.png"
                                alt=""
                                className="h-24 opacity-30"
                            />
                        )}
                    </div>
                    <div className="w-full lg:w-[320px] shrink-0 space-y-4">
                        <div className="flex items-center gap-3">
                            {characterData?.media?.assets?.length > 1 && (
                                <img
                                    src={characterData.media.assets.find((a) => a.key === 'inset')?.value || characterData.media.assets[1]?.value}
                                    alt=""
                                    className="w-14 h-14 rounded-xl border-2 border-white/10 object-cover shadow-lg"
                                />
                            )}
                            <div>
                                <h2 className={`text-2xl font-bold capitalize text-${sanitizedClass}`}>
                                    {capitalizedName}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {characterData?.metaData?.spec} {characterData?.metaData?.class}
                                </p>
                                <p className="text-xs text-muted-foreground">{decodedRealm}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">iLvl {characterData?.itemlevel?.equiped || 0}</Badge>
                            <Badge variant="secondary">M+ {Math.round(characterData?.processedStats?.mythicPlusScore || 0)}</Badge>
                        </div>
                        <EnrichmentScores
                            enrichment={characterData?.enrichment}
                            processedStats={characterData?.processedStats}
                        />
                    </div>
                </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                {
                                    label: 'Rating',
                                    value: Math.round(characterData?.processedStats?.mythicPlusScore || 0),
                                    color: getScoreColor(characterData?.processedStats?.mythicPlusScore),
                                    icon: Activity,
                                },
                                {
                                    label: 'Highest Key',
                                    value: seasonalData?.highestKeyOverall || 0,
                                    color: getScoreColor((seasonalData?.highestKeyOverall || 0) * 100),
                                    icon: Hash,
                                },
                                {
                                    label: 'Best Timed',
                                    value: seasonalData?.highestTimedKey || 0,
                                    color: getScoreColor((seasonalData?.highestTimedKey || 0) * 100),
                                    icon: Timer,
                                },
                                {
                                    label: 'Total Runs',
                                    value: seasonalData?.totalRuns || 0,
                                    color: undefined,
                                    sub: `${Math.round(seasonalData?.completionRate || 0)}% timed`,
                                    icon: Shield,
                                },
                            ].map(({ label, value, color, sub, icon: Icon }) => (
                                <div key={label} className="audit-panel p-3">
                                    <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
                                    <p className="text-2xl font-bold stat-number" style={{ color }}>{value}</p>
                                    {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
                                </div>
                            ))}
            </div>

            {/* Equipment Status strip */}
            {characterData?.equipement && (
                <div className="audit-panel overflow-hidden grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
                    {[
                        {
                            label: characterData.ready ? 'Enchants: Ready' : 'Enchants: Missing',
                            sub: characterData.ready ? 'All enchants applied' : `${characterData.missingEnchants} missing`,
                            ok: characterData.ready,
                        },
                        {
                            label: characterData.hasTierSet ? 'Tier Set' : 'No Tier Set',
                            sub: characterData.hasTierSet ? 'Tier pieces equipped' : 'No tier pieces found',
                            ok: characterData.hasTierSet,
                        },
                        {
                            label: characterData.isActiveInSeason2 ? 'Active This Season' : 'Inactive',
                            sub: characterData.isActiveInSeason2 ? 'Active this season' : 'Inactive this season',
                            ok: characterData.isActiveInSeason2,
                        },
                    ].map(({ label, sub, ok }) => (
                        <div key={label} className="px-6 py-4 flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${ok ? 'bg-green-500' : 'bg-destructive'}`} />
                            <div>
                                <p className={`text-sm font-semibold ${ok ? 'text-green-500' : 'text-destructive'}`}>{label}</p>
                                <p className="text-xs text-muted-foreground">{sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Gear: Tier & Enchant Breakdown */}
            {characterData?.equipement && (
                <EquipmentSection equipement={characterData.equipement} />
            )}

            {/* Raid Overview — all-time progress */}
            {characterData?.raidHistory && (
                <RaidOverview raidHistory={characterData.raidHistory} />
            )}

            {/* Warcraft Logs raid parses */}
            {characterData?.enrichment?.raider && (
                <Card className="border-border/50 shadow-sm bg-card/80">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Sword className="h-4 w-4 text-muted-foreground" />
                            Warcraft Logs — Raid Performance
                            <Badge variant="secondary" className="text-xs">
                                Score {Math.round(characterData.enrichment.raidScore ?? 0)}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.values(characterData.enrichment.raider.zones ?? {}).map((zone) => (
                            <div key={zone.patch} className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                    <span className="font-medium">{zone.zoneName}</span>
                                    <span className="text-muted-foreground">
                                        {zone.kills}/{zone.totalBosses} bosses · Parse {zone.parseScore?.toFixed?.(0)} · Speed {zone.speedScore?.toFixed?.(0)}
                                    </span>
                                </div>
                                {zone.bossRankings?.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {zone.bossRankings.map((boss) => (
                                            <div key={boss.bossName} className="flex justify-between gap-2 p-2 rounded-md bg-muted/30 text-xs">
                                                <span className="truncate">{boss.bossName}</span>
                                                <span className="font-semibold text-purple-400 shrink-0">
                                                    {boss.bestParse?.toFixed?.(0)}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Raider.io enriched M+ */}
            {characterData?.enrichment?.mplus && (
                <Card className="border-border/50 shadow-sm bg-card/80">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Star className="h-4 w-4 text-muted-foreground" />
                            Raider.io — Mythic+ Profile
                            <Badge variant="secondary" className="text-xs">
                                {Math.round(characterData.enrichment.mplus.score)} rating
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: 'M+ Score', value: characterData.enrichment.mplus.totalMplusScore?.toFixed?.(0) },
                            { label: 'Highest Timed', value: characterData.enrichment.mplus.highestTimedKey },
                            { label: 'Success Rate', value: `${Math.round(characterData.enrichment.mplus.successRate ?? 0)}%` },
                            { label: 'Tracked Runs', value: characterData.enrichment.mplus.totalTrackedRuns },
                        ].map(({ label, value }) => (
                            <div key={label} className="p-3 rounded-lg bg-muted/40 border border-border/30">
                                <p className="text-xs text-muted-foreground">{label}</p>
                                <p className="text-xl font-bold">{value}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Weekly Lockouts */}
            {characterData?.lockStatus !== null && characterData?.lockStatus !== undefined && (
                <LockoutsSection lockStatus={characterData.lockStatus} />
            )}

            {/* M+ Season Best Runs */}
            {characterData?.currentSeason && (
                <BestRunsSection currentSeason={characterData.currentSeason} getScoreColor={getScoreColor} />
            )}

            {/* PvP */}
            {characterData?.pvp && (
                <PvPSection pvp={characterData.pvp} />
            )}

            {/* Seasonal Data */}
            {error ? (
                <Alert variant="destructive">
                    <AlertTitle>Failed to load seasonal statistics</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : !seasonalData ? (
                <Alert>
                    <AlertTitle>No seasonal data available</AlertTitle>
                    <AlertDescription>This character hasn&apos;t completed any Mythic+ runs this season.</AlertDescription>
                </Alert>
            ) : (
                <div className="space-y-6">
                    {/* Most Played With */}
                    {seasonalData.topPlayedMembers?.length > 0 && (
                        <Card className="border-border/50 shadow-sm bg-card/80">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">Most Played With</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {seasonalData.topPlayedMembers.slice(0, 6).map((member, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/40 border border-border/30"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold truncate">
                                                    {member.name.charAt(0).toUpperCase() + member.name.slice(1).toLowerCase()}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {member.spec} &bull; {member.server}
                                                </p>
                                            </div>
                                            <Badge variant="secondary" className="shrink-0 font-bold text-xs">
                                                {member.count}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Dungeon Performance — aggregated seasonal stats */}
                    {Object.keys(seasonalData.dungeonStats || {}).length > 0 && (
                        <Card className="border-border/50 shadow-sm bg-card/80">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">Dungeon Performance</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b border-border hover:bg-transparent">
                                                <TableHead className="text-muted-foreground font-medium text-sm pl-6">Dungeon</TableHead>
                                                <TableHead className="text-muted-foreground font-medium text-sm">Runs</TableHead>
                                                <TableHead className="text-muted-foreground font-medium text-sm">Timed</TableHead>
                                                <TableHead className="text-muted-foreground font-medium text-sm">Highest Key</TableHead>
                                                <TableHead className="text-muted-foreground font-medium text-sm pr-6">Avg Rating</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Object.entries(seasonalData.dungeonStats).map(([dungeon, stats]) => (
                                                <TableRow key={dungeon} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                                    <TableCell className="font-semibold text-foreground pl-6">{dungeon}</TableCell>
                                                    <TableCell className="text-muted-foreground">{stats.totalRuns}</TableCell>
                                                    <TableCell>
                                                        <span className={`font-semibold ${stats.timedRuns > 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
                                                            {stats.timedRuns}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-bold" style={{ color: getScoreColor(stats.highestKey * 100) }}>
                                                            +{stats.highestKey}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="pr-6">
                                                        <span className="font-semibold" style={{ color: getScoreColor(stats.averageRating) }}>
                                                            {Math.round(stats.averageRating)}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
            </PageContent>
        </PageShell>
    )
}

export default MemberDetail
