import { Env, PagesFunction } from '../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const city = url.searchParams.get('city');

  if (!city) {
    return new Response('Missing city parameter', { status: 400 });
  }

  try {
    const query = `
      SELECT DISTINCT neighborhood_name as neighborhood
      FROM neighborhoods 
      WHERE LOWER(city) = LOWER(?)
      ORDER BY neighborhood_name ASC
    `;

    const result = await env.NEARME_DB.prepare(query)
      .bind(city)
      .all();

    const neighborhoods = result.results?.map((row: any) => row.neighborhood) || [];

    return new Response(JSON.stringify(neighborhoods), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching neighborhoods:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
