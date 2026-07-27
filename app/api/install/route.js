/**
 * @file API route handler for /api/install endpoint
 * @module app/api/install/route
 */

import { parseBackendResponse } from '@/lib/parseBackendResponse';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * GET /api/install - Check installation status
 */
export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/install`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await parseBackendResponse(response);

    if (!response.ok || data._emptyBody || data._invalidJson) {
      return Response.json(
        {
          success: false,
          installed: false,
          error: data.error || 'Failed to check installation status',
          message: data.message,
        },
        { status: data._emptyBody || data._invalidJson ? 502 : response.status }
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error('Error checking installation status:', error);
    return Response.json(
      { success: false, installed: false, error: 'Network error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/install - Save app settings
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/install`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await parseBackendResponse(response);

    if (!response.ok || data._emptyBody || data._invalidJson) {
      return Response.json(
        {
          ...data,
          success: false,
        },
        { status: data._emptyBody || data._invalidJson ? 502 : response.status }
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error('Error in Next.js proxy:', error);
    return Response.json(
      { success: false, error: 'Network error', message: error.message },
      { status: 500 }
    );
  }
}
