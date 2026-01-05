import { api } from '@/lib/api'
import DynamicScreenLoader from '@/core/dynamicScreenLoader'

// Enable revalidation for this page
export const revalidate = 600 // Revalidate every 10 minutes

// Server-side data fetching
async function getGuildData() {
    try {
        // Fetch main guild data
        const guildResponse = await api.getFilteredGuildData({
            filter: 'all',
            page: 1,
            limit: 300 // Get a reasonable amount for dashboard
        });

        // Fetch missing enchants statistics
        const missingEnchantsResponse = await api.getMissingEnchantsStats();

        // Fetch top PvP players
        const topPvpResponse = await api.getTopPvPPlayers();

        // Fetch top PvE players
        const topPveResponse = await api.getTopPvEPlayers();

        // Fetch role counts
        const roleCountsResponse = await api.getRoleCounts();

        return {
            data: guildResponse.data,
            pagination: guildResponse.pagination,
            timestamp: guildResponse.timestamp,
            missingEnchants: missingEnchantsResponse.data,
            topPvp: topPvpResponse.data,
            topPve: topPveResponse.data,
            roleCounts: roleCountsResponse.data,
            error: null
        }
    } catch (error) {
        console.error('Error fetching guild data:', error)
        return {
            data: null,
            pagination: null,
            timestamp: null,
            missingEnchants: null,
            topPvp: null,
            topPve: null,
            roleCounts: null,
            error: error.message
        }
    }
}

const RosterPage = async () => {
  const guildData = await getGuildData();

  return (
    <DynamicScreenLoader 
      screenName="rosterBuilder"
      props={{ guildData }}
    />
  );
};

export default RosterPage;