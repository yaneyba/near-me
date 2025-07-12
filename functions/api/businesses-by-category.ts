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
      SELECT 
        id, business_id, name, category,
        description, phone, email, website, address,
        city, state, zip_code, 
        image_url, logo_url, hours, services,
        rating, review_count,
        verified, premium, status,
        established, site_id, latitude, longitude,
        created_at, updated_at
      FROM businesses 
      WHERE LOWER(category) = LOWER(?)
      AND status = 'active'
      ORDER BY 
        premium DESC,
        verified DESC,
        rating DESC,
        name ASC
    `;

    const result = await env.DB.prepare(query)
      .bind(category)
      .all();

    // Transform database results to match TypeScript Business interface
    const transformedResults = result.results?.map((row: any) => ({
      ...row,
      // Map database column names to frontend expectations
      image: row.image_url,
      // Parse JSON fields
      services: row.services ? JSON.parse(row.services) : [],
      hours: row.hours ? JSON.parse(row.hours) : {},
      // Convert integer booleans to actual booleans
      verified: Boolean(row.verified),
      premium: Boolean(row.premium),
    })) || [];

    return new Response(JSON.stringify(transformedResults), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Database error:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};
