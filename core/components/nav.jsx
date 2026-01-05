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
import Typography from '@mui/material/Typography'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import BugReportIcon from '@mui/icons-material/BugReport'

import './scss/nav.scss'
import { useConfig } from '@/core/hooks/useConfig'

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
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen)
    
    // Convert config navigation to component format with icon components
    const navigationItems = config?.NAVIGATION ? Object.entries(config.NAVIGATION).reduce((acc, [key, section]) => {
        acc[key] = {
            ...section,
            items: section.items.map(item => ({
                ...item,
                icon: iconMap[item.icon]
            }))
        }
        return acc
    }, {}) : {}
    
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
    
    if (loading || !config?.NAVIGATION) {
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
        </List>
    )

    return (
        <nav className="crm-nav-root">
            {/* Top bar: Logo, group navigation, and mobile menu button */}
            <div className="crm-logo-bar">
                <div className="crm-logo-bar-inner">
                    <Link href="/" className="crm-logo-link">
                        {process.env.NEXT_PUBLIC_GUILD_NAME}
                    </Link>
                    {/* Desktop group navigation */}
                    <div className="crm-desktop-group-nav-wrapper">
                        <DesktopGroupNav />
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
                        {process.env.NEXT_PUBLIC_GUILD_NAME}
                    </div>
                    {renderNavItems()}
                </div>
            </Drawer>
        </nav>
    )
} 