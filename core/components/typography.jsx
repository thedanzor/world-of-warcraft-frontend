'use client'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export const SocialText = ({ children, className }) => {
    return (
        <span className={cn("text-sm text-muted-foreground", className)}>{children}</span>
    )
}

export const MultiColorHeadingH1 = ({
    children,
    floatingText,
    highlightText,
    goFancy,
    className
}) => {
    return (
        <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}>
            <span>
                {highlightText && (
                    <span className={cn(goFancy ? 'text-primary' : 'text-primary')}>
                        {' '}
                        {highlightText}{' '}
                    </span>
                )}
                {children}
                {floatingText && <div className="text-xl font-medium text-muted-foreground mt-2">{floatingText}</div>}
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
            className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
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
            className={cn(className)}
            style={style}
        >
            {children}
        </span>
    )
}

const mapVariant = (v) => {
    switch (v) {
        case 'secondaryButton': return 'secondary';
        case 'errorButton': return 'destructive';
        case 'warningButton': return 'destructive';
        case 'infoButton': return 'secondary';
        case 'successButton': return 'default';
        case 'primaryButton':
        default: return 'default';
    }
}

export const Button = ({ children, variant = 'primaryButton', className }) => {
    return (
        <span className={cn(buttonVariants({ variant: mapVariant(variant) }), className)}>
            {children}
        </span>
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
            className={cn(buttonVariants({ variant: mapVariant(variant) }), 'cursor-pointer', className)}
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
            className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
        >
            {children}
        </h3>
    )
}

export const OrElement = ({ className }) => {
    return <div className={cn("text-sm font-medium text-muted-foreground my-4 text-center", className)}>or</div>
}

export const H3 = ({ children, className }) => {
    return (
        <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)}>
            {children}
        </h3>
    )
}

export const H4 = ({ children, className }) => {
    return (
        <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)}>
            {children}
        </h4>
    )
}
