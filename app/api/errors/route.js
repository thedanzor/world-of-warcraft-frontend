import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Build query string for backend
    const queryString = searchParams.toString()
    const backendUrl = queryString 
      ? `${BACKEND_URL}/api/errors?${queryString}`
      : `${BACKEND_URL}/api/errors`
    
    const response = await fetch(backendUrl, {
      next: { 
        revalidate: 60, // Cache for 1 minute
        tags: ['error-logs']
      }
    });
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('Error fetching error logs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch error logs',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Build query string for backend
    const queryString = searchParams.toString()
    const backendUrl = queryString 
      ? `${BACKEND_URL}/api/errors?${queryString}`
      : `${BACKEND_URL}/api/errors`
    
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting error logs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete error logs',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
