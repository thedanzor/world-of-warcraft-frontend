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
            <div className="flex min-h-screen bg-background text-foreground">
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
                <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/40 bg-background/80 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
                    <SidebarTrigger className="-ml-1 h-8 w-8" />
                    <Separator orientation="vertical" className="mr-2 h-4 opacity-50" />
                    <span className="text-xs font-medium text-muted-foreground/70 tracking-wider uppercase">Guild Audit</span>
                </header>
                <main className="flex flex-1 flex-col gap-6 p-6 md:p-8 bg-background">
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
