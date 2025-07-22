import Image from 'next/image'

import './scss/logo.scss'

// Media
import full from '@/public/design/logo_screen.png'

// Generic Logo component
const Logo = ({ variant, className }) => {
   // By default return the default logo
    return (
        <Image
            src={full}
            alt="Logo GUILD NAME"
            width="290"
            height="278"
            className={className}
        />
    )
}

export const HeaderLogo = ({ className, variant }) => {
    return (
        <div
            className={`logoHeaderVariant ${className}`}
            onClick={() => (window.location.href = '/')}
        >
            <Logo variant={variant} />
        </div>
    )
}
export default Logo
