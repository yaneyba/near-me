import { Env, PagesFunction } from '../../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const businessId = params.id as string;

  if (!businessId) {
    return new Response('Missing business ID', { status: 400 });
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
      WHERE id = ? 
      AND status = 'active'
    `;

    const result = await env.DB.prepare(query)
      .bind(businessId)
      .first();

    if (!result) {
      return new Response('Business not found', { status: 404 });
    }

    // Transform database result to match TypeScript Business interface
    const transformedResult = {
      ...result,
      // Map database column names to frontend expectations
      image: result.image_url,
      // Parse JSON fields
      services: result.services ? JSON.parse(result.services as string) : [],
      hours: result.hours ? JSON.parse(result.hours as string) : {},
      // Convert integer booleans to actual booleans
      verified: Boolean(result.verified),
      premium: Boolean(result.premium),
    };

    return new Response(JSON.stringify(transformedResult), {
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
