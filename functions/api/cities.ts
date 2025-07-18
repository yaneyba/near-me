import type { Env } from '../types';

export async function onRequestGet({ env, request }: { env: Env; request: Request }) {
  try {
    const url = new URL(request.url);
    const includeState = url.searchParams.has('include_state');

    let query: string;
    if (includeState) {
      // Return cities that have businesses, with their states
      query = `
        SELECT DISTINCT b.city as name, b.state 
        FROM businesses b 
        WHERE b.city IS NOT NULL AND b.city != '' 
          AND b.state IS NOT NULL AND b.state != ''
        ORDER BY b.city ASC
      `;
    } else {
      // Return cities that have businesses
      query = `
        SELECT DISTINCT b.city as name 
        FROM businesses b 
        WHERE b.city IS NOT NULL AND b.city != '' 
        ORDER BY b.city ASC
      `;
    }

    const result = await env.DB.prepare(query).all();

    return new Response(JSON.stringify(result.results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Failed to get cities:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch cities' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
