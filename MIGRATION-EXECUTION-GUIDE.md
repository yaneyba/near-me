# Execute SQL Migration - Step by Step Guide

Since the Supabase CLI isn't linked, here are your options to run the migration:

## Option 1: Supabase Dashboard SQL Editor (Easiest)

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project (likely "SpecialtyPet" or "SeniorCare")

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Execute Migration Script**
   - Copy the contents of `complete-admin-migration.sql`
   - Paste into the SQL editor
   - Click "Run" button

4. **Copy and Execute Verification Script**
   - Copy the contents of `verify-migration.sql`
   - Paste into a new query
   - Click "Run" button

## Option 2: Link Supabase CLI (For Future Use)

```bash
# In your project directory
cd /Users/yanbanga/Development/repos/near-me

# Link to your project (you'll need to choose which one)
supabase link --project-ref qakuprizelaltygmexlz  # For SpecialtyPet
# OR
supabase link --project-ref dflafjjpcsojddieumgo  # For SeniorCare

# Then run the migration
supabase db reset --linked
```

## Option 3: Direct psql Connection

If you have your database connection string:

```bash
# Get your connection string from Supabase Dashboard > Settings > Database
psql "postgresql://postgres:[password]@[host]:5432/postgres"

# Then run:
\i supabase/sqls/complete-admin-migration.sql
\i supabase/sqls/verify-migration.sql
```

## Which Project Should You Use?

Based on your near-me business directory app, you likely want:
- **SpecialtyPet** (qakuprizelaltygmexlz) if this is for pet-related businesses
- **SeniorCare** (dflafjjpcsojddieumgo) if this is for senior care businesses

## Files Ready to Execute

✅ **Migration Script**: `supabase/sqls/complete-admin-migration.sql`
✅ **Verification Script**: `supabase/sqls/verify-migration.sql`

## What the Migration Will Do

1. Remove the old `is_admin_user()` function
2. Drop all hard-coded admin policies
3. Create new service role policies
4. Verify the migration was successful

## After Migration

Test these in your application:
- Admin dashboard should load
- Admin operations should work (approve submissions, etc.)
- Users can still create submissions
- No login timeouts

---

**Recommendation**: Use Option 1 (Supabase Dashboard) - it's the quickest and most reliable way to execute the migration.
