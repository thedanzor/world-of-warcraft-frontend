import { NextResponse } from 'next/server';



export async function POST() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/update`, {
      method: 'POST',
      cache: 'no-store' // Disable caching for dynamic data
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error triggering update:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to trigger update',
        message: error.message 
      },
      { status: 500 }
    );
  }
} 