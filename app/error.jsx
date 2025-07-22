'use client'

import ContentWrapper from '@/core/components/content'

import { MultiColorHeadingH1 } from '@/core/components/typography'


// React component
const Header = () => {
    return (
        <header>
                <ContentWrapper>

                    <div className="headerContext">
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
export default Header
