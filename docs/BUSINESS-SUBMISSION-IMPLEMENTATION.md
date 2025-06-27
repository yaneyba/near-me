# Business Submission Workflow Implementation

## Overview
The business submission workflow has been implemented to allow businesses to register and be reviewed by admins before appearing in the directory. This aligns with the production schema and provides a complete approval workflow.

## Key Components Implemented

### 1. Database Schema
- **business_submissions table**: Stores pending business registrations
- **Enhanced business_profiles table**: Added approval fields and subscription tracking
- **admin_settings table**: Stores feature flags and configuration
- **Migration file**: `20250627200000_align_with_production_schema.sql`

### 2. Frontend Components

#### Business Submission Form (`BusinessSubmissionForm.tsx`)
- Complete business registration form
- Validates required fields
- Submits to `business_submissions` table
- Shows success/error states

#### Add Business Page (`AddBusinessSubmissionPage.tsx`)
- Public page for business registration
- Explains the approval process
- Uses the submission form component

#### Admin Dashboard Updates (`AdminDashboardPage.tsx`)
- **Real Database Integration**: Replaced mock data with actual database queries
- **Submission Management**: View, approve, and reject business submissions
- **Automatic Business Creation**: When approved, creates entry in `businesses` table
- **Enhanced Statistics**: Real-time stats from database

### 3. Enhanced Authentication System

#### Updated AuthUser Type
- Added premium status tracking
- Added Stripe subscription fields
- Added approval status checking

#### Helper Functions
- `isUserApproved()`: Check if business is approved
- `isUserPremium()`: Check premium subscription status
- `canUserSubscribe()`: Check if user can subscribe (must be approved)

### 4. Updated Stripe Integration
- Only approved businesses can subscribe
- Premium status synced to `business_profiles` table
- Webhook updates subscription status

## Workflow Process

### 1. Business Registration
1. Business owner visits `/add-business` page
2. Fills out submission form
3. Submission stored with `status: 'pending'`
4. Admin receives notification (webhook ready)

### 2. Admin Review
1. Admin logs into dashboard at `/admin`
2. Views pending submissions in "Businesses" tab
3. Can approve or reject with notes
4. Approved submissions automatically create business entries

### 3. Business Approval
1. Status updated to `approved` in database
2. Business entry created in `businesses` table
3. Business appears in public directory
4. Owner can now register for account and manage listing

### 4. Subscription Management
1. Only approved business owners can subscribe
2. Subscription status synced to `business_profiles`
3. Premium features unlocked based on approval + subscription

## Database Tables

### business_submissions
- Stores registration forms
- Tracks approval status
- Contains all business details for review

### business_profiles  
- User accounts for business owners
- Links to Stripe for subscriptions
- Approval status for access control

### businesses
- Public business directory entries
- Created automatically when submissions approved
- Used for search and display

## Access Control

### Public Access
- View business directory
- Submit business registration
- Contact forms

### Business Owner Access
- Must be approved to access dashboard
- Can only subscribe if approved
- Manage own business listing

### Admin Access
- View all submissions and manage approvals
- Access admin dashboard
- Manage system settings

## Files Modified/Created

### New Files
- `src/components/BusinessSubmissionForm.tsx`
- `src/pages/AddBusinessSubmissionPage.tsx`
- `supabase/migrations/20250627200000_align_with_production_schema.sql`
- `docs/PRODUCTION-DDL-REFERENCE.sql`
- `scripts/add-sample-submissions.js`

### Modified Files
- `src/lib/auth.ts` - Enhanced AuthUser type and approval checking
- `src/pages/AdminDashboardPage.tsx` - Real database integration
- `src/lib/stripe.ts` - Approval status checking for subscriptions

## Environment Variables Required
All existing environment variables remain the same. The system uses the existing Supabase configuration.

## Testing the Implementation

1. **Start the development server**: `npm run dev`
2. **Visit the admin dashboard**: Navigate to `/admin` (requires admin user)
3. **Add sample submissions**: Use the script in `scripts/add-sample-submissions.js`
4. **Test approval workflow**: Approve/reject submissions in admin dashboard
5. **Check business directory**: Verify approved businesses appear in search

## Production Deployment Notes

1. **Run migrations**: Apply the new migration to add required tables
2. **Admin user setup**: Ensure at least one admin user exists in `business_profiles`
3. **Webhook configuration**: Set up webhooks for notifications (optional)
4. **Feature flags**: Configure default settings in `admin_settings` table

## Next Steps (Optional Enhancements)

1. **Email notifications**: Notify business owners of approval/rejection
2. **Advanced approval workflow**: Multi-step approval process
3. **Business verification**: Document upload and verification
4. **Enhanced admin tools**: Bulk actions, filtering, advanced search
5. **User invitation system**: Auto-invite approved businesses to create accounts

The implementation provides a complete business submission and approval workflow that aligns with the production schema while maintaining the existing functionality of the application.
