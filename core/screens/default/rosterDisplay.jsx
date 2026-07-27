'use client'

import { useMemo } from 'react'
import {
    Shield as ShieldIcon,
    Heart as HealerIcon,
    Swords as DpsIcon,
    ArrowRightLeft as SubstituteIcon,
    Users as SocialIcon,
} from 'lucide-react'
import CharacterCard from '@/core/components/CharacterCard'
import PageHero from '@/core/components/PageHero'
import { PageShell, PageContent } from '@/core/components/PageShell'
import { colors } from '@/core/theme'
import { getCharacterRole } from '@/core/utils/roleFromSpec'
import config from '@/app.config.js'

const ROLE_TYPES = [
    { id: 'tanks', label: 'Tanks', icon: ShieldIcon, colorClass: 'text-emerald-500', bgClass: 'bg-emerald-500/10' },
    { id: 'healers', label: 'Healers', icon: HealerIcon, colorClass: 'text-blue-500', bgClass: 'bg-blue-500/10' },
    { id: 'dps', label: 'DPS', icon: DpsIcon, colorClass: 'text-red-500', bgClass: 'bg-red-500/10' },
    { id: 'substitutes', label: 'Substitutes', icon: SubstituteIcon, colorClass: 'text-orange-500', bgClass: 'bg-orange-500/10' },
    { id: 'socials', label: 'Socials', icon: SocialIcon, colorClass: 'text-purple-500', bgClass: 'bg-purple-500/10' },
]

const RosterDisplay = ({ roster, guildData, error }) => {
    const characterMap = useMemo(() => {
        if (!guildData || !Array.isArray(guildData)) return {}
        const map = {}
        guildData.forEach(char => {
            map[char.name] = {
                ...char,
                primary_role: getCharacterRole(char, config),
            }
        })
        return map
    }, [guildData])

    const getRoleCharacters = (roleId) => {
        const characterNames = roster[roleId] || []
        return characterNames.map(name => characterMap[name]).filter(Boolean)
    }

    if (error) {
        return (
            <div className="p-8 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive">
                <p className="font-semibold">Error loading roster: {error}</p>
            </div>
        )
    }

    const hasAnyRoster = Object.values(roster || {}).some(
        characters => Array.isArray(characters) && characters.length > 0
    )

    if (!hasAnyRoster) {
        return (
            <PageShell>
                <PageHero
                    chip="Raid roster"
                    chipColor={colors.accentLt}
                    gradientColor={colors.accentLt}
                    title="Roster"
                    description="No roster has been configured yet. Please check back later."
                />
            </PageShell>
        )
    }

    const totalPlayers = ROLE_TYPES.reduce((acc, role) => acc + getRoleCharacters(role.id).length, 0)

    return (
        <PageShell>
            <PageHero
                chip="Raid roster"
                chipColor={colors.accentLt}
                gradientColor={colors.accentLt}
                title="Roster"
                description={`Current raid roster — ${totalPlayers} players assigned across tanks, healers, DPS, and backups.`}
                badges={[{ label: `${totalPlayers} players`, icon: SocialIcon, color: colors.accentLt }]}
            />
            <PageContent className="space-y-8">
            {ROLE_TYPES.map((role) => {
                const characters = getRoleCharacters(role.id)
                const Icon = role.icon

                if (characters.length === 0) return null

                return (
                    <div key={role.id}>
                        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                            {/* Role header */}
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
                                <div className={`p-2 rounded-lg ${role.bgClass}`}>
                                    <Icon className={`w-4 h-4 ${role.colorClass}`} />
                                </div>
                                <h3 className="font-semibold text-sm tracking-tight">
                                    {role.label}
                                    <span className="ml-2 text-muted-foreground font-normal">({characters.length})</span>
                                </h3>
                            </div>

                            {/* Characters grid */}
                            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                {characters.map((character) => (
                                    <CharacterCard
                                        key={character.name}
                                        character={character}
                                        isDraggable={false}
                                        layout="horizontal"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )
            })}
            </PageContent>
        </PageShell>
    )
}

export default RosterDisplay
