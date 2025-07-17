import { Env, PagesFunction } from '../types';
import { sendSlackNotification, BusinessNotificationData } from '../utils/slack';

const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

// GET: Retrieve all business submissions (for admin)
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
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
        'Access-Control-Allow-Origin': '*',
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

  const query = `
    INSERT INTO business_submissions (
      id, business_name, owner_name, email, phone, address, city, state, zip_code,
      category, website, description, services, hours, site_id, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `;

  const id = 'business_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

  try {
    // Insert into database
    await env.DB.prepare(query)
      .bind(
        id,
        businessData.name,
        businessData.submitterName || 'Unknown',
        businessData.submitterEmail || businessData.email || '',
        businessData.phone || businessData.submitterPhone || '',
        businessData.address || '',
        businessData.city,
        businessData.state || '',
        businessData.zip || '',
        businessData.category,
        businessData.website || null,
        businessData.description || null,
        businessData.services ? JSON.stringify(businessData.services) : null,
        businessData.businessHours ? JSON.stringify(businessData.businessHours) : null,
        'water-refill' // site_id for tracking which subdomain this came from
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
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
      fetch(SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slackPayload),
      }).catch(error => {
        console.error('Failed to send Slack notification for admin action:', error);
      });
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
