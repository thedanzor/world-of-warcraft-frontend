'use client'

import { lazy, Suspense } from 'react'
import { useConfig } from '@/core/hooks/useConfig'

export default function ErrorPage() {
    const { config, loading } = useConfig()
    
    if (loading || !config) {
        return <div>Loading...</div>
    }
    
    // Dynamic import using React.lazy
    const Error = lazy(() => import(`@/core/screens/${config.THEME || 'default'}/error`))
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Error />
        </Suspense>
    )
}
