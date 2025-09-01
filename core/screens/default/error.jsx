/**
 * ERROR SCREEN
 * 
 * This screen displays when an application error occurs, providing users with
 * a clear message and maintaining the guild's visual branding during error states.
 * 
 * WHAT THIS DOES:
 * - Displays user-friendly error messages when something goes wrong
 * - Maintains consistent visual design even during error states
 * - Uses guild branding and typography for professional appearance
 * - Provides clear indication that an error has occurred
 * 
 * KEY FEATURES:
 * - Consistent error message display
 * - Guild branding maintained during errors
 * - Professional error handling appearance
 * - Responsive design for all device sizes
 * 
 * ERROR HANDLING:
 * - Catches and displays application errors gracefully
 * - Maintains user experience during error states
 * - Provides clear feedback about what went wrong
 * - Keeps users informed about application status
 * 
 * DESIGN CONSISTENCY:
 * - Uses ContentWrapper for consistent layout
 * - MultiColorHeadingH1 for branded error display
 * - Maintains guild visual identity
 * - Professional error presentation
 * 
 * USAGE:
 * Automatically displayed when application errors occur.
 * Essential for maintaining user experience during failures.
 * 
 * MODIFICATION NOTES:
 * - Keep error messages user-friendly and clear
 * - Consider adding error reporting functionality
 * - Test error display on various devices
 * - Consider adding recovery suggestions
 * - Maintain consistent branding during errors
 */

'use client'

import ContentWrapper from '@/core/components/content'
import { MultiColorHeadingH1 } from '@/core/components/typography'

// React component
const Error = () => {
    return (
        <header>
            <ContentWrapper>
                <div className="headerContext">
                    <MultiColorHeadingH1
                        floatingText="Something went wrong"
                        highlightText="Error"
                    >
                        Error
                    </MultiColorHeadingH1>
                </div>
            </ContentWrapper>
        </header>
    )
}

export default Error
