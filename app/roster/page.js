import config from '@/app.config.js'
import RosterBuilder from `@/screens/${config.THEME}/rosterBuilder`
import { api } from '@/lib/api'
import { Suspense } from 'react'

// Enable revalidation for this page
export const revalidate = 600 // Revalidate every 10 minutes

// Loading component for the roster builder
const RosterBuilderLoading = () => (
  <div style={{ 
    padding: '2rem', 
    textAlign: 'center',
    color: '#dcdada'
  }}>
    <h2>Loading Roster Builder...</h2>
    <p>Please wait while we load the roster planning interface.</p>
  </div>
);

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

const RosterPage = async () => {
  const guildData = await getGuildData();

  return (
    <Suspense fallback={<RosterBuilderLoading />}>
      <RosterBuilder guildData={guildData} />
    </Suspense>
  );
};

export default RosterPage;