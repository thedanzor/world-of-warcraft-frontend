/**
 * @file Seasonal Leaderboard Component
 * @module core/modules/SeasonalLeaderboard
 */

import React, { useState } from 'react'
import { 
    Typography, 
    Box, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Chip,
    Tooltip,
    Alert
} from '@mui/material'
import { P } from '@/core/components/typography'
import Link from 'next/link'
import getRatingColor from '@/core/utils/getRatingColor'
// Removed incorrect import - functions will be defined locally

const SeasonalLeaderboard = ({ data, leaderboardData, guildData }) => {
    const [leaderboardType, setLeaderboardType] = useState('players')

    // Helper function to get guild data for a player
    const getGuildPlayerData = (playerName) => {
        if (!guildData?.data) return null
        return guildData.data.find(char => char.name === playerName)
    }

    // Helper function to generate player URL
    const getPlayerUrl = (playerName, guildData, realm) => {
        // Use realm from player data if available, otherwise try to find it from guild data
        const playerRealm = realm || (() => {
            const guildPlayer = getGuildPlayerData(playerName)
            return guildPlayer?.server || 'unknown'
        })()
        
        return `/member/${playerRealm}/${playerName}`
    }

    // Get current leaderboard data based on selected type
    const getCurrentLeaderboardData = () => {
        if (!leaderboardData) return []
        
        switch (leaderboardType) {
            case 'players':
                return leaderboardData.players || []
            case 'dungeons':
                return leaderboardData.dungeons || []
            case 'roles':
                return leaderboardData.roles || []
            default:
                return []
        }
    }

    const currentLeaderboardData = getCurrentLeaderboardData()

    const getScoreColor = (score, color = null) => {
        // Use the color from API if available
        if (color) {
            // Convert RGB color object to hex string
            if (typeof color === 'object' && color.r !== undefined) {
                const r = Math.round(color.r)
                const g = Math.round(color.g)
                const b = Math.round(color.b)
                return `rgb(${r}, ${g}, ${b})`
            }
            return color
        }
        
        // Fallback to utility function
        return getRatingColor(score, 'mplus')
    }

    const renderPlayersLeaderboard = () => {
        // Calculate total score using guild data for accurate scores
        const totalScore = currentLeaderboardData.reduce((sum, player) => {
            const guildPlayer = getGuildPlayerData(player.name)
            const currentScore = guildPlayer?.raw_mplus?.current_mythic_rating?.rating || player.rating || 0
            return sum + currentScore
        }, 0)
        const averageScore = currentLeaderboardData.length > 0 ? totalScore / currentLeaderboardData.length : 0

        return (
            <Box>
                <TableContainer component={Paper} sx={{ 
                    backgroundColor: 'rgba(17, 17, 17, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Rank</TableCell>
                                <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Avatar</TableCell>
                                <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Character</TableCell>
                                <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Rating</TableCell>
                                <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Highest Key</TableCell>
                                <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Total Runs</TableCell>
                                <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Completion Rate</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentLeaderboardData.map((player, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ color: '#A3A3A3' }}>
                                        <Chip 
                                            label={`#${index + 1}`}
                                            size="small"
                                            sx={{ 
                                                backgroundColor: index < 3 ? '#B08D5A' : 'rgba(255, 255, 255, 0.1)',
                                                color: '#FFFFFF',
                                                fontWeight: '600'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ color: '#A3A3A3' }}>
                                        <div className="mediaWrapper" style={{ 
                                            display: 'flex', 
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            {(() => {
                                                const guildPlayer = getGuildPlayerData(player.name)
                                                if (guildPlayer?.media?.assets?.length) {
                                                    return (
                                                        <img
                                                            src={guildPlayer.media.assets[0].value}
                                                            alt={player.name}
                                                            width={40}
                                                            height={40}
                                                            style={{
                                                                borderRadius: '8px',
                                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                                                            }}
                                                        />
                                                    )
                                                } else {
                                                    return (
                                                        <img
                                                            style={{ 
                                                                opacity: '0.4',
                                                                borderRadius: '8px',
                                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                                                            }}
                                                            src={'/images/logo-without-text.png'}
                                                            alt={player.name}
                                                            width={40}
                                                            height={40}
                                                        />
                                                    )
                                                }
                                            })()}
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{ color: '#A3A3A3' }}>
                                        <Link href={getPlayerUrl(player.name, guildData, player.realm)} style={{ textDecoration: 'none' }}>
                                            <div className={`name ${player.class}`} style={{ cursor: 'pointer' }}>
                                                <P sx={{ 
                                                    fontWeight: '600', 
                                                    color: '#FFFFFF',
                                                    '&:hover': { color: '#B08D5A' }
                                                }}>
                                                    {player.name}
                                                </P>
                                                <P sx={{ fontSize: '0.875rem', color: '#A3A3A3' }}>
                                                    {player.spec} {player.class}
                                                </P>
                                            </div>
                                        </Link>
                                    </TableCell>
                                    <TableCell sx={{ color: '#A3A3A3' }}>
                                        {(() => {
                                            const guildPlayer = getGuildPlayerData(player.name)
                                            const currentScore = guildPlayer?.raw_mplus?.current_mythic_rating?.rating || player.rating || 0
                                            const scoreColor = guildPlayer?.raw_mplus?.current_mythic_rating?.color
                                            
                                            return (
                                                <span style={{ 
                                                    color: getScoreColor(currentScore, scoreColor),
                                                    fontWeight: '700',
                                                    fontSize: '1.125rem'
                                                }}>
                                                    {Math.round(currentScore)}
                                                </span>
                                            )
                                        })()}
                                    </TableCell>
                                    <TableCell sx={{ color: '#A3A3A3' }}>
                                        <Tooltip title={`Timed: ${player.highestTimedKey}, Overall: ${player.highestKeyOverall}`}>
                                            <span style={{ fontWeight: '600' }}>
                                                {player.highestTimedKey}
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell sx={{ color: '#A3A3A3' }}>
                                        {player.totalRuns}
                                    </TableCell>
                                    <TableCell sx={{ color: '#A3A3A3' }}>
                                        <span style={{ 
                                            color: player.completionRate >= 80 ? '#4CAF50' : 
                                                   player.completionRate >= 60 ? '#FF9800' : '#F44336',
                                            fontWeight: '600'
                                        }}>
                                            {Math.round(player.completionRate)}%
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }

    const renderDungeonsLeaderboard = () => (
        <TableContainer component={Paper} sx={{ 
            backgroundColor: 'rgba(17, 17, 17, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Dungeon</TableCell>
                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Highest Key</TableCell>
                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Total Runs</TableCell>
                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Timed Runs</TableCell>
                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Completion Rate</TableCell>
                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Players</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentLeaderboardData.map((dungeon, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ color: '#A3A3A3' }}>
                                <P sx={{ fontWeight: '600', color: '#FFFFFF' }}>
                                    {dungeon.name}
                                </P>
                            </TableCell>
                            <TableCell sx={{ color: '#A3A3A3' }}>
                                <span style={{ 
                                    color: getScoreColor(dungeon.highestKey * 100),
                                    fontWeight: '700',
                                    fontSize: '1.125rem'
                                }}>
                                    {dungeon.highestKey}
                                </span>
                            </TableCell>
                            <TableCell sx={{ color: '#A3A3A3' }}>
                                {dungeon.totalRuns}
                            </TableCell>
                            <TableCell sx={{ color: '#A3A3A3' }}>
                                {dungeon.timedRuns}
                            </TableCell>
                            <TableCell sx={{ color: '#A3A3A3' }}>
                                <span style={{ 
                                    color: dungeon.completionRate >= 80 ? '#4CAF50' : 
                                           dungeon.completionRate >= 60 ? '#FF9800' : '#F44336',
                                    fontWeight: '600'
                                }}>
                                    {Math.round(dungeon.completionRate)}%
                                </span>
                            </TableCell>
                            <TableCell sx={{ color: '#A3A3A3' }}>
                                {dungeon.playerCount}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )

    const renderRolesLeaderboard = () => (
        <TableContainer component={Paper} sx={{ 
            backgroundColor: 'rgba(17, 17, 17, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Role</TableCell>
                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Average Rating</TableCell>
                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Total Runs</TableCell>
                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Timed Runs</TableCell>
                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Completion Rate</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentLeaderboardData.map((role, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ color: '#A3A3A3' }}>
                                <P sx={{ fontWeight: '600', color: '#FFFFFF' }}>
                                    {role.name}
                                </P>
                            </TableCell>
                            <TableCell sx={{ color: '#A3A3A3' }}>
                                <span style={{ 
                                    color: getScoreColor(role.averageRating),
                                    fontWeight: '700',
                                    fontSize: '1.125rem'
                                }}>
                                    {Math.round(role.averageRating)}
                                </span>
                            </TableCell>
                            <TableCell sx={{ color: '#A3A3A3' }}>
                                {role.totalRuns}
                            </TableCell>
                            <TableCell sx={{ color: '#A3A3A3' }}>
                                {role.timedRuns}
                            </TableCell>
                            <TableCell sx={{ color: '#A3A3A3' }}>
                                <span style={{ 
                                    color: role.completionRate >= 80 ? '#4CAF50' : 
                                           role.completionRate >= 60 ? '#FF9800' : '#F44336',
                                    fontWeight: '600'
                                }}>
                                    {Math.round(role.completionRate)}%
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )

    if (!data) {
        return (
            <Alert severity="info">
                <Typography variant="h6">No seasonal data available</Typography>
                <Typography variant="body2">Seasonal statistics will appear here once guild data is updated.</Typography>
            </Alert>
        )
    }


    return (
        <Box>
            {/* Leaderboard Type Selector */}
            <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
                {['players', 'dungeons', 'roles'].map((type) => (
                    <Chip
                        key={type}
                        label={type.charAt(0).toUpperCase() + type.slice(1)}
                        onClick={() => setLeaderboardType(type)}
                        sx={{
                            backgroundColor: leaderboardType === type ? '#B08D5A' : 'rgba(255, 255, 255, 0.1)',
                            color: '#FFFFFF',
                            fontWeight: '600',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: leaderboardType === type ? '#B08D5A' : 'rgba(255, 255, 255, 0.2)'
                            }
                        }}
                    />
                ))}
            </Box>

            {/* Leaderboard Content */}
            {leaderboardType === 'players' && renderPlayersLeaderboard()}
            {leaderboardType === 'dungeons' && renderDungeonsLeaderboard()}
            {leaderboardType === 'roles' && renderRolesLeaderboard()}
        </Box>
    )
}

export default SeasonalLeaderboard
