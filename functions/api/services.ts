import { Env, PagesFunction } from '../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const category = url.searchParams.get('category');

  try {
    if (category) {
      // Get services for a specific category
      const query = `
        SELECT service
        FROM services
        WHERE LOWER(category) = LOWER(?)
        ORDER BY service ASC
      `;

      const result = await env.DB.prepare(query)
        .bind(category)
        .all();

      const services = result.results?.map((row: any) => row.service) || [];

      return new Response(JSON.stringify(services), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'false',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      });
    } else {
      // Get all categories with their services (replaces services.json)
      const categories = await env.DB.prepare(`
        SELECT 
          category,
          GROUP_CONCAT(service) as services
        FROM services
        GROUP BY category
        ORDER BY category
      `).all();

      // Transform the data to match the old JSON format for compatibility
      const result: Record<string, string[]> = {};
      
      if (categories.results) {
        for (const category of categories.results) {
          const categoryData = category as any;
          const services = categoryData.services 
            ? (categoryData.services as string).split(',').filter(Boolean)
            : [];
          result[categoryData.category] = services;
        }
      }

      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'false',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      });
    }
  } catch (error) {
    console.error('Error fetching services:', error);
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
      'Access-Control-Allow-Credentials': 'false',
    },
  });
};
