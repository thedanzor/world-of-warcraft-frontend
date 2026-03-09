'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Bug, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'

import ErrorCard from '@/core/components/ErrorCard'
import ErrorStatsCard from '@/core/components/ErrorStatsCard'
import ErrorFilters from '@/core/components/ErrorFilters'

const ErrorManagementPage = () => {
  const router = useRouter()
  const [errors, setErrors] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: null,
    endpoint: null,
    resolved: null,
    severity: null,
    limit: 100
  })

  // Fetch errors
  const fetchErrors = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          queryParams.append(key, value)
        }
      })

      const response = await fetch(`/api/errors?${queryParams}`)
      const data = await response.json()
      
      if (data.success) {
        setErrors(data.errors)
      } else {
        throw new Error(data.error || 'Failed to fetch errors')
      }
    } catch (error) {
      console.error('Error fetching errors:', error)
      toast.error('Failed to fetch errors: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch stats
  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      const response = await fetch('/api/errors/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
      } else {
        throw new Error(data.error || 'Failed to fetch stats')
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to fetch statistics: ' + error.message)
    } finally {
      setStatsLoading(false)
    }
  }

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      type: null,
      endpoint: null,
      resolved: null,
      severity: null,
      limit: 100
    })
  }

  // Refresh data
  const handleRefresh = () => {
    fetchErrors()
    fetchStats()
  }

  // Resolve error
  const handleResolveError = async (errorId) => {
    try {
      const response = await fetch(`/api/errors/${errorId}/resolve`, {
        method: 'PUT'
      })
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to resolve error')
      }
      
      toast.success('Error marked as resolved')
    } catch (error) {
      console.error('Error resolving error:', error)
      toast.error('Failed to resolve error: ' + error.message)
      throw error
    }
  }

  // Delete error
  const handleDeleteError = async (errorId) => {
    try {
      const response = await fetch(`/api/errors/${errorId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete error')
      }
      
      toast.success('Error deleted successfully')
    } catch (error) {
      console.error('Error deleting error:', error)
      toast.error('Failed to delete error: ' + error.message)
      throw error
    }
  }

  // Handle error actions
  const handleResolve = (errorId) => {
    setErrors(prev => prev.map(error => 
      error._id === errorId ? { ...error, resolved: true } : error
    ))
  }

  const handleDelete = (errorId) => {
    setErrors(prev => prev.filter(error => error._id !== errorId))
  }

  const handleView = (errorId) => {
    router.push(`/errors/${errorId}`)
  }

  // Bulk delete
  const handleBulkDelete = async () => {
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          queryParams.append(key, value)
        }
      })

      console.log('Bulk delete request:', `/api/errors?${queryParams}`)
      
      const response = await fetch(`/api/errors?${queryParams}`, {
        method: 'DELETE'
      })
      
      console.log('Bulk delete response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Bulk delete response data:', data)
      
      if (data.success) {
        toast.success(data.message || `Successfully deleted ${data.result?.deletedCount || 0} errors`)
        // Refresh the data
        await fetchErrors()
        await fetchStats()
      } else {
        throw new Error(data.error || 'Failed to delete errors')
      }
    } catch (error) {
      console.error('Error bulk deleting:', error)
      toast.error('Failed to delete errors: ' + error.message)
    }
  }

  // Effects
  useEffect(() => {
    fetchErrors()
  }, [filters])

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Bug className="h-8 w-8" />
          <h1 className="text-3xl font-bold">
            Error Management
          </h1>
        </div>
        <p className="text-muted-foreground">
          Monitor and manage application errors with detailed insights and filtering options.
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-8">
        <ErrorStatsCard stats={stats} loading={statsLoading} />
      </div>

      {/* Filters */}
      <div className="mb-8">
        <ErrorFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onRefresh={handleRefresh}
          loading={loading}
        />
      </div>

      {/* Bulk Actions */}
      {errors.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={loading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Filtered Errors
            </Button>
            <span className="text-sm text-muted-foreground">
              {errors.length} error{errors.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
      )}

      {/* Error List */}
      <div>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        ) : errors.length === 0 ? (
          <Alert variant="default">
            <AlertDescription>
              No errors found matching your criteria.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {errors.map((error) => (
              <ErrorCard
                key={error._id}
                error={error}
                onView={handleView}
                onResolve={handleResolve}
                onDelete={handleDelete}
                onResolveError={handleResolveError}
                onDeleteError={handleDeleteError}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ErrorManagementPage