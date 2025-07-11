import { Env, PagesFunction } from '../../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  // TODO: Add admin authentication check here
  
  try {
    const [submissions, messages, businesses, profiles] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) as count FROM business_submissions WHERE status = 'pending'`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM contact_messages WHERE status = 'new'`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM businesses`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM business_profiles`).first()
    ]);

    const stats = {
      pendingBusinesses: submissions?.count || 0,
      totalBusinesses: businesses?.count || 0,
      newMessages: messages?.count || 0,
      totalUsers: profiles?.count || 0,
      premiumBusinesses: 0 // TODO: Implement premium count
    };

    return new Response(JSON.stringify(stats), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};
