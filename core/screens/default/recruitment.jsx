'use client'

import { useState, useEffect } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
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

import PageHero from '@/core/components/PageHero'
import { PageShell, PageContent } from '@/core/components/PageShell'
import { colors } from '@/core/theme'
import { UserPlus } from 'lucide-react'

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

    const heroTitle = joinText.hero?.title || 'Join Our Guild'
    const heroSubtitle = joinText.hero?.subtitle || 'Embark on epic adventures with skilled players.'
    const heroBadges = (joinText.hero?.badges || []).map((badge) => ({
        label: badge.label,
        color:
            badge.color === 'gold' ? colors.warning :
            badge.color === 'green' ? colors.success :
            colors.accentLt,
    }))

    return (
        <PageShell>
            <PageHero
                chip="Recruitment"
                chipColor={colors.success}
                gradientColor={colors.success}
                title={heroTitle}
                description={heroSubtitle}
                badges={heroBadges.length > 0 ? heroBadges : [{ label: 'Open recruitment', icon: UserPlus, color: colors.success }]}
                maxWidth="max-w-2xl"
            />

            <PageContent className="space-y-6">
                {sortedSections.map((section) => {
                    const sortedBlocks = [...section.blocks].sort((a, b) => a.order - b.order)
                    return (
                        <div key={section.id} className="grid grid-cols-12 gap-4">
                            {sortedBlocks.map(block => renderBlock(block))}
                        </div>
                    )
                })}
            </PageContent>
        </PageShell>
    )
}

export default Recruitment
