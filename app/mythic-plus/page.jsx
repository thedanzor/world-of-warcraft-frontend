// Sections
import config from '@/app.config.js'
import { api } from '@/lib/api'
import DynamicScreenLoader from '@/core/dynamicScreenLoader'

import { Public_Sans } from 'next/font/google'
const publicSans = Public_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    fallback: ['system-ui', 'arial', 'sans-serif'],
    preload: false, // Disable preloading to avoid build issues
})

// Disable caching for dynamic mythic+ data
export const revalidate = 0 // No caching - always fetch fresh data
export const dynamic = 'force-dynamic' // Force dynamic rendering

// Server-side data fetching for M+ characters only
async function getMplusGuildData() {
    try {
        const response = await api.getFilteredGuildData({
            filter: 'has-mplus-score',
            page: 1,
            limit: 80 // Increased limit for frontend pagination
        });

        return {
            data: response.data,
            pagination: response.pagination,
            timestamp: response.timestamp,
            error: null
        }
    } catch (error) {
        console.error('Error fetching M+ guild data:', error)
        return {
            data: null,
            pagination: null,
            timestamp: null,
            error: error.message
        }
    }
}

// Server-side data fetching for seasonal statistics
async function getSeasonalStats() {
    try {
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${BACKEND_URL}/api/seasonal-stats`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: true,
            data: data.data || data,
            error: null
        }
    } catch (error) {
        console.error('Error fetching seasonal stats:', error)
        return {
            success: false,
            data: null,
            error: error.message
        }
    }
}

// Server-side data fetching for leaderboard data
async function getLeaderboardData(type = 'players', limit = 20) {
    try {
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${BACKEND_URL}/api/seasonal-stats/leaderboard?type=${type}&limit=${limit}`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: true,
            data: data.data || data,
            error: null
        }
    } catch (error) {
        console.error('Error fetching leaderboard data:', error)
        return {
            success: false,
            data: null,
            error: error.message
        }
    }
}

// Page wrapper
export default async function MythicPlusPage() {
    // Fetch all data server-side
    const [guildData, seasonalStats, playersLeaderboard, dungeonsLeaderboard, rolesLeaderboard] = await Promise.all([
        getMplusGuildData(),
        getSeasonalStats(),
        getLeaderboardData('players', 20),
        getLeaderboardData('dungeons', 20),
        getLeaderboardData('roles', 20)
    ])
    
    // Combine all seasonal data
    const seasonalData = {
        stats: seasonalStats.success ? seasonalStats.data : null,
        leaderboard: {
            players: playersLeaderboard.success ? playersLeaderboard.data : [],
            dungeons: dungeonsLeaderboard.success ? dungeonsLeaderboard.data : [],
            roles: rolesLeaderboard.success ? rolesLeaderboard.data : []
        },
        errors: {
            stats: seasonalStats.error,
            players: playersLeaderboard.error,
            dungeons: dungeonsLeaderboard.error,
            roles: rolesLeaderboard.error
        }
    }
    
    return (
        <main className={`fullbody ${publicSans.className}`}>
            <DynamicScreenLoader 
                screenName="mythicPlus"
                props={{ 
                    auditable: true, 
                    guildData,
                    seasonalData
                }}
                loadingMessage="Loading Mythic Plus..."
                minHeight="50vh"
            />
        </main>
    )
}
