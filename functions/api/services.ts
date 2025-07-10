import { Env, PagesFunction } from '../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const category = url.searchParams.get('category');

  if (!category) {
    return new Response('Missing category parameter', { status: 400 });
  }

  try {
    const query = `
      SELECT DISTINCT service_name as service
      FROM services 
      WHERE LOWER(category) = LOWER(?)
      ORDER BY service_name ASC
    `;

    const result = await env.NEARME_DB.prepare(query)
      .bind(category)
      .all();

    const services = result.results?.map((row: any) => row.service) || [];

    return new Response(JSON.stringify(services), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
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
