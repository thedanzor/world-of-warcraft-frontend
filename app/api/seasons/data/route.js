import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/seasons/data`, {
      cache: 'no-store', // Always fetch fresh data
    });
    
    if (!response.ok) {
      // If backend doesn't have seasons endpoint yet, return empty array
      if (response.status === 404) {
        return NextResponse.json([], {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
          }
        });
      }
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    // Backend returns { success: true, seasons: [...] }
    const seasonsArray = data.seasons || data.season3 || [];
    
    return NextResponse.json(seasonsArray, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error fetching seasons data:', error);
    // Return empty array for now until backend is ready
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
      }
    });
  }
} 