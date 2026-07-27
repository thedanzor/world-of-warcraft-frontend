'use client'

import { usePathname } from 'next/navigation'

import SiteNav from '@/core/components/SiteNav'
import SeasonAlert from '@/core/components/SeasonAlert'

export default function AuditLayout({ children }) {
    const pathname = usePathname()
    const hideNav = pathname === '/install' || pathname?.startsWith('/settings')

    if (hideNav) {
        return (
            <div className="flex min-h-screen text-foreground flex-col">
                <main className="flex-1 flex flex-col">
                    <div className="flex-1">
                        {children}
                    </div>
                    <footer className="py-6 px-6 text-center text-sm text-muted-foreground border-t border-white/[0.05]">
                        <p>&copy; 2025 Holybarryz (Scott Jones). All rights reserved.</p>
                    </footer>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <SiteNav />
            <main className="flex-1 w-full max-w-7xl mx-auto">
                {children}
            </main>
            <footer className="w-full max-w-7xl mx-auto py-6 px-6 md:px-8 text-center text-[0.68rem] text-muted-foreground border-t border-white/[0.05]">
                <p>&copy; 2025 Holybarryz (Scott Jones). All rights reserved.</p>
            </footer>
            <SeasonAlert />
        </div>
    )
}
