import { useState, useEffect } from 'react'
import { P } from '@/core/components/typography'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

import config from '@/app.config.js'

const {
    GUILLD_RANKS,
    RESULTS_PAGINATION,
    MIN_TIER_ITEMLEVEL,
    SEASON_START_DATE,
} = config

const processMissingEnchants = (missingEnchants) => {
    if (!missingEnchants || missingEnchants.length === 0) {
        return <span>none</span>
    }

    const amount = missingEnchants.length
    const value = missingEnchants.join(', ')

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="cursor-help border-b border-dotted border-muted-foreground/50">{amount}</span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{value}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

const processTierItems = (tierSets) => {
    if (!tierSets) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="cursor-help border-b border-dotted border-muted-foreground/50">N/A</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>No tier set information available</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    const { season1, season2 } = tierSets;
    
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="cursor-help border-b border-dotted border-muted-foreground/50">{`${season1}/5 | ${season2}/5`}</span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{`Season 1: ${season1}/5 | Season 2: ${season2}/5`}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

const headCells = [
    { id: 'avatar', label: '', sortable: false, width: 120 },
    { id: 'itemlevel', label: 'ILvL', sortable: true, width: 50 },
    { id: 'name', label: 'Name & Spec', sortable: true, width: 240 },
    { id: 'guildRank', label: 'Guild Rank', sortable: false },
    { id: 'score', label: 'M+ Score', sortable: true },
    { id: 'pvp', label: 'PvP Rating', sortable: true },
    { id: 'enchants', label: 'Missing Enchants', sortable: false },
    { id: 'tier', label: 'Tier Sets (S2|S3)', sortable: false },
    { id: 'locked', label: 'Locked', sortable: false },
]

function EnhancedTableHead({ order, orderBy, onRequestSort, officerList }) {
    const createSortHandler = (property) => (event) => {
        if (property !== 'avatar') {
            onRequestSort(event, property)
        }
    }

    return (
        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-border">
                                {headCells.map((headCell) => {
                                    if (
                                        officerList &&
                                        [
                                            'guildRank',
                                            'enchants',
                                            'tier',
                                            'locked',
                                            'lastUpdated',
                                        ].includes(headCell.id)
                                    ) {
                                        return null
                                    }
                                    return (
                                        <TableHead
                                            key={headCell.id}
                                            style={{ width: headCell.width }}
                                            className="text-muted-foreground font-medium text-sm"
                                        >
                                            {headCell.sortable ? (
                                                <button
                                                    onClick={createSortHandler(headCell.id)}
                                                    className="flex items-center gap-1 hover:text-foreground transition-colors focus:outline-none"
                                                >
                                    {headCell.label}
                                    {orderBy === headCell.id ? (
                                        <span className="flex flex-col">
                                            {order === 'desc' ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronUp className="h-4 w-4" />
                                            )}
                                        </span>
                                    ) : (
                                        <span className="w-4" /> // Placeholder for alignment
                                    )}
                                </button>
                            ) : (
                                headCell.label
                            )}
                        </TableHead>
                    )
                })}
            </TableRow>
        </TableHeader>
    )
}

const getStatDifference = (current, stats) => {
    if (!stats) return null

    const seasonDate = new Date(SEASON_START_DATE)
    const now = Date.now()

    // If we're past season 2 start date, use season 2 date as reference
    const referenceDate =
        now >= seasonDate.getTime() ? seasonDate.getTime() : now
    const sevenDaysAgo = referenceDate - 7 * 24 * 60 * 60 * 1000

    // Find the closest timestamp to 7 days ago
    const oldestValidTimestamp = Object.keys(stats)
        .map(Number)
        .filter(
            (timestamp) =>
                timestamp >= sevenDaysAgo && timestamp <= referenceDate
        )
        .sort((a, b) => a - b)[0]

    if (!oldestValidTimestamp || !stats[oldestValidTimestamp]) return null

    return {
        timestamp: oldestValidTimestamp,
        data: stats[oldestValidTimestamp],
    }
}

const AuditBlock = ({ data, name, hideControls }) => {
    const [order, setOrder] = useState('desc')
    const [orderBy, setOrderBy] = useState('itemlevel')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(RESULTS_PAGINATION.MAX_ITEMS)

    // Reset pagination when data changes
    useEffect(() => {
        setPage(0)
    }, [data])

    if (!data[name]?.length && name !== 'locked') {
        return null
    }

    const renderData = name !== 'locked' ? data[name] : data

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

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy)
    }

    const descendingComparator = (a, b, orderBy) => {
        switch (orderBy) {
            case 'itemlevel':
                return b.itemLevel - a.itemLevel
            case 'name':
                return b.name.localeCompare(a.name)
            case 'score':
                return (Math.round(b.mplus) || 0) - (Math.round(a.mplus) || 0)
            case 'pvp':
                return (b.pvp || 0) - (a.pvp || 0)
            default:
                return 0
        }
    }

    const sortedData = renderData.sort(getComparator(order, orderBy))

    return (
        <div className="w-full mb-4 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto bg-card/50">
                <Table className="min-w-[750px]" aria-labelledby="tableTitle">
                    <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {sortedData
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((item, index) => {
                                const sanitizedClass = item.class ? item.class.toLowerCase().replace(/\s+/g, '') : ''
                                const capitalizedName = item.name ? item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase() : ''
                                
                                return (
                                <TableRow key={index} className="border-border hover:bg-muted/30 transition-colors">
                                    <TableCell style={{ width: 120 }}>
                                        <div className="mediaWrapper flex justify-center items-center p-2">
                                            {item?.media?.assets?.length ? (
                                                <img
                                                    src={
                                                        item?.media?.assets[0]
                                                            ?.value
                                                    }
                                                    alt={item.name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full border border-border shadow-sm object-cover"
                                                />
                                            ) : (
                                                <img
                                                    className="opacity-40 rounded-full border border-border shadow-sm object-cover"
                                                    src={
                                                        '/images/logo-without-text.png'
                                                    }
                                                    alt={item.name}
                                                    width={48}
                                                    height={48}
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell style={{ width: 50 }} className="text-muted-foreground">
                                        {item.stats ? (
                                            <div className="relative inline-flex">
                                                <span>{item.itemLevel}</span>
                                                {(() => {
                                                    const diff = getStatDifference(item.itemLevel, item.stats)
                                                    if (!diff) return null
                                                    const change = Math.round(item.itemLevel - diff.data.itemLevel)
                                                    if (change === 0) return null
                                                    
                                                    const colorClass = change > 0 ? 'bg-green-500' : 'bg-red-500'
                                                    const displayChange = change > 0 ? `+${change}` : change
                                                    
                                                    return (
                                                        <span className={`absolute -top-2 -right-4 flex h-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${colorClass}`}>
                                                            {displayChange}
                                                        </span>
                                                    )
                                                })()}
                                            </div>
                                        ) : (
                                            item.itemLevel
                                        )}
                                    </TableCell>
                                    <TableCell style={{ width: 240 }}>
                                        <div className={`font-bold text-${sanitizedClass}`}>
                                            {capitalizedName}
                                        </div>
                                        <div className="text-xs text-muted-foreground font-medium mt-0.5">
                                            {item.spec} {item.class}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {GUILLD_RANKS[item.guildRank] || item.guildRank}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {item.stats ? (
                                            <div className="relative inline-flex">
                                                <span className="font-bold text-md">{Math.round(item.mplus) || 0}</span>
                                                {(() => {
                                                    const diff = getStatDifference(item.itemLevel, item.stats)
                                                    if (!diff) return null
                                                    const current = Math.round(item.mplus) || 0
                                                    const change = Math.round(current - diff.data.mplus)
                                                    if (change === 0) return null
                                                    
                                                    const colorClass = change > 0 ? 'bg-green-500' : 'bg-red-500'
                                                    const displayChange = change > 0 ? `+${change}` : change
                                                    
                                                    return (
                                                        <span className={`absolute -top-2 -right-4 flex h-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${colorClass}`}>
                                                            {displayChange}
                                                        </span>
                                                    )
                                                })()}
                                            </div>
                                        ) : (
                                            <span className="font-bold text-md">{Math.round(item.mplus) || 0}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {item.stats ? (
                                            <div className="relative inline-flex">
                                                <span className="font-bold">{item.pvp || 0}</span>
                                                {(() => {
                                                    const diff = getStatDifference(item.itemLevel, item.stats)
                                                    if (!diff) return null
                                                    const current = item.pvp || 0
                                                    const change = current - diff.data.pvp
                                                    if (change === 0) return null
                                                    
                                                    const colorClass = change > 0 ? 'bg-green-500' : 'bg-red-500'
                                                    const displayChange = change > 0 ? `+${change}` : change
                                                    
                                                    return (
                                                        <span className={`absolute -top-2 -right-4 flex h-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${colorClass}`}>
                                                            {displayChange}
                                                        </span>
                                                    )
                                                })()}
                                            </div>
                                        ) : (
                                            <span className="font-bold">{item.pvp || 0}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {processMissingEnchants(
                                            item.missingEnchants
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {processTierItems(item.tierSets)}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="cursor-help border-b border-dotted border-muted-foreground/30">
                                                        {item.lockedToString}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-none whitespace-pre-line p-2 text-sm">
                                                    {item.lockedTooltipString}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                </TableRow>
                            )})}
                    </TableBody>
                </Table>
            </div>
            {!hideControls && (
                <div className="flex items-center justify-end px-4 py-3 border-t border-border bg-card/50 text-sm text-muted-foreground gap-4">
                    <div className="flex items-center gap-2">
                        <span>Rows per page:</span>
                        <select
                            value={rowsPerPage}
                            onChange={handleChangeRowsPerPage}
                            className="bg-background border border-input rounded-md px-2 py-1 text-foreground outline-none focus:ring-1 focus:ring-ring"
                        >
                            {[20, 50, 80, 100].map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>
                            {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, sortedData.length)} of {sortedData.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={(e) => handleChangePage(e, page - 1)}
                                disabled={page === 0}
                                className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={(e) => handleChangePage(e, page + 1)}
                                disabled={page >= Math.ceil(sortedData.length / rowsPerPage) - 1}
                                className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AuditBlock
