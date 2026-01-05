/**
 * @file Frontend API route for seeding join text
 * @module app/api/jointext/seed/route
 */

import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * POST /api/jointext/seed - Seed join text with default data (proxy to backend, admin only)
 */
export async function POST(request) {
  try {
    // Get Basic Auth from request headers
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: 'Please provide admin credentials'
        },
        { status: 401 }
      );
    }
    
    const response = await fetch(`${API_BASE_URL}/api/jointext/seed`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying join text seed request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed join text',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

