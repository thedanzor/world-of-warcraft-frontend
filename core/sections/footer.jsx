import './scss/footer.scss'

import Logo from '@/core/components/logo'
import ContentWrapper from '@/core/components/content'
import { P } from '@/core/components/typography'

const Footer = ({ variant }) => {
    return (
        <footer className={`footer ${variant}`}>
            <ContentWrapper>
                <div className="content">
                    <div className="footerLogo">
                        <Logo />
                    </div>
                    <P style={{ fontSize: '0.8rem' }}>
                        Website is designed and developed by the members of One
                        More Game and copyright 2024. <br />
                        GUILD NAME consumes the Warcraft Profile API to build
                        it's audit and insight tools, Blizzard is in no way
                        connected, partnered, or responsible in anyway for the
                        content displayed here.
                    </P>
                </div>
            </ContentWrapper>
        </footer>
    )
}
export default Footer
