# Edge Functions Supabase Client Consolidation ✅ DEPRECATED

## ⚠️ **This Documentation is Outdated**

**This approach has been replaced with a cleaner solution. See [SUPABASE-DUPLICATION-CLEANUP.md](./SUPABASE-DUPLICATION-CLEANUP.md) for the current architecture.**

## What Changed

The complex shared service approach described in this document created unnecessary duplication with the frontend SupabaseDataProvider. Instead, we now use:

- **Frontend**: SupabaseDataProvider (single source of truth for business logic)
- **Edge Functions**: Direct Supabase calls with simple client factory

## Current Architecture

```
Frontend: SupabaseDataProvider (complex business logic)
Edge Functions: getSupabaseClient() + direct calls (simple operations)
```

---

## Original Documentation (For Reference)

All Supabase Edge Functions have been refactored to use a single, shared Supabase service instead of direct `createClient` calls. This consolidation provides better maintainability, consistency, and error handling across all serverless functions.

## Changes Made

### 1. Enhanced Shared Service (`_shared/supabase-service.ts`)

Extended the `EdgeSupabaseService` class with comprehensive methods for all Edge Function operations:

- `getBusinessProfileByUserId()` - Get business profile by user ID
- `getStripeCustomer()` - Get Stripe customer by business profile ID
- `createStripeCustomer()` - Create new Stripe customer mapping
- `createStripeSubscription()` - Create subscription record
- `getStripeSubscription()` - Get subscription by customer ID
- `createStripeOrder()` - Create order record
- `updateBusinessProfileByStripeCustomer()` - Update profile by Stripe customer ID
- `getUserFromToken()` - Get user from auth token

### 2. Refactored Edge Functions

All Edge Functions now use the shared service exclusively:

#### `create-checkout/index.ts` ✅
- Already using shared service correctly

#### `stripe-checkout/index.ts` ✅
- Removed direct `createClient` usage
- All database operations now go through `supabaseService`
- Improved error handling with consistent return patterns

#### `stripe-webhook/index.ts` ✅  
- Removed direct `createClient` usage
- All database operations now go through `supabaseService`
- Subscription sync logic updated to use shared service methods

#### `webhook/index.ts` ✅
- Removed direct `createClient` usage
- All database operations now go through `supabaseService`
- Webhook event handling updated to use shared service methods

## Benefits

1. **Single Point of Configuration**: All Supabase client configuration is centralized in the shared service
2. **Consistent Error Handling**: Standardized error patterns across all functions
3. **Better Maintainability**: Changes to database logic only need to be made in one place
4. **Type Safety**: Improved TypeScript types and interfaces
5. **Environment Validation**: Centralized environment variable validation
6. **Reduced Code Duplication**: Common database operations are reused across functions

## Usage Pattern

```typescript
import { getSupabaseService } from '../_shared/supabase-service.ts';

const supabaseService = getSupabaseService();

// Use service methods instead of direct Supabase calls
const { data, error } = await supabaseService.getBusinessProfile(id);
```

## Files Modified

- `/supabase/functions/_shared/supabase-service.ts` - Extended with new methods
- `/supabase/functions/stripe-checkout/index.ts` - Refactored to use shared service
- `/supabase/functions/stripe-webhook/index.ts` - Refactored to use shared service  
- `/supabase/functions/webhook/index.ts` - Refactored to use shared service

## Next Steps

- Monitor Edge Function performance and error rates
- Consider adding more advanced logging and monitoring
- Add unit tests for the shared service methods
- Consider adding database transaction support for complex operations
