import { Env, PagesFunction } from '../../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  // TODO: Add admin authentication check here
  
  try {
    const query = `
      SELECT * FROM contact_messages 
      ORDER BY created_at DESC
    `;

    const result = await env.DB.prepare(query).all();
    const messages = result.results || [];

    return new Response(JSON.stringify(messages), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    const { action, id, resolvedBy, adminNotes } = await request.json();
    
    if (action === 'resolve') {
      const query = `
        UPDATE contact_messages 
        SET status = 'resolved', resolved_at = datetime('now'), resolved_by = ?, admin_notes = ?
        WHERE id = ?
      `;
      
      await env.DB.prepare(query).bind(resolvedBy || null, adminNotes || null, id).run();
      
      return new Response(JSON.stringify({ success: true }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } else {
      return new Response('Invalid action', { status: 400 });
    }
  } catch (error) {
    console.error('Error updating contact message:', error);
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
