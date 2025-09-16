/**
 * @file Seasonal Statistics Component
 * @module core/modules/SeasonalStatistics
 */

import React from 'react'
import { 
    Typography, 
    Box, 
    Paper, 
    Grid, 
    Card, 
    CardContent,
    Chip,
    Divider,
    Alert
} from '@mui/material'
import { P } from '@/core/components/typography'
import Link from 'next/link'
import getRatingColor from '@/core/utils/getRatingColor'

const SeasonalStatistics = ({ data, guildData }) => {
    // Helper function to get guild data for a player
    const getGuildPlayerData = (playerName) => {
        if (!guildData?.data) return null
        return guildData.data.find(char => char.name === playerName)
    }

    // Helper function to generate player URL
    const getPlayerUrl = (playerName, realm) => {
        // Use realm from player data if available, otherwise try to find it from guild data
        const playerRealm = realm || (() => {
            const guildPlayer = getGuildPlayerData(playerName)
            return guildPlayer?.server || 'unknown'
        })()
        
        return `/member/${playerRealm}/${playerName}`
    }

    if (!data) {
        return (
            <Alert severity="info">
                <Typography variant="h6">No seasonal data available</Typography>
                <Typography variant="body2">Seasonal statistics will appear here once guild data is updated.</Typography>
            </Alert>
        )
    }

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

    const StatCard = ({ title, value, subtitle, color = '#FFFFFF' }) => (
        <Card sx={{ 
            backgroundColor: 'rgba(17, 17, 17, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            height: '100%'
        }}>
            <CardContent>
                <Typography variant="h6" sx={{ color: '#A3A3A3', mb: 1 }}>
                    {title}
                </Typography>
                <Typography variant="h4" sx={{ color, fontWeight: '700', mb: 1 }}>
                    {value}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" sx={{ color: '#A3A3A3' }}>
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    )

    const AchievementCard = ({ achievement }) => (
        <Card sx={{ 
            backgroundColor: 'rgba(17, 17, 17, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            height: '100%'
        }}>
            <CardContent>
                <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
                    {achievement.title}
                </Typography>
                {achievement.player && (
                    <Box sx={{ mb: 2 }}>
                        <Link href={getPlayerUrl(achievement.player.name, achievement.player.realm)} style={{ textDecoration: 'none' }}>
                            <Typography variant="h4" sx={{ 
                                color: '#B08D5A', 
                                fontWeight: '700',
                                cursor: 'pointer',
                                '&:hover': { color: '#FFFFFF' }
                            }}>
                                {achievement.player.name}
                            </Typography>
                        </Link>
                        <Typography variant="body2" sx={{ color: '#A3A3A3' }}>
                            {achievement.player.spec} {achievement.player.class}
                        </Typography>
                    </Box>
                )}
                {achievement.value && (
                    <Typography variant="h5" sx={{ color: getScoreColor(achievement.value), fontWeight: '700' }}>
                        {achievement.value}
                    </Typography>
                )}
            </CardContent>
        </Card>
    )

    return (
        <Box>
            {/* Season Info */}
            <Paper sx={{ 
                mb: 3,
                p: 3,
                backgroundColor: 'rgba(17, 17, 17, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
                <Typography variant="h4" sx={{ color: '#FFFFFF', mb: 1 }}>
                    Season {data.season} Statistics
                </Typography>
                <Typography variant="body1" sx={{ color: '#A3A3A3' }}>
                    Last updated: {new Date(data.lastUpdated).toLocaleString()}
                </Typography>
            </Paper>

            {/* Overview Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Total Characters"
                        value={data.totalCharacters}
                        subtitle="Guild members"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="M+ Players"
                        value={data.charactersWithMplus}
                        subtitle={`${Math.round((data.charactersWithMplus / data.totalCharacters) * 100)}% participation`}
                        color="#4CAF50"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Total Runs"
                        value={data.totalRuns}
                        subtitle={`${data.totalTimedRuns} timed`}
                        color="#FF9800"
                    />
                </Grid>
            </Grid>

            {/* Key Achievements */}
            <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 2 }}>
                Key Achievements
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <AchievementCard 
                        achievement={{
                            title: "Highest Key Overall",
                            value: data.highestKeyOverall,
                            player: data.achievements?.highestKeyOverall?.player
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <AchievementCard 
                        achievement={{
                            title: "Highest Timed Key",
                            value: data.highestTimedKey,
                            player: data.achievements?.highestTimedKey?.player
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <AchievementCard 
                        achievement={{
                            title: "Top Rated Player",
                            player: data.achievements?.topRatedPlayer,
                            value: data.achievements?.topRatedPlayer?.rating
                        }}
                    />
                </Grid>
            </Grid>

            {/* Top Players */}
            <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 2 }}>
                Top 5 Players
            </Typography>
            <Paper sx={{ 
                mb: 4,
                backgroundColor: 'rgba(17, 17, 17, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
                <Box sx={{ p: 3 }}>
                    {data.topPlayers.slice(0, 5).map((player, index) => {
                        // Helper function to get guild data for a player
                        const getGuildPlayerData = (playerName) => {
                            if (!guildData?.data) return null
                            return guildData.data.find(char => char.name === playerName)
                        }
                        
                        const guildPlayer = getGuildPlayerData(player.name)
                        
                        return (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Chip 
                                            label={`#${index + 1}`}
                                            size="small"
                                            sx={{ 
                                                backgroundColor: index < 3 ? '#B08D5A' : 'rgba(255, 255, 255, 0.1)',
                                                color: '#FFFFFF',
                                                fontWeight: '600'
                                            }}
                                        />
                                        {/* Avatar */}
                                        <div className="mediaWrapper" style={{ 
                                            display: 'flex', 
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            {guildPlayer?.media?.assets?.length ? (
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
                                            ) : (
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
                                            )}
                                        </div>
                                        <Link href={getPlayerUrl(player.name, player.realm)} style={{ textDecoration: 'none' }}>
                                            <div className={`name ${player.class}`} style={{ cursor: 'pointer' }}>
                                                <Typography variant="h6" sx={{ 
                                                    color: '#FFFFFF', 
                                                    fontWeight: '600',
                                                    '&:hover': { color: '#B08D5A' }
                                                }}>
                                                    {player.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#A3A3A3' }}>
                                                    {player.spec} {player.class}
                                                </Typography>
                                            </div>
                                        </Link>
                                    </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    {(() => {
                                        const guildPlayer = getGuildPlayerData(player.name)
                                        const currentScore = guildPlayer?.raw_mplus?.current_mythic_rating?.rating || player.rating || 0
                                        const scoreColor = guildPlayer?.raw_mplus?.current_mythic_rating?.color
                                        
                                        return (
                                            <Typography variant="h6" sx={{ 
                                                color: getScoreColor(currentScore, scoreColor), 
                                                fontWeight: '700' 
                                            }}>
                                                {Math.round(currentScore)}
                                            </Typography>
                                        )
                                    })()}
                                    <Typography variant="body2" sx={{ color: '#A3A3A3' }}>
                                        {player.totalRuns} runs
                                    </Typography>
                                </Box>
                            </Box>
                            {index < 4 && <Divider sx={{ mt: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
                        </Box>
                        )
                    })}
                </Box>
            </Paper>

            {/* Dungeon Statistics */}
            <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 2 }}>
                Dungeon Performance
            </Typography>
            <Grid container spacing={2}>
                {Object.entries(data.dungeonLeaderboard).slice(0, 8).map(([dungeonName, stats]) => (
                    <Grid item xs={12} sm={6} md={3} key={dungeonName}>
                        <Card sx={{ 
                            backgroundColor: 'rgba(17, 17, 17, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                            height: '100%'
                        }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1, fontSize: '0.9rem' }}>
                                    {dungeonName}
                                </Typography>
                                <Typography variant="h5" sx={{ color: getScoreColor(stats.highestKey * 100), fontWeight: '700', mb: 1 }}>
                                    +{stats.highestKey}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#A3A3A3' }}>
                                    {stats.totalRuns} runs ({stats.playerCount} players)
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    color: stats.completionRate >= 80 ? '#4CAF50' : 
                                           stats.completionRate >= 60 ? '#FF9800' : '#F44336',
                                    fontWeight: '600'
                                }}>
                                    {Math.round(stats.completionRate)}% timed
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default SeasonalStatistics
