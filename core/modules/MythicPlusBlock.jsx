import { useState, useEffect } from 'react'
import { P } from '@/core/components/typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { visuallyHidden } from '@mui/utils'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import Link from 'next/link'

import config from '@/app.config.js'

const { RESULTS_PAGINATION } = config

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
        <Paper sx={{ 
            width: '100%', 
            mb: 2,
            backgroundColor: 'rgba(17, 17, 17, 0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
            <TableContainer sx={{ 
                '& .MuiTable-root': {
                    backgroundColor: '#101a29',
                    '& .MuiTableHead-root .MuiTableRow-root .MuiTableCell-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        color: '#FFFFFF',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        letterSpacing: '-0.025em'
                    },
                    '& .MuiTableBody-root .MuiTableRow-root': {
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.02)'
                        },
                        '& .MuiTableCell-root': {
                            color: '#B0C4DE',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                        }
                    }
                }
            }}>
                <Table sx={{ 
                    minWidth: 750,
                    '& .MuiTableCell-root': {
                        padding: { xs: 1, sm: 2 },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }
                }} aria-labelledby="tableTitle">
                    <TableHead>
                        <TableRow>
                            {headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    sortDirection={
                                        orderBy === headCell.id ? order : false
                                    }
                                    sx={{ width: headCell.width }}
                                >
                                    {headCell.sortable ? (
                                        <TableSortLabel
                                            active={orderBy === headCell.id}
                                            direction={
                                                orderBy === headCell.id ? order : 'asc'
                                            }
                                            onClick={(event) => handleRequestSort(event, headCell.id)}
                                        >
                                            {headCell.label}
                                            {orderBy === headCell.id ? (
                                                <Box
                                                    component="span"
                                                    sx={visuallyHidden}
                                                >
                                                    {order === 'desc'
                                                        ? 'sorted descending'
                                                        : 'sorted ascending'}
                                                </Box>
                                            ) : null}
                                        </TableSortLabel>
                                    ) : (
                                        <Tooltip title={headCell.label} placement="top">
                                            <span style={{ fontSize: '0.8rem' }}>
                                                {headCell.label.length > 15 
                                                    ? headCell.label.substring(0, 15) + '...'
                                                    : headCell.label
                                                }
                                            </span>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((character, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ width: 120 }}>
                                        <div className="mediaWrapper" style={{ 
                                            display: 'flex', 
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            {character?.media?.assets?.length ? (
                                                                                            <img
                                                src={character?.media?.assets[0]?.value}
                                                alt={character.name}
                                                width={60}
                                                height={60}
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
                                                    alt={character.name}
                                                    width={60}
                                                    height={60}
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{ width: 200 }}>
                                        <Link href={`/member/${character.server}/${character.name}`} style={{ textDecoration: 'none' }}>
                                            <div className={`name ${character.class}`} style={{ cursor: 'pointer' }}>
                                                <P sx={{ 
                                                    color: '#FFFFFF', 
                                                    fontWeight: '600',
                                                    '&:hover': { color: '#FFD700' }
                                                }}>
                                                    {character.name}
                                                </P>
                                            </div>
                                            <div className="classandspec">
                                                <P className="spec" sx={{ color: '#B0C4DE' }}>
                                                    {character.metaData?.spec || character.spec} {character.class}
                                                </P>
                                            </div>
                                        </Link>
                                    </TableCell>
                                                                         <TableCell sx={{ width: 120 }}>
                                         <span style={{ 
                                             color: getScoreColor(getTotalScore(character), character.raw_mplus?.current_mythic_rating?.color),
                                             fontWeight: '700',
                                             fontSize: '1.125rem'
                                         }}>
                                             {Math.round(getTotalScore(character))}
                                         </span>
                                     </TableCell>
                                    {dungeonIds.map(dungeonId => (
                                        <TableCell key={dungeonId} sx={{ width: 120 }}>
                                            {(() => {
                                                const dungeonScoreData = getDungeonScore(character, dungeonId)
                                                if (!dungeonScoreData) {
                                                    return (
                                                        <Tooltip title="No data available" placement="top">
                                                            <span style={{ color: '#B0C4DE' }}>-</span>
                                                        </Tooltip>
                                                    )
                                                }
                                                return (
                                                    <Tooltip 
                                                        title={
                                                            <div style={{ whiteSpace: 'pre-line' }}>
                                                                {`${getDungeonDisplayName(dungeonId, dungeonData[dungeonId])}\n`}
                                                                {`Rating: ${Math.round(dungeonScoreData.rating)}\n`}
                                                                {`Level: ${dungeonScoreData.keystoneLevel}\n`}
                                                                {`Timed: ${dungeonScoreData.isCompletedWithinTime ? 'Yes' : 'No'}`}
                                                            </div>
                                                        } 
                                                        placement="top"
                                                    >
                                                        <span style={{ 
                                                            color: getScoreColor(dungeonScoreData.rating, dungeonScoreData.color),
                                                            fontWeight: '700'
                                                        }}>
                                                            {Math.round(dungeonScoreData.rating)}
                                                        </span>
                                                    </Tooltip>
                                                )
                                            })()}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {!hideControls && (
                <TablePagination
                    rowsPerPageOptions={[20, 50, 80, 100]}
                    component="div"
                    count={sortedData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
        </Paper>
    )
}

export default MythicPlusBlock
