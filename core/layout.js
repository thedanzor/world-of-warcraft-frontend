'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

import Nav from '@/core/components/nav'
import SeasonAlert from '@/core/components/SeasonAlert'

export default function AuditLayout({ children }) {
    const pathname = usePathname()
    const hideNav = pathname === '/install'

    if (hideNav) {
        return (
            <div className="flex min-h-screen text-foreground">
                <main className="flex-1 flex flex-col">
                    <div className="flex-1">
                        {children}
                    </div>
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        <p>&copy; 2025 Holybarryz (Scott Jones). All rights reserved.</p>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <SidebarProvider>
            <Nav />
            <SidebarInset>
                <header className="flex h-12 shrink-0 items-center gap-2 border-b border-white/[0.07] bg-[#090f18]/90 backdrop-blur-md px-4 md:px-6 sticky top-0 z-30">
                    <SidebarTrigger className="-ml-1 h-8 w-8" />
                    <Separator orientation="vertical" className="mr-2 h-4 opacity-40" />
                    <span className="text-[0.67rem] font-semibold text-muted-foreground tracking-[0.1em] uppercase">Guild Audit</span>
                </header>
                <main className="flex flex-1 flex-col gap-6 p-6 md:p-8 max-w-7xl w-full mx-auto">
                    {children}
                    
                    <footer className="mt-auto py-6 text-center text-sm text-muted-foreground">
                        <p>&copy; 2025 Holybarryz (Scott Jones). All rights reserved.</p>
                    </footer>
                </main>
                <SeasonAlert />
            </SidebarInset>
        </SidebarProvider>
    )
}
