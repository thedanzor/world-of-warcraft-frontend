import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stats/top-pvp`, {
      next: { 
        revalidate: 600, // Cache for 10 minutes
        tags: ['guild-stats', 'top-pvp']
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error fetching top PvP statistics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch top PvP statistics',
        message: error.message 
      },
      { status: 500 }
    );
  }
} 