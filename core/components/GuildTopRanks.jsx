'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Crown, Skull, Key, Crosshair, Heart, Shield, Star, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { api } from '@/lib/api'

const RAID_MAX = 200
const MPLUS_MAX = 200

const TIERS = {
  mythic:    { label: 'Mythic',    color: '#e6cc80', stars: 5 },
  legendary: { label: 'Legendary', color: '#ff8000', stars: 4 },
  epic:      { label: 'Epic',      color: '#a335ee', stars: 3 },
  rare:      { label: 'Rare',      color: '#0070dd', stars: 2 },
  uncommon:  { label: 'Uncommon',  color: '#1eff00', stars: 1 },
}

function tierForRank(rank) {
  if (rank === 1) return 'mythic'
  if (rank <= 3) return 'legendary'
  if (rank <= 7) return 'epic'
  if (rank <= 12) return 'rare'
  return 'uncommon'
}

function raidScoreColour(score) {
  if (score >= 150) return '#e6cc80'
  if (score >= 125) return '#ff8000'
  if (score >= 110) return '#a335ee'
  if (score >= 100) return '#0070dd'
  if (score >= 75) return '#1eff00'
  return '#9d9d9d'
}

function mplusScoreColour(score) {
  if (score >= 130) return '#e6cc80'
  if (score >= 110) return '#ff8000'
  if (score >= 80) return '#a335ee'
  if (score >= 50) return '#0070dd'
  if (score >= 20) return '#1eff00'
  return '#9d9d9d'
}

function ScoreBar({ score, maxScore, colour, label }) {
  const pct = Math.min(100, (score / maxScore) * 100)
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="space-y-1 min-w-[72px]">
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: colour }} />
            </div>
            <p className="text-[10px] text-muted-foreground text-center">{label}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>{label}: {score?.toFixed?.(1) ?? score} / {maxScore}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function RankEmblem({ rank, tier }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: tier.stars }).map((_, i) => (
          <Star key={i} className="w-2.5 h-2.5" style={{ color: tier.color, fill: tier.color }} />
        ))}
      </div>
      <div
        className="w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-lg shadow-inner"
        style={{ borderColor: tier.color, color: tier.color, background: `linear-gradient(135deg, ${tier.color}22, transparent)` }}
      >
        {rank}
      </div>
      <Badge variant="outline" className="text-[10px] px-1.5" style={{ borderColor: tier.color, color: tier.color }}>
        {tier.label}
      </Badge>
    </div>
  )
}

function RoleIcon({ role }) {
  if (role === 'Healer') return <Heart className="w-3.5 h-3.5 text-green-400" />
  if (role === 'Tank') return <Shield className="w-3.5 h-3.5 text-blue-400" />
  return <Crosshair className="w-3.5 h-3.5 text-red-400" />
}

/**
 * Guild combined rankings — raid parses (WCL) + M+ (Raider.io).
 */
export default function GuildTopRanks({ compact = false }) {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await api.getRankings()
        if (!cancelled) setPlayers(data.combined ?? [])
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const topThree = useMemo(() => players.slice(0, 3), [players])
  const rest = useMemo(() => players.slice(3, compact ? 12 : 50), [players, compact])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        Rankings unavailable — ensure Raider.io and Warcraft Logs API keys are configured.
      </p>
    )
  }

  if (players.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        No enrichment data yet. Run a guild sync to pull Raider.io and Warcraft Logs data.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {!compact && (
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-semibold tracking-tight">Guild Rankings</h2>
          <span className="text-xs text-muted-foreground">Raid parses + Mythic+ combined</span>
        </div>
      )}

      {topThree.length > 0 && (
        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
          {[topThree[1], topThree[0], topThree[2]].filter(Boolean).map((player) => {
            const tier = TIERS[tierForRank(player.rank)]
            const isFirst = player.rank === 1
            return (
              <Card
                key={`${player.name}-${player.server}`}
                className={`border-border/50 bg-card/80 text-center ${isFirst ? 'ring-1 ring-amber-500/40 scale-105' : ''}`}
              >
                <CardContent className="pt-4 pb-3 space-y-2">
                  {isFirst && <Crown className="w-5 h-5 text-amber-400 mx-auto" />}
                  <RankEmblem rank={player.rank} tier={tier} />
                  <Link
                    href={`/member/${player.server}/${player.name}`}
                    className="font-semibold text-sm hover:underline block"
                    style={{ color: player.classColour }}
                  >
                    {player.name}
                  </Link>
                  <div className="flex justify-center gap-3">
                    <ScoreBar score={player.raidScore} maxScore={RAID_MAX} colour={raidScoreColour(player.raidScore)} label="Raid" />
                    <ScoreBar score={player.mplusScore} maxScore={MPLUS_MAX} colour={mplusScoreColour(player.mplusScore)} label="M+" />
                  </div>
                  <p className="text-xs text-muted-foreground">{player.combinedScore?.toFixed(1)} combined</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {rest.length > 0 && (
        <Card className="border-border/50 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {rest.map((player) => {
                const tier = TIERS[tierForRank(player.rank)]
                return (
                    <div key={`${player.name}-${player.server}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30">
                    <span className="text-xs font-mono w-6 text-muted-foreground">#{player.rank}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/member/${player.server}/${player.name}`}
                          className="font-medium text-sm truncate hover:underline"
                          style={{ color: player.classColour }}
                        >
                          {player.name}
                        </Link>
                        <RoleIcon role={player.role} />
                        <Badge variant="outline" className="text-[10px]" style={{ borderColor: tier.color, color: tier.color }}>
                          {tier.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{player.spec || player.className}</p>
                    </div>
                    <div className="flex gap-2 items-center shrink-0">
                      <ScoreBar score={player.raidScore} maxScore={RAID_MAX} colour={raidScoreColour(player.raidScore)} label="Raid" />
                      <ScoreBar score={player.mplusScore} maxScore={MPLUS_MAX} colour={mplusScoreColour(player.mplusScore)} label="M+" />
                      <span className="text-xs font-mono text-muted-foreground w-10 text-right">
                        {player.combinedScore?.toFixed(0)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function RankBadge({ rank, tierId, size = 'sm' }) {
  const tier = TIERS[tierId ?? tierForRank(rank)]
  if (!tier || !rank) return null
  const sz = size === 'lg' ? 'text-sm px-2 py-1' : 'text-[10px] px-1.5 py-0.5'
  return (
    <Badge variant="outline" className={`font-semibold gap-1 ${sz}`} style={{ borderColor: tier.color, color: tier.color }}>
      <Star className="w-2.5 h-2.5" style={{ fill: tier.color }} />
      #{rank} {tier.label}
    </Badge>
  )
}

export function EnrichmentScores({ enrichment, processedStats }) {
  if (!enrichment && !processedStats?.raidScore) return null
  const raidScore = enrichment?.raidScore ?? processedStats?.raidScore ?? 0
  const mplusScore = enrichment?.mplusScore ?? 0
  const rioRating = enrichment?.rioRating ?? processedStats?.mythicPlusScore ?? 0

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {raidScore > 0 && (
        <div className="flex items-center gap-1.5 text-xs">
          <Skull className="w-3.5 h-3.5 text-purple-400" />
          <span style={{ color: raidScoreColour(raidScore) }} className="font-semibold">
            Raid {raidScore.toFixed(0)}
          </span>
        </div>
      )}
      {mplusScore > 0 && (
        <div className="flex items-center gap-1.5 text-xs">
          <Key className="w-3.5 h-3.5 text-cyan-400" />
          <span style={{ color: mplusScoreColour(mplusScore) }} className="font-semibold">
            M+ {mplusScore.toFixed(0)}
          </span>
        </div>
      )}
      {rioRating > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          Raider.io {Math.round(rioRating)}
        </div>
      )}
    </div>
  )
}
