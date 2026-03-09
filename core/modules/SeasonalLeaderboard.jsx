/**
 * @file Seasonal Leaderboard Component
 * @module core/modules/SeasonalLeaderboard
 */

import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from 'lucide-react'
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
            <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="overflow-x-auto bg-card/50">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-border">
                                <TableHead className="text-muted-foreground font-medium text-sm">Rank</TableHead>
                                <TableHead className="text-muted-foreground font-medium text-sm">Avatar</TableHead>
                                <TableHead className="text-muted-foreground font-medium text-sm">Character</TableHead>
                                <TableHead className="text-muted-foreground font-medium text-sm">Rating</TableHead>
                                <TableHead className="text-muted-foreground font-medium text-sm">Highest Key</TableHead>
                                <TableHead className="text-muted-foreground font-medium text-sm">Total Runs</TableHead>
                                <TableHead className="text-muted-foreground font-medium text-sm">Completion Rate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentLeaderboardData.map((player, index) => {
                                const sanitizedClass = player.class ? player.class.toLowerCase().replace(/\s+/g, '') : ''
                                const capitalizedName = player.name ? player.name.charAt(0).toUpperCase() + player.name.slice(1).toLowerCase() : ''
                                return (
                                <TableRow key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                                    <TableCell className="text-muted-foreground">
                                        <Badge 
                                            variant="secondary"
                                            className={`font-semibold ${index < 3 ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                                        >
                                            #{index + 1}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        <div className="flex justify-center items-center">
                                            {(() => {
                                                const guildPlayer = getGuildPlayerData(player.name)
                                                if (guildPlayer?.media?.assets?.length) {
                                                    return (
                                                        <img
                                                            src={guildPlayer.media.assets[0].value}
                                                            alt={player.name}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-full border border-border shadow-sm object-cover"
                                                        />
                                                    )
                                                } else {
                                                    return (
                                                        <img
                                                            className="opacity-40 rounded-full border border-border shadow-sm object-cover"
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
                                    <TableCell className="text-muted-foreground">
                                        <Link href={getPlayerUrl(player.name, guildData, player.realm)} className="no-underline group block">
                                            <div className="cursor-pointer">
                                                <P className={`font-bold transition-opacity group-hover:opacity-80 text-${sanitizedClass}`}>
                                                    {capitalizedName}
                                                </P>
                                                <P className="text-xs text-muted-foreground mt-0.5 font-medium">
                                                    {player.spec} {player.class}
                                                </P>
                                            </div>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {(() => {
                                            const guildPlayer = getGuildPlayerData(player.name)
                                            const currentScore = guildPlayer?.raw_mplus?.current_mythic_rating?.rating || player.rating || 0
                                            const scoreColor = guildPlayer?.raw_mplus?.current_mythic_rating?.color
                                            
                                            return (
                                                <span className="font-bold text-md" style={{ color: getScoreColor(currentScore, scoreColor) }}>
                                                    {Math.round(currentScore)}
                                                </span>
                                            )
                                        })()}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="font-medium cursor-help border-b border-dotted border-muted-foreground/30 pb-0.5">
                                                        {player.highestTimedKey}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Timed: {player.highestTimedKey}, Overall: {player.highestKeyOverall}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground font-medium">
                                        {player.totalRuns}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        <span className="font-semibold" style={{ 
                                            color: player.completionRate >= 80 ? '#4CAF50' : 
                                                   player.completionRate >= 60 ? '#FF9800' : '#F44336'
                                        }}>
                                            {Math.round(player.completionRate)}%
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

    const renderDungeonsLeaderboard = () => (
        <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto bg-card/50">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border">
                            <TableHead className="text-muted-foreground font-medium text-sm">Dungeon</TableHead>
                            <TableHead className="text-muted-foreground font-medium text-sm">Highest Key</TableHead>
                            <TableHead className="text-muted-foreground font-medium text-sm">Total Runs</TableHead>
                            <TableHead className="text-muted-foreground font-medium text-sm">Timed Runs</TableHead>
                            <TableHead className="text-muted-foreground font-medium text-sm">Completion Rate</TableHead>
                            <TableHead className="text-muted-foreground font-medium text-sm">Players</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentLeaderboardData.map((dungeon, index) => (
                            <TableRow key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                                <TableCell className="text-muted-foreground">
                                    <P className="font-semibold text-foreground">
                                        {dungeon.name}
                                    </P>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    <span className="font-bold text-md" style={{ color: getScoreColor(dungeon.highestKey * 100) }}>
                                        {dungeon.highestKey}
                                    </span>
                                </TableCell>
                                <TableCell className="text-muted-foreground font-medium">
                                    {dungeon.totalRuns}
                                </TableCell>
                                <TableCell className="text-muted-foreground font-medium">
                                    {dungeon.timedRuns}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    <span className="font-semibold" style={{ 
                                        color: dungeon.completionRate >= 80 ? '#4CAF50' : 
                                               dungeon.completionRate >= 60 ? '#FF9800' : '#F44336'
                                    }}>
                                        {Math.round(dungeon.completionRate)}%
                                    </span>
                                </TableCell>
                                <TableCell className="text-muted-foreground font-medium">
                                    {dungeon.playerCount}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )

    const renderRolesLeaderboard = () => (
        <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto bg-card/50">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border">
                            <TableHead className="text-muted-foreground font-medium text-sm">Role</TableHead>
                            <TableHead className="text-muted-foreground font-medium text-sm">Average Rating</TableHead>
                            <TableHead className="text-muted-foreground font-medium text-sm">Total Runs</TableHead>
                            <TableHead className="text-muted-foreground font-medium text-sm">Timed Runs</TableHead>
                            <TableHead className="text-muted-foreground font-medium text-sm">Completion Rate</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentLeaderboardData.map((role, index) => (
                            <TableRow key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                                <TableCell className="text-muted-foreground">
                                    <P className="font-semibold text-foreground">
                                        {role.name}
                                    </P>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    <span className="font-bold text-md" style={{ color: getScoreColor(role.averageRating) }}>
                                        {Math.round(role.averageRating)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-muted-foreground font-medium">
                                    {role.totalRuns}
                                </TableCell>
                                <TableCell className="text-muted-foreground font-medium">
                                    {role.timedRuns}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    <span className="font-semibold" style={{ 
                                        color: role.completionRate >= 80 ? '#4CAF50' : 
                                               role.completionRate >= 60 ? '#FF9800' : '#F44336'
                                    }}>
                                        {Math.round(role.completionRate)}%
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )

    if (!data) {
        return (
            <Alert variant="default" className="bg-blue-500/10 border-blue-500/20 text-blue-200">
                <Info className="h-4 w-4" />
                <AlertTitle>No seasonal data available</AlertTitle>
                <AlertDescription>
                    Seasonal statistics will appear here once guild data is updated.
                </AlertDescription>
            </Alert>
        )
    }


    return (
        <div>
            {/* Leaderboard Type Selector */}
            <div className="mb-6 flex gap-2">
                {['players', 'dungeons', 'roles'].map((type) => (
                    <Badge
                        key={type}
                        variant="secondary"
                        onClick={() => setLeaderboardType(type)}
                        className={`cursor-pointer px-4 py-1.5 text-sm font-semibold transition-colors ${
                            leaderboardType === type 
                                ? 'bg-[#FFD700] text-black hover:bg-[#FFD700]/90' 
                                : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Badge>
                ))}
            </div>

            {/* Leaderboard Content */}
            {leaderboardType === 'players' && renderPlayersLeaderboard()}
            {leaderboardType === 'dungeons' && renderDungeonsLeaderboard()}
            {leaderboardType === 'roles' && renderRolesLeaderboard()}
        </div>
    )
}

export default SeasonalLeaderboard
