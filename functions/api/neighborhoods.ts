import { Env, PagesFunction } from '../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const city = url.searchParams.get('city');

  try {
    if (city) {
      // Get neighborhoods for a specific city
      const query = `
        SELECT n.display_name as neighborhood
        FROM neighborhoods n
        JOIN cities c ON n.city_id = c.id
        WHERE LOWER(c.name) = LOWER(?) OR LOWER(c.id) = LOWER(?)
        ORDER BY n.display_name ASC
      `;

      const result = await env.DB.prepare(query)
        .bind(city, city)
        .all();

      const neighborhoods = result.results?.map((row: any) => row.neighborhood) || [];

      return new Response(JSON.stringify(neighborhoods), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      });
    } else {
      // Get all cities with their neighborhoods (replaces neighborhoods.json)
      const cities = await env.DB.prepare(`
        SELECT 
          c.name,
          c.display_name,
          GROUP_CONCAT(n.display_name) as neighborhoods
        FROM cities c
        LEFT JOIN neighborhoods n ON c.id = n.city_id
        GROUP BY c.id, c.name, c.display_name
        ORDER BY c.display_name
      `).all();

      // Transform the data to match the old JSON format for compatibility
      const result: Record<string, string[]> = {};
      
      if (cities.results) {
        for (const city of cities.results) {
          const cityData = city as any;
          const neighborhoods = cityData.neighborhoods 
            ? (cityData.neighborhoods as string).split(',').filter(Boolean)
            : [];
          result[cityData.name] = neighborhoods;
        }
      }

      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      });
    }
  } catch (error) {
    console.error('Error fetching neighborhoods:', error);
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
