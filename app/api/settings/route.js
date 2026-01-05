/**
 * @file Frontend API route for settings management
 * @module app/api/settings/route
 */

import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * GET /api/settings - Get app settings (requires admin auth)
 */
export async function GET(request) {
  try {
    // Get Basic Auth from request
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

    const response = await fetch(`${API_BASE_URL}/api/settings`, {
      method: 'GET',
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
    console.error('Error proxying settings request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get settings',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings - Update app settings (requires admin auth)
 */
export async function PUT(request) {
  try {
    const body = await request.json();
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

    const response = await fetch(`${API_BASE_URL}/api/settings`, {
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
    console.error('Error proxying settings update:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update settings',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

