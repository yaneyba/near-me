import { Env, PagesFunction } from '../types';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const engagementData = await request.json();

    // Validate required fields
    if (!engagementData.eventType) {
      return new Response('Missing eventType', { status: 400 });
    }

    const query = `
      INSERT INTO user_engagement_events (
        id, business_id, event_type, event_data, 
        timestamp, user_agent, ip_address, session_id
      ) VALUES (?, ?, ?, ?, datetime('now'), ?, ?, ?)
    `;

    const id = 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const userAgent = request.headers.get('user-agent') || null;
    const clientIP = request.headers.get('cf-connecting-ip') || 
                     request.headers.get('x-forwarded-for') || 
                     null;

    await env.NEARME_DB.prepare(query)
      .bind(
        id,
        engagementData.businessId || null,
        engagementData.eventType,
        JSON.stringify(engagementData.eventData || {}),
        userAgent,
        clientIP,
        engagementData.userSessionId || null
      )
      .run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Engagement tracked successfully',
      id
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error tracking engagement:', error);
    // Don't return error for tracking failures - just log and return success
    return new Response(JSON.stringify({
      success: true,
      message: 'Engagement tracked'
    }), {
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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
