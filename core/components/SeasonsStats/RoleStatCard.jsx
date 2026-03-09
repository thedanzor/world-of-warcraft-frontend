import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

const RoleStatCard = ({
    title,
    count,
    backupCount,
    description,
    icon: Icon,
}) => (
    <Card className="h-full">
        <CardContent className="p-4">
            <div className="flex items-center mb-4">
                <Icon className="mr-2 h-5 w-5 text-primary" />
                <h3 className="text-md font-semibold">
                    {title}
                </h3>
            </div>
            <div className="text-3xl font-bold mb-2">
                {count}
            </div>
            {backupCount !== undefined && (
                <div className="text-base mb-2">
                    +{backupCount} backup
                </div>
            )}
            <p className="text-sm text-muted-foreground">
                {description}
            </p>
        </CardContent>
    </Card>
)

export default RoleStatCard
