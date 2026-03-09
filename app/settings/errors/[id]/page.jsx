'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { formatDistanceToNow, format } from 'date-fns'
import {
  ArrowLeft,
  Bug,
  CheckCircle,
  Trash2,
  Clock,
  Monitor,
  User,
  Code,
  Info,
  AlertTriangle,
  XOctagon,
  Network,
  MapPin
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { toast } from 'sonner'

const ErrorDetailPage = () => {
  const router = useRouter()
  const params = useParams()
  const errorId = params.id

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

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
      toast.error('Failed to fetch error details: ' + err.message)
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
        toast.success('Error marked as resolved')
      } else {
        throw new Error(data.error || 'Failed to resolve error')
      }
    } catch (err) {
      console.error('Error resolving:', err)
      toast.error('Failed to resolve error: ' + err.message)
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
        toast.success('Error deleted successfully')
        setTimeout(() => {
          router.push('/errors')
        }, 1500)
      } else {
        throw new Error(data.error || 'Failed to delete error')
      }
    } catch (err) {
      console.error('Error deleting:', err)
      toast.error('Failed to delete error: ' + err.message)
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    if (errorId) {
      fetchError()
    }
  }, [errorId])

  const getSeverityVariant = (severity) => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'default'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-destructive'
      case 'medium': return 'text-amber-500'
      case 'low': return 'text-blue-500'
      default: return 'text-foreground'
    }
  }

  const getSeverityIcon = (severity, className = "h-4 w-4") => {
    switch (severity) {
      case 'high': return <XOctagon className={className} />
      case 'medium': return <AlertTriangle className={className} />
      case 'low': return <Info className={className} />
      default: return <Bug className={className} />
    }
  }

  const getTypeIcon = (type, className = "h-5 w-5") => {
    switch (type) {
      case 'api': return <Network className={className} />
      case 'guild-fetch': return <User className={className} />
      case 'database': return <Monitor className={className} />
      default: return <Bug className={className} />
    }
  }

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-center items-center py-24">
          <Spinner className="h-8 w-8" />
        </div>
      </div>
    )
  }

  if (!error) {
    return (
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <XOctagon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Error not found or failed to load.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-row items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/settings/errors')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Bug className="h-8 w-8 text-muted-foreground" />
          <h1 className="text-3xl font-bold tracking-tight">
            Error Details
          </h1>
          <Badge 
            variant={getSeverityVariant(error.severity)}
            className="flex items-center gap-1.5"
          >
            {getSeverityIcon(error.severity, "h-3 w-3")}
            {error.severity.toUpperCase()}
          </Badge>
          {error.resolved && (
            <Badge 
              variant="default"
              className="bg-green-600 hover:bg-green-700 flex items-center gap-1.5"
            >
              <CheckCircle className="h-3 w-3" />
              RESOLVED
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Error Information */}
        <div className="md:col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Error Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                {getTypeIcon(error.type, "h-6 w-6 text-muted-foreground")}
                <h2 className="text-xl font-semibold">
                  {error.error.name}
                </h2>
              </div>
              <p className="text-muted-foreground mb-4">
                {error.error.message}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{error.type}</Badge>
                <Badge variant="outline">Status {error.error.status}</Badge>
                {error.error.code && (
                  <Badge variant="outline">{error.error.code}</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stack Trace */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-md font-semibold mb-4">
                Stack Trace
              </h3>
              <div className="p-4 bg-muted/50 rounded-md border font-mono text-sm whitespace-pre-wrap overflow-auto max-h-[400px]">
                {error.error.stack}
              </div>
            </CardContent>
          </Card>

          {/* Context Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-md font-semibold mb-4">
                Request Context
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Network className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">Method</p>
                      <p className="text-sm text-muted-foreground">{error.context.method}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">Endpoint</p>
                      <p className="text-sm text-muted-foreground break-all">{error.context.url}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Monitor className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">IP Address</p>
                      <p className="text-sm text-muted-foreground">{error.context.ip}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">Timestamp</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(error.timestamp), 'PPpp')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Code className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">Process ID</p>
                      <p className="text-sm text-muted-foreground">{error.context.processId}</p>
                    </div>
                  </div>
                  {error.context.character && (
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium leading-none mb-1">Character</p>
                        <p className="text-sm text-muted-foreground">{error.context.character}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Query Parameters */}
          {error.context.query && Object.keys(error.context.query).length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-md font-semibold mb-4">
                  Query Parameters
                </h3>
                <div className="p-4 bg-muted/50 rounded-md border font-mono text-sm overflow-auto">
                  <pre className="m-0">
                    {JSON.stringify(error.context.query, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Route Parameters */}
          {error.context.params && Object.keys(error.context.params).length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-md font-semibold mb-4">
                  Route Parameters
                </h3>
                <div className="p-4 bg-muted/50 rounded-md border font-mono text-sm overflow-auto">
                  <pre className="m-0">
                    {JSON.stringify(error.context.params, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* User Agent */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="user-agent" className="border rounded-md px-4 bg-card shadow-sm data-[state=open]:rounded-b-none">
              <AccordionTrigger className="text-md font-semibold hover:no-underline py-4">
                User Agent
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="p-4 bg-muted/50 rounded-md border font-mono text-sm break-all">
                  {error.context.userAgent}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Actions Sidebar */}
        <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-md font-semibold mb-4">
                Actions
              </h3>
              <div className="flex flex-col gap-3">
                {!error.resolved && (
                  <Button
                    variant="default"
                    className="w-full bg-green-600 hover:bg-green-700 justify-start"
                    onClick={handleResolve}
                    disabled={actionLoading}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Resolved
                  </Button>
                )}
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleDelete}
                  disabled={actionLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Error
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error Metadata */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-md font-semibold mb-4">
                Metadata
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium leading-none mb-1">Error ID</p>
                  <p className="text-xs text-muted-foreground font-mono">{error._id}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium leading-none mb-1">Occurred</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(error.timestamp), { addSuffix: true })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ({format(new Date(error.timestamp), 'PPpp')})
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium leading-none mb-1">Type</p>
                  <p className="text-sm text-muted-foreground capitalize">{error.type}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium leading-none mb-1">Severity</p>
                  <div className={`text-sm font-medium capitalize ${getSeverityColor(error.severity)}`}>
                    {error.severity}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium leading-none mb-1">Status</p>
                  <p className="text-sm text-muted-foreground">
                    {error.resolved ? 'Resolved' : 'Unresolved'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ErrorDetailPage