import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/season3/data`, {
      next: { 
        revalidate: 600, // Cache for 10 minutes
        tags: ['season3-data']
      }
    });
    
    if (!response.ok) {
      // If backend doesn't have season3 endpoint yet, return empty array
      if (response.status === 404) {
        return NextResponse.json([], {
          headers: {
            'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300'
          }
        });
      }
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error fetching season 3 data:', error);
    // Return empty array for now until backend is ready
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300'
      }
    });
  }
} 