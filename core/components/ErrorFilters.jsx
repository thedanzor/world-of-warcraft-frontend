'use client'

import React from 'react'
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'

const ErrorFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  onRefresh,
  loading = false 
}) => {
  const handleFilterChange = (key, value) => {
    onFilterChange(key, value)
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== null && value !== '').length
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <FilterIcon />
        <Typography variant="h6">Filters</Typography>
        {getActiveFiltersCount() > 0 && (
          <Chip 
            label={`${getActiveFiltersCount()} active`} 
            color="primary" 
            size="small"
          />
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Refresh">
          <IconButton onClick={onRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Button 
          startIcon={<ClearIcon />}
          onClick={onClearFilters}
          disabled={getActiveFiltersCount() === 0}
        >
          Clear All
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filters.type || ''}
            label="Type"
            onChange={(e) => handleFilterChange('type', e.target.value || null)}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="api">API</MenuItem>
            <MenuItem value="guild-fetch">Guild Fetch</MenuItem>
            <MenuItem value="database">Database</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Severity</InputLabel>
          <Select
            value={filters.severity || ''}
            label="Severity"
            onChange={(e) => handleFilterChange('severity', e.target.value || null)}
          >
            <MenuItem value="">All Severities</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.resolved === null ? '' : filters.resolved ? 'true' : 'false'}
            label="Status"
            onChange={(e) => {
              const value = e.target.value
              handleFilterChange('resolved', value === '' ? null : value === 'true')
            }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="false">Unresolved</MenuItem>
            <MenuItem value="true">Resolved</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Endpoint"
          placeholder="Filter by endpoint..."
          value={filters.endpoint || ''}
          onChange={(e) => handleFilterChange('endpoint', e.target.value || null)}
          sx={{ minWidth: 200 }}
        />

        <TextField
          size="small"
          label="Limit"
          type="number"
          value={filters.limit || 100}
          onChange={(e) => handleFilterChange('limit', parseInt(e.target.value) || 100)}
          inputProps={{ min: 1, max: 1000 }}
          sx={{ minWidth: 100 }}
        />
      </Stack>
    </Box>
  )
}

export default ErrorFilters
