'use client'

import { lazy, Suspense } from 'react'
import { useConfig } from '@/core/hooks/useConfig'

export default function NotFoundPage() {
    const { config, loading } = useConfig()
    
    if (loading || !config) {
        return <div>Loading...</div>
    }
    
    // Dynamic import using React.lazy
    const NotFound = lazy(() => import(`@/core/screens/${config.THEME || 'default'}/not-found`))
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotFound />
        </Suspense>
    )
}
