/**
 * @file Frontend API route for database reset
 * @module app/api/reset/route
 */

import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * POST /api/reset - Reset database (proxy to backend)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/api/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying reset request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reset database',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reset/info - Get reset information (proxy to backend)
 */
export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reset/info`);
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching reset info:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reset info',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

