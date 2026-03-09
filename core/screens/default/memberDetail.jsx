'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Activity, Timer, Hash } from 'lucide-react'

import getRatingColor from '@/core/utils/getRatingColor'

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
        <section className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3">
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/mythic-plus')}
                        className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Mythic+
                    </Button>
                </div>
                <div>
                    <h2 className={`text-3xl font-bold tracking-tight text-${sanitizedClass}`}>
                        {capitalizedName}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {characterData?.metaData?.spec} {characterData?.metaData?.class} &mdash; {decodedRealm}
                    </p>
                </div>
            </div>

            {/* Character Hero Card */}
            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            {characterData?.media?.assets?.length ? (
                                <img
                                    src={characterData.media.assets[0].value}
                                    alt={capitalizedName}
                                    width={96}
                                    height={96}
                                    className={`rounded-xl border-2 shadow-lg object-cover border-${sanitizedClass || 'border'}`}
                                />
                            ) : (
                                <img
                                    src="/images/logo-without-text.png"
                                    alt={capitalizedName}
                                    width={96}
                                    height={96}
                                    className="rounded-xl border-2 border-border opacity-50 object-cover"
                                />
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <Badge variant="secondary">
                                    Level {characterData?.metaData?.level || '80'}
                                </Badge>
                                <Badge variant="secondary" className="font-bold">
                                    iLvL {characterData?.itemlevel?.equiped || 0}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Current M+ Rating:{' '}
                                <span
                                    className="font-bold text-base"
                                    style={{ color: getScoreColor(characterData?.processedStats?.mythicPlusScore) }}
                                >
                                    {Math.round(characterData?.processedStats?.mythicPlusScore || 0)}
                                </span>
                            </p>
                        </div>

                        {/* Stat pills */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
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
                                <div key={label} className="flex flex-col p-3 rounded-lg bg-muted/40 border border-border/30">
                                    <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
                                    <p className="text-2xl font-bold" style={{ color }}>{value}</p>
                                    {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Equipment Status strip */}
                {characterData?.equipement && (
                    <div className="border-t border-border/50 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
                        {[
                            {
                                label: characterData.ready ? 'Enchants: Ready' : 'Enchants: Missing',
                                sub: characterData.ready ? 'All enchants applied' : `${characterData.missingEnchants} missing enchants`,
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
            </div>

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

                    {/* Dungeon Performance */}
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
        </section>
    )
}

export default MemberDetail
