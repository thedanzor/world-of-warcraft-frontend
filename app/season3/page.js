// Sections
import config from '@/app.config.js'
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
    let season3Response = null;
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
        // Fetch Season 3 data (try to fetch even if guild data failed)
        season3Response = await api.getSeason3Data();
    } catch (season3Error) {
        console.error('Error fetching Season 3 data:', season3Error);
        // Don't override guild error if it exists
        if (!error) {
            error = season3Error.message;
        }
    }

    return {
        data: guildResponse?.data || null,
        season3: season3Response?.season3 || [],
        error: error
    }
}

// Page wrapper
export default async function Home() {
    const guildData = await getGuildData()

    return (
        <main className={`fullbody ${poppins.className}`}>
            <DynamicScreenLoader 
                screenName="season3"
                props={{ guildData, season3Data: guildData.season3 }}
                loadingMessage="Loading Season 3..."
                minHeight="50vh"
            />
        </main>
    )
}
