import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
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
        <TableContainer>
            <Table>
                <TableBody>
                    {data.map((player, index) => (
                        <TableRow
                            key={index}
                            onClick={() => {
                                window.location.href = `/2024/${player.name}`
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <TableCell sx={{ width: 60 }}>
                                <div className="mediaWrapper">
                                    {player?.media?.assets?.length ? (
                                        <img
                                            src={
                                                player?.media?.assets[0]?.value
                                            }
                                            alt={player.name}
                                            width={40}
                                            height={40}
                                        />
                                    ) : (
                                        <img
                                            style={{ opacity: '0.4' }}
                                            src="/images/logo-without-text.png"
                                            alt={player.name}
                                            width={40}
                                            height={40}
                                        />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell sx={{ width: 240 }}>
                                <div
                                    className={`name ${player.class}`}
                                >
                                    <span
                                        style={{ textTransform: 'capitalize' }}
                                    >
                                        {player.name}
                                    </span>
                                </div>
                                <div className="classandspec">
                                    {player.spec}{' '}
                                    {player.class}
                                </div>
                            </TableCell>
                            <TableCell>
                                {config.GUILLD_RANKS[player.guildRank] || player.guildRank}
                            </TableCell>
                            <TableCell>
                                <span
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
                        // </Link>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default YearOverviewTable
