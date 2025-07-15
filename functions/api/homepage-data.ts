export const onRequest = async (context: any): Promise<Response> => {
  try {
    const { env } = context;
    
    if (!env.DB) {
      return new Response(JSON.stringify({ error: 'Database not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get all services with counts
    const servicesQuery = `
      SELECT 
        s.name,
        s.slug,
        s.description,
        COUNT(DISTINCT b.id) as count
      FROM services s
      LEFT JOIN businesses b ON b.category = s.slug
      GROUP BY s.name, s.slug, s.description
      ORDER BY count DESC, s.name ASC
    `;

    // Get all cities with business counts  
    const citiesQuery = `
      SELECT 
        b.city as name,
        b.city as slug,
        b.state,
        COUNT(DISTINCT b.id) as count
      FROM businesses b
      WHERE b.city IS NOT NULL AND b.city != ''
      GROUP BY b.city, b.state
      HAVING count > 0
      ORDER BY count DESC, b.city ASC
    `;

    const [servicesResult, citiesResult] = await Promise.all([
      env.DB.prepare(servicesQuery).all(),
      env.DB.prepare(citiesQuery).all()
    ]);

    // Format services data
    const services = servicesResult.results?.map((row: any) => ({
      name: row.name,
      slug: row.slug,
      count: row.count || 0,
      description: row.description || `Find the best ${row.name.toLowerCase()} near you`,
      icon: '🏪' // Default icon
    })) || [];

    // Format cities data
    const cities = citiesResult.results?.map((row: any) => ({
      name: row.name,
      slug: row.name.toLowerCase().replace(/\s+/g, '-'),
      state: row.state,
      count: row.count || 0
    })) || [];

    const response = {
      services,
      cities,
      meta: {
        totalServices: services.length,
        totalCities: cities.length,
        totalBusinesses: services.reduce((sum: number, service: any) => sum + service.count, 0),
        lastUpdated: new Date().toISOString()
      }
    };

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // 5 minutes cache
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Homepage data API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch homepage data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
