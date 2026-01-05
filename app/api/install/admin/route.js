/**
 * @file API route handler for /api/install/admin endpoint
 * @module app/api/install/admin/route
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * POST /api/install/admin - Create admin user
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/install/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { success: false, error: data.error || 'Failed to create admin', message: data.message, errors: data.errors },
        { status: response.status }
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error('Error creating admin user:', error);
    return Response.json(
      { success: false, error: 'Network error', message: error.message },
      { status: 500 }
    );
  }
}

