/**
 * MODERN DARK UI THEME
 * 
 * A clean, professional dark theme inspired by modern commercial dashboard software.
 * Features sophisticated typography, proper spacing, and a refined color palette.
 * 
 * DESIGN PRINCIPLES:
 * - Clean, minimal aesthetic with focus on readability
 * - Sophisticated color palette with browns, dark grays, and whites
 * - Proper contrast ratios for accessibility
 * - Consistent spacing and typography hierarchy
 * - Modern component styling with subtle shadows and borders
 * 
 * COLOR SYSTEM:
 * - Primary: Gold (#FFD700) for accents and primary actions
 * - Secondary: Cool grays for backgrounds and secondary elements
 * - Text: High contrast whites and grays for readability
 * - Background: Deep dark grays for depth and focus
 * - Accents: Subtle browns and warm tones for visual interest
 * 
 * TYPOGRAPHY:
 * - Clean, modern font stack with excellent readability
 * - Proper font weights and sizing for hierarchy
 * - Consistent line heights and letter spacing
 * - Responsive typography scaling
 * 
 * SPACING:
 * - 8px base unit system for consistent spacing
 * - Proper padding and margins throughout
 * - Generous whitespace for breathing room
 * 
 * COMPONENT DESIGN:
 * - Subtle borders and shadows for depth
 * - Rounded corners for modern feel
 * - Hover states with smooth transitions
 * - Focus states for accessibility
 */

'use client'

import { useMemo, useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import StyledEngineProvider from '@mui/material/StyledEngineProvider'
import { HEADER_HEIGHT } from './config'
import { alpha } from '@mui/material/styles'
import merge from 'lodash/merge'

// Import base styles first (foundation)
import './base.scss'

// Import component styles (navigation, layout)
import '@/core/components/scss/nav.scss'

// Import screen styles in logical order (most important first)
import '@/core/screens/default/scss/dashboard.scss'
import '@/core/screens/default/scss/roster.scss'
import '@/core/screens/default/scss/recruitment.scss'
import '@/core/screens/default/scss/guildAudit.scss'
import '@/core/screens/default/scss/team.scss'
import '@/core/screens/default/scss/activities.scss'
import '@/core/screens/default/scss/header.scss'
import '@/core/screens/default/scss/mplus.scss'
import '@/core/screens/default/scss/mrt.scss'
import '@/core/screens/default/scss/peerOverview.scss'
import '@/core/screens/default/scss/pvp.scss'

// ==============================|| MODERN DARK PALETTE ||============================== //
const palette = {
    mode: 'dark',
    common: { 
        black: '#000000', 
        white: '#FFFFFF' 
    },
    primary: {
        lighter: '#FFED4E',
        100: '#FFED4E',
        200: '#FFE135',
        light: '#FFED4E',
        400: '#FFD700',
        main: '#FFD700',
        dark: '#FFA500',
        700: '#FF8C00',
        darker: '#FF7F00',
        900: '#FF6B00',
        contrastText: '#000000',
    },
    secondary: {
        lighter: '#152238',
        100: '#152238',
        200: '#1a2d4a',
        light: '#1f3a5c',
        400: '#2a4a6e',
        500: '#355a80',
        main: '#406a92',
        dark: '#4b7aa4',
        800: '#568ab6',
        darker: '#619ac8',
        contrastText: '#FFFFFF',
    },
    error: {
        lighter: '#FEE2E2',
        light: '#FCA5A5',
        main: '#EF4444',
        dark: '#DC2626',
        darker: '#B91C1C',
        contrastText: '#FFFFFF',
    },
    warning: {
        lighter: '#FEF3C7',
        light: '#FCD34D',
        main: '#F59E0B',
        dark: '#D97706',
        darker: '#B45309',
        contrastText: '#000000',
    },
    info: {
        lighter: '#DBEAFE',
        light: '#93C5FD',
        main: '#3B82F6',
        dark: '#2563EB',
        darker: '#1D4ED8',
        contrastText: '#FFFFFF',
    },
    success: {
        lighter: '#D1FAE5',
        light: '#6EE7B7',
        main: '#10B981',
        dark: '#059669',
        darker: '#047857',
        contrastText: '#FFFFFF',
    },
    grey: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#E5E5E5',
        300: '#D4D4D4',
        400: '#A3A3A3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
    },
    text: {
        primary: '#FFFFFF',
        secondary: '#B0C4DE',
        disabled: '#6B7A99',
    },
    action: {
        active: alpha('#FFFFFF', 0.54),
        hover: alpha('#FFD700', 0.08),
        selected: alpha('#FFD700', 0.15),
        disabled: alpha('#FFFFFF', 0.26),
        disabledBackground: alpha('#FFFFFF', 0.12),
        focus: alpha('#FFD700', 0.12),
        hoverOpacity: 0.08,
        selectedOpacity: 0.15,
        disabledOpacity: 0.26,
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
    },
    divider: alpha('#B0C4DE', 0.15),
    background: {
        default: '#0a1628',
        paper: '#101a29',
        secondary: '#152238',
        tertiary: '#1a2d4a',
    },
}

// ==============================|| MODERN SHADOWS ||============================== //
const customShadows = (theme) => ({
    button: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    text: '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    z1: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    z2: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    z3: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    z4: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    primary: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
    secondary: `0 0 0 3px ${alpha(theme.palette.secondary.main, 0.1)}`,
    error: `0 0 0 3px ${alpha(theme.palette.error.main, 0.1)}`,
    warning: `0 0 0 3px ${alpha(theme.palette.warning.main, 0.1)}`,
    info: `0 0 0 3px ${alpha(theme.palette.info.main, 0.1)}`,
    success: `0 0 0 3px ${alpha(theme.palette.success.main, 0.1)}`,
})

// ==============================|| MODERN COMPONENT OVERRIDES ||============================== //

function Accordion(theme) {
    return {
        MuiAccordion: {
            defaultProps: { 
                disableGutters: true, 
                square: false, 
                elevation: 0 
            },
            styleOverrides: {
                root: {
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 8,
                    '&:not(:last-child)': { 
                        borderBottom: `1px solid ${theme.palette.divider}` 
                    },
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': {
                        margin: '8px 0',
                    },
                },
            },
        },
    }
}

function AccordionDetails(theme) {
    return {
        MuiAccordionDetails: {
            styleOverrides: {
                root: { 
                    padding: theme.spacing(3),
                    backgroundColor: theme.palette.background.secondary,
                },
            },
        },
    }
}

function Alert(theme) {
    return {
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    border: `1px solid ${theme.palette.divider}`,
                    padding: theme.spacing(2, 3),
                },
                standardInfo: {
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                },
                standardSuccess: {
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                },
                standardWarning: {
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                },
                standardError: {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                },
            },
        },
    }
}

function Autocomplete(theme) {
    return {
        MuiAutocomplete: {
            styleOverrides: {
                paper: {
                    boxShadow: theme.customShadows.z3,
                    borderRadius: 8,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                },
                listbox: {
                    padding: theme.spacing(1),
                    '& .MuiAutocomplete-option': {
                        borderRadius: 6,
                        margin: theme.spacing(0.5, 0),
                        '&[aria-selected="true"]': {
                            backgroundColor: theme.palette.action.selected,
                        },
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                        },
                    },
                },
            },
        },
    }
}

function Avatar(theme) {
    return {
        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 600,
                },
            },
        },
    }
}

function Backdrop(theme) {
    return {
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha(theme.palette.background.default, 0.8),
                    backdropFilter: 'blur(4px)',
                },
            },
        },
    }
}

function Badge(theme) {
    return {
        MuiBadge: {
            styleOverrides: {
                badge: {
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    minWidth: 20,
                    height: 20,
                    padding: '0 6px',
                },
            },
        },
    }
}

function Button(theme) {
    return {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    padding: theme.spacing(1.5, 3),
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: theme.customShadows.z2,
                    },
                },
                contained: {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                    },
                },
                outlined: {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                },
                text: {
                    color: theme.palette.primary.main,
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                },
            },
        },
    }
}

function Card(theme) {
    return {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.customShadows.z1,
                    overflow: 'hidden',
                },
            },
        },
    }
}

function Chip(theme) {
    return {
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                },
                filled: {
                    backgroundColor: theme.palette.background.secondary,
                    color: theme.palette.text.primary,
                },
                outlined: {
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.secondary,
                },
            },
        },
    }
}

function Dialog(theme) {
    return {
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 12,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.customShadows.z4,
                },
            },
        },
    }
}

function Drawer(theme) {
    return {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.customShadows.z3,
                },
            },
        },
    }
}

function ListItemButton(theme) {
    return {
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    margin: theme.spacing(0.5, 1),
                    '&.Mui-selected': {
                        backgroundColor: theme.palette.action.selected,
                        '&:hover': {
                            backgroundColor: theme.palette.action.selected,
                        },
                    },
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                },
            },
        },
    }
}

function Menu(theme) {
    return {
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: 8,
                    boxShadow: theme.customShadows.z3,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                },
            },
        },
    }
}

function Paper(theme) {
    return {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    background: 'rgb(25 21 29 / 80%) !important',
                    border: `1px solid ${theme.palette.divider}`,
                },
            },
        },
    }
}

function Popover(theme) {
    return {
        MuiPopover: {
            styleOverrides: {
                paper: {
                    borderRadius: 8,
                    boxShadow: theme.customShadows.z3,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                },
            },
        },
    }
}

function Snackbar(theme) {
    return {
        MuiSnackbar: {
            styleOverrides: {
                root: {
                    '& .MuiAlert-root': {
                        borderRadius: 8,
                        boxShadow: theme.customShadows.z3,
                    },
                },
            },
        },
    }
}

function Table(theme) {
    return {
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: theme.palette.background.secondary,
                    '& .MuiTableCell-root': {
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    padding: theme.spacing(2),
                },
            },
        },
    }
}

function Tabs(theme) {
    return {
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    minHeight: 48,
                    minWidth: 100,
                    '&.Mui-selected': {
                        color: theme.palette.primary.main,
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: theme.palette.primary.main,
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                },
            },
        },
    }
}

function TextField(theme) {
    return {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        backgroundColor: theme.palette.background.secondary,
                        '& fieldset': {
                            borderColor: theme.palette.divider,
                            borderWidth: 1,
                        },
                        '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 2,
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: theme.palette.text.secondary,
                        '&.Mui-focused': {
                            color: theme.palette.primary.main,
                        },
                    },
                },
            },
        },
    }
}

function Typography(theme) {
    return {
        MuiTypography: {
            styleOverrides: {
                h1: { 
                    fontFamily: '"Telex", sans-serif',
                    fontWeight: 700, 
                    fontSize: '2.5rem', 
                    lineHeight: 1.2,
                    letterSpacing: '0.02em',
                    color: '#C8D8E8',
                    textShadow: '0 0 10px rgba(200, 216, 232, 0.25), 0 2px 4px rgba(0, 0, 0, 0.4)',
                },
                h2: { 
                    fontFamily: '"Telex", sans-serif',
                    fontWeight: 700, 
                    fontSize: '2rem', 
                    lineHeight: 1.2,
                    letterSpacing: '0.02em',
                    color: '#C8D8E8',
                    textShadow: '0 0 8px rgba(200, 216, 232, 0.2), 0 2px 3px rgba(0, 0, 0, 0.3)',
                },
                h3: { 
                    fontFamily: '"Telex", sans-serif',
                    fontWeight: 600, 
                    fontSize: '1.75rem', 
                    lineHeight: 1.2,
                    letterSpacing: '0.02em',
                    color: '#D8D8D8',
                    textShadow: '0 0 6px rgba(200, 216, 232, 0.15)',
                },
                h4: { 
                    fontFamily: '"Telex", sans-serif',
                    fontWeight: 600, 
                    fontSize: '1.5rem', 
                    lineHeight: 1.2,
                    letterSpacing: '0.02em',
                    color: '#D8D8D8',
                    textShadow: '0 0 5px rgba(200, 216, 232, 0.1)',
                },
                h5: { 
                    fontFamily: '"Telex", sans-serif',
                    fontWeight: 600, 
                    fontSize: '1.25rem', 
                    lineHeight: 1.2,
                    letterSpacing: '0.02em',
                    color: '#D8D8D8',
                },
                h6: { 
                    fontFamily: '"Telex", sans-serif',
                    fontWeight: 600, 
                    fontSize: '1.125rem', 
                    lineHeight: 1.2,
                    letterSpacing: '0.02em',
                    color: '#D8D8D8',
                },
                body1: { 
                    fontSize: '1rem', 
                    lineHeight: 1.6,
                    color: theme.palette.text.primary,
                },
                body2: { 
                    fontSize: '0.875rem', 
                    lineHeight: 1.6,
                    color: theme.palette.text.secondary,
                },
                caption: { 
                    fontSize: '0.75rem', 
                    lineHeight: 1.5,
                    color: theme.palette.text.secondary,
                },
                button: { 
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
    }
}

function Select(theme) {
    return {
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: theme.palette.background.secondary,
                },
                outlined: {
                    '& fieldset': {
                        borderColor: theme.palette.divider,
                    },
                    '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                    },
                },
            },
        },
    }
}

// ==============================|| THEME PROVIDER ||============================== //
export default function ThemeCustomization({ children }) {
    const [stylesLoaded, setStylesLoaded] = useState(false)
    
    // Ensure styles are loaded before rendering
    useEffect(() => {
        // Small delay to ensure SCSS imports are processed
        const timer = setTimeout(() => {
            setStylesLoaded(true)
        }, 50)
        
        return () => clearTimeout(timer)
    }, [])
    
    const theme = useMemo(() => createTheme({ palette }), [])
    const themeOptions = useMemo(
        () => ({
            breakpoints: {
                values: { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280 },
            },
            direction: 'ltr',
            mixins: {
                toolbar: { 
                    minHeight: HEADER_HEIGHT, 
                    paddingTop: 16, 
                    paddingBottom: 16 
                },
            },
            palette: theme.palette,
            shape: { borderRadius: 8 },
            spacing: 8,
            customShadows: customShadows(theme),
            typography: {
                fontFamily: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                ].join(','),
                fontSize: 14,
                fontWeightLight: 300,
                fontWeightRegular: 400,
                fontWeightMedium: 500,
                fontWeightBold: 700,
            },
        }),
        [theme]
    )
    
    const themes = createTheme(themeOptions)
    
    // Merge all component overrides
    themes.components = merge(
        Accordion(themes),
        AccordionDetails(themes),
        Alert(themes),
        Autocomplete(themes),
        Avatar(themes),
        Backdrop(themes),
        Badge(themes),
        Button(themes),
        Card(themes),
        Chip(themes),
        Dialog(themes),
        Drawer(themes),
        ListItemButton(themes),
        Menu(themes),
        Paper(themes),
        Popover(themes),
        Snackbar(themes),
        Table(themes),
        Tabs(themes),
        TextField(themes),
        Typography(themes),
        Select(themes),
    )
    
    // Show loading state until styles are ready
    if (!stylesLoaded) {
        return (
            <div style={{ 
                        backgroundColor: '#0a1628',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}>
                <div style={{ 
                    textAlign: 'center',
                    position: 'relative'
                }}>
                    {/* Animated logo/icon */}
                    <div style={{
                        width: '64px',
                        height: '64px',
                        margin: '0 auto 24px',
                        position: 'relative',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFED4E 50%, #FFE135 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'pulse 2s ease-in-out infinite',
                        boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '6px',
                            position: 'relative',
                            animation: 'rotate 3s linear infinite'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '16px',
                                height: '16px',
                                background: '#FFD700',
                                borderRadius: '3px'
                            }}></div>
                        </div>
                    </div>
                    
                    {/* Loading text */}
                    <div style={{ 
                        color: '#FFFFFF', 
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        marginBottom: '8px',
                        letterSpacing: '-0.025em'
                    }}>
                        Loading WoW Guild Audit App
                    </div>
                    
                    {/* Subtitle text */}
                    <div style={{ 
                        color: '#B0C4DE', 
                        fontSize: '0.875rem',
                        fontWeight: '400',
                        marginBottom: '16px',
                        letterSpacing: '-0.025em'
                    }}>
                        Application by ScottJones.nl
                    </div>
                    
                    {/* Animated dots */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '4px',
                        marginTop: '8px'
                    }}>
                        <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#FFD700',
                            animation: 'bounce 1.4s ease-in-out infinite both',
                            animationDelay: '0s'
                        }}></div>
                        <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#FFD700',
                            animation: 'bounce 1.4s ease-in-out infinite both',
                            animationDelay: '0.16s'
                        }}></div>
                        <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#FFD700',
                            animation: 'bounce 1.4s ease-in-out infinite both',
                            animationDelay: '0.32s'
                        }}></div>
                    </div>
                    
                    {/* Progress bar */}
                    <div style={{
                        width: '200px',
                        height: '2px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '1px',
                        margin: '24px auto 0',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, #FFD700, #FFED4E)',
                            borderRadius: '1px',
                            animation: 'progress 2s ease-in-out infinite',
                            transformOrigin: 'left'
                        }}></div>
                    </div>
                </div>
                
                {/* CSS Animations */}
                <style>{`
                    @keyframes pulse {
                        0%, 100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                        50% {
                            transform: scale(1.05);
                            opacity: 0.8;
                        }
                    }
                    
                    @keyframes rotate {
                        0% {
                            transform: translate(-50%, -50%) rotate(0deg);
                        }
                        100% {
                            transform: translate(-50%, -50%) rotate(360deg);
                        }
                    }
                    
                    @keyframes bounce {
                        0%, 80%, 100% {
                            transform: scale(0.8);
                            opacity: 0.5;
                        }
                        40% {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                    
                    @keyframes progress {
                        0% {
                            transform: translateX(-100%);
                        }
                        50% {
                            transform: translateX(0%);
                        }
                        100% {
                            transform: translateX(100%);
                        }
                    }
                `}</style>
            </div>
        )
    }
    
    return (
        <StyledEngineProvider injectFirst={false}>
            <ThemeProvider theme={themes}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    )
}
