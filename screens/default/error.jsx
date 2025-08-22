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
