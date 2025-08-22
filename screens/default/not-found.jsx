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
