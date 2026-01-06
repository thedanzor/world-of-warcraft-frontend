/**
 * @file Frontend API route for join text
 * @module app/api/jointext/route
 */

import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * GET /api/jointext - Get join text content (proxy to backend)
 */
export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/jointext`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { 
        status: response.status,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
    }
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Error proxying join text request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get join text',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/jointext - Update join text content (proxy to backend, admin only)
 */
export async function PUT(request) {
  try {
    const body = await request.json();
    
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
    
    const response = await fetch(`${API_BASE_URL}/api/jointext`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
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
    console.error('Error proxying join text update request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update join text',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

