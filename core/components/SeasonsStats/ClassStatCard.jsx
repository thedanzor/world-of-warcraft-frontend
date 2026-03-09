import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

const ClassStatCard = ({ title, signedCount, totalCount, icon: Icon }) => (
    <Card className="h-full">
        <CardContent className="p-4">
            <div className="flex items-center mb-4">
                <Icon className="mr-2 h-5 w-5 text-primary" />
                <h3 className="text-md font-semibold">
                    {title}
                </h3>
            </div>
            <div className="text-3xl font-bold mb-2">
                {signedCount}/{totalCount}
            </div>
            <p className="text-sm text-muted-foreground">
                Signed up for next season
            </p>
        </CardContent>
    </Card>
)

export default ClassStatCard
