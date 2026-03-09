import { useState, useEffect } from 'react'
import { P } from '@/core/components/typography'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'

import config from '@/app.config.js'

const { RESULTS_PAGINATION } = config

// Helper function to capitalize character names
const capitalizeCharacterName = (name) => {
    if (!name) return name
    // Split by hyphen to handle "name-realm" format, capitalize each part
    return name.split('-').map(part => {
        if (!part) return part
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    }).join('-')
}

// Dungeon mapping for display names
const DUNGEON_NAMES = {
    392: "Tazavesh: So'leah's Gambit",
    391: "Tazavesh: Streets of Wonder",
    505: "The Dawnbreaker",
    378: "Halls of Atonement",
    499: "Priory of the Sacred Flame",
    525: "Operation: Floodgate",
    542: "Eco-Dome Al'dani",
    503: "Ara-Kara, City of Echoes",
    // Add more dungeon mappings as needed
}

const getDungeonDisplayName = (dungeonId, dungeonName = null) => {
    return DUNGEON_NAMES[dungeonId] || dungeonName || `Dungeon ${dungeonId}`
}

const getDungeonScore = (character, dungeonId) => {
    if (!character.raw_mplus?.current_period?.best_runs) {
        console.log('No best_runs for character:', character.name)
        return null
    }
    
    // Convert dungeonId to number for comparison
    const numericDungeonId = parseInt(dungeonId, 10)
    
    const run = character.raw_mplus.current_period.best_runs.find(
        run => run.dungeon.id === numericDungeonId
    )
    
    if (!run) {
        console.log(`No run found for dungeon ${dungeonId} (numeric: ${numericDungeonId}) for character ${character.name}`)
        return null
    }
    
    return {
        rating: run.mythic_rating.rating,
        color: run.mythic_rating.color,
        mapRating: run.map_rating.rating,
        mapColor: run.map_rating.color,
        keystoneLevel: run.keystone_level,
        isCompletedWithinTime: run.is_completed_within_time,
        duration: run.duration
    }
}

const getTotalScore = (character) => {
    return character.raw_mplus?.current_mythic_rating?.rating || 0
}

const getScoreColor = (score, color = null) => {
    if (!score) return '#666'
    
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
    
    // Fallback to our color logic
    if (score >= 3000) return '#ffd700' // Gold
    if (score >= 2500) return '#c0c0c0' // Silver
    if (score >= 2000) return '#cd7f32' // Bronze
    if (score >= 1500) return '#4CAF50' // Green
    if (score >= 1000) return '#FFD700' // Gold (our theme color)
    return '#B0C4DE' // Gray (matching dashboard secondary text)
}

const MythicPlusBlock = ({ data, name, hideControls }) => {
    if (!data[name]?.length) {
        return null
    }

    const renderData = data[name]
    const [order, setOrder] = useState('desc')
    const [orderBy, setOrderBy] = useState('totalScore')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(RESULTS_PAGINATION.MAX_ITEMS)

    // Get unique dungeon IDs and names from all characters
    const dungeonData = renderData.reduce((acc, character) => {
        if (character.raw_mplus?.current_period?.best_runs) {
            character.raw_mplus.current_period.best_runs.forEach(run => {
                acc[run.dungeon.id] = run.dungeon.name
            })
        }
        return acc
    }, {})
    
    const dungeonIds = Object.keys(dungeonData).sort()

    const headCells = [
        { id: 'avatar', label: '', sortable: false, width: 120 },
        { id: 'name', label: 'Character', sortable: true, width: 200 },
        { id: 'totalScore', label: 'Total Score', sortable: true, width: 120 },
        ...dungeonIds.map(id => ({
            id: `dungeon_${id}`,
            label: getDungeonDisplayName(id, dungeonData[id]),
            sortable: false,
            width: 120
        }))
    ]

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    // Reset pagination when data changes
    useEffect(() => {
        setPage(0)
    }, [data])

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy)
    }

    const descendingComparator = (a, b, orderBy) => {
        switch (orderBy) {
            case 'name':
                return a.name.localeCompare(b.name)
            case 'totalScore':
                return getTotalScore(b) - getTotalScore(a)
            default:
                return 0
        }
    }

    const sortedData = renderData
        .filter(character => character.raw_mplus?.current_mythic_rating?.rating > 0)
        .sort(getComparator(order, orderBy))

    return (
        <div className="w-full mb-4 bg-card border border-border shadow-sm rounded-xl overflow-hidden">
            <TooltipProvider>
                <div className="overflow-x-auto bg-card/50">
                    <Table className="min-w-[750px]">
                        <TableHeader>
                            <TableRow className="border-b border-border hover:bg-transparent">
                                {headCells.map((headCell) => (
                                    <TableHead
                                        key={headCell.id}
                                        style={{ width: headCell.width }}
                                        className="text-muted-foreground font-medium text-sm py-3 px-2 sm:px-4"
                                    >
                                        {headCell.sortable ? (
                                            <div
                                                className="flex items-center cursor-pointer select-none"
                                                onClick={(event) => handleRequestSort(event, headCell.id)}
                                            >
                                                {headCell.label}
                                                {orderBy === headCell.id ? (
                                                    <span className="ml-1 text-xs">
                                                        {order === 'desc' ? '▼' : '▲'}
                                                    </span>
                                                ) : null}
                                            </div>
                                        ) : (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-xs cursor-help">
                                                        {headCell.label.length > 15 
                                                            ? headCell.label.substring(0, 15) + '...'
                                                            : headCell.label
                                                        }
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <p>{headCell.label}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedData
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((character, index) => (
                                    <TableRow key={index} className="hover:bg-muted/30 border-b border-border transition-colors">
                                        <TableCell style={{ width: 120 }} className="p-2 sm:p-4 text-muted-foreground">
                                            <div className="mediaWrapper flex justify-center items-center">
                                                {character?.media?.assets?.length ? (
                                                    <img
                                                        src={character?.media?.assets[0]?.value}
                                                        alt={capitalizeCharacterName(character.name)}
                                                        width={48}
                                                        height={48}
                                                        className="rounded-full border border-border shadow-sm object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        className="opacity-40 rounded-full border border-border shadow-sm object-cover"
                                                        src={'/images/logo-without-text.png'}
                                                        alt={capitalizeCharacterName(character.name)}
                                                        width={48}
                                                        height={48}
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell style={{ width: 200 }} className="p-2 sm:p-4 text-muted-foreground">
                                            <Link href={`/member/${character.server}/${character.name}`} className="no-underline block group">
                                                <div className="cursor-pointer">
                                                    <P className={`font-bold transition-opacity group-hover:opacity-80 text-${character.class?.toLowerCase().replace(/\s+/g, '')}`}>
                                                        {capitalizeCharacterName(character.name)}
                                                    </P>
                                                </div>
                                                <div className="classandspec mt-0.5">
                                                    <P className="spec text-xs text-muted-foreground font-medium">
                                                        {character.metaData?.spec || character.spec} {character.class}
                                                    </P>
                                                </div>
                                            </Link>
                                        </TableCell>
                                        <TableCell style={{ width: 120 }} className="p-2 sm:p-4 text-muted-foreground">
                                            <span style={{ 
                                                color: getScoreColor(getTotalScore(character), character.raw_mplus?.current_mythic_rating?.color),
                                                fontWeight: '700',
                                                fontSize: '1.125rem'
                                            }}>
                                                {Math.round(getTotalScore(character))}
                                            </span>
                                        </TableCell>
                                        {dungeonIds.map(dungeonId => (
                                            <TableCell key={dungeonId} style={{ width: 120 }} className="p-2 sm:p-4 text-muted-foreground">
                                                {(() => {
                                                    const dungeonScoreData = getDungeonScore(character, dungeonId)
                                                    if (!dungeonScoreData) {
                                                        return (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <span className="text-muted-foreground/50 cursor-help">-</span>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top">
                                                                    <p>No data available</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )
                                                    }
                                                    return (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="font-bold cursor-help" style={{ 
                                                                    color: getScoreColor(dungeonScoreData.rating, dungeonScoreData.color)
                                                                }}>
                                                                    {Math.round(dungeonScoreData.rating)}
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top">
                                                                <div className="whitespace-pre-line">
                                                                    {`${getDungeonDisplayName(dungeonId, dungeonData[dungeonId])}\n`}
                                                                    {`Rating: ${Math.round(dungeonScoreData.rating)}\n`}
                                                                    {`Level: ${dungeonScoreData.keystoneLevel}\n`}
                                                                    {`Timed: ${dungeonScoreData.isCompletedWithinTime ? 'Yes' : 'No'}`}
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )
                                                })()}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </TooltipProvider>
            {!hideControls && (
                <div className="flex items-center justify-end px-4 py-3 border-t border-border bg-card/50">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Rows per page:</span>
                            <select 
                                className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                value={rowsPerPage} 
                                onChange={handleChangeRowsPerPage}
                            >
                                {[20, 50, 80, 100].map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{sortedData.length === 0 ? 0 : page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, sortedData.length)} of {sortedData.length}</span>
                            <div className="flex space-x-1">
                                <button 
                                    onClick={(e) => handleChangePage(e, page - 1)} 
                                    disabled={page === 0}
                                    className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Prev
                                </button>
                                <button 
                                    onClick={(e) => handleChangePage(e, page + 1)} 
                                    disabled={page >= Math.ceil(sortedData.length / rowsPerPage) - 1 || sortedData.length === 0}
                                    className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MythicPlusBlock
