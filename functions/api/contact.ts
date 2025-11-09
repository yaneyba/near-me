import { Env, PagesFunction } from '../types';
import { sendSlackNotification, ContactNotificationData } from '../utils/slack';
import { getCorsHeaders, createCorsPreflightResponse } from '../utils/cors';

// Use environment variable for Slack webhook URL
const getSlackWebhookUrl = (env: Env): string => {
  return env.SLACK_WEBHOOK_URL || '';
};

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

    // Send Slack notification if webhook URL is configured
    const webhookUrl = getSlackWebhookUrl(env);
    if (webhookUrl) {
      await sendSlackNotification(webhookUrl, {
        type: 'contact',
        data: slackData,
        submissionId: id,
        timestamp: new Date().toISOString(),
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Contact form submitted successfully',
      id
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(request, env),
      },
    });
  } catch (error) {
    console.error('Error submitting contact form:', error instanceof Error ? error.message : 'Unknown error');
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to submit contact form',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(request, env),
      },
    });
  }
};

export const onRequestOptions: PagesFunction<Env> = async (context) => {
  return createCorsPreflightResponse(context.request, context.env);
};
