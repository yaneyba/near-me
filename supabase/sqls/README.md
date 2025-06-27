# Supabase SQL Files

This directory contains SQL files for database fixes and admin management.

## Files Overview

### Production Reference

#### `production-ddl-reference.sql`
- **Purpose**: Complete production database schema reference
- **Use**: Reference for schema alignment and understanding current production structure
- **Features**:
  - All tables, indexes, policies, and functions from production
  - Authoritative source for database structure
  - Used for migration planning and schema validation

### Admin Management

#### `admin-email-only-approach.sql` ⭐ **RECOMMENDED**
- **Purpose**: Implements clean email-only admin detection
- **Use**: Apply this for the recommended admin architecture
- **Features**: 
  - Admins stored only in `auth.users`
  - Email-based detection (no database lookups)
  - Removes incorrect admin business_profiles entries
  - Clean separation: admins ≠ businesses

#### `admin-rls-policies-fix.sql` 
- **Purpose**: Comprehensive admin RLS policy fixes
- **Use**: If you need more detailed policy updates
- **Features**:
  - Updates all admin-related RLS policies
  - Fixes business_submissions, admin_settings, businesses table access
  - Email-based admin detection

#### `login-timeout-fix.sql`
- **Purpose**: Quick fix for immediate login timeout issues
- **Use**: Emergency fix if login is completely broken
- **Features**:
  - Fixes admin email detection
  - Adds missing business_profiles RLS policies
  - Temporary debugging access (remove in production)

## Usage Instructions

### For New Setup (Recommended)
```sql
-- Apply the clean email-only approach
\i admin-email-only-approach.sql
```

### For Emergency Login Fix
```sql
-- If login is completely broken
\i login-timeout-fix.sql
```

### For Comprehensive Policy Update
```sql
-- If you need detailed RLS policy fixes
\i admin-rls-policies-fix.sql
```

## Admin Architecture

For detailed admin implementation documentation, see:
**📖 [Admin Implementation Guide](../../docs/ADMIN-IMPLEMENTATION-GUIDE.md)**

### Quick Reference
- **Recommended approach**: Email-only admin detection
- **Admin storage**: Only in `auth.users` (no business_profiles needed)
- **Detection method**: Hardcoded email list in code + SQL function
- **Clean separation**: Admins ≠ businesses

### 🔧 Adding New Admins

1. **Create user in Supabase Auth** (via dashboard or script)
2. **Add email to admin list** in `src/lib/auth.ts`
3. **Update database function** (if different from code)

No business_profiles entry needed for admins!

## File Relationships

```
production-ddl-reference.sql            ← Production schema reference
│
admin-email-only-approach.sql           ← Use this (cleanest approach)
├── Replaces admin-rls-policies-fix.sql
└── Supersedes login-timeout-fix.sql
```

## Related Documentation

- **📖 [Admin Implementation Guide](../../docs/ADMIN-IMPLEMENTATION-GUIDE.md)** - Complete admin architecture
- **📖 [Admin Record Strategy](../../docs/ADMIN-RECORD-STRATEGY.md)** - Strategy decisions  
- **📖 [Architecture Fixes](../../docs/ADMIN-VS-BUSINESS-ARCHITECTURE-FIX.md)** - Architecture fixes

## Notes

- All files implement email-based admin detection
- `admin-email-only-approach.sql` is the most refined version
- Remove any existing admin business_profiles entries (they're incorrect)
- Admins are platform managers, not businesses on the platform
