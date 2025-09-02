/**
 * Main page for the WoW guild dashboard
 * Fetches guild data and renders the dashboard
 */

// Project imports
import { api } from '@/lib/api'
import DynamicScreenLoader from '@/core/dynamicScreenLoader'

// Refresh data every 10 minutes
export const revalidate = 600

/**
 * Gets all the guild data we need for the dashboard
 * Fetches roster, stats, top players, and role counts
 */
async function getGuildData() {
    try {
        // Main guild roster
        const guildResponse = await api.getFilteredGuildData({
            filter: 'all',
            page: 1,
            limit: 300 // Enough for dashboard display
        });

        // Check who's missing enchants
        const missingEnchantsResponse = await api.getMissingEnchantsStats();

        // Top PvP players
        const topPvpResponse = await api.getTopPvPPlayers();

        // Top PvE players (raids, mythic+)
        const topPveResponse = await api.getTopPvEPlayers();

        // How many tanks/healers/DPS we have
        const roleCountsResponse = await api.getRoleCounts();

        return {
            data: guildResponse.data,
            statistics: guildResponse.statistics,
            timestamp: guildResponse.timestamp,
            missingEnchants: missingEnchantsResponse.data,
            topPvp: topPvpResponse.data,
            topPve: topPveResponse.data,
            roleCounts: roleCountsResponse.data,
            error: null
        }
    } catch (error) {
        console.error('Error fetching guild data:', error)
        
        // Return empty data on error so the page still loads
        return {
            data: null,
            statistics: null,
            timestamp: null,
            missingEnchants: null,
            topPvp: null,
            topPve: null,
            roleCounts: null,
            error: error.message
        }
    }
}

/**
 * Home page component
 * Fetches data and renders the dashboard
 */
export default async function Home() {
    const guildData = await getGuildData()

    return (
        <main className={`fullbody`}>
            <DynamicScreenLoader 
                screenName="dashboard"
                props={{ guildData }}
            />
        </main>
    )
}
