'use client'

import config from '@/app.config.js'
import { lazy, Suspense } from 'react'

// Dynamic import using React.lazy
const Error = lazy(() => import(`@/core/screens/${config.THEME}/error`))

export default function ErrorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Error />
        </Suspense>
    )
}
