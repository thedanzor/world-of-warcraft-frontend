/**
 * @file Member Detail Page for Mythic+ Profiles
 * @module app/member/[realm]/[character]/page
 */

import config from '@/app.config.js'
import { api } from '@/lib/api'
import DynamicScreenLoader from '@/core/dynamicScreenLoader'

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
    try {
        // Fetch both seasonal stats and complete character data in parallel
        const [seasonalResponse, characterResponse] = await Promise.all([
            api.getCharacterSeasonalStats(realm, character),
            api.getCharacterData(realm, character, 'raid,mplus,pvp')
        ]);

        return {
            seasonalData: seasonalResponse.seasonalStats,
            characterData: characterResponse.character,
            timestamp: {
                seasonal: seasonalResponse.timestamp,
                character: characterResponse.timestamp
            },
            error: null
        }
    } catch (error) {
        console.error('Error fetching member data:', error)
        return {
            seasonalData: null,
            characterData: null,
            timestamp: null,
            error: error.message
        }
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
    const { realm, character } = params;
    
    // Decode URL-encoded names for metadata
    const decodedCharacter = decodeURIComponent(character);
    const decodedRealm = decodeURIComponent(realm);
    
    return {
        title: `${decodedCharacter} - ${decodedRealm} | Mythic+ Profile`,
        description: `Mythic+ profile and statistics for ${decodedCharacter} on ${decodedRealm} server. View detailed dungeon performance, seasonal achievements, and team play history.`,
        keywords: `World of Warcraft, WoW, ${decodedRealm}, ${decodedCharacter}, Mythic+, Dungeon, Profile, Statistics`,
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
