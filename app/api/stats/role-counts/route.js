import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stats/role-counts`, {
      cache: 'no-store', // Disable caching - always fetch live data
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json(data, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
      }
    })
  } catch (error) {
    console.error('Error fetching role count statistics:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch role count statistics',
        message: error.message 
      }, 
      { status: 500 }
    )
  }
} 