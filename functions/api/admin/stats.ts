import { Env, PagesFunction } from '../../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  // TODO: Add admin authentication check here
  
  try {
    const [submissions, messages, businesses, profiles, categories, cities, avgRating] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) as count FROM business_submissions WHERE status = 'pending'`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM contact_messages WHERE status = 'new'`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM businesses`).first(),
      env.DB.prepare(`SELECT COUNT(*) as count FROM business_profiles`).first(),
      env.DB.prepare(`SELECT COUNT(DISTINCT category) as count FROM businesses WHERE category IS NOT NULL AND category != ''`).first(),
      env.DB.prepare(`SELECT COUNT(DISTINCT city) as count FROM businesses WHERE city IS NOT NULL AND city != ''`).first(),
      env.DB.prepare(`SELECT AVG(rating) as avg FROM businesses WHERE rating IS NOT NULL AND rating > 0`).first()
    ]);

    const stats = {
      pendingBusinesses: submissions?.count || 0,
      totalBusinesses: businesses?.count || 0,
      newMessages: messages?.count || 0,
      totalUsers: profiles?.count || 0,
      premiumBusinesses: 0, // TODO: Implement premium count
      totalCategories: categories?.count || 0,
      totalCities: cities?.count || 0,
      averageRating: avgRating?.avg ? Number(avgRating.avg).toFixed(1) : '4.8'
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
