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
    try {
        // Fetch main guild data
        const guildResponse = await api.getFilteredGuildData({
            filter: 'all',
            page: 1,
            limit: 300 // Get a reasonable amount for dashboard
        });

        // Fetch missing enchants statistics
        const season3Response = await api.getSeason3Data();

        return {
            data: guildResponse.data,
            season3: season3Response.season3,
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
