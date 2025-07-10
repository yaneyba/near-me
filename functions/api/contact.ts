import { Env, PagesFunction } from '../types';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const contactData = await request.json();

    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.message) {
      return new Response('Missing required fields', { status: 400 });
    }

    const query = `
      INSERT INTO contact_messages (
        id, name, email, message, business_id, 
        subject, phone, created_at, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), 'pending')
    `;

    const id = 'contact_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    await env.DB.prepare(query)
      .bind(
        id,
        contactData.name,
        contactData.email,
        contactData.message,
        contactData.businessId || null,
        contactData.subject || 'General Inquiry',
        contactData.phone || null
      )
      .run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Contact form submitted successfully',
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
    console.error('Error submitting contact form:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to submit contact form'
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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
