import { Env, PagesFunction } from '../../types';

const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  // TODO: Add admin authentication check here
  
  try {
    const query = `
      SELECT * FROM contact_messages 
      ORDER BY created_at DESC
    `;

    const result = await env.DB.prepare(query).all();
    const messages = result.results || [];

    return new Response(JSON.stringify(messages), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    const { action, id, resolvedBy, adminNotes } = await request.json();
    
    if (action === 'resolve') {
      // Get the contact message details before updating
      const messageQuery = `SELECT * FROM contact_messages WHERE id = ?`;
      const messageResult = await env.DB.prepare(messageQuery).bind(id).first();
      
      const query = `
        UPDATE contact_messages 
        SET status = 'resolved', resolved_at = datetime('now'), resolved_by = ?, admin_notes = ?
        WHERE id = ?
      `;
      
      await env.DB.prepare(query).bind(resolvedBy || null, adminNotes || null, id).run();
      
      // Send Slack notification for contact message resolution
      if (messageResult) {
        const slackPayload = {
          username: 'Near Me Admin',
          icon_emoji: ':white_check_mark:',
          text: 'Contact message resolved',
          attachments: [
            {
              color: '#36a64f',
              title: 'Contact Message RESOLVED',
              title_link: `https://near-me.us/admin/dashboard`,
              fields: [
                {
                  title: 'From',
                  value: `${messageResult.name} (${messageResult.email})`,
                  short: true,
                },
                {
                  title: 'Subject',
                  value: messageResult.subject,
                  short: true,
                },
                {
                  title: 'Category',
                  value: messageResult.category || 'General',
                  short: true,
                },
                {
                  title: 'Location',
                  value: messageResult.city || 'Not specified',
                  short: true,
                },
                {
                  title: 'Resolved By',
                  value: resolvedBy || 'Admin',
                  short: true,
                },
                {
                  title: 'Status',
                  value: 'RESOLVED',
                  short: true,
                },
                {
                  title: 'Message',
                  value: String(messageResult.message).length > 300 ? `${String(messageResult.message).substring(0, 300)}...` : String(messageResult.message),
                  short: false,
                },
                ...(adminNotes ? [{
                  title: 'Admin Notes',
                  value: adminNotes,
                  short: false,
                }] : []),
              ],
              footer: `Message ID: ${id}`,
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
          console.error('Failed to send Slack notification for contact message resolution:', error);
        });
      }
      
      return new Response(JSON.stringify({ success: true }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } else {
      return new Response('Invalid action', { status: 400 });
    }
  } catch (error) {
    console.error('Error updating contact message:', error);
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
