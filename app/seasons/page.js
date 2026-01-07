// Sections
import { Poppins } from 'next/font/google'
import { api } from '@/lib/api'
import DynamicScreenLoader from '@/core/dynamicScreenLoader'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    fallback: ['system-ui', 'arial', 'sans-serif'],
    preload: false, // Disable preloading to avoid build issues
})

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Server-side data fetching
async function getGuildData() {
    let guildResponse = null;
    let seasonsResponse = null;
    let error = null;

    try {
        // Fetch main guild data
        guildResponse = await api.getFilteredGuildData({
            filter: 'all',
            page: 1,
            limit: 300 // Get a reasonable amount for dashboard
        });
    } catch (guildError) {
        console.error('Error fetching guild data:', guildError);
        error = guildError.message;
    }

    try {
        // Fetch seasons data (try to fetch even if guild data failed)
        seasonsResponse = await api.getSeasonsData();
    } catch (seasonsError) {
        console.error('Error fetching seasons data:', seasonsError);
        // Don't override guild error if it exists
        if (!error) {
            error = seasonsError.message;
        }
    }

    const seasonsData = seasonsResponse?.seasons || []

    return {
        data: guildResponse?.data || null,
        seasons: seasonsData,
        error: error
    }
}

// Page wrapper
export default async function Home() {
    const guildData = await getGuildData()

    return (
        <main className={`fullbody ${poppins.className}`}>
            <DynamicScreenLoader 
                screenName="seasons"
                props={{ guildData, seasonsData: guildData.seasons }}
                loadingMessage="Loading Seasons..."
                minHeight="50vh"
            />
        </main>
    )
}
