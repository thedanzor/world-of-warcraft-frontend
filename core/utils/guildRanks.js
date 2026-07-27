/**
 * Resolve guild rank label from DB-backed GUILLD_RANKS array.
 */
export function getGuildRankLabel(guildRanks, guildRank) {
  if (guildRank === undefined || guildRank === null) return '-'
  if (Array.isArray(guildRanks) && guildRanks[guildRank]) return guildRanks[guildRank]
  return String(guildRank)
}
