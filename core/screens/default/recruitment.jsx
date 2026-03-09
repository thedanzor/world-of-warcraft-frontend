'use client'

import { useState, useEffect } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
    MessageCircle as ChatIcon, 
    Mail as EmailIcon,
    CheckCircle as CheckCircleIcon,
    Trophy as TrophyIcon,
    Users as PeopleIcon,
    Clock as ScheduleIcon,
    Contact as ContactMailIcon,
    Gavel as RulesIcon,
    ArrowRight,
} from 'lucide-react'

import ContentWrapper from '@/core/components/content'

const ICON_MAP = {
    requirements: RulesIcon,
    benefits: TrophyIcon,
    process: CheckCircleIcon,
    needs: PeopleIcon,
    schedule: ScheduleIcon,
    contact: ContactMailIcon,
}

const ACCENT_COLORS = {
    requirements: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    benefits: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
    process: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    needs: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    schedule: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    contact: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
}

const getCardType = (title = '') => {
    const t = title.toLowerCase()
    if (t.includes('requirement') || t.includes('criteria')) return 'requirements'
    if (t.includes('benefit') || t.includes('guild')) return 'benefits'
    if (t.includes('process') || t.includes('application')) return 'process'
    if (t.includes('need') || t.includes('recruiting')) return 'needs'
    if (t.includes('schedule') || t.includes('raid')) return 'schedule'
    if (t.includes('contact') || t.includes('join')) return 'contact'
    return 'process'
}

const Recruitment = () => {
    const [joinText, setJoinText] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchJoinText = async () => {
            try {
                setLoading(true)
                setError('')
                const response = await fetch('/api/jointext', {
                    cache: 'no-store',
                    headers: { 'Cache-Control': 'no-cache' },
                })
                const data = await response.json()

                if (!response.ok) {
                    setError(data.message || data.error || 'Failed to load join text')
                    return
                }

                const fetchedData = data.joinText || {}
                if (!fetchedData.hero) {
                    fetchedData.hero = {
                        title: 'Join Our Guild',
                        subtitle: 'Embark on epic adventures with skilled players.',
                        badges: [],
                    }
                }
                setJoinText(fetchedData)
            } catch (err) {
                setError('Failed to load join text. Please try again.')
            } finally {
                setLoading(false)
            }
        }
        fetchJoinText()
    }, [])

    const renderBlock = (block) => {
        const cardType = getCardType(block.title)
        const Icon = ICON_MAP[cardType] || CheckCircleIcon
        const accent = ACCENT_COLORS[cardType] || ACCENT_COLORS.process
        const widthClass = block.layout === 'full' ? 'col-span-12' : 'col-span-12 md:col-span-6'

        return (
            <div className={widthClass} key={block.id}>
                <div className={`h-full rounded-xl border ${accent.border} bg-card shadow-sm p-6 flex flex-col gap-5`}>
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${accent.bg} shrink-0`}>
                            <Icon className={`w-5 h-5 ${accent.text}`} />
                        </div>
                        <h3 className="text-base font-semibold tracking-tight">{block.title}</h3>
                    </div>

                    {/* Divider */}
                    <div className={`h-px w-full ${accent.bg}`} />

                    {block.type === 'text' && (
                        <p className="whitespace-pre-line text-muted-foreground leading-relaxed text-sm flex-1">
                            {block.content}
                        </p>
                    )}

                    {block.type === 'list' && (
                        <ul className="space-y-3 flex-1">
                            {block.items.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${accent.text}`} />
                                    <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {block.type === 'contact' && (
                        <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-2">
                            {block.discord?.url && (
                                <a
                                    href={block.discord.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <ChatIcon className="w-4 h-4" />
                                    {block.discord.label}
                                </a>
                            )}
                            {block.email?.url && (
                                <a
                                    href={block.email.url}
                                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2.5 px-5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <EmailIcon className="w-4 h-4" />
                                    {block.email.label}
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Spinner size="lg" />
            </div>
        )
    }

    if (error || !joinText || !joinText.sections) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertDescription>
                        {error || 'Failed to load join page content. Please try again later.'}
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    const sortedSections = [...joinText.sections].sort((a, b) => a.order - b.order)

    return (
        <section className="space-y-0">
            {/* Hero */}
            {joinText.hero && (
                <div className="relative -mx-6 md:-mx-8 lg:-mx-12 mb-10 overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/3 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.06)_0%,transparent_100%)] pointer-events-none" />
                    
                    <div className="relative px-6 md:px-8 lg:px-12 py-14 text-center">
                        <div className="max-w-2xl mx-auto">
                            {joinText.hero.badges?.length > 0 && (
                                <div className="flex justify-center gap-2 flex-wrap mb-5">
                                    {joinText.hero.badges.map((badge, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className={`text-xs font-medium px-3 py-1 ${
                                                badge.color === 'gold' ? 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10' :
                                                badge.color === 'green' ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' :
                                                'border-border/60 text-muted-foreground'
                                            }`}
                                        >
                                            {badge.label}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                                {joinText.hero.title}
                            </h1>
                            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                                {joinText.hero.subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-border/50" />
                </div>
            )}

            {/* Content Sections */}
            <div className="space-y-6">
                {sortedSections.map((section) => {
                    const sortedBlocks = [...section.blocks].sort((a, b) => a.order - b.order)
                    return (
                        <div key={section.id} className="grid grid-cols-12 gap-4">
                            {sortedBlocks.map(block => renderBlock(block))}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default Recruitment
