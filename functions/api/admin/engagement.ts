import { Env, PagesFunction } from '../../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  // TODO: Add admin authentication check here
  
  try {
    const query = `SELECT * FROM engagement_data ORDER BY timestamp DESC`;
    const result = await env.DB.prepare(query).all();
    const engagements = result.results || [];

    return new Response(JSON.stringify(engagements), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching engagement data:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  // TODO: Add admin authentication check here
  
  try {
    const body = await request.json() as any;
    const { action, identifier } = body;
    
    if (action === 'clear-sample' && identifier) {
      const deleteQuery = `DELETE FROM user_engagement_events WHERE event_data LIKE ?`;
      await env.DB.prepare(deleteQuery).bind(`%${identifier}%`).run();
      
      return new Response(JSON.stringify({ success: true }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    
    return new Response('Invalid action', { status: 400 });
  } catch (error) {
    console.error('Error processing engagement delete action:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};
