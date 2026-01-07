import { NextResponse } from 'next/server';

const BACKEND_URL =  process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/data`, {
      cache: 'no-store', // Disable caching - always fetch live data
    });
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
      }
    });
  } catch (error) {
    console.error('Error fetching guild data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch guild data',
        message: error.message 
      },
      { status: 500 }
    );
  }
} 