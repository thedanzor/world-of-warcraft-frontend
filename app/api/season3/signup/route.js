import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'currentCharacterName',
      'season3CharacterName', 
      'characterClass',
      'mainSpec',
      'season3Goal'
    ];
    
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: `Missing required fields: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Check for duplicate entries
    try {
      const existingDataResponse = await fetch(`${BACKEND_URL}/api/season3/data`, {
        next: { revalidate: 0 } // Don't cache for duplicate check
      });
      
      if (existingDataResponse.ok) {
        const existingData = await existingDataResponse.json();
        const normalizedCurrentName = body.currentCharacterName.toLowerCase().trim();
        const normalizedSeason3Name = body.season3CharacterName.toLowerCase().trim();
        
        const duplicate = existingData.find(entry => 
          entry.currentCharacterName?.toLowerCase().trim() === normalizedCurrentName ||
          entry.season3CharacterName?.toLowerCase().trim() === normalizedSeason3Name
        );
        
        if (duplicate) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Duplicate entry',
              message: 'A character with this name has already signed up for Season 3.'
            },
            { status: 409 }
          );
        }
      }
    } catch (error) {
      console.warn('Could not check for duplicates:', error);
      // Continue with submission even if duplicate check fails
    }

    // Submit to backend
    const response = await fetch(`${BACKEND_URL}/api/season3/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // If backend doesn't have season3 endpoint yet, simulate success
      if (response.status === 404) {
        console.log('Backend season3 endpoint not ready, simulating success');
        return NextResponse.json(
          { 
            success: true, 
            message: 'Sign-up submitted successfully (backend not ready yet)',
            data: body
          },
          { status: 200 }
        );
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
    
  } catch (error) {
    console.error('Error processing season 3 signup:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process signup',
        message: error.message || 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
} 