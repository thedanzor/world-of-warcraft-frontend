import React from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import config from '@/app.config.js'
import getRatingColor from '@/core/utils/getRatingColor'
import Link from 'next/link'

const TopPlayersTable = ({ data, title, scoreKey }) => {
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
        <Paper className="top-players-table">
            <Typography variant="h6" className="top-players-table-title">
                {title}
            </Typography>
            <TableContainer>
                <Table>
                    <TableBody>
                        {data.slice(0, 5).map((player, index) => (
                            <TableRow key={index} className="top-players-table-row">
                                <TableCell sx={{ width: 60 }}>
                                    <div className="mediaWrapper">
                                        {player?.media?.assets?.length ? (
                                            <img
                                                src={player?.media?.assets[0]?.value}
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
                                    <Link href={`/member/${player.server}/${player.name}`} style={{ textDecoration: 'none' }}>
                                        <div
                                            className={`name ${player.class}`}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span
                                                style={{
                                                    textTransform: 'capitalize',
                                                    color: '#FFFFFF',
                                                    fontWeight: '600',
                                                    '&:hover': { color: '#FFD700' }
                                                }}
                                            >
                                                {player.name}
                                            </span>
                                        </div>
                                        <div className="classandspec">
                                            {player.spec} {player.class}
                                        </div>
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {config.GUILLD_RANKS[player.guildRank] || player.guildRank || '-'}
                                </TableCell>
                                <TableCell>
                                    <span
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
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}

export default TopPlayersTable 