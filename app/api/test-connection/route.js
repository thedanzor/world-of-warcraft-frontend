import { NextResponse } from 'next/server';

const BACKEND_URL =  process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    backendUrl: BACKEND_URL,
    tests: {}
  };

  // Test 1: Basic connectivity
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    results.tests.health = {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: response.ok ? await response.json() : null
    };
  } catch (error) {
    results.tests.health = {
      success: false,
      error: error.message,
      type: error.constructor.name
    };
  }

  // Test 2: Data endpoint
  try {
    const response = await fetch(`${BACKEND_URL}/data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    results.tests.data = {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      hasData: response.ok ? true : false
    };
  } catch (error) {
    results.tests.data = {
      success: false,
      error: error.message,
      type: error.constructor.name
    };
  }

  // Test 3: Status endpoint
  try {
    const response = await fetch(`${BACKEND_URL}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    results.tests.status = {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: response.ok ? await response.json() : null
    };
  } catch (error) {
    results.tests.status = {
      success: false,
      error: error.message,
      type: error.constructor.name
    };
  }

  return NextResponse.json(results);
} 