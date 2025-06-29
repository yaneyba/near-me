// API endpoints that expose SupabaseDataProvider methods
// This makes SupabaseDataProvider the SINGLE SOURCE OF TRUTH

import { DataProviderFactory } from '../providers/DataProviderFactory';

const dataProvider = DataProviderFactory.getProvider();

/**
 * Express-like handler for Supabase operations
 * This ensures ALL database access goes through SupabaseDataProvider
 */
export const supabaseProxyHandler = async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Parse request body if present
    const body = method !== 'GET' ? await req.json() : null;

    // Route to appropriate SupabaseDataProvider method
    switch (path) {
      case '/api/business-profiles':
        if (method === 'GET') {
          const data = await dataProvider.getBusinessProfiles();
          return new Response(JSON.stringify({ data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        if (method === 'POST') {
          const result = await dataProvider.submitBusiness(body);
          return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        break;

      case '/api/business-profiles/approve':
        if (method === 'POST') {
          await dataProvider.approveBusinessSubmission(body.id, body.reviewerNotes);
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        break;

      case '/api/business-profiles/reject':
        if (method === 'POST') {
          await dataProvider.rejectBusinessSubmission(body.id, body.reviewerNotes);
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        break;

      case '/api/contacts':
        if (method === 'POST') {
          const result = await dataProvider.submitContact(body);
          return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        break;

      case '/api/user-engagement':
        if (method === 'POST') {
          await dataProvider.trackEngagement(body);
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        break;

      case '/api/admin/stats':
        if (method === 'GET') {
          const stats = await dataProvider.getAdminStats();
          return new Response(JSON.stringify({ data: stats }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        break;

      case '/api/admin/submissions':
        if (method === 'GET') {
          const submissions = await dataProvider.getBusinessSubmissions();
          return new Response(JSON.stringify({ data: submissions }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        break;

      case '/api/admin/messages':
        if (method === 'GET') {
          const messages = await dataProvider.getContactMessages();
          return new Response(JSON.stringify({ data: messages }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        break;

      case '/api/admin/businesses':
        if (method === 'GET') {
          const businesses = await dataProvider.getAllBusinesses();
          return new Response(JSON.stringify({ data: businesses }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        break;

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Supabase proxy error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
