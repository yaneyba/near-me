import { Env, PagesFunction } from '../../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  // TODO: Add admin authentication check here
  // const isAdmin = await verifyAdminToken(request);
  // if (!isAdmin) return new Response('Unauthorized', { status: 401 });

  try {
    const query = `
      SELECT * FROM business_submissions 
      ORDER BY created_at DESC
    `;

    const result = await env.DB.prepare(query).all();
    const submissions = result.results || [];

    return new Response(JSON.stringify(submissions), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching business submissions:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    const { action, id, reviewerNotes } = await request.json();
    
    let query: string;
    let params: any[];
    
    if (action === 'approve') {
      query = `
        UPDATE business_submissions 
        SET status = 'approved', reviewed_at = datetime('now'), reviewer_notes = ?
        WHERE id = ?
      `;
      params = [reviewerNotes || null, id];
    } else if (action === 'reject') {
      query = `
        UPDATE business_submissions 
        SET status = 'rejected', reviewed_at = datetime('now'), reviewer_notes = ?
        WHERE id = ?
      `;
      params = [reviewerNotes || null, id];
    } else {
      return new Response('Invalid action', { status: 400 });
    }

    await env.DB.prepare(query).bind(...params).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error updating business submission:', error);
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
