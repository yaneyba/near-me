# Supabase Setup and Deployment Guide

## Current Issues and Solutions

### 1. Service Role Key Issue
Your current service role key appears to have a typo in the JWT payload. You need to get a fresh service role key from your Supabase dashboard.

**Steps to fix:**
1. Go to https://supabase.com/dashboard/project/jeofyinldjyuouppgxhi/settings/api
2. Copy the **service_role** key (not the anon key)
3. Replace the value of `VITE_SUPABASE_SERVICE_ROLE_KEY` in your `.env` file

### 2. Database Schema Setup
Since CLI auth is having issues, you can manually run the migration in your Supabase SQL Editor:

**Option A: Manual SQL Editor (Recommended)**
1. Go to https://supabase.com/dashboard/project/jeofyinldjyuouppgxhi/sql/new
2. Copy and paste the contents of `docs/MANUAL-MIGRATION.sql`
3. Run the SQL to create all necessary tables and indexes

**Option B: Using the migration file**
1. If you can get CLI auth working, run: `npx supabase db push`

### 3. Edge Functions Deployment

Since CLI auth is having issues, you have two options:

**Option A: Manual Function Deployment via Dashboard**
1. Go to https://supabase.com/dashboard/project/jeofyinldjyuouppgxhi/functions
2. Create a new function called `stripe-webhook`
3. Copy the contents of `supabase/functions/stripe-webhook/index.ts`
4. Set the following environment variables in the function settings:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret
   - `SUPABASE_URL`: https://jeofyinldjyuouppgxhi.supabase.co
   - `SUPABASE_SERVICE_ROLE_KEY`: Your corrected service role key

**Option B: Fix CLI Auth First**
1. Try logging out and back in: `npx supabase logout && npx supabase login`
2. If that fails, try creating a new access token in your Supabase dashboard
3. Then run: `npx supabase functions deploy stripe-webhook`

### 4. Testing Your Setup

After deploying the function, test it with:

```bash
# Test the connection
npm run test:supabase

# Check if tables exist
npm run check:schema
```

### 5. Stripe Webhook Configuration

1. In your Stripe dashboard, go to Webhooks
2. Add endpoint: `https://jeofyinldjyuouppgxhi.supabase.co/functions/v1/stripe-webhook`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 6. Environment Variables Checklist

Make sure all these are set correctly in your `.env`:

```env
# Supabase (get fresh keys from dashboard)
VITE_SUPABASE_URL=https://jeofyinldjyuouppgxhi.supabase.co
VITE_SUPABASE_ANON_KEY=<fresh_anon_key>
VITE_SUPABASE_SERVICE_ROLE_KEY=<fresh_service_role_key>

# Stripe (from your Stripe dashboard)
VITE_STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>
STRIPE_SECRET_KEY=<your_stripe_secret_key>
STRIPE_WEBHOOK_SECRET=<your_webhook_signing_secret>
```

## Quick Fix Commands

```bash
# Test if Supabase connection works
npm run test:supabase

# Add sample data for testing
npm run add:samples

# Start development server
npm run dev
```

## Manual Migration SQL

If you need to run the migration manually, use the SQL in `docs/MANUAL-MIGRATION.sql` in your Supabase SQL Editor.
