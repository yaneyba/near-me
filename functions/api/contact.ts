import { Env, PagesFunction } from '../types';
import { sendSlackNotification, ContactNotificationData } from '../utils/slack';

const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

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
        id, name, email, subject, message, category, city, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'new', datetime('now'))
    `;

    const id = 'contact_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Extract only the fields that exist in the database schema
    const dbFields = {
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject || 'General Inquiry',
      message: contactData.message,
      category: contactData.category || null,
      city: contactData.city || null
    };

    console.log('Contact API - Received data:', JSON.stringify(contactData, null, 2));
    console.log('Contact API - DB fields:', JSON.stringify(dbFields, null, 2));

    // Insert into database
    await env.DB.prepare(query)
      .bind(
        id,
        dbFields.name,
        dbFields.email,
        dbFields.subject,
        dbFields.message,
        dbFields.category,
        dbFields.city
      )
      .run();

    // Send Slack notification
    const slackData: ContactNotificationData = {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || undefined,
      subject: contactData.subject || 'General Inquiry',
      message: contactData.message,
      inquiryType: contactData.inquiryType || undefined,
      businessName: contactData.businessName || undefined,
      category: contactData.category || undefined,
      city: contactData.city || undefined,
      state: contactData.state || undefined,
      urgency: contactData.urgency || undefined,
      preferredContact: contactData.preferredContact || undefined,
    };

    console.log('Attempting to send Slack notification with data:', JSON.stringify(slackData, null, 2));

    await sendSlackNotification(SLACK_WEBHOOK_URL, {
      type: 'contact',
      data: slackData,
      submissionId: id,
      timestamp: new Date().toISOString(),
    });

    console.log('Contact form processing completed successfully');

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
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to submit contact form',
      error: error.message
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
