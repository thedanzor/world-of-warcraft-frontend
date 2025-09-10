import { NextResponse } from 'next/server';



export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/health`, {
      cache: 'no-store' // Disable caching for dynamic data
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching health status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch health status',
        message: error.message 
      },
      { status: 500 }
    );
  }
} 