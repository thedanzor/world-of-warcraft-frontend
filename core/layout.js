'use client'

import { usePathname } from 'next/navigation'

import SiteNav from '@/core/components/SiteNav'
import SeasonAlert from '@/core/components/SeasonAlert'

export default function AuditLayout({ children }) {
    const pathname = usePathname()
    const hideNav = pathname === '/install' || pathname?.startsWith('/settings')

    if (hideNav) {
        return (
            <div className="flex min-h-screen flex-col bg-[#090f18] text-foreground">
                <main className="flex-1 flex flex-col w-full">
                    <div className="flex-1 w-full">
                        {children}
                    </div>
                    <footer className="py-6 px-6 lg:px-10 text-center text-[0.68rem] text-muted-foreground border-t border-white/[0.05]">
                        <p>&copy; 2025 Holybarryz (Scott Jones). All rights reserved.</p>
                    </footer>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#090f18]">
            <SiteNav />
            <div className="flex-1 w-full">
                {children}
            </div>
            <footer className="w-full py-6 px-6 lg:px-10 text-center text-[0.68rem] text-muted-foreground border-t border-white/[0.05]">
                <p>&copy; 2025 Holybarryz (Scott Jones). All rights reserved.</p>
            </footer>
            <SeasonAlert />
        </div>
    )
}
