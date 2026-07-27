'use client'

import React from 'react'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import config from '@/app.config.js'
import { useConfig } from '@/core/hooks/useConfig'
import { getGuildRankLabel } from '@/core/utils/guildRanks'
import getRatingColor from '@/core/utils/getRatingColor'
import Link from 'next/link'

const TopPlayersTable = ({ data, title, scoreKey }) => {
    const { config: guildConfig } = useConfig()
    const guildRanks = guildConfig?.GUILLD_RANKS || config.GUILLD_RANKS
    const rows = Array.isArray(data) ? data : []
    const getValue = (player) => {
        switch (scoreKey) {
            case 'score':
                return Math.round(player?.score || 0)
            case 'pvp':
                return Math.round(player?.rating || 0)
            default:
                return 0
        }
    }

    // Map scoreKey to rating type for color function
    const getRatingType = (key) => {
        switch (key) {
            case 'score':
                return 'mplus'
            case 'pvp':
                return 'pvp'
            default:
                return 'mplus'
        }
    }

    return (
        <div className="audit-panel overflow-hidden">
            <div className="audit-panel-header">
                <h6 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    {title}
                </h6>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableBody>
                        {rows.slice(0, 5).map((player, index) => {
                            const sanitizedClass = player.class ? player.class.toLowerCase().replace(/\s+/g, '') : ''
                            const capitalizedName = player.name ? player.name.charAt(0).toUpperCase() + player.name.slice(1).toLowerCase() : ''
                            
                            return (
                            <TableRow key={index} className="hover:bg-muted/30 border-border transition-colors">
                                <TableCell style={{ width: 60 }} className="p-3">
                                    <div className="mediaWrapper flex justify-center items-center">
                                        {player?.media?.assets?.length ? (
                                            <img
                                                src={player?.media?.assets[0]?.value}
                                                alt={player.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full border border-border object-cover"
                                            />
                                        ) : (
                                            <img
                                                style={{ opacity: '0.4' }}
                                                src="/images/logo-without-text.png"
                                                alt={player.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full border border-border object-cover"
                                            />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell style={{ width: 240 }} className="p-3">
                                    <Link href={`/member/${player.server}/${player.name}`} className="block group no-underline">
                                        <div
                                            className="cursor-pointer"
                                        >
                                            <span
                                                className={`font-bold transition-opacity group-hover:opacity-80 text-${sanitizedClass}`}
                                            >
                                                {capitalizedName}
                                            </span>
                                        </div>
                                        <div className="classandspec text-xs font-medium text-muted-foreground mt-0.5">
                                            {player.spec} {player.class}
                                        </div>
                                    </Link>
                                </TableCell>
                                <TableCell className="text-muted-foreground p-3">
                                    {player.guildRankLabel || getGuildRankLabel(guildRanks, player.guildRank)}
                                </TableCell>
                                <TableCell className="p-3">
                                    <span
                                        className="font-bold text-md"
                                        style={{
                                            color: getRatingColor(
                                                getValue(player),
                                                getRatingType(scoreKey)
                                            ),
                                        }}
                                    >
                                        {getValue(player)}
                                    </span>
                                </TableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default TopPlayersTable
