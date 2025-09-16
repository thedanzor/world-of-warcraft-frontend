import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function PUT(request, { params }) {
  try {
    const { id } = params
    
    // Validate MongoDB ObjectId format (basic validation)
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid error ID format' },
        { status: 400 }
      )
    }
    
    const response = await fetch(`${BACKEND_URL}/api/errors/${id}/resolve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Error not found' },
          { status: 404 }
        )
      }
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error resolving error log:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to resolve error log',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
