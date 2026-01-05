'use client'

import { telex, systemui } from '@/app/fonts'

import './scss/typo.scss'

export const SocialText = ({ children }) => {
    return (
        <span className={`${telex.className} socialText`}>{children}</span>
    )
}

export const MultiColorHeadingH1 = ({
    children,
    floatingText,
    highlightText,
    goFancy,
}) => {
    return (
        <h1 className={`${telex.className} primaryTitle`}>
            <span>
                {highlightText && (
                    <span className={` ${goFancy ? 'goFancy' : ''}`}>
                        {' '}
                        {highlightText}{' '}
                    </span>
                )}
                {children}
                {floatingText && <div>{floatingText}</div>}
            </span>
        </h1>
    )
}

export const P = ({
    children,
    className = '',
    style = {},
    onClick = () => {},
}) => {
    return (
        <p
            onClick={onClick}
            className={`${systemui.className} pstyling ${className}`}
            style={style}
        >
            {children}
        </p>
    )
}

export const Span = ({
    children,
    className = '',
    style = {},
    onClick = () => {},
}) => {
    return (
        <span
            onClick={onClick}
            className={`${systemui.className} span ${className}`}
            style={style}
        >
            {children}
        </span>
    )
}

export const Button = ({ children, variant = 'primaryButton' }) => {
    return (
        <span className={`${telex.className} ${variant}`}>{children}</span>
    )
}
export const ButtonEle = ({
    children,
    variant = 'primaryButton',
    className = '',
    onClick,
}) => {
    return (
        <span
            className={`${telex.className} ${variant} ${className}`}
            onClick={onClick}
        >
            {children}
        </span>
    )
}

export const CardTitle = ({ children, className = '', onClick = () => {} }) => {
    return (
        <h3
            onClick={onClick}
            className={`${telex.className} cardTitle ${className}`}
        >
            {children}
        </h3>
    )
}

export const OrElement = ({}) => {
    return <div className={`${telex.className} orElement`}>or</div>
}

export const H3 = ({ children }) => {
    return (
        <h3 className={`${telex.className} sectionHeading`}>{children}</h3>
    )
}

export const H4 = ({ children }) => {
    return (
        <h4 className={`${telex.className} sectionSubHeading`}>
            {children}
        </h4>
    )
}
