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

// Enable revalidation for this page
export const revalidate = 600 // Revalidate every 10 minutes

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
            statistics: response.statistics,
            timestamp: response.timestamp,
            error: null
        }
    } catch (error) {
        console.error('Error fetching M+ guild data:', error)
        return {
            data: null,
            statistics: null,
            timestamp: null,
            error: error.message
        }
    }
}

// Page wrapper
export default async function MythicPlusPage() {
    const guildData = await getMplusGuildData()
    
    return (
        <main className={`fullbody ${publicSans.className}`}>
            <DynamicScreenLoader 
                screenName="mythicPlus"
                props={{ auditable: true, guildData }}
                loadingMessage="Loading Mythic Plus..."
                minHeight="50vh"
            />
        </main>
    )
}
