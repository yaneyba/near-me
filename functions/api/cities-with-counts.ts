import type { Env } from '../types';

export async function onRequestGet({ env, request }: { env: Env; request: Request }) {
  try {
    // Get cities with their business counts
    const query = `
      SELECT 
        b.city as name, 
        b.state,
        COUNT(*) as business_count
      FROM businesses b 
      WHERE b.city IS NOT NULL AND b.city != '' 
        AND b.state IS NOT NULL AND b.state != ''
      GROUP BY b.city, b.state
      ORDER BY business_count DESC, b.city ASC
    `;

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
    console.error('Failed to get cities with counts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch cities with counts' }), {
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
