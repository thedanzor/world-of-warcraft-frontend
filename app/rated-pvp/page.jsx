// Sections
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

// Enable revalidation for this page
export const revalidate = 600 // Revalidate every 10 minutes

// Server-side data fetching for PvP characters only
async function getPvpGuildData() {
    try {
        const response = await api.getFilteredGuildData({
            filter: 'has-pvp-rating',
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
        console.error('Error fetching PvP guild data:', error)
        return {
            data: null,
            pagination: null,
            timestamp: null,
            error: error.message
        }
    }
}

// Page wrapper
export default async function RatedPvpPage() {
    const guildData = await getPvpGuildData()
    
    return (
        <main className={`fullbody ${publicSans.className}`}>
            <DynamicScreenLoader 
                screenName="pvp"
                props={{ guildData }}
                loadingMessage="Loading PvP..."
                minHeight="50vh"
            />
        </main>
    )
}
