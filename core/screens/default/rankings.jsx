'use client'

import GuildTopRanks from '@/core/components/GuildTopRanks'

export default function Rankings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rankings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Combined raid performance (Warcraft Logs) and Mythic+ scores (Raider.io) per character.
        </p>
      </div>
      <GuildTopRanks />
    </div>
  )
}
