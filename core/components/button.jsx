import './scss/button.scss'

import { Button, ButtonEle } from '@/core/components/typography'

export const PrimaryButton = ({ children, link, samePage }) => {
    return (
        <a href={link} target={samePage ? '' : '_blank'} className="primary">
            <Button>{children}</Button>
        </a>
    )
}

export const PrimaryButtonEle = ({ children, className = '', handleClick }) => {
    return (
        <ButtonEle className={`primary ${className}`} onClick={handleClick}>
            {children}
        </ButtonEle>
    )
}

export const SecondaryButton = ({ children, link, samePage }) => {
    return (
        <a href={link} target={samePage ? '' : '_blank'} className="secondary">
            <Button variant="secondaryButton">{children}</Button>
        </a>
    )
}
