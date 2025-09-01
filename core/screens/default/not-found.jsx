/**
 * NOT FOUND SCREEN (404 ERROR)
 * 
 * This screen displays when users navigate to a page that doesn't exist,
 * providing a clear 404 error message while maintaining the guild's visual branding.
 * 
 * WHAT THIS DOES:
 * - Displays user-friendly 404 error messages for missing pages
 * - Maintains consistent visual design during navigation errors
 * - Uses guild branding and typography for professional appearance
 * - Provides clear indication that the requested page was not found
 * 
 * KEY FEATURES:
 * - Consistent 404 error message display
 * - Guild branding maintained during navigation errors
 * - Professional error handling appearance
 * - Responsive design for all device sizes
 * 
 * 404 ERROR HANDLING:
 * - Catches and displays navigation errors gracefully
 * - Maintains user experience during routing failures
 * - Provides clear feedback about missing pages
 * - Keeps users informed about navigation status
 * 
 * DESIGN CONSISTENCY:
 * - Uses ContentWrapper for consistent layout
 * - MultiColorHeadingH1 for branded error display
 * - Maintains guild visual identity
 * - Professional error presentation
 * 
 * NAVIGATION SUPPORT:
 * - Helps users understand when they've reached a dead end
 * - Maintains application context during errors
 * - Provides consistent error experience
 * 
 * USAGE:
 * Automatically displayed when users navigate to non-existent pages.
 * Essential for maintaining user experience during navigation failures.
 * 
 * MODIFICATION NOTES:
 * - Keep 404 messages user-friendly and clear
 * - Consider adding navigation suggestions
 * - Test error display on various devices
 * - Consider adding search functionality
 * - Maintain consistent branding during errors
 */

'use client'

import ContentWrapper from '@/core/components/content'
import { MultiColorHeadingH1 } from '@/core/components/typography'

// React component
const NotFound = () => {
    return (
        <header>
            <ContentWrapper>
                <div className="not-found">
                    <MultiColorHeadingH1
                        floatingText="We could not find the page you were looking for"
                        highlightText="Page"
                    >
                        Not Found
                    </MultiColorHeadingH1>
                </div>
            </ContentWrapper>
        </header>
    )
}

export default NotFound
