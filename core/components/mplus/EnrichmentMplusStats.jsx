'use client'

import { useMemo } from 'react'
import { colors, mplusScoreColour } from '@/core/theme'
import SectionHeading from '@/core/components/SectionHeading'
import { BarChart3 } from 'lucide-react'

export default function EnrichmentMplusStats({ guildData = [] }) {
  const stats = useMemo(() => {
    const withMplus = guildData.filter((p) => p.mplus > 0 || p.raw_mplus?.current_mythic_rating?.rating)
    const ratings = withMplus.map(
      (p) => p.mplus || p.raw_mplus?.current_mythic_rating?.rating || 0
    )
    const avgRating = ratings.length
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0
    const topRating = ratings.length ? Math.max(...ratings) : 0
    const totalRuns = withMplus.reduce(
      (acc, p) => acc + (p.raw_mplus?.current_period?.runs?.length || 0),
      0
    )
    const withEnrichment = guildData.filter((p) => p.enrichment?.mplusScore > 0)
    const avgEnrichment = withEnrichment.length
      ? withEnrichment.reduce((a, p) => a + p.enrichment.mplusScore, 0) / withEnrichment.length
      : 0

    return {
      tracked: withMplus.length,
      total: guildData.length,
      avgRating: Math.round(avgRating),
      topRating: Math.round(topRating),
      totalRuns,
      enriched: withEnrichment.length,
      avgEnrichment: Math.round(avgEnrichment),
    }
  }, [guildData])

  const cards = [
    { label: 'Characters tracked', value: stats.tracked, sub: `of ${stats.total} roster` },
    { label: 'Avg M+ rating', value: stats.avgRating, sub: 'Battle.net + Raider.io' },
    { label: 'Top rating', value: stats.topRating, sub: 'Guild best', color: colors.warning },
    { label: 'Raider.io enriched', value: stats.enriched, sub: `avg score ${stats.avgEnrichment}` },
    { label: 'Weekly runs', value: stats.totalRuns, sub: 'Current period' },
  ]

  return (
    <div className="space-y-4">
      <SectionHeading icon={BarChart3} label="M+ Statistics" color={colors.warning} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map(({ label, value, sub, color }) => (
          <div key={label} className="audit-panel p-4 dashboard-fade-in">
            <p className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">{label}</p>
            <p
              className="text-2xl font-bold stat-number mt-2"
              style={{ color: color || colors.textPrimary }}
            >
              {value}
            </p>
            <p className="text-[0.65rem] text-muted-foreground mt-1">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
