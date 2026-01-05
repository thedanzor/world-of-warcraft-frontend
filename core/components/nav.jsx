'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssessmentIcon from '@mui/icons-material/Assessment'
import StarIcon from '@mui/icons-material/Star'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'
import Typography from '@mui/material/Typography'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import BugReportIcon from '@mui/icons-material/BugReport'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'

import './scss/nav.scss'
import { useConfig } from '@/core/hooks/useConfig'
import menuConfig from '@/menu.config'

// Icon mapping for dynamic icon loading
const iconMap = {
    DashboardIcon,
    AssessmentIcon,
    StarIcon,
    EmojiEventsIcon,
    GroupAddIcon,
    HowToRegIcon,
    BugReportIcon,
    PrecisionManufacturingIcon
}

export default function Nav() {
    const { config, loading } = useConfig()
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)
    const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' })
    const [loginError, setLoginError] = useState('')
    const [loginLoading, setLoginLoading] = useState(false)
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen)
    
    // Get guild name from config and format it (replace hyphens with spaces)
    const guildName = config?.GUILD_NAME 
        ? config.GUILD_NAME.replace(/-/g, ' ')
        : process.env.NEXT_PUBLIC_GUILD_NAME?.replace(/-/g, ' ') || 'Guild'
    
    // Convert config navigation to component format with icon components
    const navigationItems = menuConfig?.NAVIGATION ? Object.entries(menuConfig.NAVIGATION).reduce((acc, [key, section]) => {
        acc[key] = {
            ...section,
            items: section.items.map(item => ({
                ...item,
                icon: iconMap[item.icon]
            }))
        }
        return acc
    }, {}) : {}

    console.log('config', config)
    console.log('menuConfig', menuConfig)
    console.log('navigationItems', navigationItems)
    // Helper functions
    function isActive(path, pathname) {
        if (path === '/') return pathname === path
        if (path === '/season2') return pathname === path
        return pathname.startsWith(path)
    }
    
    function getCurrentSection(pathname) {
        for (const [section, data] of Object.entries(navigationItems)) {
            const hasActiveItem = data.items.some(item => isActive(item.path, pathname))
            if (hasActiveItem) {
                return section
            }
        }
        return 'OVERVIEW'
    }
    
    if (loading || !navigationItems) {
        return <nav className="crm-nav-root"><div></div></nav>
    }
    
    const currentSection = getCurrentSection(pathname)
    const currentSectionItems = navigationItems[currentSection]?.items || []

    // Desktop group navigation (next to logo)
    const DesktopGroupNav = () => (
        <div className="crm-group-nav">
            {Object.entries(navigationItems).map(([sectionKey, section]) => (
                <Link 
                    key={sectionKey} 
                    href={section.items[0].path} 
                    className="crm-group-link"
                >
                    <div className={`crm-group-item${currentSection === sectionKey ? ' crm-group-item-active' : ''}`}>
                        <span className="crm-group-label">{section.label}</span>
                    </div>
                </Link>
            ))}
        </div>
    )

    // Desktop sub-navigation bar
    const DesktopSubNavBar = () => (
        <div className="crm-sub-nav-bar">
            {currentSectionItems.map((item) => (
                <Link key={item.path} href={item.path} className="crm-nav-link">
                    <div className={`crm-nav-item${isActive(item.path, pathname) ? ' crm-nav-item-active' : ''}`}>
                        <item.icon className="crm-nav-item-icon" />
                        <span className="crm-nav-item-label">{item.label}</span>
                    </div>
                </Link>
            ))}
        </div>
    )

    // Mobile nav items (drawer)
    const renderNavItems = () => (
        <List className="nav-mobile-list">
            {Object.entries(navigationItems).map(([sectionKey, section]) => (
                <div key={sectionKey}>
                    <ListItem className="nav-mobile-section-label">
                        <ListItemText primary={section.label} />
                    </ListItem>
                    {section.items.map((item) => (
                        <ListItem disablePadding key={item.label} className="nav-mobile-list-item">
                            <ListItemButton
                                component={Link}
                                href={item.path}
                                selected={isActive(item.path, pathname)}
                                className="nav-mobile-list-btn"
                                onClick={handleDrawerToggle}
                                {...(item.external ? { target: '_blank' } : {})}
                            >
                                <ListItemIcon className="nav-mobile-list-icon">
                                    <item.icon />
                                </ListItemIcon>
                                <ListItemText primary={item.label} className="nav-mobile-list-label" />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </div>
            ))}
            {/* Settings menu item */}
            <ListItem disablePadding className="nav-mobile-list-item">
                <ListItemButton
                    className="nav-mobile-list-btn"
                    onClick={() => {
                        handleDrawerToggle()
                        handleSettingsClick()
                    }}
                >
                    <ListItemIcon className="nav-mobile-list-icon">
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" className="nav-mobile-list-label" />
                </ListItemButton>
            </ListItem>
        </List>
    )

    const handleSettingsClick = () => {
        // Check if already authenticated
        const authStatus = sessionStorage.getItem('settings_authenticated')
        if (authStatus === 'true') {
            // Already authenticated, navigate directly
            window.location.href = '/settings'
        } else {
            // Not authenticated, show login dialog
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

            // Store authentication state and credentials
            sessionStorage.setItem('settings_authenticated', 'true')
            sessionStorage.setItem('settings_username', loginCredentials.username)
            sessionStorage.setItem('settings_password', loginCredentials.password)
            
            // Close dialog and redirect to settings
            setLoginDialogOpen(false)
            setLoginError('')
            setLoginCredentials({ username: '', password: '' })
            window.location.href = '/settings'
        } catch (error) {
            console.error('Error logging in:', error)
            setLoginError('Failed to login. Please try again.')
        } finally {
            setLoginLoading(false)
        }
    }

    const handleCloseLoginDialog = () => {
        if (!loginLoading) {
            setLoginDialogOpen(false)
            setLoginError('')
            setLoginCredentials({ username: '', password: '' })
        }
    }

    console.log('guildName', guildName)

    return (
        <nav className="crm-nav-root">
            {/* Top bar: Logo, group navigation, and mobile menu button */}
            <div className="crm-logo-bar">
                <div className="crm-logo-bar-inner">
                    <Link href="/" className="crm-logo-link">
                        {guildName}
                    </Link>
                    <div className="crm-logo-separator"></div>
                    {/* Desktop group navigation */}
                    <div className="crm-desktop-group-nav-wrapper">
                        <DesktopGroupNav />
                    </div>
                    {/* Desktop settings icon (right side) */}
                    <div className="crm-desktop-settings-wrapper">
                        <IconButton
                            aria-label="settings"
                            onClick={handleSettingsClick}
                            className="crm-settings-icon-btn"
                        >
                            <SettingsIcon />
                        </IconButton>
                    </div>
                    {/* Mobile menu button (right side) */}
                    <div className="crm-mobile-menu-btn-wrapper">
                        <IconButton
                            aria-label="open drawer"
                            edge="end"
                            onClick={handleDrawerToggle}
                            className="crm-mobile-menu-btn"
                        >
                            <MenuIcon />
                        </IconButton>
                    </div>
                </div>
            </div>
            {/* Desktop sub-navigation bar (hidden on mobile) */}
            <div className="crm-desktop-sub-nav-wrapper">
                <DesktopSubNavBar />
            </div>
            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                className="nav-mobile-drawer"
            >
                <div className="nav-mobile-drawer-content">
                    <div className="logoSmall">
                        {guildName}
                    </div>
                    {renderNavItems()}
                    {/* Mobile settings item */}
                    <ListItem disablePadding className="nav-mobile-list-item">
                        <ListItemButton
                            onClick={() => {
                                handleDrawerToggle()
                                handleSettingsClick()
                            }}
                            className="nav-mobile-list-btn"
                        >
                            <ListItemIcon className="nav-mobile-list-icon">
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Settings" className="nav-mobile-list-label" />
                        </ListItemButton>
                    </ListItem>
                </div>
            </Drawer>
            
            {/* Login Dialog */}
            <Dialog 
                open={loginDialogOpen} 
                onClose={handleCloseLoginDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Admin Login</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>
                        Please enter your admin credentials to access the settings panel.
                    </DialogContentText>
                    
                    {loginError && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setLoginError('')}>
                            {loginError}
                        </Alert>
                    )}
                    
                    <form onSubmit={handleLogin}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    value={loginCredentials.username}
                                    onChange={(e) => setLoginCredentials(prev => ({ ...prev, username: e.target.value }))}
                                    required
                                    disabled={loginLoading}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={loginCredentials.password}
                                    onChange={(e) => setLoginCredentials(prev => ({ ...prev, password: e.target.value }))}
                                    required
                                    disabled={loginLoading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={loginLoading || !loginCredentials.username || !loginCredentials.password}
                                    startIcon={loginLoading ? <CircularProgress size={20} /> : null}
                                >
                                    {loginLoading ? 'Logging in...' : 'Login'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
        </nav>
    )
} 