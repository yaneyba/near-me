import { Env, PagesFunction } from '../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const city = url.searchParams.get('city');
  const productCategory = url.searchParams.get('product_category');
  const vendor = url.searchParams.get('vendor');

  try {
    let query: string;
    let bindParams: (string | number)[] = [];

    // Base query joining products with businesses (vendors)
    let baseQuery = `
      SELECT 
        p.id as product_id,
        p.name as product_name,
        p.description as product_description,
        p.price,
        p.category as product_category,
        p.images as product_images,
        p.vendor_id,
        b.id as vendor_id_fk,
        b.business_id,
        b.name as vendor_name,
        b.category as vendor_category,
        b.address as vendor_address,
        b.city as vendor_city,
        b.state as vendor_state,
        b.phone as vendor_phone,
        b.website as vendor_website,
        b.verified as vendor_verified,
        b.premium as vendor_premium
      FROM products p
      JOIN businesses b ON p.vendor_id = b.id
      WHERE b.status = 'active'
    `;

    // Add category filter (vendor category)
    if (category) {
      baseQuery += ` AND LOWER(b.category) = LOWER(?)`;
      bindParams.push(category);
    }

    // Add city filter
    if (city && city.toLowerCase() !== 'all cities') {
      baseQuery += ` AND LOWER(b.city) = LOWER(?)`;
      bindParams.push(city);
    }

    // Add product category filter
    if (productCategory) {
      baseQuery += ` AND LOWER(p.category) = LOWER(?)`;
      bindParams.push(productCategory);
    }

    // Add vendor filter
    if (vendor) {
      baseQuery += ` AND LOWER(b.name) LIKE LOWER(?)`;
      bindParams.push(`%${vendor}%`);
    }

    // Add ordering
    baseQuery += `
      ORDER BY 
        b.premium DESC,
        b.verified DESC,
        p.price ASC,
        p.name ASC
    `;

    query = baseQuery;

    const stmt = env.DB.prepare(query);
    const results = await stmt.bind(...bindParams).all();

    if (!results.success) {
      throw new Error('Database query failed');
    }

    // Transform results to include both product and vendor information
    const products = (results.results || []).map((row: any) => ({
      id: row.product_id,
      name: row.product_name,
      description: row.product_description,
      price: row.price,
      category: row.product_category,
      images: row.product_images,
      vendor: {
        id: row.vendor_id_fk,
        business_id: row.business_id,
        name: row.vendor_name,
        category: row.vendor_category,
        address: row.vendor_address,
        city: row.vendor_city,
        state: row.vendor_state,
        phone: row.vendor_phone,
        website: row.vendor_website,
        verified: row.vendor_verified,
        premium: row.vendor_premium
      }
    }));

    return new Response(JSON.stringify({
      products,
      count: products.length,
      filters: {
        category,
        city,
        product_category: productCategory,
        vendor
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
