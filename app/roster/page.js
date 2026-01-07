import { api } from '@/lib/api'
import DynamicScreenLoader from '@/core/dynamicScreenLoader'

// Disable caching - always fetch live data
export const revalidate = 0
export const dynamic = 'force-dynamic'

// Server-side data fetching
async function getRosterData() {
    try {
        // Fetch roster data
        const rosterResponse = await api.getRoster();

        // Fetch guild data for character details
        const guildResponse = await api.getFilteredGuildData({
            filter: 'all',
            page: 1,
            limit: 300,
        });

        return {
            roster: rosterResponse.success ? rosterResponse.roster : {
                tanks: [],
                healers: [],
                dps: [],
                substitutes: [],
                socials: []
            },
            guildData: guildResponse.data || [],
            error: null
        }
    } catch (error) {
        console.error('Error fetching roster data:', error)
        return {
            roster: {
                tanks: [],
                healers: [],
                dps: [],
                substitutes: [],
                socials: []
            },
            guildData: [],
            error: error.message
        }
    }
}

const RosterPage = async () => {
  const { roster, guildData, error } = await getRosterData();

  return (
    <DynamicScreenLoader 
      screenName="rosterDisplay"
      props={{ roster, guildData, error }}
    />
  );
};

export default RosterPage;
