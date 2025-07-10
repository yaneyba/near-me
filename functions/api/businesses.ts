import { Env, PagesFunction } from '../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const city = url.searchParams.get('city');

  if (!category || !city) {
    return new Response('Missing category or city parameter', { status: 400 });
  }

  try {
    const query = `
      SELECT 
        id, name, slug, category, subcategory,
        description, phone, website, address,
        city, state, zip, latitude, longitude,
        image_url, business_hours, featured,
        verified, premium, created_at, updated_at
      FROM businesses 
      WHERE LOWER(category) = LOWER(?) 
      AND LOWER(city) = LOWER(?)
      ORDER BY 
        premium DESC,
        featured DESC,
        verified DESC,
        name ASC
    `;

    const result = await env.DB.prepare(query)
      .bind(category, city)
      .all();

    return new Response(JSON.stringify(result.results || []), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
