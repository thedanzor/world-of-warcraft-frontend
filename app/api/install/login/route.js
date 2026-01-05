/**
 * @file Frontend API route for admin login
 * @module app/api/install/login/route
 */

import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * POST /api/install/login - Login with admin credentials (proxy to backend)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/api/install/login`, {
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
    console.error('Error proxying login request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to login',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

