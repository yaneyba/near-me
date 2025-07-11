
export function transformDatabaseToBusiness(dbRow: any): Business {
  return {
    id: dbRow.id,
    business_id: dbRow.business_id,
    name: dbRow.name,
    description: dbRow.description || null,
    address: dbRow.address || null,
    city: dbRow.city || null,
    state: dbRow.state || null,
    zip_code: dbRow.zip_code || null,
    phone: dbRow.phone || null,
    email: dbRow.email || null,
    website: dbRow.website || null,
    category: dbRow.category || null,
    services: dbRow.services ? JSON.parse(dbRow.services) : [],
    hours: dbRow.hours ? JSON.parse(dbRow.hours) : {},
    rating: dbRow.rating || 0,
    review_count: dbRow.review_count || 0,
    image: dbRow.image || null,
    logo_url: dbRow.logo_url || null,
    established: dbRow.established || null,
    verified: Boolean(dbRow.verified),
    premium: Boolean(dbRow.premium),
    status: dbRow.status || 'active',
    site_id: dbRow.site_id || null,
    latitude: dbRow.latitude || null,
    longitude: dbRow.longitude || null,
    created_at: dbRow.created_at,
    updated_at: dbRow.updated_at
  };
}

export function transformBusinessToLegacy(business: Business): LegacyBusiness {
  return {
    id: business.id,
    name: business.name,
    category: business.category || '',
    city: business.city || '',
    state: business.state || '',
    address: business.address || '',
    phone: business.phone || '',
    website: business.website,
    rating: business.rating || 0,
    reviewCount: business.review_count || 0,
    description: business.description,
    services: business.services || [],
    hours: business.hours || {},
    image: business.image || '',
    premium: business.premium || false,
    latitude: business.latitude,
    longitude: business.longitude,
    neighborhood: undefined, // Legacy field not in new schema
    bookingLinks: [] // Legacy field not in new schema
  };
}
