import { Env, PagesFunction } from '../../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  
  // TODO: Add admin authentication check here
  
  try {
    let query: string;
    
    switch (type) {
      case 'profiles':
        query = `SELECT * FROM business_profiles ORDER BY created_at DESC`;
        break;
      case 'all':
      default:
        query = `SELECT * FROM businesses ORDER BY created_at DESC`;
        break;
    }

    const result = await env.DB.prepare(query).all();
    const businesses = result.results || [];

    return new Response(JSON.stringify(businesses), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};
