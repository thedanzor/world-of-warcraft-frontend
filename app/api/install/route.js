/**
 * @file API route handler for /api/install endpoint
 * @module app/api/install/route
 */

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
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { success: false, error: data.error || 'Failed to check installation status', message: data.message },
        { status: response.status }
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error('Error checking installation status:', error);
    return Response.json(
      { success: false, error: 'Network error', message: error.message },
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
    
    console.log('=== NEXT.JS API PROXY ===');
    console.log('Received body:', JSON.stringify({ ...body, API_BATTLENET_KEY: '***', API_BATTLENET_SECRET: '***' }, null, 2));
    console.log('========================');

    const response = await fetch(`${API_BASE_URL}/api/install`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    console.log('=== BACKEND RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('========================');

    if (!response.ok) {
      // Pass through ALL fields from the backend response
      return Response.json(
        { 
          ...data,
          success: false
        },
        { status: response.status }
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

