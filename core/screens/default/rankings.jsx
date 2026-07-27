'use client'

import GuildTopRanks from '@/core/components/GuildTopRanks'
import PageHero from '@/core/components/PageHero'
import { PageShell, PageContent } from '@/core/components/PageShell'
import { colors } from '@/core/theme'
import { Crown, Skull, Key } from 'lucide-react'

export default function Rankings() {
  return (
    <PageShell>
      <PageHero
        chip="Guild Rank Conquest"
        chipColor={colors.neonPurple}
        gradientColor={colors.neonPurple}
        title="Guild Conquest"
        description="The top guild members ranked by combined Raid and Mythic+ performance. Climb the ladder by parsing harder, clearing earlier, and timing bigger keys."
        badges={[
          { label: 'Raid score', icon: Skull, color: colors.accent },
          { label: 'M+ score', icon: Key, color: colors.warning },
          { label: 'Conquest', icon: Crown, color: colors.neonPurple },
        ]}
      />
      <PageContent>
        <GuildTopRanks />
      </PageContent>
    </PageShell>
  )
}
