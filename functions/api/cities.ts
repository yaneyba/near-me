import type { Env } from '../types';

export async function onRequestGet({ env, request }: { env: Env; request: Request }) {
  try {
    const url = new URL(request.url);
    const includeState = url.searchParams.has('include_state');

    let query: string;
    if (includeState) {
      query = 'SELECT name, state FROM cities WHERE state IS NOT NULL ORDER BY name ASC';
    } else {
      query = 'SELECT name FROM cities ORDER BY display_name ASC';
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
