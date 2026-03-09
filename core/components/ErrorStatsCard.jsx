'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import {
  AlertCircle as ErrorIcon,
  CheckCircle2 as ResolvedIcon,
  XCircle as UnresolvedIcon,
  Bug as BugReportIcon
} from 'lucide-react'

const ErrorStatsCard = ({ stats, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
          <Spinner className="w-8 h-8 mb-4" />
          <div className="text-sm text-muted-foreground">
            Loading statistics...
          </div>
        </CardContent>
      </Card>
    )
  }

  const { overview, byType, byEndpoint } = stats

  const StatItem = ({ label, value, colorClass = 'text-primary', icon }) => (
    <div className="text-center">
      <div className="flex justify-center items-center mb-2 gap-2">
        {React.cloneElement(icon, { className: `w-6 h-6 ${colorClass}` })}
        <div className={`text-3xl font-semibold ${colorClass}`}>
          {value}
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {label}
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Overview Stats */}
      <div className="col-span-1 md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Error Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <StatItem 
                label="Total Errors" 
                value={overview.total} 
                colorClass="text-primary"
                icon={<ErrorIcon />}
              />
              <StatItem 
                label="Resolved" 
                value={overview.resolved} 
                colorClass="text-green-600"
                icon={<ResolvedIcon />}
              />
              <StatItem 
                label="Unresolved" 
                value={overview.unresolved} 
                colorClass="text-destructive"
                icon={<UnresolvedIcon />}
              />
              <StatItem 
                label="High Severity" 
                value={overview.highSeverity} 
                colorClass="text-destructive"
                icon={<BugReportIcon />}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* By Type */}
      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-md">Errors by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {byType.map((type) => (
                <div key={type._id} className="flex justify-between items-center">
                  <Badge variant="outline">
                    {type._id}
                  </Badge>
                  <div className="text-sm font-bold">
                    {type.count}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* By Endpoint */}
      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-md">Top Error Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {byEndpoint.slice(0, 5).map((endpoint) => (
                <div key={endpoint._id}>
                  <div className="text-sm truncate mb-1">
                    {endpoint._id}
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {endpoint.count} errors
                    </div>
                    <Progress 
                      value={(endpoint.count / byEndpoint[0].count) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ErrorStatsCard
