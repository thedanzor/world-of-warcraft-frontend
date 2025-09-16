'use client'

import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Divider
} from '@mui/material'
import {
  Error as ErrorIcon,
  CheckCircle as ResolvedIcon,
  Cancel as UnresolvedIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Schedule as TimeIcon,
  Computer as ComputerIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import { formatDistanceToNow } from 'date-fns'

const ErrorCard = ({ error, onView, onResolve, onDelete, onResolveError, onDeleteError }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'default'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'api': return <ComputerIcon />
      case 'guild-fetch': return <PersonIcon />
      case 'database': return <ComputerIcon />
      default: return <ErrorIcon />
    }
  }

  const handleResolve = async (e) => {
    e.stopPropagation()
    try {
      await onResolveError(error._id)
      onResolve(error._id)
    } catch (err) {
      console.error('Failed to resolve error:', err)
    }
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    try {
      await onDeleteError(error._id)
      onDelete(error._id)
    } catch (err) {
      console.error('Failed to delete error:', err)
    }
  }

  const handleView = (e) => {
    e.stopPropagation()
    onView(error._id)
  }

  return (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        border: error.resolved ? '1px solid #4caf50' : '1px solid transparent',
        '&:hover': {
          boxShadow: 3
        }
      }}
      onClick={() => onView(error._id)}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            {getTypeIcon(error.type)}
            <Typography variant="h6" component="div">
              {error.error.name}
            </Typography>
            <Chip 
              label={error.severity.toUpperCase()} 
              color={getSeverityColor(error.severity)}
              size="small"
            />
            {error.resolved && (
              <Chip 
                icon={<ResolvedIcon />}
                label="RESOLVED" 
                color="success"
                size="small"
              />
            )}
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="View Details">
              <IconButton size="small" onClick={handleView}>
                <ViewIcon />
              </IconButton>
            </Tooltip>
            {!error.resolved && (
              <Tooltip title="Mark as Resolved">
                <IconButton size="small" onClick={handleResolve}>
                  <ResolvedIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Delete">
              <IconButton size="small" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {error.error.message}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <TimeIcon fontSize="small" />
            <Typography variant="caption">
              {formatDistanceToNow(new Date(error.timestamp), { addSuffix: true })}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Typography variant="caption" color="text.secondary">
            {error.endpoint}
          </Typography>
        </Stack>

        {error.context.character && (
          <Typography variant="caption" color="text.secondary">
            Character: {error.context.character}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default ErrorCard
