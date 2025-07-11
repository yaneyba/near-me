import { Env, PagesFunction } from '../../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  // TODO: Add admin authentication check here
  
  try {
    const query = `SELECT * FROM business_profiles ORDER BY created_at DESC`;
    const result = await env.DB.prepare(query).all();
    const profiles = result.results || [];

    return new Response(JSON.stringify(profiles), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching business profiles:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  // TODO: Add admin authentication check here
  
  try {
    const body = await request.json() as any;
    const { action, profileId } = body;
    
    if (action === 'delete' && profileId) {
      const deleteQuery = `DELETE FROM business_profiles WHERE id = ?`;
      await env.DB.prepare(deleteQuery).bind(profileId).run();
      
      return new Response(JSON.stringify({ success: true }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    
    return new Response('Invalid action', { status: 400 });
  } catch (error) {
    console.error('Error processing business profile action:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};
