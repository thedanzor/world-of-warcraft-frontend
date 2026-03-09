'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    BarChart,
    Star,
    Trophy,
    Users,
    UserCheck,
    Bug,
    Wrench,
    Settings
} from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'

import { useConfig } from '@/core/hooks/useConfig'
import menuConfig from '@/menu.config'

const iconMap = {
    DashboardIcon: LayoutDashboard,
    AssessmentIcon: BarChart,
    StarIcon: Star,
    EmojiEventsIcon: Trophy,
    GroupAddIcon: Users,
    HowToRegIcon: UserCheck,
    BugReportIcon: Bug,
    PrecisionManufacturingIcon: Wrench
}

export default function Nav() {
    const { config, loading } = useConfig()
    const pathname = usePathname()
    const { setOpenMobile } = useSidebar()
    
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)
    const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' })
    const [loginError, setLoginError] = useState('')
    const [loginLoading, setLoginLoading] = useState(false)

    const guildName = config?.GUILD_NAME 
        ? config.GUILD_NAME.replace(/-/g, ' ')
        : process.env.NEXT_PUBLIC_GUILD_NAME?.replace(/-/g, ' ') || 'Guild'
    
    const seasonTitle = config?.SEASON_TITLE || menuConfig?.NAVIGATION?.SEASONS?.label || 'Current Season'
    
    const navigationItems = menuConfig?.NAVIGATION ? Object.entries(menuConfig.NAVIGATION).reduce((acc, [key, section]) => {
        const sectionLabel = key === 'SEASONS' ? seasonTitle : section.label
        acc[key] = {
            ...section,
            label: sectionLabel,
            items: section.items.map(item => ({
                ...item,
                icon: iconMap[item.icon] || LayoutDashboard
            }))
        }
        return acc
    }, {}) : {}

    function isActive(path, pathname) {
        if (path === '/') return pathname === path
        if (path === '/season2') return pathname === path
        return pathname.startsWith(path)
    }

    const handleSettingsClick = () => {
        const authStatus = sessionStorage.getItem('settings_authenticated')
        if (authStatus === 'true') {
            window.location.href = '/settings'
        } else {
            setLoginDialogOpen(true)
            setLoginError('')
            setLoginCredentials({ username: '', password: '' })
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoginLoading(true)
        setLoginError('')

        try {
            const response = await fetch('/api/install/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginCredentials),
            })

            const data = await response.json()

            if (!response.ok) {
                setLoginError(data.message || data.error || 'Login failed')
                return
            }

            sessionStorage.setItem('settings_authenticated', 'true')
            sessionStorage.setItem('settings_username', loginCredentials.username)
            sessionStorage.setItem('settings_password', loginCredentials.password)
            
            setLoginDialogOpen(false)
            window.location.href = '/settings'
        } catch (error) {
            console.error('Error logging in:', error)
            setLoginError('Failed to login. Please try again.')
        } finally {
            setLoginLoading(false)
        }
    }

    if (loading || !navigationItems) {
        return <Sidebar className="hidden" />
    }

    return (
        <>
            <Sidebar>
                <SidebarHeader className="px-5 py-5 border-b border-border/30">
                    <Link href="/" className="font-bold text-xl tracking-tight truncate text-foreground hover:opacity-80 transition-opacity capitalize" onClick={() => setOpenMobile(false)}>
                        {guildName}
                    </Link>
                </SidebarHeader>
                
                <SidebarContent className="py-3">
                    {Object.entries(navigationItems).map(([sectionKey, section]) => (
                        <SidebarGroup key={sectionKey} className="px-3 pb-1">
                            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest px-2 mb-1">{section.label}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {section.items.map((item) => {
                                        const isCurrent = isActive(item.path, pathname);
                                        return (
                                            <SidebarMenuItem key={item.path}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={isCurrent}
                                                    onClick={() => setOpenMobile(false)}
                                                    className={`rounded-md h-9 transition-all duration-150 ${isCurrent ? 'bg-muted text-foreground font-semibold' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}
                                                >
                                                    <Link href={item.path} target={item.external ? '_blank' : undefined} className="flex items-center gap-2.5 px-2.5">
                                                        {item.icon && <item.icon className="w-4 h-4 shrink-0" />}
                                                        <span className="text-sm">{item.label}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </SidebarContent>

                <SidebarFooter className="px-3 pb-4 pt-3 border-t border-border/30">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={handleSettingsClick}
                                className="rounded-md h-9 transition-all duration-150 text-muted-foreground hover:bg-muted/60 hover:text-foreground flex items-center gap-2.5 px-2.5 w-full"
                            >
                                <Settings className="w-4 h-4 shrink-0" />
                                <span className="text-sm">Settings</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <Dialog open={loginDialogOpen} onOpenChange={(open) => !loginLoading && setLoginDialogOpen(open)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Admin Login</DialogTitle>
                        <DialogDescription>
                            Please enter your admin credentials to access the settings panel.
                        </DialogDescription>
                    </DialogHeader>

                    {loginError && (
                        <Alert variant="destructive">
                            <AlertDescription>{loginError}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <Input
                                value={loginCredentials.username}
                                onChange={(e) => setLoginCredentials(prev => ({ ...prev, username: e.target.value }))}
                                required
                                disabled={loginLoading}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                type="password"
                                value={loginCredentials.password}
                                onChange={(e) => setLoginCredentials(prev => ({ ...prev, password: e.target.value }))}
                                required
                                disabled={loginLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loginLoading || !loginCredentials.username || !loginCredentials.password}>
                            {loginLoading && <Spinner className="mr-2 h-4 w-4" />}
                            {loginLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
