/**
 * @file API route handler for /api/config endpoint
 * @module app/api/config/route
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * GET /api/config - Get app configuration from backend
 */
export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Don't cache this - we need fresh data
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { success: false, error: data.error || 'Failed to get config', message: data.message },
        { status: response.status }
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error('Error fetching config:', error);
    return Response.json(
      { success: false, error: 'Network error', message: error.message, installed: false },
      { status: 500 }
    );
  }
}

