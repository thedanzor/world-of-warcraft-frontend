'use client'

import { useConfig } from '@/core/hooks/useConfig'
import { getGuildRankLabel } from '@/core/utils/guildRanks'

export default function GuildRankLabel({ guildRank, guildRankLabel, className = '' }) {
  const { config } = useConfig()

  const label =
    guildRankLabel ||
    getGuildRankLabel(config?.GUILLD_RANKS, guildRank)

  return <span className={className}>{label}</span>
}
