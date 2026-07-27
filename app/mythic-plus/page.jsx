// Sections
import { api } from '@/lib/api'
import DynamicScreenLoader from '@/core/dynamicScreenLoader'

export const revalidate = 0
export const dynamic = 'force-dynamic'

async function getMplusGuildData() {
    try {
        const response = await api.getFilteredGuildData({
            filter: 'has-mplus-score',
            page: 1,
            limit: 120,
        })
        return {
            data: response.data,
            pagination: response.pagination,
            timestamp: response.timestamp,
            error: null,
        }
    } catch (error) {
        return { data: null, pagination: null, timestamp: null, error: error.message }
    }
}

async function getAllGuildData() {
    try {
        const response = await api.getFilteredGuildData({
            filter: 'all',
            page: 1,
            limit: 300,
        })
        return response.data || []
    } catch {
        return []
    }
}

async function getSeasonalStats() {
    try {
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
        const response = await fetch(`${BACKEND_URL}/api/seasonal-stats`, { cache: 'no-store' })
        if (response.status === 404) return { success: false, data: null, error: null }
        if (!response.ok) throw new Error(`Status ${response.status}`)
        const data = await response.json()
        return { success: true, data: data.data || data, error: null }
    } catch (error) {
        return { success: false, data: null, error: error.message }
    }
}

async function getLeaderboardData(type = 'players', limit = 20) {
    try {
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
        const response = await fetch(
            `${BACKEND_URL}/api/seasonal-stats/leaderboard?type=${type}&limit=${limit}`,
            { cache: 'no-store' }
        )
        if (response.status === 404) return { success: false, data: null, error: null }
        if (!response.ok) throw new Error(`Status ${response.status}`)
        const data = await response.json()
        return { success: true, data: data.data || data, error: null }
    } catch (error) {
        return { success: false, data: null, error: error.message }
    }
}

export default async function MythicPlusPage() {
    const [guildData, allGuildData, seasonalStats, playersLb, dungeonsLb, rolesLb] = await Promise.all([
        getMplusGuildData(),
        getAllGuildData(),
        getSeasonalStats(),
        getLeaderboardData('players', 20),
        getLeaderboardData('dungeons', 20),
        getLeaderboardData('roles', 20),
    ])

    const seasonalData = {
        stats: seasonalStats.success ? seasonalStats.data : null,
        leaderboard: {
            players: playersLb.success ? playersLb.data : [],
            dungeons: dungeonsLb.success ? dungeonsLb.data : [],
            roles: rolesLb.success ? rolesLb.data : [],
        },
        errors: {
            stats: seasonalStats.error,
            players: playersLb.error,
            dungeons: dungeonsLb.error,
            roles: rolesLb.error,
        },
    }

    return (
        <DynamicScreenLoader
            screenName="mythicPlus"
            props={{
                auditable: true,
                guildData,
                allGuildData,
                seasonalData,
            }}
        />
    )
}
