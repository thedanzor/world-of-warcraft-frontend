import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/errors/stats`, {
      next: { 
        revalidate: 300, // Cache for 5 minutes
        tags: ['error-stats']
      }
    });
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150'
      }
    });
  } catch (error) {
    console.error('Error fetching error stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch error stats',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
