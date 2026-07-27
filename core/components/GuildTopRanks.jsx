'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Crown, Skull, Key, Crosshair, Heart, Shield, Star, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { api } from '@/lib/api'
import { colors, tiers, raidScoreColour, mplusScoreColour, tierForRank } from '@/core/theme'

const RAID_MAX = 200
const MPLUS_MAX = 200

function ScoreBar({ score, maxScore, colour, label }) {
  const pct = Math.min(100, (score / maxScore) * 100)
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="space-y-1 min-w-[76px]">
            <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: colour }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-center font-medium">{label}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent className="text-xs">
          {label}: {score?.toFixed?.(1) ?? score} / {maxScore}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function RankEmblem({ rank, tier }) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-1">
      <div className="flex gap-0.5">
        {Array.from({ length: tier.stars }).map((_, i) => (
          <Star
            key={i}
            className="w-2.5 h-2.5"
            style={{ color: tier.color, fill: tier.color, filter: `drop-shadow(0 0 4px ${tier.color}88)` }}
          />
        ))}
      </div>
      <div
        className="w-14 h-14 rounded-lg border-2 flex items-center justify-center font-bold text-xl"
        style={{
          borderColor: tier.color,
          color: tier.color,
          background: `linear-gradient(135deg, ${tier.color}22, transparent)`,
          boxShadow: `0 0 16px ${tier.color}22`,
        }}
      >
        {rank}
      </div>
      <Badge
        variant="outline"
        className="text-[10px] px-1.5 font-semibold"
        style={{ borderColor: `${tier.color}55`, color: tier.color, background: `${tier.color}12` }}
      >
        {tier.label}
      </Badge>
    </div>
  )
}

function RoleIcon({ role }) {
  if (role === 'Healer') return <Heart className="w-3.5 h-3.5 text-emerald-400" />
  if (role === 'Tank') return <Shield className="w-3.5 h-3.5 text-sky-400" />
  return <Crosshair className="w-3.5 h-3.5 text-red-400" />
}

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
    <div className="space-y-5">
      {!compact && (
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5" style={{ color: colors.warning }} />
          <h2 className="text-lg font-semibold tracking-tight">Guild Rankings</h2>
          <span className="text-xs text-muted-foreground">Raid parses + Mythic+ combined</span>
        </div>
      )}

      {topThree.length > 0 && (
        <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto items-end">
          {[topThree[1], topThree[0], topThree[2]].filter(Boolean).map((player) => {
            const tier = tiers[tierForRank(player.rank)]
            const isFirst = player.rank === 1
            return (
              <div
                key={`${player.name}-${player.server}`}
                className={`audit-panel text-center transition-all ${isFirst ? 'scale-[1.03] shadow-[0_0_36px_rgba(230,204,128,0.15)]' : ''}`}
                style={isFirst ? { borderColor: `${tier.color}44` } : undefined}
              >
                <div className="p-4 space-y-2">
                  {isFirst && <Crown className="w-5 h-5 mx-auto" style={{ color: tier.color }} />}
                  <RankEmblem rank={player.rank} tier={tier} />
                  <Link
                    href={`/member/${player.server}/${player.name}`}
                    className="font-semibold text-sm hover:underline block capitalize"
                    style={{ color: player.classColour }}
                  >
                    {player.name}
                  </Link>
                  <div className="flex justify-center gap-3 pt-1">
                    <ScoreBar score={player.raidScore} maxScore={RAID_MAX} colour={raidScoreColour(player.raidScore)} label="Raid" />
                    <ScoreBar score={player.mplusScore} maxScore={MPLUS_MAX} colour={mplusScoreColour(player.mplusScore)} label="M+" />
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    {player.combinedScore?.toFixed(1)} combined
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {rest.length > 0 && (
        <div className="audit-panel overflow-hidden">
          <div className="audit-panel-header">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Leaderboard</p>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {rest.map((player) => {
              const tier = tiers[tierForRank(player.rank)]
              return (
                <div
                  key={`${player.name}-${player.server}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
                >
                  <span className="text-xs font-mono w-7 text-muted-foreground tabular-nums">#{player.rank}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/member/${player.server}/${player.name}`}
                        className="font-semibold text-sm truncate hover:underline capitalize"
                        style={{ color: player.classColour }}
                      >
                        {player.name}
                      </Link>
                      <RoleIcon role={player.role} />
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold"
                        style={{ borderColor: `${tier.color}44`, color: tier.color, background: `${tier.color}10` }}
                      >
                        {tier.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{player.spec || player.className}</p>
                  </div>
                  <div className="flex gap-2 items-center shrink-0">
                    <ScoreBar score={player.raidScore} maxScore={RAID_MAX} colour={raidScoreColour(player.raidScore)} label="Raid" />
                    <ScoreBar score={player.mplusScore} maxScore={MPLUS_MAX} colour={mplusScoreColour(player.mplusScore)} label="M+" />
                    <span className="text-xs font-mono text-muted-foreground w-8 text-right tabular-nums">
                      {player.combinedScore?.toFixed(0)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function RankBadge({ rank, tierId, size = 'sm' }) {
  const tier = tiers[tierId ?? tierForRank(rank)]
  if (!tier || !rank) return null
  const sz = size === 'lg' ? 'text-sm px-2 py-1' : 'text-[10px] px-1.5 py-0.5'
  return (
    <Badge
      variant="outline"
      className={`font-semibold gap-1 ${sz}`}
      style={{ borderColor: `${tier.color}44`, color: tier.color, background: `${tier.color}10` }}
    >
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
          <Skull className="w-3.5 h-3.5" style={{ color: colors.accent }} />
          <span style={{ color: raidScoreColour(raidScore) }} className="font-semibold">
            Raid {raidScore.toFixed(0)}
          </span>
        </div>
      )}
      {mplusScore > 0 && (
        <div className="flex items-center gap-1.5 text-xs">
          <Key className="w-3.5 h-3.5" style={{ color: colors.warning }} />
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
