
# Supabase to D1 Migration Summary

## Migration Overview
- **Date**: 2025-07-10T20:18:40.814Z
- **Database**: nearme-db (86879c31-0686-4532-a66c-f310b89d7a27)
- **Tables Migrated**: 5

## Data Summary
- **business_submissions**: 15 rows
- **contact_messages**: 5 rows
- **business_profiles**: 1 rows
- **businesses**: 462 rows
- **admin_settings**: 2 rows

## Migration Files Generated
1. `001_schema.sql` - Database schema
2. `002_data_business_submissions.sql` - Data for business_submissions
3. `002_data_contact_messages.sql` - Data for contact_messages
4. `002_data_business_profiles.sql` - Data for business_profiles
5. `002_data_businesses.sql` - Data for businesses
6. `002_data_admin_settings.sql` - Data for admin_settings

## Next Steps
1. Apply schema: `wrangler d1 execute nearme-db --file=./migrations/d1/001_schema.sql`
2. Apply data migrations:
   `wrangler d1 execute nearme-db --file=./migrations/d1/002_data_business_submissions.sql`
   `wrangler d1 execute nearme-db --file=./migrations/d1/002_data_contact_messages.sql`
   `wrangler d1 execute nearme-db --file=./migrations/d1/002_data_business_profiles.sql`
   `wrangler d1 execute nearme-db --file=./migrations/d1/002_data_businesses.sql`
   `wrangler d1 execute nearme-db --file=./migrations/d1/002_data_admin_settings.sql`

## Validation
After migration, verify data integrity:
```bash
wrangler d1 execute nearme-db --command="SELECT COUNT(*) as total_submissions FROM business_submissions;"
wrangler d1 execute nearme-db --command="SELECT COUNT(*) as total_contacts FROM contact_messages;"
wrangler d1 execute nearme-db --command="SELECT COUNT(*) as total_businesses FROM businesses;"
```
