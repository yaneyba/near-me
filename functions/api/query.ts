import { Env, PagesFunction } from '../types';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    const { sql, params } = await request.json();
    
    // Verify API key
    const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '');
    const expectedApiKey = env.D1_API_KEY;
    
    if (!expectedApiKey) {
      return new Response('Server configuration error: API key not configured', { status: 500 });
    }
    
    if (apiKey !== expectedApiKey) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (!sql) {
      return new Response('Missing SQL query', { status: 400 });
    }

    // Execute the query using the D1 database binding
    const result = await env.DB.prepare(sql)
      .bind(...(params || []))
      .all();

    return new Response(JSON.stringify({
      success: true,
      data: result.results || []
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('D1 Query Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};
