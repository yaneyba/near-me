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

  // Let's be 100% explicit about the fields and values
  const query = `
    INSERT INTO business_submissions (
      id, business_name, owner_name, email, phone, address, city, state, zip_code,
      category, website, description, services, hours, site_id, status
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, 'pending'
    )
  `;
  
  // Count the number of parameters (question marks) in the query
  const paramCount = (query.match(/\?/g) || []).length;
  console.log(`SQL query has ${paramCount} parameters`);

  const id = 'business_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

  try {
    // Clean up and sanitize all input data
    const cleanZip = businessData.zip ? String(businessData.zip).replace(/[^\w\d]/g, '') : '';
    
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
    
    console.log('Preparing to insert business submission:', {
      id, 
      name: businessData.name,
      email: businessData.submitterEmail || businessData.email || '',
      city: businessData.city,
      state: businessData.state || '',
      zip: cleanZip
    });
    
    // Insert into database
    const stmt = env.DB.prepare(query);
    
    await stmt.bind(
      id,
      businessData.name,
      businessData.submitterName || 'Unknown',
      businessData.submitterEmail || businessData.email || '',
      businessData.phone || businessData.submitterPhone || 'Not provided',
      businessData.address || 'Not provided',
      businessData.city,
      businessData.state || 'Not provided',
      cleanZip || '00000', // Use the cleaned ZIP code with default
      businessData.category,
      businessData.website || null,
      businessData.description || null,
      sanitizedServices,
      sanitizedHours,
      'water-refill' // site_id for tracking which subdomain this came from
    );
    
    // Log the prepared query for debugging
    console.log('Executing SQL query:', query);
    console.log('With parameters:', [
      id,
      businessData.name,
      businessData.submitterName || 'Unknown',
      businessData.submitterEmail || businessData.email || '',
      businessData.phone || businessData.submitterPhone || 'Not provided',
      businessData.address || 'Not provided',
      businessData.city,
      businessData.state || 'Not provided',
      cleanZip || '00000', 
      businessData.category,
      businessData.website || null,
      businessData.description || null,
      sanitizedServices,
      sanitizedHours,
      'water-refill'
    ]);
    
    // Execute the query
    await stmt.run();

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
    // Add detailed error logging with the specific error and payload
    console.error('Error submitting business:', error);
    
    // Log the detailed error info for debugging
    try {
      console.error('Business data causing error:', {
        id,
        name: businessData.name,
        city: businessData.city,
        state: businessData.state || 'Not provided',
        zip: businessData.zip || '00000',
        category: businessData.category,
        email: businessData.submitterEmail || businessData.email || '',
        owner: businessData.submitterName || 'Unknown',
        phone: businessData.phone || businessData.submitterPhone || 'Not provided',
        address: businessData.address || 'Not provided',
        servicesType: typeof businessData.services,
        servicesIsArray: Array.isArray(businessData.services),
        businessHoursType: typeof businessData.businessHours
      });
      
      // If we have D1 error details, log them
      if (error && typeof error === 'object' && 'cause' in error) {
        console.error('Database error cause:', error.cause);
      }
      
      // Log SQL bind parameters for debugging
      const zipForLog = businessData.zip ? String(businessData.zip).replace(/[^\w\d]/g, '') : '00000';
      console.error('SQL bind parameters:', [
        id,
        businessData.name,
        businessData.submitterName || 'Unknown',
        businessData.submitterEmail || businessData.email || '',
        businessData.phone || businessData.submitterPhone || 'Not provided',
        businessData.address || 'Not provided',
        businessData.city,
        businessData.state || 'Not provided',
        zipForLog,
        businessData.category,
        businessData.website || null,
        businessData.description || null,
        businessData.services ? JSON.stringify(businessData.services) : null,
        businessData.businessHours ? JSON.stringify(businessData.businessHours) : null,
        'water-refill'
      ]);
    } catch (logError) {
      console.error('Error while logging:', logError);
    }
    
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
