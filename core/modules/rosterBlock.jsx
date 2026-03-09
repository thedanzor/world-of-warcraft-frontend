import { useState, useEffect } from 'react'
import { P } from '@/core/components/typography'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import config from '@/app.config.js'

const {
    GUILLD_RANKS,
    RESULTS_PAGINATION,
} = config

const headCells = [
    { id: 'avatar', label: '', sortable: false, width: 120 },
    { id: 'itemlevel', label: 'ILvL', sortable: true, width: 50 },
    { id: 'name', label: 'Name & Spec', sortable: true, width: 240 },
    { id: 'next_season_class', label: 'Next Season Class', sortable: true },
    { id: 'primary_role', label: 'Primary Role', sortable: true },
    { id: 'secondary_role', label: 'Secondary Role', sortable: true },
    { id: 'guildRank', label: 'Guild Rank', sortable: false },
    { id: 'score', label: 'M+ Score', sortable: true },
    { id: 'pvp', label: 'PvP Rating', sortable: true },
]

function EnhancedTableHead({ order, orderBy, onRequestSort, officerList }) {
    const createSortHandler = (property) => (event) => {
        if (property !== 'avatar') {
            onRequestSort(event, property)
        }
    }

    return (
        <TableHeader>
            <TableRow>
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
                        >
                            {headCell.sortable ? (
                                <div
                                    className="flex items-center cursor-pointer select-none"
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                    {orderBy === headCell.id ? (
                                        <span className="ml-1 text-xs">
                                            {order === 'desc' ? '▼' : '▲'}
                                        </span>
                                    ) : null}
                                </div>
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

const AuditBlock = ({ data, name }) => {
    if (!data[name]?.length && name !== 'locked') {
        return null
    }

    const renderData = name !== 'locked' ? data[name] : data
    const [order, setOrder] = useState('desc')
    const [orderBy, setOrderBy] = useState('itemlevel')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(RESULTS_PAGINATION.MAX_ITEMS)

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
            case 'itemlevel':
                return b.itemLevel - a.itemLevel
            case 'name':
                return b.name.localeCompare(a.name)
            case 'score':
                return (
                    (Math.round(b?.mplus || 0)) -
                    (Math.round(a?.mplus || 0))
                )
            case 'pvp':
                return (b?.pvp || 0) - (a?.pvp || 0)
            default:
                return 0
        }
    }

    const sortedData = renderData.sort(getComparator(order, orderBy))

    return (
        <div className="w-full mb-4 bg-card rounded-md shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <Table className="min-w-[750px]">
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
                            .map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell style={{ width: 120 }}>
                                        <div className="mediaWrapper">
                                            {item?.media?.assets?.length ? (
                                                <img
                                                    src={
                                                        item?.media?.assets[0]
                                                            ?.value
                                                    }
                                                    alt={item.name}
                                                    width={60}
                                                    height={60}
                                                    className="rounded-md"
                                                />
                                            ) : (
                                                <img
                                                    style={{ opacity: '0.4' }}
                                                    src={
                                                        '/images/logo-without-text.png'
                                                    }
                                                    alt={item.name}
                                                    width={60}
                                                    height={60}
                                                    className="rounded-md"
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell style={{ width: 50 }}>
                                        {item.itemLevel}
                                    </TableCell>
                                    <TableCell style={{ width: 240 }}>
                                        <div
                                            className={`name ${item.class}`}
                                        >
                                            <P className="font-medium">{item.name}</P>
                                        </div>
                                        <div className="classandspec">
                                            <P className="spec text-sm text-muted-foreground">
                                                {item.spec}{' '}
                                                {item.class}
                                            </P>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {item?.next_season_class ? (
                                            <div
                                                className={
                                                    item.next_season_class
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    item.next_season_class.slice(
                                                        1
                                                    )
                                                }
                                            >
                                                <strong>
                                                    {item.next_season_class}
                                                </strong>
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {item?.primary_role || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {item?.secondary_role || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {GUILLD_RANKS[item.guildRank] || item.guildRank}
                                    </TableCell>
                                    <TableCell>
                                        {Math.round(item?.mplus || 0)}
                                    </TableCell>
                                    <TableCell>
                                        {item?.pvp || 0}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end px-4 py-3 border-t border-border bg-muted/20">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Rows per page:</span>
                        <select 
                            className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 py-1 text-sm focus:outline-none"
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
                                className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Prev
                            </button>
                            <button 
                                onClick={(e) => handleChangePage(e, page + 1)} 
                                disabled={page >= Math.ceil(sortedData.length / rowsPerPage) - 1 || sortedData.length === 0}
                                className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuditBlock
