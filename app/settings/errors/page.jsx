'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material'
import {
  BugReport as BugReportIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'

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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, errorId: null })

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
      setSnackbar({
        open: true,
        message: 'Failed to fetch errors: ' + error.message,
        severity: 'error'
      })
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
      setSnackbar({
        open: true,
        message: 'Failed to fetch statistics: ' + error.message,
        severity: 'error'
      })
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
      
      setSnackbar({
        open: true,
        message: 'Error marked as resolved',
        severity: 'success'
      })
    } catch (error) {
      console.error('Error resolving error:', error)
      setSnackbar({
        open: true,
        message: 'Failed to resolve error: ' + error.message,
        severity: 'error'
      })
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
      
      setSnackbar({
        open: true,
        message: 'Error deleted successfully',
        severity: 'success'
      })
    } catch (error) {
      console.error('Error deleting error:', error)
      setSnackbar({
        open: true,
        message: 'Failed to delete error: ' + error.message,
        severity: 'error'
      })
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
        setSnackbar({
          open: true,
          message: data.message || `Successfully deleted ${data.result?.deletedCount || 0} errors`,
          severity: 'success'
        })
        // Refresh the data
        await fetchErrors()
        await fetchStats()
      } else {
        throw new Error(data.error || 'Failed to delete errors')
      }
    } catch (error) {
      console.error('Error bulk deleting:', error)
      setSnackbar({
        open: true,
        message: 'Failed to delete errors: ' + error.message,
        severity: 'error'
      })
    }
  }

  // Effects
  useEffect(() => {
    fetchErrors()
  }, [filters])

  useEffect(() => {
    fetchStats()
  }, [])

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <BugReportIcon fontSize="large" />
          <Typography variant="h4" component="h1">
            Error Management
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          Monitor and manage application errors with detailed insights and filtering options.
        </Typography>
      </Box>

      {/* Statistics */}
      <Box mb={4}>
        <ErrorStatsCard stats={stats} loading={statsLoading} />
      </Box>

      {/* Filters */}
      <ErrorFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Bulk Actions */}
      {errors.length > 0 && (
        <Box mb={3}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBulkDelete}
              disabled={loading}
            >
              Delete Filtered Errors
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
              {errors.length} error{errors.length !== 1 ? 's' : ''} found
            </Typography>
          </Stack>
        </Box>
      )}

      {/* Error List */}
      <Box>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : errors.length === 0 ? (
          <Alert severity="info">
            No errors found matching your criteria.
          </Alert>
        ) : (
          <Stack spacing={2}>
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
          </Stack>
        )}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Container>
  )
}

export default ErrorManagementPage