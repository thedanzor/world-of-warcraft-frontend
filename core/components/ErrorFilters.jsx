'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Filter as FilterIcon,
  X as ClearIcon,
  RefreshCw as RefreshIcon
} from 'lucide-react'

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
    <div className="mb-6">
      <div className="flex flex-row items-center gap-4 mb-4">
        <FilterIcon className="w-5 h-5" />
        <h2 className="text-md font-semibold">Filters</h2>
        {getActiveFiltersCount() > 0 && (
          <Badge variant="default">
            {getActiveFiltersCount()} active
          </Badge>
        )}
        <div className="flex-grow" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onRefresh} disabled={loading}>
                <RefreshIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button 
          variant="outline"
          onClick={onClearFilters}
          disabled={getActiveFiltersCount() === 0}
          className="gap-2"
        >
          <ClearIcon className="w-4 h-4" />
          Clear All
        </Button>
      </div>

      <div className="flex flex-row gap-4 flex-wrap">
        <div className="min-w-[140px]">
          <Select
            value={filters.type || 'all'}
            onValueChange={(val) => handleFilterChange('type', val === 'all' ? null : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="api">API</SelectItem>
              <SelectItem value="guild-fetch">Guild Fetch</SelectItem>
              <SelectItem value="database">Database</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[140px]">
          <Select
            value={filters.severity || 'all'}
            onValueChange={(val) => handleFilterChange('severity', val === 'all' ? null : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[140px]">
          <Select
            value={filters.resolved === null ? 'all' : filters.resolved ? 'true' : 'false'}
            onValueChange={(val) => {
              handleFilterChange('resolved', val === 'all' ? null : val === 'true')
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="false">Unresolved</SelectItem>
              <SelectItem value="true">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[200px]">
          <Input
            placeholder="Filter by endpoint..."
            value={filters.endpoint || ''}
            onChange={(e) => handleFilterChange('endpoint', e.target.value || null)}
          />
        </div>

        <div className="w-[100px]">
          <Input
            type="number"
            placeholder="Limit"
            value={filters.limit || 100}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value) || 100)}
            min={1}
            max={1000}
          />
        </div>
      </div>
    </div>
  )
}

export default ErrorFilters
