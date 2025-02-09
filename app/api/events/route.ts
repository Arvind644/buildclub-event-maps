import { NextResponse } from 'next/server';

const LUMA_API_KEY = process.env.LUMA_API_KEY;

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const today = new Date();
    const filter_date = today.toISOString().split('T')[0];
    
    const LUMA_API_URL = `https://api.lu.ma/public/v1/calendar/list-events?after=${filter_date}`;

    const response = await fetch(LUMA_API_URL, {
      headers: {
        'x-luma-api-key': LUMA_API_KEY || '',
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.entries || !Array.isArray(data.entries)) {
      console.log('No entries found in response');
      return NextResponse.json({ events: [] });
    }

    // Process each event from the entries
    const validEvents = data.entries
      .map((entry: any) => {
        const event = entry.event;
        
        // Check if event has coordinates
        if (event.geo_latitude && event.geo_longitude) {
          return {
            api_id: event.api_id,
            name: event.name,
            description: event.description,
            start_at: event.start_at,
            end_at: event.end_at,
            cover_url: event.cover_url,
            url: event.url,
            location: {
              geo: {
                latitude: parseFloat(event.geo_latitude),
                longitude: parseFloat(event.geo_longitude)
              },
              venue: event.geo_address_json?.description || '',
              address: event.geo_address_json?.full_address || '',
              city: event.geo_address_json?.city || '',
              country: event.geo_address_json?.country || '',
            }
          };
        }
        return null;
      })
      .filter(Boolean); // Remove null values

    console.log(`Found ${validEvents.length} valid events with coordinates`);
    if (validEvents.length > 0) {
      console.log('Sample event:', JSON.stringify(validEvents[0], null, 2));
    }

    return NextResponse.json({ events: validEvents });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch events',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
} 