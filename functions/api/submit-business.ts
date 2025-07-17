import { Env, PagesFunction } from '../types';
import { sendSlackNotification, BusinessNotificationData } from '../utils/slack';

const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const businessData = await request.json();

    // Validate required fields
    if (!businessData.name || !businessData.category || !businessData.city) {
      return new Response('Missing required fields', { status: 400 });
    }

    const query = `
      INSERT INTO business_submissions (
        id, name, category, subcategory, description,
        phone, website, email, address, city, state, zip,
        latitude, longitude, business_hours, services,
        submitter_name, submitter_email, submitter_phone,
        additional_info, created_at, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), 'pending')
    `;

    const id = 'business_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Insert into database
    await env.DB.prepare(query)
      .bind(
        id,
        businessData.name,
        businessData.category,
        businessData.subcategory || null,
        businessData.description || null,
        businessData.phone || null,
        businessData.website || null,
        businessData.email || null,
        businessData.address || null,
        businessData.city,
        businessData.state || null,
        businessData.zip || null,
        businessData.latitude || null,
        businessData.longitude || null,
        businessData.businessHours ? JSON.stringify(businessData.businessHours) : null,
        businessData.services ? JSON.stringify(businessData.services) : null,
        businessData.submitterName || null,
        businessData.submitterEmail || null,
        businessData.submitterPhone || null,
        businessData.additionalInfo || null
      )
      .run();

    // Send Slack notification
    const slackData: BusinessNotificationData = {
      businessName: businessData.name,
      ownerName: businessData.ownerName || businessData.submitterName || 'Unknown',
      email: businessData.email || businessData.submitterEmail || 'No email provided',
      phone: businessData.phone || businessData.submitterPhone || undefined,
      address: businessData.address || undefined,
      city: businessData.city,
      state: businessData.state || undefined,
      zipCode: businessData.zip || undefined,
      category: businessData.category,
      website: businessData.website || undefined,
      description: businessData.description || undefined,
      services: businessData.services || undefined,
      submitterName: businessData.submitterName || undefined,
      submitterEmail: businessData.submitterEmail || undefined,
      submitterPhone: businessData.submitterPhone || undefined,
    };

    await sendSlackNotification(SLACK_WEBHOOK_URL, {
      type: 'business',
      data: slackData,
      submissionId: id,
      timestamp: new Date().toISOString(),
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Business submission received successfully',
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
    console.error('Error submitting business:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to submit business'
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
