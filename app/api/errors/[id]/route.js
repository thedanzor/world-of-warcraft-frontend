import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    // Validate MongoDB ObjectId format (basic validation)
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid error ID format' },
        { status: 400 }
      )
    }
    
    const response = await fetch(`${BACKEND_URL}/api/errors/${id}`, {
      next: { 
        revalidate: 60, // Cache for 1 minute
        tags: ['error-logs']
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Error not found' },
          { status: 404 }
        )
      }
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('Error fetching error log:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch error log',
        message: error.message 
      },
      { status: 500 }
    );
  }
}