import { Env, PagesFunction } from '../../../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  
  try {
    const result = await env.DB.prepare(`
      SELECT 
        category,
        COUNT(*) as count
      FROM businesses 
      WHERE category IS NOT NULL 
        AND category != '' 
        AND status = 'active'
      GROUP BY category
      ORDER BY count DESC
    `).all();

    const categories = result.results?.map((row: any) => ({
      category: row.category,
      count: row.count
    })) || [];

    return new Response(JSON.stringify(categories), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
