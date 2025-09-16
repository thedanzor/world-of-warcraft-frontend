import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request, { params }) {
  try {
    const { realm, character } = params;
    
    const response = await fetch(`${BACKEND_URL}/api/seasonal-stats/character/${realm}/${character}`, {
      cache: 'no-store' // No caching for character seasonal stats
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Character not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error fetching character seasonal stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch character seasonal stats',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
