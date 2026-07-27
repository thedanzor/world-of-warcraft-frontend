'use client'

import React from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'

import PvpBlock from '@/core/modules/RatingBlock'
import PageHero from '@/core/components/PageHero'
import { PageShell, PageContent } from '@/core/components/PageShell'
import { colors } from '@/core/theme'
import { Trophy } from 'lucide-react'

const PVP = ({ auditable, guildData }) => {
    if (!guildData) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Spinner size="lg" />
            </div>
        )
    }

    if (guildData.error) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertTitle>Failed to load guild data</AlertTitle>
                    <AlertDescription>{guildData.error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    const lastAudit = guildData.timestamp
        ? new Date(guildData.timestamp).toLocaleString()
        : 'Unknown'

    return (
        <PageShell>
            <PageHero
                chip="Rated PvP"
                chipColor={colors.success}
                gradientColor={colors.success}
                title="Rated PvP"
                description={`Arena and rated battleground standings for guild members. Last audit ran ${lastAudit}.`}
                badges={[{ label: 'Arena rankings', icon: Trophy, color: colors.success }]}
            />
            <PageContent>
                <PvpBlock data={guildData} name="data" type="pvp" />
            </PageContent>
        </PageShell>
    )
}

export default PVP
