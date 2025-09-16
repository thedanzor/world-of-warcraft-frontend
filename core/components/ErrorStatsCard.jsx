'use client'

import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Stack
} from '@mui/material'
import {
  Error as ErrorIcon,
  CheckCircle as ResolvedIcon,
  Cancel as UnresolvedIcon,
  TrendingUp as TrendingUpIcon,
  BugReport as BugReportIcon
} from '@mui/icons-material'

const ErrorStatsCard = ({ stats, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Loading statistics...
          </Typography>
        </CardContent>
      </Card>
    )
  }

  const { overview, byType, byEndpoint } = stats

  const StatItem = ({ label, value, color = 'primary', icon }) => (
    <Box textAlign="center">
      <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
        {icon}
        <Typography variant="h4" color={color} sx={{ ml: 1 }}>
          {value}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  )

  return (
    <Grid container spacing={3}>
      {/* Overview Stats */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Error Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <StatItem 
                  label="Total Errors" 
                  value={overview.total} 
                  color="primary"
                  icon={<ErrorIcon />}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatItem 
                  label="Resolved" 
                  value={overview.resolved} 
                  color="success"
                  icon={<ResolvedIcon />}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatItem 
                  label="Unresolved" 
                  value={overview.unresolved} 
                  color="error"
                  icon={<UnresolvedIcon />}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatItem 
                  label="High Severity" 
                  value={overview.highSeverity} 
                  color="error"
                  icon={<BugReportIcon />}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* By Type */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Errors by Type
            </Typography>
            <Stack spacing={1}>
              {byType.map((type) => (
                <Box key={type._id} display="flex" justifyContent="space-between" alignItems="center">
                  <Chip 
                    label={type._id} 
                    variant="outlined" 
                    size="small"
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {type.count}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* By Endpoint */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Error Endpoints
            </Typography>
            <Stack spacing={1}>
              {byEndpoint.slice(0, 5).map((endpoint) => (
                <Box key={endpoint._id}>
                  <Typography variant="body2" noWrap>
                    {endpoint._id}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      {endpoint.count} errors
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(endpoint.count / byEndpoint[0].count) * 100}
                      sx={{ width: 60, height: 4 }}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ErrorStatsCard
