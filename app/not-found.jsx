'use client'

import config from '@/app.config.js'
import { lazy, Suspense } from 'react'

// Dynamic import using React.lazy
const NotFound = lazy(() => import(`@/core/screens/${config.THEME}/not-found`))

export default function NotFoundPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotFound />
        </Suspense>
    )
}
