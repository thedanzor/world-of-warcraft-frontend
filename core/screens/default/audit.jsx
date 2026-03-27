/**
 * GUILD AUDIT SCREEN
 * 
 * This is a comprehensive guild analysis and audit tool that allows officers and leaders
 * to examine guild member data, filter by various criteria, and assess raid readiness.
 * 
 * WHAT THIS DOES:
 * - Provides advanced filtering by class, spec, rank, item level, and more
 * - Shows detailed audit information for raid preparation
 * - Displays missing enchants and consumables for guild members
 * - Tracks raid lockouts and availability
 * - Offers multiple view modes (all players, missing enchants, locked players)
 * - Generates comprehensive guild statistics and role breakdowns
 * 
 * KEY FEATURES:
 * - Multi-tab interface for different audit views
 * - Advanced filtering system with real-time search
 * - Visual indicators for missing requirements
 * - Role distribution analysis (tanks, healers, DPS)
 * - Item level requirements and compliance tracking
 * - Rank-based filtering (mains vs alts)
 * 
 * FILTERING CAPABILITIES:
 * - Text search across character names
 * - Class and specialization filtering
 * - Guild rank filtering (mains, alts, specific ranks)
 * - Item level threshold filtering
 * - Instance-specific filtering
 * - Raid lockout status filtering
 * 
 * AUDIT VIEWS:
 * - All Players: Complete guild roster with audit status
 * - Missing Enchants: Players needing enchantments
 * - Locked Players: Characters with active raid lockouts
 * - Statistics: Guild composition and role breakdowns
 * 
 * DATA INTEGRATION:
 * - Uses useAuditData hook for filtered data processing
 * - Integrates with guild data from API
 * - Real-time filtering and search capabilities
 * - Configurable thresholds and requirements
 * 
 * USAGE:
 * Primary tool for guild officers to assess raid readiness and member compliance.
 * Essential for raid planning and guild management.
 * 
 * MODIFICATION NOTES:
 * - Filter logic is complex; test thoroughly when modifying
 * - Performance considerations for large guilds
 * - Ensure all filter combinations work correctly
 * - Consider adding export functionality for reports
 */

'use client'

// React
import React, { useMemo } from 'react'

// Shadcn & Tailwind components
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'

// Internal components
import AuditBlock from '@/core/modules/auditBlock'
import AuditAnalytics from '@/core/components/AuditAnalytics'
import { P } from '@/core/components/typography'

// Internal utilities and config
import getPreviousWednesdayAt1AM from '@/core/utils/currentLockout'
import { buildInitialClassList } from '@/tools/guildFetcher/utils'
import useAuditData from '@/core/hooks/useAuditData'
import { getCharacterRole } from '@/core/utils/roleFromSpec'
import config from '@/app.config.js'

// Styles

// Static variables
const {
    MAIN_RANKS,
    ALT_RANKS,
    INITIAL_FILTERS,
    MIN_CHECK_CAP,
    MAX_CHECK_CAP,
    ITEM_LEVEL_REQUIREMENT,
} = config

/**
 * GuildAudit - Comprehensive guild audit and analysis tool
 * Provides filtering, analysis, and reporting for guild member data
 */
const GuildAudit = ({ auditable, initialData }) => {
    console.log('initialData', initialData)
    const [loading, isLoading] = React.useState(false)
    const [data, setData] = React.useState(initialData.data)
    const [query, setQuery] = React.useState('')
    const [rankFilter, setRankFilter] = React.useState(
        INITIAL_FILTERS.rankFilter
    )
    const [activeTab, setActiveTab] = React.useState(INITIAL_FILTERS.activeTab)
    const [classFilter, setClassFilter] = React.useState([])
    const [specFilter, setSpecFilter] = React.useState(
        INITIAL_FILTERS.specFilter
    )
    const [ilevelFilter, setIlevelFilter] = React.useState(
        INITIAL_FILTERS.defaultItemLevel
    )
    const [instanceIndex, setInstanceIndex] = React.useState(
        INITIAL_FILTERS.instanceIndex
    )
    const [lockTimeStamp, setLockTimeStamp] = React.useState(
        getPreviousWednesdayAt1AM(Date.now())
    )
    const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(true)

    const builtClassList = useMemo(() => buildInitialClassList(data), [data])
    const dataToUse = useAuditData(data, [
        query,
        classFilter,
        rankFilter,
        specFilter,
        ilevelFilter,
        instanceIndex,
        lockTimeStamp,
    ])

    const useQueryData =
        (query && query?.length > 0) ||
        classFilter.length > 0 ||
        rankFilter !== 'all'
    const hasReadyData = dataToUse?.all?.length
    const hasMissingEnchantData = dataToUse?.onlyMissingEnchants?.length
    const hasLockedData = dataToUse?.locked?.length
    const showSearchError =
        useQueryData &&
        !hasReadyData &&
        !hasMissingEnchantData &&
        !hasLockedData

    const {
        numbOfMains,
        numbOfAlts,
        numbOfTanks,
        numbOfHealers,
        numbOfDps,
        numbOfCombinedMainsAndAlts,
    } = useMemo(() => {
        const filteredData = data || []
        const altData = filteredData.filter(
            (item) => ALT_RANKS.includes(item.guildRank)
        )
        const mainData = filteredData.filter(
            (item) => MAIN_RANKS.includes(item.guildRank)
        )
        const tankData = filteredData.filter(
            (item) => getCharacterRole(item, config) === 'tank'
        )
        const healerData = filteredData.filter(
            (item) => getCharacterRole(item, config) === 'healer'
        )
        const dpsData = filteredData.filter(
            (item) => getCharacterRole(item, config) === 'dps'
        )

        return {
            numbOfCombinedMainsAndAlts: filteredData.length,
            numbOfMains: mainData.length,
            numbOfAlts: altData.length,
            numbOfTanks: tankData.length,
            numbOfHealers: healerData.length,
            numbOfDps: dpsData.length,
        }
    }, [data])

    const toggleClassFilter = (className) => {
        setClassFilter(prev => 
            prev.includes(className) 
                ? prev.filter(c => c !== className)
                : [...prev, className]
        )
    }

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight">Audit</h2>
                <p className="text-sm text-muted-foreground">
                    Last audit ran {new Date(initialData.timestamp).toLocaleString()}
                </p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search */}
                <div className="lg:col-span-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                            className="pl-9"
                            placeholder="Search by character name…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value.replace(/\s/g, ''))}
                        />
                    </div>
                </div>

                {/* Item Level */}
                <div className="p-4 rounded-lg bg-card border border-border/50 shadow-sm space-y-3">
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Item Level</p>
                        <p className="text-2xl font-bold mt-1">{ilevelFilter}</p>
                    </div>
                    <Slider
                        value={[ilevelFilter]}
                        onValueChange={(val) => setIlevelFilter(val[0])}
                        min={MIN_CHECK_CAP}
                        max={MAX_CHECK_CAP}
                        step={1}
                    />
                </div>

                {/* Rank Filter */}
                <div className="p-4 rounded-lg bg-card border border-border/50 shadow-sm space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rank</p>
                    <Select value={rankFilter} onValueChange={setRankFilter}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select rank" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All ({numbOfCombinedMainsAndAlts})</SelectItem>
                            <SelectItem value="mains">Mains ({numbOfMains})</SelectItem>
                            <SelectItem value="alts">Alts ({numbOfAlts})</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Spec Filter */}
                <div className="p-4 rounded-lg bg-card border border-border/50 shadow-sm space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</p>
                    <Select value={specFilter} onValueChange={setSpecFilter}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="tanks">Tanks</SelectItem>
                            <SelectItem value="healers">Healers</SelectItem>
                            <SelectItem value="dps">DPS</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Class Filter */}
                <div className="p-4 rounded-lg bg-card border border-border/50 shadow-sm space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class</p>
                    <div className="flex flex-wrap gap-1">
                        {builtClassList.map((className) => (
                            <Badge
                                key={className}
                                variant={classFilter.includes(className) ? "default" : "outline"}
                                className="cursor-pointer text-xs"
                                onClick={() => toggleClassFilter(className)}
                            >
                                {className}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            {/* Analytics */}
            {!loading && !showSearchError && dataToUse?.all?.length > 0 && (
                <AuditAnalytics players={dataToUse.all} />
            )}

            {/* Results */}
            {!loading && showSearchError && (
                <div className="rounded-lg border border-border bg-card p-8 text-center">
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        No characters found with that search query. The character may not be in the guild
                        or too far behind in progression to be audited.
                    </p>
                </div>
            )}

            {!loading && !showSearchError && (
                <div className="space-y-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <div className="overflow-x-auto pb-px">
                            <TabsList className="gap-1">
                                <TabsTrigger value="all" className="gap-2">
                                    All
                                    <Badge variant="secondary" className="text-xs px-1.5 py-0 min-w-[1.5rem] justify-center">{dataToUse?.all?.length || 0}</Badge>
                                </TabsTrigger>
                                <TabsTrigger value="enchants" className="gap-2">
                                    Missing Enchants
                                    <Badge variant="secondary" className="text-xs px-1.5 py-0 min-w-[1.5rem] justify-center">{dataToUse?.onlyMissingEnchants?.length || 0}</Badge>
                                </TabsTrigger>
                                {dataToUse?.normalLocked?.length > 0 && (
                                    <TabsTrigger value="lockedNormal" className="gap-2">
                                        Locked Normal
                                        <Badge variant="secondary" className="text-xs px-1.5 py-0 min-w-[1.5rem] justify-center">{dataToUse?.normalLocked?.length || 0}</Badge>
                                    </TabsTrigger>
                                )}
                                {dataToUse?.heroicLocked?.length > 0 && (
                                    <TabsTrigger value="lockedHeroic" className="gap-2">
                                        Locked Heroic
                                        <Badge variant="secondary" className="text-xs px-1.5 py-0 min-w-[1.5rem] justify-center">{dataToUse?.heroicLocked?.length || 0}</Badge>
                                    </TabsTrigger>
                                )}
                                {dataToUse?.mythicLocked?.length > 0 && (
                                    <TabsTrigger value="lockedMythic" className="gap-2">
                                        Locked Mythic
                                        <Badge variant="secondary" className="text-xs px-1.5 py-0 min-w-[1.5rem] justify-center">{dataToUse?.mythicLocked?.length || 0}</Badge>
                                    </TabsTrigger>
                                )}
                            </TabsList>
                        </div>

                        <TabsContent value="all"><AuditBlock data={dataToUse} name="all" /></TabsContent>
                        <TabsContent value="enchants"><AuditBlock data={dataToUse} name="onlyMissingEnchants" /></TabsContent>
                        <TabsContent value="lockedNormal"><AuditBlock data={dataToUse} name="normalLocked" /></TabsContent>
                        <TabsContent value="lockedHeroic"><AuditBlock data={dataToUse} name="heroicLocked" /></TabsContent>
                        <TabsContent value="lockedMythic"><AuditBlock data={dataToUse} name="mythicLocked" /></TabsContent>
                    </Tabs>
                </div>
            )}
        </section>
    )
}

export default GuildAudit 