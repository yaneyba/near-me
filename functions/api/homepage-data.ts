export const onRequest = async (context: any): Promise<Response> => {
  try {
    const { env } = context;
    
    if (!env.DB) {
      return new Response(JSON.stringify({ error: 'Database not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get all service categories with business counts (from businesses table directly)
    const servicesQuery = `
      SELECT 
        b.category as slug,
        b.category as name,
        b.category as description,
        COUNT(DISTINCT b.id) as count
      FROM businesses b
      WHERE b.category IS NOT NULL AND b.category != ''
      GROUP BY b.category
      ORDER BY b.category ASC
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
      ORDER BY b.city ASC, b.state ASC
    `;

    const [servicesResult, citiesResult] = await Promise.all([
      env.DB.prepare(servicesQuery).all(),
      env.DB.prepare(citiesQuery).all()
    ]);

    // Format services data with proper category names
    const formatCategoryName = (category: string): string =>
      category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const services = servicesResult.results?.map((row: any) => ({
      name: formatCategoryName(row.name),
      slug: row.slug,
      count: row.count || 0,
      description: `Find the best ${formatCategoryName(row.name).toLowerCase()} near you`,
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
