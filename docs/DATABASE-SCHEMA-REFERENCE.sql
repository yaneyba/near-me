-- Complete Database Schema Reference
-- This is the actual DDL from the production database
-- Use this as the authoritative source for table structures and relationships

-- ENUMS
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE stripe_subscription_status AS ENUM ('not_started', 'incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');
CREATE TYPE stripe_order_status AS ENUM ('pending', 'completed', 'canceled');

-- MAIN TABLES

-- Business submissions (registration requests)
CREATE TABLE business_submissions (
    id             uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    business_name  text NOT NULL,
    owner_name     text NOT NULL,
    email          text NOT NULL,
    phone          text NOT NULL,
    address        text NOT NULL,
    city           text NOT NULL,
    state          text NOT NULL,
    zip_code       text NOT NULL,
    category       text NOT NULL,
    website        text,
    description    text,
    services       text[] DEFAULT '{}'::text[],
    hours          jsonb,
    status         submission_status DEFAULT 'pending'::submission_status,
    submitted_at   timestamp with time zone DEFAULT now(),
    reviewed_at    timestamp with time zone,
    reviewer_notes text,
    site_id        text NOT NULL,
    created_at     timestamp with time zone DEFAULT now(),
    updated_at     timestamp with time zone DEFAULT now()
);

-- Business profiles (approved registrations with auth users)
CREATE TABLE business_profiles (
    id                     uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id                uuid NOT NULL REFERENCES auth.users(),
    business_id            text,
    business_name          text NOT NULL,
    email                  text NOT NULL,
    role                   text DEFAULT 'owner'::text NOT NULL,
    created_at             timestamp with time zone DEFAULT now(),
    updated_at             timestamp with time zone DEFAULT now(),
    stripe_customer_id     text,
    stripe_subscription_id text,
    stripe_price_id        text,
    premium                boolean DEFAULT false
);

-- Approved businesses (public listings)
CREATE TABLE businesses (
    id           uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    business_id  text NOT NULL UNIQUE,
    name         text NOT NULL,
    description  text,
    address      text NOT NULL,
    phone        text,
    website      text,
    email        text,
    rating       numeric(3, 2),
    review_count integer DEFAULT 0,
    category     text NOT NULL REFERENCES categories (name),
    city         text NOT NULL,
    state        text NOT NULL,
    services     text[] DEFAULT '{}'::text[],
    verified     boolean DEFAULT false,
    hours        jsonb,
    image        text,
    established  integer,
    site_id      text DEFAULT 'near-me-us'::text NOT NULL,
    status       text DEFAULT 'active'::text,
    created_at   timestamp with time zone DEFAULT now(),
    updated_at   timestamp with time zone DEFAULT now(),
    premium      boolean DEFAULT false
);

-- Stripe integration tables
CREATE TABLE stripe_customers (
    id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id             uuid NOT NULL UNIQUE REFERENCES auth.users(),
    customer_id         text NOT NULL UNIQUE,
    created_at          timestamp with time zone DEFAULT now(),
    updated_at          timestamp with time zone DEFAULT now(),
    deleted_at          timestamp with time zone,
    business_profile_id uuid REFERENCES business_profiles
);

CREATE TABLE stripe_subscriptions (
    id                   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id          text NOT NULL UNIQUE,
    subscription_id      text,
    price_id             text,
    current_period_start bigint,
    current_period_end   bigint,
    cancel_at_period_end boolean DEFAULT false,
    payment_method_brand text,
    payment_method_last4 text,
    status               stripe_subscription_status NOT NULL,
    created_at           timestamp with time zone DEFAULT now(),
    updated_at           timestamp with time zone DEFAULT now(),
    deleted_at           timestamp with time zone
);

CREATE TABLE stripe_orders (
    id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    checkout_session_id text NOT NULL,
    payment_intent_id   text NOT NULL,
    customer_id         text NOT NULL,
    amount_subtotal     bigint NOT NULL,
    amount_total        bigint NOT NULL,
    currency            text NOT NULL,
    payment_status      text NOT NULL,
    status              stripe_order_status DEFAULT 'pending'::stripe_order_status NOT NULL,
    created_at          timestamp with time zone DEFAULT now(),
    updated_at          timestamp with time zone DEFAULT now(),
    deleted_at          timestamp with time zone
);

-- Other supporting tables
CREATE TABLE categories (
    id                 uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name               text NOT NULL UNIQUE,
    display_name       text NOT NULL,
    description        text,
    common_services    text[] DEFAULT '{}'::text[],
    related_categories text[] DEFAULT '{}'::text[],
    created_at         timestamp with time zone DEFAULT now(),
    updated_at         timestamp with time zone DEFAULT now()
);

CREATE TABLE cities (
    id            uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name          text NOT NULL,
    state         text NOT NULL,
    state_abbr    text NOT NULL,
    population    integer,
    neighborhoods text[] DEFAULT '{}'::text[],
    zip_codes     text[] DEFAULT '{}'::text[],
    created_at    timestamp with time zone DEFAULT now(),
    updated_at    timestamp with time zone DEFAULT now(),
    UNIQUE (name, state)
);

CREATE TABLE contact_messages (
    id          uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name        text NOT NULL,
    email       text NOT NULL,
    subject     text NOT NULL,
    message     text NOT NULL,
    category    text,
    city        text,
    status      text DEFAULT 'new'::text,
    admin_notes text,
    resolved_at timestamp with time zone,
    resolved_by text,
    created_at  timestamp with time zone DEFAULT now(),
    updated_at  timestamp with time zone DEFAULT now()
);

CREATE TABLE user_engagement_events (
    id              uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    business_id     text NOT NULL,
    business_name   text NOT NULL,
    event_type      text NOT NULL,
    event_data      jsonb DEFAULT '{}'::jsonb,
    timestamp       timestamp with time zone DEFAULT now() NOT NULL,
    ip_address      text,
    user_session_id text NOT NULL,
    created_at      timestamp with time zone DEFAULT now()
);

CREATE TABLE admin_settings (
    id          uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    key         text NOT NULL UNIQUE,
    value       jsonb NOT NULL,
    description text,
    created_at  timestamp with time zone DEFAULT now(),
    updated_at  timestamp with time zone DEFAULT now(),
    updated_by  uuid REFERENCES auth.users()
);

-- VIEWS
CREATE VIEW stripe_user_subscriptions AS
SELECT c.customer_id,
       s.subscription_id,
       s.status AS subscription_status,
       s.price_id,
       s.current_period_start,
       s.current_period_end,
       s.cancel_at_period_end,
       s.payment_method_brand,
       s.payment_method_last4
FROM stripe_customers c
LEFT JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
WHERE (c.user_id = auth.uid() OR (c.business_profile_id IN (
    SELECT business_profiles.id
    FROM business_profiles
    WHERE business_profiles.user_id = auth.uid()
)))
AND c.deleted_at IS NULL
AND s.deleted_at IS NULL;

CREATE VIEW stripe_user_orders AS
SELECT c.customer_id,
       o.id AS order_id,
       o.checkout_session_id,
       o.payment_intent_id,
       o.amount_subtotal,
       o.amount_total,
       o.currency,
       o.payment_status,
       o.status AS order_status,
       o.created_at AS order_date
FROM stripe_customers c
LEFT JOIN stripe_orders o ON c.customer_id = o.customer_id
WHERE (c.user_id = auth.uid() OR (c.business_profile_id IN (
    SELECT business_profiles.id
    FROM business_profiles
    WHERE business_profiles.user_id = auth.uid()
)))
AND c.deleted_at IS NULL
AND o.deleted_at IS NULL;

-- KEY BUSINESS LOGIC:
-- 1. Users submit business applications via business_submissions table
-- 2. Admin reviews and approves/rejects submissions
-- 3. Approved submissions create:
--    - Auth user account
--    - business_profiles record (linked to auth user)
--    - businesses record (public listing)
-- 4. Business owner can login and access dashboard via business_profiles
-- 5. Only business_profiles with role='owner' can manage subscriptions
-- 6. Stripe integration uses separate stripe_* tables
-- 7. Premium status managed in both business_profiles and businesses tables
