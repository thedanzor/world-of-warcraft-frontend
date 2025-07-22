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
        <TableHead>
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
                                    onClick={createSortHandler(headCell.id)}
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
                                headCell.label
                            )}
                        </TableCell>
                    )
                })}
            </TableRow>
        </TableHead>
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
        <Paper sx={{ width: '100%', mb: 2 }}>
            <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
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
                                    <TableCell sx={{ width: 120 }}>
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
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{ width: 50 }}>
                                        {item.itemLevel}
                                    </TableCell>
                                    <TableCell sx={{ width: 240 }}>
                                        <div
                                            className={`name ${item.class}`}
                                        >
                                            <P>{item.name}</P>
                                        </div>
                                        <div className="classandspec">
                                            <P className="spec">
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
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[20, 50, 80, 100]}
                component="div"
                count={sortedData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

export default AuditBlock
