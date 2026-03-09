'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import {
  AlertCircle as ErrorIcon,
  CheckCircle2 as ResolvedIcon,
  Trash2 as DeleteIcon,
  Eye as ViewIcon,
  Clock as TimeIcon,
  Monitor as ComputerIcon,
  User as PersonIcon
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const ErrorCard = ({ error, onView, onResolve, onDelete, onResolveError, onDeleteError }) => {
  const getSeverityVariant = (severity) => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'default' // or warning if available
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'api': return <ComputerIcon className="w-5 h-5" />
      case 'guild-fetch': return <PersonIcon className="w-5 h-5" />
      case 'database': return <ComputerIcon className="w-5 h-5" />
      default: return <ErrorIcon className="w-5 h-5" />
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
      className={`mb-4 cursor-pointer transition-shadow hover:shadow-md ${error.resolved ? 'border-green-500' : 'border-transparent'}`}
      onClick={() => onView(error._id)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {getTypeIcon(error.type)}
            <div className="text-md font-semibold">
              {error.error.name}
            </div>
            <Badge variant={getSeverityVariant(error.severity)}>
              {error.severity.toUpperCase()}
            </Badge>
            {error.resolved && (
              <Badge variant="outline" className="text-green-600 border-green-600 flex items-center gap-1">
                <ResolvedIcon className="w-3 h-3" />
                RESOLVED
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleView}>
                    <ViewIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Details</TooltipContent>
              </Tooltip>
              
              {!error.resolved && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleResolve}>
                      <ResolvedIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mark as Resolved</TooltipContent>
                </Tooltip>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={handleDelete}>
                    <DeleteIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-3">
          {error.error.message}
        </div>

        <div className="flex flex-row items-center gap-4 mb-2">
          <div className="flex items-center gap-1.5">
            <TimeIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(error.timestamp), { addSuffix: true })}
            </span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-xs text-muted-foreground">
            {error.endpoint}
          </span>
        </div>

        {error.context.character && (
          <div className="text-xs text-muted-foreground">
            Character: {error.context.character}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ErrorCard
