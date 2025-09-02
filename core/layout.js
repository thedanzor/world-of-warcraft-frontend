// Dynamic theme loader with direct imports
import DynamicThemeLoader from '@/core/dynamicThemeLoader'

// Material UI Components
import Box from '@mui/material/Box'

import Nav from '@/core/components/nav'
import SeasonAlert from '@/core/components/SeasonAlert'

export default function AuditLayout({ children }) {
    return (
        <DynamicThemeLoader>
            <Box className="layout-root">
                {/* Navigation */}
                <Nav />
                {/* Main content area */}
                <Box className="layout-content">
                    {children}
                    <div className="copyright">
                        <p className="copyright-text">
                            &copy; 2025 Holybarryz (Scott Jones). All rights reserved.
                        </p>
                    </div>
                </Box>
                {/* Season Alert - Client-side component */}
                <SeasonAlert />
            </Box>
        </DynamicThemeLoader>
    )
}
