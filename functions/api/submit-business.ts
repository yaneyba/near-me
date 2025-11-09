import { Env, PagesFunction } from '../types';
import { sendSlackNotification, BusinessNotificationData } from '../utils/slack';
import { requireAdminAuth } from '../utils/auth';
import { getCorsHeaders, createCorsPreflightResponse } from '../utils/cors';

// Use environment variable for Slack webhook URL
// Fallback to empty string if not set (will gracefully fail in sendSlackNotification)
const getSlackWebhookUrl = (env: Env): string => {
  return env.SLACK_WEBHOOK_URL || '';
};

// GET: Retrieve all business submissions (for admin)
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Require admin authentication
  const authError = await requireAdminAuth(request, env);
  if (authError) return authError;

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
        ...getCorsHeaders(request, env),
      },
    });
  } catch (error) {
    console.error('Error fetching business submissions:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to fetch business submissions'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(request, env),
      }
    });
  }
};

// POST: Submit new business OR handle admin actions
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const requestData = await request.json();
    
    // Check if this is an admin action (has action field)
    if (requestData.action && requestData.id) {
      return await handleAdminAction(requestData, env);
    }
    
    // Otherwise, handle new business submission
    return await handleBusinessSubmission(requestData, env);
  } catch (error) {
    console.error('Error in submit-business handler:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to process request'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

// Handle new business submission
async function handleBusinessSubmission(businessData: any, env: Env) {
  // Validate required fields based on database schema
  if (!businessData.name || !businessData.category || !businessData.city) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Missing required fields: name, category, and city are required'
    }), { 
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  // Validate submitter info (required for owner_name and email fields)
  if (!businessData.submitterName && !businessData.ownerName) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Submitter name is required'
    }), { 
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  if (!businessData.submitterEmail && !businessData.email) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Email is required'
    }), { 
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  const id = 'business_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

  // Clean up and sanitize input data first
  const cleanZip = businessData.zip ? String(businessData.zip).replace(/[^\w\d]/g, '') : '00000';

  // Prepare data with defaults for NOT NULL fields
  const business_name = businessData.name;
  const owner_name = businessData.submitterName || businessData.owner || 'Unknown';
  const email = businessData.submitterEmail || businessData.email || '';
  const phone = businessData.phone || businessData.submitterPhone || 'Not provided';
  const address = businessData.address || 'Not provided';
  const city = businessData.city;
  const state = businessData.state || 'Not provided';
  const zip_code = cleanZip || '00000';
  const category = businessData.category;
  const website = businessData.website || null;
  const description = businessData.description || null;
  const site_id = 'water-refill';

  // Use parameterized queries to prevent SQL injection
  const query = `
    INSERT INTO business_submissions (
      id, business_name, owner_name, email, phone, address, city, state, zip_code,
      category, website, description, site_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    // Sanitize the JSON data before storing
    let sanitizedServices: string | null = null;
    let sanitizedHours: string | null = null;
    
    try {
      if (businessData.services) {
        // Make sure services is an array
        if (Array.isArray(businessData.services)) {
          sanitizedServices = JSON.stringify(businessData.services);
        } else {
          // If it's not an array, convert to string and log warning
          console.warn('Services not in expected array format:', businessData.services);
          sanitizedServices = JSON.stringify([]);
        }
      }
      
      if (businessData.businessHours) {
        // Make sure businessHours is an object
        if (typeof businessData.businessHours === 'object' && businessData.businessHours !== null) {
          sanitizedHours = JSON.stringify(businessData.businessHours);
        } else {
          // If it's not an object, convert to empty object and log warning
          console.warn('Business hours not in expected format:', businessData.businessHours);
          sanitizedHours = JSON.stringify({});
        }
      }
    } catch (jsonError) {
      console.error('JSON serialization error:', jsonError);
      // Provide fallback values in case of errors
      sanitizedServices = JSON.stringify([]);
      sanitizedHours = JSON.stringify({});
    }
    
    // Execute parameterized query to prevent SQL injection
    await env.DB.prepare(query)
      .bind(
        id,
        business_name,
        owner_name,
        email,
        phone,
        address,
        city,
        state,
        zip_code,
        category,
        website,
        description,
        site_id
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

    const webhookUrl = getSlackWebhookUrl(env);
    if (webhookUrl) {
      await sendSlackNotification(webhookUrl, {
        type: 'business',
        data: slackData,
        submissionId: id,
        timestamp: new Date().toISOString(),
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Business submission received successfully',
      id
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    // Log error for debugging (without exposing sensitive data)
    console.error('Error submitting business:', {
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      businessId: id,
      city: businessData.city,
      category: businessData.category
    });
    
    // Provide more helpful error message for debugging
    let errorMessage = 'Failed to submit business';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
      
      // Add additional context for SQL errors
      if ('cause' in error && error.cause && typeof error.cause === 'object' && 'message' in error.cause) {
        errorMessage += ` (${error.cause.message})`;
      }
    }
    
    return new Response(JSON.stringify({
      success: false,
      message: errorMessage
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Handle admin actions (approve/reject)
async function handleAdminAction(requestData: any, env: Env) {
  const { action, id, reviewerNotes } = requestData;
  
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
    return new Response(JSON.stringify({
      success: false,
      message: 'Invalid action'
    }), { 
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  try {
    // Get the business submission details before updating
    const businessQuery = `SELECT * FROM business_submissions WHERE id = ?`;
    const businessResult = await env.DB.prepare(businessQuery).bind(id).first();

    // Update the business submission status
    await env.DB.prepare(query).bind(...params).run();

    // Send Slack notification for admin action
    if (businessResult) {
      const actionText = action === 'approve' ? 'approved' : 'rejected';
      const color = action === 'approve' ? '#36a64f' : '#ff4444';
      
      const slackPayload = {
        username: 'Near Me Admin',
        icon_emoji: action === 'approve' ? ':white_check_mark:' : ':x:',
        text: `Business submission ${actionText}`,
        attachments: [
          {
            color: color,
            title: `Business Submission ${actionText.toUpperCase()}`,
            title_link: `https://near-me.us/admin/dashboard`,
            fields: [
              {
                title: 'Business Name',
                value: businessResult.business_name,
                short: true,
              },
              {
                title: 'Category',
                value: businessResult.category,
                short: true,
              },
              {
                title: 'Location',
                value: `${businessResult.city}${businessResult.state ? `, ${businessResult.state}` : ''}`,
                short: true,
              },
              {
                title: 'Email',
                value: businessResult.email || 'No email',
                short: true,
              },
              {
                title: 'Status',
                value: actionText.toUpperCase(),
                short: true,
              },
              ...(reviewerNotes ? [{
                title: 'Admin Notes',
                value: reviewerNotes,
                short: false,
              }] : []),
            ],
            footer: `Submission ID: ${id}`,
            ts: Math.floor(Date.now() / 1000),
          },
        ],
      };

      // Send notification using fetch directly (don't await to avoid blocking the response)
      const webhookUrl = getSlackWebhookUrl(env);
      if (webhookUrl) {
        fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(slackPayload),
        }).catch(error => {
          console.error('Failed to send Slack notification for admin action:', error);
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error handling admin action:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to process admin action'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
