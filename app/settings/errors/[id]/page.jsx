'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  BugReport as BugReportIcon,
  CheckCircle as ResolvedIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Schedule as TimeIcon,
  Computer as ComputerIcon,
  Person as PersonIcon,
  Code as CodeIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Http as HttpIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material'
import { formatDistanceToNow, format } from 'date-fns'

const ErrorDetailPage = () => {
  const router = useRouter()
  const params = useParams()
  const errorId = params.id

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // Fetch error details
  const fetchError = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/errors/${errorId}`)
      const data = await response.json()
      
      if (data.success) {
        setError(data.error)
      } else {
        throw new Error(data.error || 'Failed to fetch error details')
      }
    } catch (err) {
      console.error('Error fetching error details:', err)
      setSnackbar({
        open: true,
        message: 'Failed to fetch error details: ' + err.message,
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  // Resolve error
  const handleResolve = async () => {
    try {
      setActionLoading(true)
      const response = await fetch(`/api/errors/${errorId}/resolve`, {
        method: 'PUT'
      })
      const data = await response.json()
      
      if (data.success) {
        setError(prev => ({ ...prev, resolved: true }))
        setSnackbar({
          open: true,
          message: 'Error marked as resolved',
          severity: 'success'
        })
      } else {
        throw new Error(data.error || 'Failed to resolve error')
      }
    } catch (err) {
      console.error('Error resolving:', err)
      setSnackbar({
        open: true,
        message: 'Failed to resolve error: ' + err.message,
        severity: 'error'
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Delete error
  const handleDelete = async () => {
    try {
      setActionLoading(true)
      const response = await fetch(`/api/errors/${errorId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        setSnackbar({
          open: true,
          message: 'Error deleted successfully',
          severity: 'success'
        })
        setTimeout(() => {
          router.push('/errors')
        }, 1500)
      } else {
        throw new Error(data.error || 'Failed to delete error')
      }
    } catch (err) {
      console.error('Error deleting:', err)
      setSnackbar({
        open: true,
        message: 'Failed to delete error: ' + err.message,
        severity: 'error'
      })
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    if (errorId) {
      fetchError()
    }
  }, [errorId])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'default'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <ErrorIcon />
      case 'medium': return <WarningIcon />
      case 'low': return <InfoIcon />
      default: return <BugReportIcon />
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'api': return <HttpIcon />
      case 'guild-fetch': return <PersonIcon />
      case 'database': return <ComputerIcon />
      default: return <BugReportIcon />
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (!error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">
          Error not found or failed to load.
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <IconButton onClick={() => router.push('/settings/errors')}>
            <ArrowBackIcon />
          </IconButton>
          <BugReportIcon fontSize="large" />
          <Typography variant="h4" component="h1">
            Error Details
          </Typography>
          <Chip 
            label={error.severity.toUpperCase()} 
            color={getSeverityColor(error.severity)}
            icon={getSeverityIcon(error.severity)}
          />
          {error.resolved && (
            <Chip 
              icon={<ResolvedIcon />}
              label="RESOLVED" 
              color="success"
            />
          )}
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Main Error Information */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            {/* Error Summary */}
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  {getTypeIcon(error.type)}
                  <Typography variant="h5">
                    {error.error.name}
                  </Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary" mb={2}>
                  {error.error.message}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Chip label={error.type} variant="outlined" />
                  <Chip label={`Status ${error.error.status}`} variant="outlined" />
                  {error.error.code && (
                    <Chip label={error.error.code} variant="outlined" />
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Stack Trace */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Stack Trace
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    backgroundColor: '#f5f5f5',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    overflow: 'auto',
                    maxHeight: 400
                  }}
                >
                  {error.error.stack}
                </Paper>
              </CardContent>
            </Card>

            {/* Context Information */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Request Context
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <HttpIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Method" 
                          secondary={error.context.method}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <LocationIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Endpoint" 
                          secondary={error.context.url}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ComputerIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="IP Address" 
                          secondary={error.context.ip}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <TimeIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Timestamp" 
                          secondary={format(new Date(error.timestamp), 'PPpp')}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CodeIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Process ID" 
                          secondary={error.context.processId}
                        />
                      </ListItem>
                      {error.context.character && (
                        <ListItem>
                          <ListItemIcon>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Character" 
                            secondary={error.context.character}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Query Parameters */}
            {error.context.query && Object.keys(error.context.query).length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Query Parameters
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <pre style={{ margin: 0, fontFamily: 'monospace' }}>
                      {JSON.stringify(error.context.query, null, 2)}
                    </pre>
                  </Paper>
                </CardContent>
              </Card>
            )}

            {/* Route Parameters */}
            {error.context.params && Object.keys(error.context.params).length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Route Parameters
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <pre style={{ margin: 0, fontFamily: 'monospace' }}>
                      {JSON.stringify(error.context.params, null, 2)}
                    </pre>
                  </Paper>
                </CardContent>
              </Card>
            )}

            {/* User Agent */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">User Agent</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {error.context.userAgent}
                  </Typography>
                </Paper>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Grid>

        {/* Actions Sidebar */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Actions
                </Typography>
                <Stack spacing={2}>
                  {!error.resolved && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<ResolvedIcon />}
                      onClick={handleResolve}
                      disabled={actionLoading}
                      fullWidth
                    >
                      Mark as Resolved
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                    disabled={actionLoading}
                    fullWidth
                  >
                    Delete Error
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Error Metadata */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Metadata
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Error ID" 
                      secondary={error._id}
                      secondaryTypographyProps={{ 
                        sx: { fontFamily: 'monospace', fontSize: '0.75rem' }
                      }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Occurred" 
                      secondary={`${formatDistanceToNow(new Date(error.timestamp), { addSuffix: true })} (${format(new Date(error.timestamp), 'PPpp')})`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Type" 
                      secondary={error.type}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Severity" 
                      secondary={error.severity}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Status" 
                      secondary={error.resolved ? 'Resolved' : 'Unresolved'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

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

export default ErrorDetailPage
