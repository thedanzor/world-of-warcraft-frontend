import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import config from '@/app.config.js'
import Link from 'next/link'
import getRatingColor from '@/core/utils/getRatingColor'

const getLatestStats = (player) => {
    const timestamps = Object.keys(player?.stats || {})
    const latestTimestamp = Math.max(...timestamps.map(Number))
    return player?.stats?.[latestTimestamp] || {}
}

const getColorForParse = (parse) => {
    if (parse > 90) return getRatingColor(2900, 'mplus') // Orange/Elite
    if (parse > 70) return getRatingColor(2200, 'mplus') // Purple/Duelist
    if (parse > 60) return getRatingColor(1400, 'mplus') // Blue/Rival
    if (parse > 40) return getRatingColor(1000, 'mplus') // Green/Challenger
    return getRatingColor(0, 'mplus') // Gray/Unranked
}

const YearOverviewTable = ({ data, type }) => {
    const getValue = (player) => {
        const stats = getLatestStats(player)['2024'] || {}
        switch (type) {
            case 'score':
                return stats.mplus_parse || 0
            case 'pvp':
                return stats.pvp_parse || 0
            case 'ilvl':
                return stats.itemlevel_parse || 0
            case 'parse':
                return stats.total_parse || 0
            default:
                return 0
        }
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableBody>
                    {data.map((player, index) => (
                        <TableRow
                            key={index}
                            onClick={() => {
                                window.location.href = `/2024/${player.name}`
                            }}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                            <TableCell style={{ width: 60 }}>
                                <div className="mediaWrapper">
                                    {player?.media?.assets?.length ? (
                                        <img
                                            src={
                                                player?.media?.assets[0]?.value
                                            }
                                            alt={player.name}
                                            width={40}
                                            height={40}
                                            className="rounded-md"
                                        />
                                    ) : (
                                        <img
                                            style={{ opacity: '0.4' }}
                                            src="/images/logo-without-text.png"
                                            alt={player.name}
                                            width={40}
                                            height={40}
                                            className="rounded-md"
                                        />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell style={{ width: 240 }}>
                                <div
                                    className={`name ${player.class}`}
                                >
                                    <span
                                        style={{ textTransform: 'capitalize' }}
                                        className="font-medium"
                                    >
                                        {player.name}
                                    </span>
                                </div>
                                <div className="classandspec text-sm text-muted-foreground">
                                    {player.spec}{' '}
                                    {player.class}
                                </div>
                            </TableCell>
                            <TableCell>
                                {config.GUILLD_RANKS[player.guildRank] || player.guildRank}
                            </TableCell>
                            <TableCell>
                                <span
                                    className="font-bold"
                                    style={{
                                        color: getColorForParse(
                                            getValue(player)
                                        ),
                                    }}
                                >
                                    {getValue(player)}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default YearOverviewTable
