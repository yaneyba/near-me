import { Env, PagesFunction } from '../../types';

const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

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
                  value: businessResult.name,
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
                  value: businessResult.email || businessResult.submitter_email || 'No email',
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
