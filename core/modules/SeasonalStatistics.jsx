/**
 * @file Seasonal Statistics Component
 * @module core/modules/SeasonalStatistics
 */

import React from 'react'
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
            <div className="bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-lg p-4">
                <h6 className="text-md font-medium mb-1">No seasonal data available</h6>
                <p className="text-sm">Seasonal statistics will appear here once guild data is updated.</p>
            </div>
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

    const StatCard = ({ title, value, subtitle, color = 'currentColor' }) => (
        <div className="bg-card border border-border shadow-sm rounded-xl h-full p-6">
            <h6 className="text-muted-foreground font-medium mb-2">
                {title}
            </h6>
            <p className="text-3xl font-bold mb-2" style={{ color: color === 'currentColor' ? 'var(--foreground)' : color }}>
                {value}
            </p>
            {subtitle && (
                <p className="text-sm text-muted-foreground">
                    {subtitle}
                </p>
            )}
        </div>
    )

    const AchievementCard = ({ achievement }) => (
        <div className="bg-card border border-border shadow-sm rounded-xl h-full p-6">
            <h6 className="text-foreground text-sm font-medium mb-4">
                {achievement.title}
            </h6>
            {achievement.player && (
                <div className="mb-4">
                    <Link href={getPlayerUrl(achievement.player.name, achievement.player.realm)} className="no-underline group">
                        <h4 className={`text-2xl font-bold transition-opacity group-hover:opacity-80 text-${achievement.player.class?.toLowerCase().replace(/\s+/g, '')}`}>
                            {achievement.player.name ? achievement.player.name.charAt(0).toUpperCase() + achievement.player.name.slice(1).toLowerCase() : ''}
                        </h4>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                        {achievement.player.spec} {achievement.player.class}
                    </p>
                </div>
            )}
            {achievement.value && (
                <h5 className="text-xl font-bold" style={{ color: getScoreColor(achievement.value) }}>
                    {achievement.value}
                </h5>
            )}
        </div>
    )

    return (
        <div>
            {/* Season Info */}
            <div className="mb-6 p-6 bg-card border border-border shadow-sm rounded-xl">
                <h4 className="text-foreground text-2xl font-bold mb-2">
                    Season {data.season} Statistics
                </h4>
                <p className="text-muted-foreground">
                    Last updated: {new Date(data.lastUpdated).toLocaleString()}
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="col-span-1">
                    <StatCard 
                        title="Total Characters"
                        value={data.totalCharacters}
                        subtitle="Guild members"
                    />
                </div>
                <div className="col-span-1">
                    <StatCard 
                        title="M+ Players"
                        value={data.charactersWithMplus}
                        subtitle={`${Math.round((data.charactersWithMplus / data.totalCharacters) * 100)}% participation`}
                        color="#4CAF50"
                    />
                </div>
                <div className="col-span-1">
                    <StatCard 
                        title="Total Runs"
                        value={data.totalRuns}
                        subtitle={`${data.totalTimedRuns} timed`}
                        color="#FF9800"
                    />
                </div>
            </div>

            {/* Key Achievements */}
            <h5 className="text-foreground text-xl font-bold mb-4">
                Key Achievements
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                <div className="col-span-1">
                    <AchievementCard 
                        achievement={{
                            title: "Highest Key Overall",
                            value: data.highestKeyOverall,
                            player: data.achievements?.highestKeyOverall?.player
                        }}
                    />
                </div>
                <div className="col-span-1">
                    <AchievementCard 
                        achievement={{
                            title: "Highest Timed Key",
                            value: data.highestTimedKey,
                            player: data.achievements?.highestTimedKey?.player
                        }}
                    />
                </div>
                <div className="col-span-1">
                    <AchievementCard 
                        achievement={{
                            title: "Top Rated Player",
                            player: data.achievements?.topRatedPlayer,
                            value: data.achievements?.topRatedPlayer?.rating
                        }}
                    />
                </div>
            </div>

            {/* Top Players */}
            <h5 className="text-foreground text-xl font-bold mb-4">
                Top 5 Players
            </h5>
            <div className="mb-8 bg-card border border-border shadow-sm rounded-xl">
                <div className="p-6">
                    {data.topPlayers.slice(0, 5).map((player, index) => {
                        // Helper function to get guild data for a player
                        const getGuildPlayerData = (playerName) => {
                            if (!guildData?.data) return null
                            return guildData.data.find(char => char.name === playerName)
                        }
                        
                        const guildPlayer = getGuildPlayerData(player.name)
                        
                        return (
                            <div key={index} className="mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span 
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${index < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                                        >
                                            #{index + 1}
                                        </span>
                                        {/* Avatar */}
                                        <div className="mediaWrapper flex justify-center items-center">
                                            {guildPlayer?.media?.assets?.length ? (
                                                <img
                                                    src={guildPlayer.media.assets[0].value}
                                                    alt={player.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full border border-border shadow-sm object-cover"
                                                />
                                            ) : (
                                                <img
                                                    className="opacity-40 rounded-full border border-border shadow-sm object-cover"
                                                    src={'/images/logo-without-text.png'}
                                                    alt={player.name}
                                                    width={40}
                                                    height={40}
                                                />
                                            )}
                                        </div>
                                        <Link href={getPlayerUrl(player.name, player.realm)} className="no-underline group">
                                            <div className="cursor-pointer">
                                                <h6 className={`font-semibold text-md transition-opacity group-hover:opacity-80 text-${player.class?.toLowerCase().replace(/\s+/g, '')}`}>
                                                    {player.name ? player.name.charAt(0).toUpperCase() + player.name.slice(1).toLowerCase() : ''}
                                                </h6>
                                                <p className="text-sm text-muted-foreground mt-0.5">
                                                    {player.spec} {player.class}
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                <div className="text-right">
                                    {(() => {
                                        const guildPlayer = getGuildPlayerData(player.name)
                                        const currentScore = guildPlayer?.raw_mplus?.current_mythic_rating?.rating || player.rating || 0
                                        const scoreColor = guildPlayer?.raw_mplus?.current_mythic_rating?.color
                                        
                                        return (
                                            <h6 className="text-md font-bold" style={{ color: getScoreColor(currentScore, scoreColor) }}>
                                                {Math.round(currentScore)}
                                            </h6>
                                        )
                                    })()}
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {player.totalRuns} runs
                                    </p>
                                </div>
                            </div>
                            {index < 4 && <hr className="mt-4 border-border" />}
                        </div>
                        )
                    })}
                </div>
            </div>

            {/* Dungeon Statistics */}
            <h5 className="text-foreground text-xl font-bold mb-4">
                Dungeon Performance
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(data.dungeonLeaderboard).slice(0, 8).map(([dungeonName, stats]) => (
                    <div key={dungeonName} className="col-span-1">
                        <div className="bg-card border border-border shadow-sm rounded-xl h-full p-4">
                            <h6 className="text-foreground mb-2 text-sm font-medium">
                                {dungeonName}
                            </h6>
                            <h5 className="text-xl font-bold mb-2" style={{ color: getScoreColor(stats.highestKey * 100) }}>
                                +{stats.highestKey}
                            </h5>
                            <p className="text-sm text-muted-foreground mb-1">
                                {stats.totalRuns} runs ({stats.playerCount} players)
                            </p>
                            <p className="text-sm font-semibold" style={{ 
                                color: stats.completionRate >= 80 ? '#4CAF50' : 
                                       stats.completionRate >= 60 ? '#FF9800' : '#F44336'
                            }}>
                                {Math.round(stats.completionRate)}% timed
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SeasonalStatistics
