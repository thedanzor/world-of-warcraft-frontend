/**
 * @file Member Detail Page for Mythic+ Profiles
 * @module app/member/[realm]/[character]/page
 */

import { api } from '@/lib/api'
import DynamicScreenLoader from '@/core/dynamicScreenLoader'
import { getServerConfig } from '@/lib/serverConfig'

import { Public_Sans } from 'next/font/google'
const publicSans = Public_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    fallback: ['system-ui', 'arial', 'sans-serif'],
    preload: false,
})

// Disable caching for dynamic member data
export const revalidate = 0 // No caching - always fetch fresh data
export const dynamic = 'force-dynamic' // Force dynamic rendering

// Server-side data fetching for member details
async function getMemberData(realm, character) {
    const [seasonalResult, characterResult] = await Promise.allSettled([
        api.getCharacterSeasonalStats(realm, character),
        api.getCharacterData(realm, character, 'raid,mplus,pvp,stats'),
    ])

    const seasonalResponse = seasonalResult.status === 'fulfilled' ? seasonalResult.value : null
    const characterResponse = characterResult.status === 'fulfilled' ? characterResult.value : null

    const characterData = characterResponse?.success ? characterResponse.character : null
    const dbSeasonalData = seasonalResponse?.success ? seasonalResponse.seasonalStats : null
    const liveSeasonalData = characterData?.seasonalStats

    // Prefer live seasonal stats when DB cache is empty or stale
    const seasonalData = (liveSeasonalData?.totalRuns > 0 ? liveSeasonalData : null)
        || (dbSeasonalData?.totalRuns > 0 ? dbSeasonalData : null)
        || liveSeasonalData
        || dbSeasonalData

    const errors = []
    if (seasonalResult.status === 'rejected' && !liveSeasonalData) {
        errors.push(`Seasonal cache: ${seasonalResult.reason?.message || 'unavailable'}`)
    }
    if (characterResult.status === 'rejected') {
        errors.push(characterResult.reason?.message || 'Failed to load character data')
    }
    if (characterResponse && !characterResponse.success) {
        errors.push(characterResponse.message || characterResponse.error || 'Character not found')
    }

    if (!characterData && errors.length > 0) {
        return {
            seasonalData: null,
            characterData: null,
            timestamp: null,
            error: errors.join('; '),
        }
    }

    return {
        seasonalData,
        characterData,
        timestamp: {
            seasonal: seasonalResponse?.timestamp || null,
            character: characterResponse?.timestamp || null,
        },
        error: errors.length > 0 ? errors.join('; ') : null,
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
    const { realm, character } = params;
    const config = await getServerConfig()
    
    // Decode URL-encoded names for metadata
    const decodedCharacter = decodeURIComponent(character);
    const decodedRealm = decodeURIComponent(realm);
    
    const siteName = config?.SITE_NAME || 'WoW Guild Audit Tool'
    return {
        title: `${decodedCharacter} — ${decodedRealm}`,
        description: `Character profile for ${decodedCharacter} on ${decodedRealm}. Raid progress, Mythic+ scores, PvP ratings, and enrichment data in ${siteName}.`,
        keywords: `World of Warcraft, WoW, ${decodedRealm}, ${decodedCharacter}, guild audit, mythic plus, raid readiness`,
    }
}

// Page wrapper
export default async function MemberDetailPage({ params }) {
    const { realm, character } = params;
    
    // Decode URL-encoded character name
    const decodedCharacter = decodeURIComponent(character);
    const decodedRealm = decodeURIComponent(realm);
    
    const memberData = await getMemberData(decodedRealm, decodedCharacter);
    
    return (
        <main className={`fullbody ${publicSans.className}`}>
            <DynamicScreenLoader 
                screenName="memberDetail"
                props={{ 
                    auditable: true, 
                    memberData,
                    realm: decodedRealm,
                    character: decodedCharacter
                }}
                loadingMessage={`Loading ${decodedCharacter}'s profile...`}
                minHeight="50vh"
            />
        </main>
    )
}
