import { NextResponse } from 'next/server';



export async function GET() {
  try {
    console.log('Fetching missing enchants from backend...');
    
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stats/missing-enchants`;
    console.log('Backend URL:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching - always fetch live data
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched missing enchants data');
    
    return NextResponse.json(data, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
      }
    });
  } catch (error) {
    console.error('Error fetching missing enchants statistics:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch missing enchants statistics',
        message: error.message 
      },
      { status: 500 }
    );
  }
} 