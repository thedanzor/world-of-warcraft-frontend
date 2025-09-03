import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    backendUrl: BACKEND_URL,
    season3Tests: {}
  };

  // Test 1: Season 3 data endpoint
  try {
    const response = await fetch(`${BACKEND_URL}/api/season3/data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    results.season3Tests.data = {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      hasData: response.ok ? true : false,
      is404: response.status === 404
    };
  } catch (error) {
    results.season3Tests.data = {
      success: false,
      error: error.message,
      type: error.constructor.name
    };
  }

  // Test 2: Season 3 signup endpoint (POST)
  try {
    const testData = {
      currentCharacterName: 'TestCharacter',
      season3CharacterName: 'TestCharacterS3',
      characterClass: 'Warrior',
      mainSpec: 'Arms',
      offSpec: 'Protection',
      returningToRaid: true,
      season3Goal: 'AOTC',
      wantToPushKeys: true
    };

    const response = await fetch(`${BACKEND_URL}/api/season3/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    results.season3Tests.signup = {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      is404: response.status === 404,
      is405: response.status === 405
    };
  } catch (error) {
    results.season3Tests.signup = {
      success: false,
      error: error.message,
      type: error.constructor.name
    };
  }

  // Test 3: Frontend API routes
  try {
    const frontendDataResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/season3/data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    results.season3Tests.frontendData = {
      success: frontendDataResponse.ok,
      status: frontendDataResponse.status,
      statusText: frontendDataResponse.statusText,
      hasData: frontendDataResponse.ok ? true : false
    };
  } catch (error) {
    results.season3Tests.frontendData = {
      success: false,
      error: error.message,
      type: error.constructor.name
    };
  }

  return NextResponse.json(results);
} 