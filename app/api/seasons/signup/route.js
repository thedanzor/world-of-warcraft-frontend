import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Normalize field names (support both old and new)
    const normalizedBody = {
      ...body,
      seasonCharacterName: body.seasonCharacterName || body.season3CharacterName,
      seasonGoal: body.seasonGoal || body.season3Goal,
      // Keep old fields for backward compatibility
      season3CharacterName: body.season3CharacterName || body.seasonCharacterName,
      season3Goal: body.season3Goal || body.seasonGoal,
    };
    
    // Validate required fields (check both old and new names)
    const requiredFields = [
      'currentCharacterName',
      'characterClass',
      'mainSpec'
    ];
    
    // Check for season character name (either new or old field)
    if (!normalizedBody.seasonCharacterName && !normalizedBody.season3CharacterName) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'Missing required field: seasonCharacterName or season3CharacterName'
        },
        { status: 400 }
      );
    }
    
    // Check for season goal (either new or old field)
    if (!normalizedBody.seasonGoal && !normalizedBody.season3Goal) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'Missing required field: seasonGoal or season3Goal'
        },
        { status: 400 }
      );
    }
    
    const missingFields = requiredFields.filter(field => !normalizedBody[field]);
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

    // Validate against test/demo characters
    const isTestOrDemoCharacter = (name) => {
      if (!name) return false
      const normalizedName = name.toLowerCase().trim()
      const testPatterns = [
        'test', 'demo', 'example', 'sample', 'tester', 'testing',
        'dummy', 'fake', 'placeholder', 'temp', 'temporary'
      ]
      return testPatterns.some(pattern => normalizedName.includes(pattern))
    }

    if (isTestOrDemoCharacter(normalizedBody.currentCharacterName)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid character name',
          message: 'Test or demo characters are not allowed'
        },
        { status: 400 }
      )
    }

    const seasonCharName = normalizedBody.seasonCharacterName || normalizedBody.season3CharacterName
    if (isTestOrDemoCharacter(seasonCharName)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid character name',
          message: 'Test or demo characters are not allowed'
        },
        { status: 400 }
      )
    }

    // Check for duplicate entries
    try {
      const existingDataResponse = await fetch(`${BACKEND_URL}/api/seasons/data`, {
        next: { revalidate: 0 } // Don't cache for duplicate check
      });
      
      if (existingDataResponse.ok) {
        const existingData = await existingDataResponse.json();
        const normalizedCurrentName = normalizedBody.currentCharacterName.toLowerCase().trim();
        const normalizedSeasonName = normalizedBody.seasonCharacterName.toLowerCase().trim();
        
        const duplicate = existingData.seasons?.find(entry => 
          entry.currentCharacterName?.toLowerCase().trim() === normalizedCurrentName ||
          (entry.seasonCharacterName || entry.season3CharacterName)?.toLowerCase().trim() === normalizedSeasonName
        );
        
        if (duplicate) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Duplicate entry',
              message: 'A character with this name has already signed up.'
            },
            { status: 409 }
          );
        }
      }
    } catch (error) {
      console.warn('Could not check for duplicates:', error);
      // Continue with submission even if duplicate check fails
    }

    // Submit to backend (use normalized body)
    const response = await fetch(`${BACKEND_URL}/api/seasons/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(normalizedBody),
    });

    if (!response.ok) {
      // If backend doesn't have seasons endpoint yet, simulate success
      if (response.status === 404) {
        console.log('Backend seasons endpoint not ready, simulating success');
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
    console.error('Error processing season signup:', error);
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