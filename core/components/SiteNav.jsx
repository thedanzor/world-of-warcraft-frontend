'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Skull,
  Crown,
  Key,
  Trophy,
  UserCheck,
  Users,
  Shield,
  Settings,
} from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { APP_SHORT_NAME } from '@/core/seo'

const ICON_MAP = {
  DashboardIcon: LayoutDashboard,
  AssessmentIcon: Skull,
  EmojiEventsIcon: Trophy,
  StarIcon: Key,
  GroupAddIcon: Users,
  HowToRegIcon: UserCheck,
}

const PATH_COLORS = {
  '/': colors.accent,
  '/audit': colors.accent,
  '/rankings': colors.neonPurple,
  '/mythic-plus': colors.warning,
  '/rated-pvp': colors.success,
  '/seasons': colors.neonPurple,
  '/roster': colors.accentLt,
  '/join': colors.success,
  '/recruitment': colors.success,
}

function isActive(path, pathname) {
  if (path === '/') return pathname === path
  return pathname === path || pathname?.startsWith(`${path}/`)
}

function buildNavItems(seasonTitle) {
  if (!menuConfig?.NAVIGATION) return []

  const items = []
  for (const [key, section] of Object.entries(menuConfig.NAVIGATION)) {
    const sectionLabel = key === 'SEASONS' ? seasonTitle : section.label
    for (const item of section.items) {
      items.push({
        ...item,
        section: sectionLabel,
        icon: ICON_MAP[item.icon] || LayoutDashboard,
        color: PATH_COLORS[item.path] || colors.accent,
      })
    }
  }
  return items
}

export default function SiteNav() {
  const pathname = usePathname()
  const { config, loading } = useConfig()

  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const guildName = config?.GUILD_NAME
    ? config.GUILD_NAME.replace(/-/g, ' ')
    : process.env.NEXT_PUBLIC_GUILD_NAME?.replace(/-/g, ' ') || APP_SHORT_NAME

  const regionLabel = config?.REGION ? config.REGION.toUpperCase() : null
  const realmLabel = config?.GUILD_REALM?.replace(/-/g, ' ') || null
  const realmChip = regionLabel && realmLabel ? `${regionLabel} · ${realmLabel}` : null
  const seasonTitle = config?.SEASON_TITLE || menuConfig?.NAVIGATION?.SEASONS?.label || 'Current Season'

  const navItems = buildNavItems(seasonTitle)

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
        headers: { 'Content-Type': 'application/json' },
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

  if (loading) {
    return (
      <nav
        className="sticky top-0 z-[100] border-b border-white/[0.07] bg-[#090f18]/92 backdrop-blur-[14px] h-14"
        aria-hidden
      />
    )
  }

  return (
    <>
      <nav
        className="sticky top-0 z-[100] border-b border-white/[0.07] bg-[#090f18]/92 backdrop-blur-[14px]"
      >
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-14 gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 min-w-0 shrink-0 group">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-md shrink-0 transition-colors"
                style={{
                  background: `${colors.accent}26`,
                  border: `1px solid ${colors.accent}4d`,
                }}
              >
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0 hidden sm:block">
                <p className="font-bold text-[0.95rem] text-[#f1f5f9] tracking-tight truncate capitalize group-hover:text-primary transition-colors">
                  {guildName}
                </p>
                {realmChip && (
                  <p
                    className="text-[0.68rem] font-semibold truncate mt-0.5"
                    style={{ color: colors.accentLt }}
                  >
                    {realmChip}
                  </p>
                )}
              </div>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none min-w-0 flex-1 justify-end">
              {navItems.map((item) => {
                const active = isActive(item.path, pathname)
                const color = item.color
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="shrink-0 rounded-md transition-all duration-150"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.375rem 0.625rem',
                      background: active ? `${color}1f` : 'transparent',
                      border: `1px solid ${active ? `${color}4d` : 'transparent'}`,
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = `${color}14`
                        e.currentTarget.style.borderColor = `${color}33`
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = 'transparent'
                      }
                    }}
                  >
                    <item.icon
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: active ? color : 'rgba(241,245,249,0.45)' }}
                    />
                    <span
                      className="text-[0.8rem] hidden md:block"
                      style={{
                        fontWeight: active ? 700 : 500,
                        color: active ? color : 'rgba(241,245,249,0.6)',
                      }}
                    >
                      {item.label}
                    </span>
                  </Link>
                )
              })}

              <button
                type="button"
                onClick={handleSettingsClick}
                className="shrink-0 rounded-md flex items-center gap-1.5 px-2.5 py-1.5 ml-0.5 text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08] transition-all"
                aria-label="Settings"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="text-[0.8rem] hidden lg:block font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

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
                onChange={(e) => setLoginCredentials((prev) => ({ ...prev, username: e.target.value }))}
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
                onChange={(e) => setLoginCredentials((prev) => ({ ...prev, password: e.target.value }))}
                required
                disabled={loginLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginLoading || !loginCredentials.username || !loginCredentials.password}
            >
              {loginLoading && <Spinner className="mr-2 h-4 w-4" />}
              {loginLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
