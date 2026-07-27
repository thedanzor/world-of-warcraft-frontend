'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Spinner } from '@/components/ui/spinner'
import { colors, mplusScoreColour } from '@/core/theme'
import SectionHeading from '@/core/components/SectionHeading'
import { Key } from 'lucide-react'

export default function EnrichmentMplusLeaderboard() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await api.getRankings()
        if (!cancelled) setPlayers(data.mplus ?? [])
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const ranked = useMemo(
    () => [...players].sort((a, b) => (b.totalMplusScore || b.score || 0) - (a.totalMplusScore || a.score || 0)),
    [players]
  )

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-muted-foreground text-center py-10">
        Could not load Raider.io rankings. Ensure API keys are configured and run a guild sync.
      </p>
    )
  }

  if (!ranked.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-10">
        No Raider.io enrichment data yet. Run a guild sync to pull Mythic+ scores.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <SectionHeading icon={Key} label="Raider.io M+ Rankings" color={colors.warning} />
      <div className="audit-panel overflow-hidden">
        <div className="divide-y divide-white/[0.06]">
          {ranked.slice(0, 25).map((player, index) => {
            const score = player.totalMplusScore || player.score || 0
            const rating = player.score || player.mplusRating || 0
            return (
              <div
                key={`${player.server}-${player.name}`}
                className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-xs font-mono w-8 text-muted-foreground">#{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/member/${player.server || player.realm}/${player.name}`}
                    className="font-semibold text-sm capitalize hover:underline"
                    style={{ color: player.classColour || colors.accentLt }}
                  >
                    {player.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{player.spec || player.className}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold" style={{ color: mplusScoreColour(score) }}>
                    {Math.round(score)} pts
                  </p>
                  <p className="text-[0.65rem] text-muted-foreground">{Math.round(rating)} rating</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
