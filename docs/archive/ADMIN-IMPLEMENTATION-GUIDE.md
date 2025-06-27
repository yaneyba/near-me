# Admin Implementation Guide

This guide documents the complete admin architecture and implementation approach for the business directory platform.

## Admin Architecture Overview

### ✅ Recommended: Email-Only Approach

**Admins:**
- Stored only in `auth.users` (Supabase Auth)
- Detected by email in code: `adminEmails = ['yaneyba@finderhubs.com']`
- No `business_profiles` entries needed
- Clean separation from business users

**Business Users:**
- Stored in `auth.users` + `business_profiles`
- Role-based access from database
- Approval workflow and subscriptions

## Why Email-Only Admin Detection?

1. **Simplicity**: No database lookups required for admin detection
2. **Security**: Admin status is hardcoded in application logic
3. **Separation**: Clear distinction between platform admins and business users
4. **Performance**: No additional database queries for every admin action
5. **Reliability**: No dependency on database state for admin access

## Implementation Details

### 1. Code-Level Admin Detection

In `src/lib/auth.ts`:
```typescript
const adminEmails = ['yaneyba@finderhubs.com'];

export const isUserAdmin = (user: User | null): boolean => {
  if (!user?.email) return false;
  return adminEmails.includes(user.email);
};
```

### 2. Database-Level Admin Detection

SQL function for RLS policies:
```sql
CREATE OR REPLACE FUNCTION is_admin_user() RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.jwt() ->> 'email') IN (
        'yaneyba@finderhubs.com'
        -- Add more admin emails here as needed
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. RLS Policies

Example admin policy:
```sql
CREATE POLICY "Admins can manage business submissions" ON business_submissions
FOR ALL TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());
```

## Adding New Admins

### Step 1: Create User in Supabase Auth
```bash
# Via Supabase dashboard or API
# User will be created in auth.users automatically
```

### Step 2: Add Email to Application Code
Update `src/lib/auth.ts`:
```typescript
const adminEmails = [
  'yaneyba@finderhubs.com',
  'new-admin@example.com'  // Add new admin email
];
```

### Step 3: Update Database Function (Optional)
If using different emails in database vs code:
```sql
CREATE OR REPLACE FUNCTION is_admin_user() RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.jwt() ->> 'email') IN (
        'yaneyba@finderhubs.com',
        'new-admin@example.com'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Important**: No `business_profiles` entry needed for admins!

## Admin vs Business User Access

### Admin Capabilities
- View/approve business submissions
- Manage admin settings
- Access all business data
- Platform-level management

### Business User Capabilities  
- Manage own business profile
- Submit business information
- View subscription status
- Business-specific features

## Troubleshooting

### Login Timeouts
Usually caused by RLS policy issues:
1. Check admin email in `is_admin_user()` function
2. Verify RLS policies allow admin access
3. Use SQL files in `supabase/sqls/` for fixes

### Admin Not Recognized
1. Verify email in `adminEmails` array in code
2. Check email matches exactly (case-sensitive)
3. Ensure user exists in `auth.users`

### Business Profile Errors for Admins
Admins should NOT have `business_profiles` entries:
```sql
-- Remove incorrect admin business profiles
DELETE FROM business_profiles WHERE role = 'admin';
```

## Database Schema Integration

### Tables Admin Has Access To
- `business_submissions` (full access)
- `admin_settings` (full access)
- `business_profiles` (read access for approval workflow)

### Tables Admin Does NOT Need
- `business_profiles` entry for themselves
- Subscription-related tables (business-specific)

## Security Considerations

1. **Email Verification**: Ensure admin emails are verified
2. **Access Control**: Admin detection is fail-safe (defaults to false)
3. **Audit Trail**: All admin actions should be logged
4. **Principle of Least Privilege**: Admins only get necessary permissions

## Migration from Business-Profile Based Admins

If you previously had admins with `business_profiles`:

1. **Backup admin data** (if any business-specific info needed)
2. **Apply email-only approach** using `supabase/sqls/admin-email-only-approach.sql`
3. **Remove admin business profiles** (done automatically by SQL script)
4. **Update code** to use email-based detection
5. **Test admin access** thoroughly

## Related Documentation

- `supabase/sqls/README.md` - SQL implementation files
- `docs/ADMIN-RECORD-STRATEGY.md` - Strategy decisions
- `docs/ADMIN-VS-BUSINESS-ARCHITECTURE-FIX.md` - Architecture fixes
- `docs/ARCHITECTURE.md` - Overall system architecture
