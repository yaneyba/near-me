-- PRODUCTION DATABASE DDL REFERENCE
-- This is the actual production DDL extracted from the live database
-- Use this as the authoritative reference for schema alignment
-- Generated: June 27, 2025
-- Updated: June 27, 2025 - Fixed all storage parameters, foreign keys, and admin policies

-- ========================================
-- ADMIN FUNCTIONS
-- ========================================

-- Email-only admin detection function
CREATE OR REPLACE FUNCTION is_admin_user() RETURNS BOOLEAN AS $$
BEGIN
    -- Admins detected purely by email - no database table lookups needed
    RETURN (auth.jwt() ->> 'email') IN (
        'yaneyba@finderhubs.com'
        -- Add more admin emails here as needed
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION is_admin_user() IS 'Email-only admin detection - admins exist only in auth.users, not business_profiles';

-- ========================================
-- ENUMS
-- ========================================

create type submission_status as enum ('pending', 'approved', 'rejected');

alter type submission_status owner to postgres;

create type stripe_subscription_status as enum ('not_started', 'incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');

alter type stripe_subscription_status owner to postgres;

create type stripe_order_status as enum ('pending', 'completed', 'canceled');

alter type stripe_order_status owner to postgres;

create table business_submissions
(
    id             uuid                     default gen_random_uuid() not null
        primary key,
    business_name  text                                               not null,
    owner_name     text                                               not null,
    email          text                                               not null,
    phone          text                                               not null,
    address        text                                               not null,
    city           text                                               not null,
    state          text                                               not null,
    zip_code       text                                               not null,
    category       text                                               not null,
    website        text,
    description    text,
    services       text[]                   default '{}'::text[],
    hours          jsonb,
    status         submission_status        default 'pending'::submission_status,
    submitted_at   timestamp with time zone default now(),
    reviewed_at    timestamp with time zone,
    reviewer_notes text,
    site_id        text                                               not null,
    created_at     timestamp with time zone default now(),
    updated_at     timestamp with time zone default now()
)
    using heap;

alter table business_submissions
    owner to postgres;

create index idx_business_submissions_status
    on business_submissions using btree (status);

create index idx_business_submissions_site_id
    on business_submissions using btree (site_id);

create index idx_business_submissions_submitted_at
    on business_submissions using btree (submitted_at desc);

create index idx_business_submissions_email
    on business_submissions using btree (email);

create policy "Authenticated users can insert submissions" on business_submissions
    as permissive
    for insert
    to authenticated
    with check true;

create policy "Users can view their own submissions" on business_submissions
    as permissive
    for select
    to authenticated
    using (email = (auth.jwt() ->> 'email'::text));

create policy "Email-based admins can select all submissions" on business_submissions
    as permissive
    for select
    to authenticated
    using (is_admin_user());

create policy "Email-based admins can update all submissions" on business_submissions
    as permissive
    for update
    to authenticated
    using (is_admin_user());

create policy "Email-based admins can insert submissions" on business_submissions
    as permissive
    for insert
    to authenticated
    with check (is_admin_user());

create policy "Anon can insert" on business_submissions
    as permissive
    for insert
    to anon
    with check true;

create policy "Authenticator can insert" on business_submissions
    as permissive
    for insert
    to authenticator
    with check true;

create policy "Public can insert" on business_submissions
    as permissive
    for insert
    with check true;

grant delete, insert, references, select, trigger, truncate, update on business_submissions to public;

grant insert on business_submissions to supabase_admin;

grant delete, insert, references, select, trigger, truncate, update on business_submissions to anon;

grant delete, insert, references, select, trigger, truncate, update on business_submissions to authenticated;

grant delete, insert, references, select, trigger, truncate, update on business_submissions to service_role;

grant insert, select on business_submissions to authenticator;

create table categories
(
    id                 uuid                     default gen_random_uuid() not null
        primary key,
    name               text                                               not null
        unique,
    display_name       text                                               not null,
    description        text,
    common_services    text[]                   default '{}'::text[],
    related_categories text[]                   default '{}'::text[],
    created_at         timestamp with time zone default now(),
    updated_at         timestamp with time zone default now()
)
    using heap;

alter table categories
    owner to postgres;

create index idx_categories_name
    on categories using btree (name);

create policy "Anyone can read categories" on categories
    as permissive
    for select
    to anon, authenticated
    using true;

create policy "Admins can manage categories" on categories
    as permissive
    for all
    to authenticated
    using (is_admin_user());

grant delete, insert, references, select, trigger, truncate, update on categories to anon;

grant delete, insert, references, select, trigger, truncate, update on categories to authenticated;

grant delete, insert, references, select, trigger, truncate, update on categories to service_role;

create table cities
(
    id            uuid                     default gen_random_uuid() not null
        primary key,
    name          text                                               not null,
    state         text                                               not null,
    state_abbr    text                                               not null,
    population    integer,
    neighborhoods text[]                   default '{}'::text[],
    zip_codes     text[]                   default '{}'::text[],
    created_at    timestamp with time zone default now(),
    updated_at    timestamp with time zone default now(),
    unique (name, state)
)
    using heap;

alter table cities
    owner to postgres;

create index idx_cities_name_state
    on cities using btree (name, state);

create index idx_cities_state
    on cities using btree (state);

create policy "Anyone can read cities" on cities
    as permissive
    for select
    to anon, authenticated
    using true;

create policy "Admins can manage cities" on cities
    as permissive
    for all
    to authenticated
    using (is_admin_user());

grant delete, insert, references, select, trigger, truncate, update on cities to anon;

grant delete, insert, references, select, trigger, truncate, update on cities to authenticated;

grant delete, insert, references, select, trigger, truncate, update on cities to service_role;

create table businesses
(
    id           uuid                     default gen_random_uuid()  not null
        primary key,
    business_id  text                                                not null
        unique,
    name         text                                                not null,
    description  text,
    address      text                                                not null,
    phone        text,
    website      text,
    email        text,
    rating       numeric(3, 2),
    review_count integer                  default 0,
    category     text                                                not null
        references categories (name),
    city         text                                                not null,
    state        text                                                not null,
    services     text[]                   default '{}'::text[],
    verified     boolean                  default false,
    hours        jsonb,
    image        text,
    established  integer,
    site_id      text                     default 'near-me-us'::text not null,
    status       text                     default 'active'::text,
    created_at   timestamp with time zone default now(),
    updated_at   timestamp with time zone default now(),
    premium      boolean                  default false
)
    using heap;

alter table businesses
    owner to postgres;

create index idx_businesses_business_id
    on businesses using btree (business_id);

create index idx_businesses_category
    on businesses using btree (category);

create index idx_businesses_city_state
    on businesses using btree (city, state);

create index idx_businesses_site_id
    on businesses using btree (site_id);

create index idx_businesses_status
    on businesses using btree (status);

create index idx_businesses_rating
    on businesses using btree (rating desc);

create index idx_businesses_verified
    on businesses using btree (verified);

create policy "Anyone can read active businesses" on businesses
    as permissive
    for select
    to anon, authenticated
    using (status = 'active'::text);

create policy "Admins can manage all businesses" on businesses
    as permissive
    for all
    to authenticated
    using (is_admin_user());

grant delete, insert, references, select, trigger, truncate, update on businesses to anon;

grant delete, insert, references, select, trigger, truncate, update on businesses to authenticated;

grant delete, insert, references, select, trigger, truncate, update on businesses to service_role;

create table contact_messages
(
    id          uuid                     default gen_random_uuid() not null
        primary key,
    name        text                                               not null,
    email       text                                               not null,
    subject     text                                               not null,
    message     text                                               not null,
    category    text,
    city        text,
    status      text                     default 'new'::text,
    admin_notes text,
    resolved_at timestamp with time zone,
    resolved_by text,
    created_at  timestamp with time zone default now(),
    updated_at  timestamp with time zone default now()
)
    using heap;

comment on table contact_messages is 'Stores contact form submissions from users';

comment on column contact_messages.category is 'Business category context when message was sent';

comment on column contact_messages.city is 'City context when message was sent';

comment on column contact_messages.status is 'Message status: new, in_progress, resolved';

comment on column contact_messages.admin_notes is 'Internal notes for admin use';

comment on column contact_messages.resolved_by is 'Admin user who resolved the message';

alter table contact_messages
    owner to postgres;

create index idx_contact_messages_email
    on contact_messages using btree (email);

create index idx_contact_messages_status
    on contact_messages using btree (status);

create index idx_contact_messages_category
    on contact_messages using btree (category);

create index idx_contact_messages_created_at
    on contact_messages using btree (created_at desc);

create policy "Anonymous users can submit contact messages" on contact_messages
    as permissive
    for insert
    to anon
    with check true;

create policy "Admins can read all contact messages" on contact_messages
    as permissive
    for select
    to authenticated
    using (is_admin_user());

create policy "Admins can update contact messages" on contact_messages
    as permissive
    for update
    to authenticated
    using (is_admin_user());

grant delete, insert, references, select, trigger, truncate, update on contact_messages to anon;

grant delete, insert, references, select, trigger, truncate, update on contact_messages to authenticated;

grant delete, insert, references, select, trigger, truncate, update on contact_messages to service_role;

create table debug_log
(
    id         serial
        primary key,
    message    text,
    created_at timestamp default now()
)
    using heap;

alter table debug_log
    owner to postgres;

grant select, update, usage on sequence debug_log_id_seq to anon;

grant select, update, usage on sequence debug_log_id_seq to authenticated;

grant select, update, usage on sequence debug_log_id_seq to service_role;

create policy select_policy on debug_log
    as permissive
    for select
    using (auth.uid() IS NOT NULL);

create policy insert_policy on debug_log
    as permissive
    for insert
    with check (auth.uid() IS NOT NULL);

create policy update_policy on debug_log
    as permissive
    for update
    using (auth.uid() IS NOT NULL);

create policy delete_policy on debug_log
    as permissive
    for delete
    using (auth.uid() IS NOT NULL);

grant delete, insert, references, select, trigger, truncate, update on debug_log to anon;

grant delete, insert, references, select, trigger, truncate, update on debug_log to authenticated;

grant delete, insert, references, select, trigger, truncate, update on debug_log to service_role;

create table user_engagement_events
(
    id              uuid                     default gen_random_uuid() not null
        primary key,
    business_id     text                                               not null,
    business_name   text                                               not null,
    event_type      text                                               not null,
    event_data      jsonb                    default '{}'::jsonb,
    timestamp       timestamp with time zone default now()             not null,
    ip_address      text,
    user_session_id text                                               not null,
    created_at      timestamp with time zone default now()
)
    using heap;

alter table user_engagement_events
    owner to postgres;

create index idx_user_engagement_events_business_id
    on user_engagement_events using btree (business_id);

create index idx_user_engagement_events_timestamp
    on user_engagement_events using btree (timestamp desc);

create index idx_user_engagement_events_event_type
    on user_engagement_events using btree (event_type);

create index idx_user_engagement_events_session_id
    on user_engagement_events using btree (user_session_id);

create index idx_user_engagement_events_business_timestamp
    on user_engagement_events using btree (business_id asc, timestamp desc);

create policy "Allow anonymous insert for user engagement events" on user_engagement_events
    as permissive
    for insert
    with check true;

create policy "Allow authenticated users to read engagement events" on user_engagement_events
    as permissive
    for select
    to authenticated
    using true;

grant delete, insert, references, select, trigger, truncate, update on user_engagement_events to anon;

grant delete, insert, references, select, trigger, truncate, update on user_engagement_events to authenticated;

grant delete, insert, references, select, trigger, truncate, update on user_engagement_events to service_role;

create table business_profiles
(
    id                     uuid                     default gen_random_uuid() not null
        primary key,
    user_id                uuid                                               not null
        references auth.users (id),
    business_id            text,
    business_name          text                                               not null,
    email                  text                                               not null,
    role                   text                     default 'owner'::text     not null,
    created_at             timestamp with time zone default now(),
    updated_at             timestamp with time zone default now(),
    stripe_customer_id     text,
    stripe_subscription_id text,
    stripe_price_id        text,
    premium                boolean                  default false
)
    using heap;

alter table business_profiles
    owner to postgres;

create index idx_business_profiles_user_id
    on business_profiles using btree (user_id);

create index idx_business_profiles_stripe_customer_id
    on business_profiles using btree (stripe_customer_id);

create index idx_business_profiles_stripe_subscription_id
    on business_profiles using btree (stripe_subscription_id);

create index idx_business_profiles_premium
    on business_profiles using btree (premium);

create policy "Users can read own profile" on business_profiles
    as permissive
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can update own profile" on business_profiles
    as permissive
    for update
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert own profile" on business_profiles
    as permissive
    for insert
    to authenticated
    with check (auth.uid() = user_id);

grant delete, insert, references, select, trigger, truncate, update on business_profiles to anon;

grant delete, insert, references, select, trigger, truncate, update on business_profiles to authenticated;

grant delete, insert, references, select, trigger, truncate, update on business_profiles to service_role;

create table admin_settings
(
    id          uuid                     default gen_random_uuid() not null
        primary key,
    key         text                                               not null
        unique,
    value       jsonb                                              not null,
    description text,
    created_at  timestamp with time zone default now(),
    updated_at  timestamp with time zone default now(),
    updated_by  uuid
        references auth.users (id)
)
    using heap;

alter table admin_settings
    owner to postgres;

create policy "Admin users can read all settings" on admin_settings
    as permissive
    for select
    to authenticated
    using (is_admin_user());

create policy "Admin users can update settings" on admin_settings
    as permissive
    for update
    to authenticated
    using (is_admin_user());

create policy "Admin users can insert settings" on admin_settings
    as permissive
    for insert
    to authenticated
    with check (is_admin_user());

create policy "All users can read public settings" on admin_settings
    as permissive
    for select
    to authenticated
    using (key = ANY (ARRAY ['login_enabled'::text, 'tracking_enabled'::text]));

grant delete, insert, references, select, trigger, truncate, update on admin_settings to anon;

grant delete, insert, references, select, trigger, truncate, update on admin_settings to authenticated;

grant delete, insert, references, select, trigger, truncate, update on admin_settings to service_role;

create table stripe_customers
(
    id                  bigint generated always as identity
        primary key,
    user_id             uuid not null
        unique
        references auth.users (id),
    customer_id         text not null
        unique,
    created_at          timestamp with time zone default now(),
    updated_at          timestamp with time zone default now(),
    deleted_at          timestamp with time zone,
    business_profile_id uuid
        references business_profiles
)
    using heap;

alter table stripe_customers
    owner to postgres;

grant select, update, usage on sequence stripe_customers_id_seq to anon;

grant select, update, usage on sequence stripe_customers_id_seq to authenticated;

grant select, update, usage on sequence stripe_customers_id_seq to service_role;

create policy "Users can view their own customer data" on stripe_customers
    as permissive
    for select
    to authenticated
    using (((user_id = auth.uid()) OR (business_profile_id IN (SELECT business_profiles.id
                                                               FROM business_profiles
                                                               WHERE (business_profiles.user_id = auth.uid())))) AND
           (deleted_at IS NULL));

grant delete, insert, references, select, trigger, truncate, update on stripe_customers to anon;

grant delete, insert, references, select, trigger, truncate, update on stripe_customers to authenticated;

grant delete, insert, references, select, trigger, truncate, update on stripe_customers to service_role;

create table stripe_subscriptions
(
    id                   bigint generated always as identity
        primary key,
    customer_id          text                       not null
        unique,
    subscription_id      text,
    price_id             text,
    current_period_start bigint,
    current_period_end   bigint,
    cancel_at_period_end boolean                  default false,
    payment_method_brand text,
    payment_method_last4 text,
    status               stripe_subscription_status not null,
    created_at           timestamp with time zone default now(),
    updated_at           timestamp with time zone default now(),
    deleted_at           timestamp with time zone
)
    using heap;

alter table stripe_subscriptions
    owner to postgres;

grant select, update, usage on sequence stripe_subscriptions_id_seq to anon;

grant select, update, usage on sequence stripe_subscriptions_id_seq to authenticated;

grant select, update, usage on sequence stripe_subscriptions_id_seq to service_role;

create policy "Users can view their own subscription data" on stripe_subscriptions
    as permissive
    for select
    to authenticated
    using ((customer_id IN (SELECT stripe_customers.customer_id
                            FROM stripe_customers
                            WHERE ((stripe_customers.user_id = auth.uid()) AND
                                   (stripe_customers.deleted_at IS NULL)))) AND (deleted_at IS NULL));

grant delete, insert, references, select, trigger, truncate, update on stripe_subscriptions to anon;

grant delete, insert, references, select, trigger, truncate, update on stripe_subscriptions to authenticated;

grant delete, insert, references, select, trigger, truncate, update on stripe_subscriptions to service_role;

create table stripe_orders
(
    id                  bigint generated always as identity
        primary key,
    checkout_session_id text                                                            not null,
    payment_intent_id   text                                                            not null,
    customer_id         text                                                            not null,
    amount_subtotal     bigint                                                          not null,
    amount_total        bigint                                                          not null,
    currency            text                                                            not null,
    payment_status      text                                                            not null,
    status              stripe_order_status      default 'pending'::stripe_order_status not null,
    created_at          timestamp with time zone default now(),
    updated_at          timestamp with time zone default now(),
    deleted_at          timestamp with time zone
)
    using heap;

alter table stripe_orders
    owner to postgres;

grant select, update, usage on sequence stripe_orders_id_seq to anon;

grant select, update, usage on sequence stripe_orders_id_seq to authenticated;

grant select, update, usage on sequence stripe_orders_id_seq to service_role;

create policy "Users can view their own order data" on stripe_orders
    as permissive
    for select
    to authenticated
    using ((customer_id IN (SELECT stripe_customers.customer_id
                            FROM stripe_customers
                            WHERE ((stripe_customers.user_id = auth.uid()) AND
                                   (stripe_customers.deleted_at IS NULL)))) AND (deleted_at IS NULL));

grant delete, insert, references, select, trigger, truncate, update on stripe_orders to anon;

grant delete, insert, references, select, trigger, truncate, update on stripe_orders to authenticated;

grant delete, insert, references, select, trigger, truncate, update on stripe_orders to service_role;

create table aggregated_metrics
(
    id            uuid                     default gen_random_uuid() not null
        primary key,
    business_id   text                                               not null,
    business_name text                                               not null,
    date          date                                               not null,
    metrics       jsonb                                              not null,
    created_at    timestamp with time zone default now(),
    updated_at    timestamp with time zone default now(),
    unique (business_id, date)
)
    using heap;

alter table aggregated_metrics
    owner to postgres;

create index idx_aggregated_metrics_business_id
    on aggregated_metrics using btree (business_id);

create index idx_aggregated_metrics_date
    on aggregated_metrics using btree (date desc);

create index idx_aggregated_metrics_business_date
    on aggregated_metrics using btree (business_id, date desc);

create policy "Admins can read all aggregated metrics" on aggregated_metrics
    as permissive
    for select
    to authenticated
    using (is_admin_user());

create policy "Business owners can read their own metrics" on aggregated_metrics
    as permissive
    for select
    to authenticated
    using (business_id IN (SELECT bp.business_id 
                          FROM business_profiles bp 
                          WHERE bp.user_id = auth.uid() 
                          AND bp.business_id IS NOT NULL));

grant delete, insert, references, select, trigger, truncate, update on aggregated_metrics to anon;

grant delete, insert, references, select, trigger, truncate, update on aggregated_metrics to authenticated;

grant delete, insert, references, select, trigger, truncate, update on aggregated_metrics to service_role;

create view stripe_user_subscriptions
            (customer_id, subscription_id, subscription_status, price_id, current_period_start, current_period_end,
             cancel_at_period_end, payment_method_brand, payment_method_last4)
as
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
WHERE (c.user_id = auth.uid() OR (c.business_profile_id IN (SELECT business_profiles.id
                                                            FROM business_profiles
                                                            WHERE business_profiles.user_id = auth.uid())))
  AND c.deleted_at IS NULL
  AND s.deleted_at IS NULL;

alter table stripe_user_subscriptions
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on stripe_user_subscriptions to anon;

grant delete, insert, references, select, trigger, truncate, update on stripe_user_subscriptions to authenticated;

grant delete, insert, references, select, trigger, truncate, update on stripe_user_subscriptions to service_role;

create view stripe_user_orders
            (customer_id, order_id, checkout_session_id, payment_intent_id, amount_subtotal, amount_total, currency,
             payment_status, order_status, order_date)
as
SELECT c.customer_id,
       o.id         AS order_id,
       o.checkout_session_id,
       o.payment_intent_id,
       o.amount_subtotal,
       o.amount_total,
       o.currency,
       o.payment_status,
       o.status     AS order_status,
       o.created_at AS order_date
FROM stripe_customers c
         LEFT JOIN stripe_orders o ON c.customer_id = o.customer_id
WHERE (c.user_id = auth.uid() OR (c.business_profile_id IN (SELECT business_profiles.id
                                                            FROM business_profiles
                                                            WHERE business_profiles.user_id = auth.uid())))
  AND c.deleted_at IS NULL
  AND o.deleted_at IS NULL;

alter table stripe_user_orders
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on stripe_user_orders to anon;

grant delete, insert, references, select, trigger, truncate, update on stripe_user_orders to authenticated;

grant delete, insert, references, select, trigger, truncate, update on stripe_user_orders to service_role;

create function update_updated_at_column() returns trigger
    SET search_path = public
    language plpgsql
as
$$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

alter function update_updated_at_column() owner to postgres;

create trigger update_business_submissions_updated_at
    before update
    on business_submissions
    for each row
execute procedure update_updated_at_column();

create trigger update_categories_updated_at
    before update
    on categories
    for each row
execute procedure update_updated_at_column();

create trigger update_cities_updated_at
    before update
    on cities
    for each row
execute procedure update_updated_at_column();

create trigger update_businesses_updated_at
    before update
    on businesses
    for each row
execute procedure update_updated_at_column();

create trigger update_contact_messages_updated_at
    before update
    on contact_messages
    for each row
execute procedure update_updated_at_column();

create trigger update_aggregated_metrics_updated_at
    before update
    on aggregated_metrics
    for each row
execute procedure update_updated_at_column();

grant execute on function update_updated_at_column() to anon;

grant execute on function update_updated_at_column() to authenticated;

grant execute on function update_updated_at_column() to service_role;

create function debug_log_current_user() returns trigger
    SET search_path = public
    language plpgsql
as
$$
BEGIN
    RAISE NOTICE 'RLS Insert Debug: current_user=%, session_user=%', current_user, session_user;
    RETURN NEW;
END;
$$;

alter function debug_log_current_user() owner to postgres;

create trigger debug_role_trigger
    before insert
    on business_submissions
    for each row
execute procedure debug_log_current_user();

grant execute on function debug_log_current_user() to anon;

grant execute on function debug_log_current_user() to authenticated;

grant execute on function debug_log_current_user() to service_role;

create function log_insert_role() returns trigger
    SET search_path = public
    language plpgsql
as
$$
BEGIN
    RAISE NOTICE '🚨 RLS DEBUG: current_user=%, session_user=%', current_user, session_user;
    RETURN NEW;
END;
$$;

alter function log_insert_role() owner to postgres;

create trigger trg_log_insert_role
    before insert
    on business_submissions
    for each row
execute procedure log_insert_role();

grant execute on function log_insert_role() to anon;

grant execute on function log_insert_role() to authenticated;

grant execute on function log_insert_role() to service_role;

create function get_current_role() returns json
    SET search_path = public
    language sql
as
$$
SELECT json_build_object(
    'current_user', current_user,
    'role', current_setting('request.jwt.claim.role', true),
    'user_id', current_setting('request.jwt.claim.sub', true)
);
$$;

alter function get_current_role() owner to postgres;

grant execute on function get_current_role() to anon;

grant execute on function get_current_role() to authenticated;

grant execute on function get_current_role() to service_role;

create function notify_new_contact_message() returns trigger
    security definer
    SET search_path = public, extensions
    language plpgsql
as
$$
DECLARE
    webhook_url character varying := 'https://n8n.nasbanga.io/webhook/contact-message-notify';
    payload character varying;
    response JSON;
BEGIN
    payload := jsonb_build_object(
            'trigger', 'contact_message_created',
            'message_data', jsonb_build_object(
                    'id', NEW.id,
                    'name', NEW.name,
                    'email', NEW.email,
                    'subject', NEW.subject,
                    'message', NEW.message,
                    'category', NEW.category,
                    'city', NEW.city,
                    'created_at', NEW.created_at
                            )
               )::character varying;

    -- Send webhook notification
    SELECT content::json INTO response
    FROM http_post(webhook_url, payload, 'application/json'::character varying);

    RETURN NEW;
END;
$$;

alter function notify_new_contact_message() owner to postgres;

create trigger trigger_notify_new_contact_message
    after insert
    on contact_messages
    for each row
execute procedure notify_new_contact_message();

grant execute on function notify_new_contact_message() to anon;

grant execute on function notify_new_contact_message() to authenticated;

grant execute on function notify_new_contact_message() to service_role;

create function notify_new_business_submission() returns trigger
    security definer
    SET search_path = public, extensions
    language plpgsql
as
$$
DECLARE
    webhook_url character varying := 'https://n8n.nasbanga.io/webhook/business-submission-notify';
    payload character varying;
    response JSON;
BEGIN
    payload := jsonb_build_object(
        'trigger', 'business_submission_created',
        'submission_data', jsonb_build_object(
            'id', NEW.id,
            'business_name', NEW.business_name,
            'owner_name', NEW.owner_name,
            'email', NEW.email,
            'phone', NEW.phone,
            'address', NEW.address,
            'city', NEW.city,
            'state', NEW.state,
            'zip_code', NEW.zip_code,
            'category', NEW.category,
            'website', NEW.website,
            'description', NEW.description,
            'submitted_at', NEW.submitted_at
        )
    )::character varying;

    -- Now it should find http_post in the extensions schema
    SELECT content::json INTO response
    FROM http_post(webhook_url, payload, 'application/json'::character varying);

    RETURN NEW;
END;
$$;

alter function notify_new_business_submission() owner to postgres;

create trigger notify_new_business_submission_trigger
    after insert
    on business_submissions
    for each row
execute procedure notify_new_business_submission();

grant execute on function notify_new_business_submission() to anon;

grant execute on function notify_new_business_submission() to authenticated;

grant execute on function notify_new_business_submission() to service_role;

create function debug_insert_policy() returns boolean
    language plpgsql
as
$$
BEGIN
    RAISE NOTICE '🚨 RLS DEBUG: current_user=%, session_user=%, auth.role()=%, auth.uid()=%', 
        current_user, session_user, auth.role(), auth.uid();
    RETURN true;
END;
$$;

alter function debug_insert_policy() owner to postgres;

grant execute on function debug_insert_policy() to anon;

grant execute on function debug_insert_policy() to authenticated;

grant execute on function debug_insert_policy() to service_role;

create function check_role_context() returns text
    language plpgsql
as
$$
BEGIN
    INSERT INTO public.debug_log (message) VALUES (
        'Role check: current_user=' || current_user || 
        ', session_user=' || session_user ||
        ', current_role=' || current_role
    );
    RETURN 'logged';
END;
$$;

alter function check_role_context() owner to postgres;

grant execute on function check_role_context() to anon;

grant execute on function check_role_context() to authenticated;

grant execute on function check_role_context() to service_role;

create function update_business_profiles_updated_at() returns trigger
    language plpgsql
as
$$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

alter function update_business_profiles_updated_at() owner to postgres;

create trigger update_business_profiles_updated_at
    before update
    on business_profiles
    for each row
execute procedure update_business_profiles_updated_at();

grant execute on function update_business_profiles_updated_at() to anon;

grant execute on function update_business_profiles_updated_at() to authenticated;

grant execute on function update_business_profiles_updated_at() to service_role;

create function aggregate_daily_metrics(target_date date) returns void
    language plpgsql
as
$$
DECLARE
    business record;
    metrics jsonb;
    view_count integer;
    unique_views integer;
    phone_clicks integer;
    website_clicks integer;
    booking_clicks integer;
    directions_clicks integer;
    email_clicks integer;
    hours_views integer;
    services_expands integer;
    photo_views integer;
    mobile_count integer;
    tablet_count integer;
    desktop_count integer;
    unique_sessions text[];
    source_data jsonb;
    search_query_data jsonb;
    hourly_data jsonb;
BEGIN
    -- Loop through each business with events on the target date
    FOR business IN
        SELECT DISTINCT business_id, business_name
        FROM user_engagement_events
        WHERE date_trunc('day', timestamp) = target_date
        LOOP
            -- Count total views
            SELECT COUNT(*) INTO view_count
            FROM user_engagement_events
            WHERE business_id = business.business_id
              AND date_trunc('day', timestamp) = target_date
              AND event_type = 'view';

            -- Count unique views (by session)
            SELECT array_agg(DISTINCT user_session_id) INTO unique_sessions
            FROM user_engagement_events
            WHERE business_id = business.business_id
              AND date_trunc('day', timestamp) = target_date
              AND event_type = 'view';

            unique_views := array_length(unique_sessions, 1);
            IF unique_views IS NULL THEN
                unique_views := 0;
            END IF;

            -- Count other event types
            SELECT COUNT(*) INTO phone_clicks
            FROM user_engagement_events
            WHERE business_id = business.business_id
              AND date_trunc('day', timestamp) = target_date
              AND event_type = 'phone_click';

            SELECT COUNT(*) INTO website_clicks
            FROM user_engagement_events
            WHERE business_id = business.business_id
              AND date_trunc('day', timestamp) = target_date
              AND event_type = 'website_click';

            SELECT COUNT(*) INTO booking_clicks
            FROM user_engagement_events
            WHERE business_id = business.business_id
              AND date_trunc('day', timestamp) = target_date
              AND event_type = 'booking_click';

            SELECT COUNT(*) INTO directions_clicks
            FROM user_engagement_events
            WHERE business_id = business.business_id
              AND date_trunc('day', timestamp) = target_date
              AND event_type = 'directions_click';

            SELECT COUNT(*) INTO email_clicks
            FROM user_engagement_events
            WHERE business_id = business.business_id
              AND date_trunc('day', timestamp) = target_date
              AND event_type = 'email_click';

            SELECT COUNT(*) INTO hours_views
            FROM user_engagement_events
            WHERE business_id = business.business_id
              AND date_trunc('day', timestamp) = target_date
              AND event_type = 'hours_view';

            SELECT COUNT(*) INTO services_expands
            FROM user_engagement_events
            WHERE business_id = business.business_id
              AND date_trunc('day', timestamp) = target_date
              AND event_type = 'services_expand';

            SELECT COUNT(*) INTO photo_views
            FROM user_engagement_events
            WHERE business_id = business.business_id
              AND date_trunc('day', timestamp) = target_date
              AND event_type = 'photo_view';

            -- Count device types
            SELECT COUNT(*) INTO mobile_count
            FROM user_engagement_events
            WHERE business_id = business.business_id
              AND date_trunc('day', timestamp) = target_date
              AND event_data->>'deviceType' = 'mobile';

            SELECT COUNT(*) INTO tablet_count
            FROM user_engagement_events
            WHERE business_id = business.business_id
              AND date_trunc('day', timestamp) = target_date
              AND event_data->>'deviceType' = 'tablet';

            SELECT COUNT(*) INTO desktop_count
            FROM user_engagement_events
            WHERE business_id = business.business_id
              AND date_trunc('day', timestamp) = target_date
              AND event_data->>'deviceType' = 'desktop';

            -- Aggregate source data
            WITH source_counts AS (
                SELECT
                    COALESCE(event_data->>'source', 'direct') AS source,
                    COUNT(*) AS count
                FROM user_engagement_events
                WHERE business_id = business.business_id
                  AND date_trunc('day', timestamp) = target_date
                  AND event_type = 'view'
                GROUP BY COALESCE(event_data->>'source', 'direct')
            )
            SELECT
                jsonb_object_agg(source, count) INTO source_data
            FROM source_counts;

            -- Aggregate search query data
            WITH query_counts AS (
                SELECT
                    event_data->>'searchQuery' AS query,
                    COUNT(*) FILTER (WHERE event_type = 'view') AS views,
                    COUNT(*) FILTER (WHERE event_type != 'view') AS clicks
                FROM user_engagement_events
                WHERE business_id = business.business_id
                  AND date_trunc('day', timestamp) = target_date
                  AND event_data->>'searchQuery' IS NOT NULL
                GROUP BY event_data->>'searchQuery'
            )
            SELECT
                jsonb_object_agg(query, jsonb_build_object('views', views, 'clicks', clicks)) INTO search_query_data
            FROM query_counts;

            -- Aggregate hourly distribution
            WITH hourly_counts AS (
                SELECT
                    EXTRACT(HOUR FROM timestamp) AS hour,
                    COUNT(*) FILTER (WHERE event_type = 'view') AS views,
                    COUNT(*) FILTER (WHERE event_type != 'view') AS interactions
                FROM user_engagement_events
                WHERE business_id = business.business_id
                  AND date_trunc('day', timestamp) = target_date
                GROUP BY EXTRACT(HOUR FROM timestamp)
            )
            SELECT
                jsonb_object_agg(hour, jsonb_build_object('views', views, 'interactions', interactions)) INTO hourly_data
            FROM hourly_counts;

            -- Build metrics JSON
            metrics := jsonb_build_object(
                    'totalViews', view_count,
                    'uniqueViews', unique_views,
                    'phoneClicks', phone_clicks,
                    'websiteClicks', website_clicks,
                    'bookingClicks', booking_clicks,
                    'directionsClicks', directions_clicks,
                    'emailClicks', email_clicks,
                    'hoursViews', hours_views,
                    'servicesExpands', services_expands,
                    'photoViews', photo_views,
                    'deviceBreakdown', jsonb_build_object(
                            'mobile', mobile_count,
                            'tablet', tablet_count,
                            'desktop', desktop_count
                                       ),
                    'sources', COALESCE(source_data, '{}'::jsonb),
                    'searchQueries', COALESCE(search_query_data, '{}'::jsonb),
                    'hourlyDistribution', COALESCE(hourly_data, '{}'::jsonb)
                       );

            -- Calculate derived metrics
            IF view_count > 0 THEN
                metrics := metrics || jsonb_build_object(
                        'conversionRate', ((phone_clicks + website_clicks + booking_clicks)::float / view_count) * 100,
                        'engagementRate', ((phone_clicks + website_clicks + booking_clicks + directions_clicks +
                                            email_clicks + hours_views + services_expands + photo_views)::float / view_count) * 100
                                      );
            ELSE
                metrics := metrics || jsonb_build_object(
                        'conversionRate', 0,
                        'engagementRate', 0
                                      );
            END IF;

            -- Insert or update aggregated metrics
            INSERT INTO aggregated_metrics (business_id, business_name, date, metrics)
            VALUES (business.business_id, business.business_name, target_date, metrics)
            ON CONFLICT (business_id, date)
                DO UPDATE SET
                              metrics = EXCLUDED.metrics,
                              updated_at = now();

        END LOOP;
END;
$$;

alter function aggregate_daily_metrics(date) owner to postgres;

grant execute on function aggregate_daily_metrics(date) to anon;

grant execute on function aggregate_daily_metrics(date) to authenticated;

grant execute on function aggregate_daily_metrics(date) to service_role;

create function aggregate_yesterday_metrics() returns void
    language plpgsql
as
$$
BEGIN
    PERFORM aggregate_daily_metrics(current_date - interval '1 day');
END;
$$;

alter function aggregate_yesterday_metrics() owner to postgres;

grant execute on function aggregate_yesterday_metrics() to anon;

grant execute on function aggregate_yesterday_metrics() to authenticated;

grant execute on function aggregate_yesterday_metrics() to service_role;

create function cleanup_old_engagement_events() returns integer
    language plpgsql
as
$$
DECLARE
    deleted_count integer;
BEGIN
    -- Delete events older than 30 days
    DELETE FROM user_engagement_events
    WHERE timestamp < (current_date - interval '30 days')
    RETURNING COUNT(*) INTO deleted_count;

    RETURN deleted_count;
END;
$$;

alter function cleanup_old_engagement_events() owner to postgres;

grant execute on function cleanup_old_engagement_events() to anon;

grant execute on function cleanup_old_engagement_events() to authenticated;

grant execute on function cleanup_old_engagement_events() to service_role;

create function get_business_metrics(business_id_param text, period_param text, start_date_param date DEFAULT NULL::date, end_date_param date DEFAULT NULL::date) returns jsonb
    language plpgsql
as
$$
DECLARE
    start_date date;
    end_date date;
    result jsonb;
BEGIN
    -- Set date range based on period or explicit dates
    IF start_date_param IS NOT NULL AND end_date_param IS NOT NULL THEN
        start_date := start_date_param;
        end_date := end_date_param;
    ELSE
        end_date := current_date - interval '1 day';
        CASE period_param
            WHEN 'day' THEN start_date := end_date;
            WHEN 'week' THEN start_date := end_date - interval '6 days';
            WHEN 'month' THEN start_date := end_date - interval '29 days';
            WHEN 'year' THEN start_date := end_date - interval '364 days';
            ELSE start_date := end_date - interval '6 days'; -- Default to week
            END CASE;
    END IF;

    -- Get aggregated metrics for the date range
    WITH metrics_data AS (
        SELECT
            date,
            metrics
        FROM aggregated_metrics
        WHERE business_id = business_id_param
          AND date BETWEEN start_date AND end_date
        ORDER BY date
    ),
         aggregated AS (
             SELECT
                 jsonb_build_object(
                         'totalViews', COALESCE(SUM((metrics->>'totalViews')::int), 0),
                         'uniqueViews', COALESCE(SUM((metrics->>'uniqueViews')::int), 0),
                         'phoneClicks', COALESCE(SUM((metrics->>'phoneClicks')::int), 0),
                         'websiteClicks', COALESCE(SUM((metrics->>'websiteClicks')::int), 0),
                         'bookingClicks', COALESCE(SUM((metrics->>'bookingClicks')::int), 0),
                         'directionsClicks', COALESCE(SUM((metrics->>'directionsClicks')::int), 0),
                         'emailClicks', COALESCE(SUM((metrics->>'emailClicks')::int), 0),
                         'hoursViews', COALESCE(SUM((metrics->>'hoursViews')::int), 0),
                         'servicesExpands', COALESCE(SUM((metrics->>'servicesExpands')::int), 0),
                         'photoViews', COALESCE(SUM((metrics->>'photoViews')::int), 0)
                 ) AS metrics_sum,
                 jsonb_build_object(
                         'mobile', COALESCE(SUM((metrics->'deviceBreakdown'->>'mobile')::int), 0),
                         'tablet', COALESCE(SUM((metrics->'deviceBreakdown'->>'tablet')::int), 0),
                         'desktop', COALESCE(SUM((metrics->'deviceBreakdown'->>'desktop')::int), 0)
                 ) AS device_breakdown,
                 jsonb_agg(
                         jsonb_build_object(
                                 'date', date,
                                 'metrics', metrics
                         )
                         ORDER BY date
                 ) AS daily_data
             FROM metrics_data
         )
    SELECT
        jsonb_build_object(
                'businessId', business_id_param,
                'period', period_param,
                'startDate', start_date,
                'endDate', end_date,
                'metrics', (
                    SELECT
                        metrics_sum ||
                        jsonb_build_object(
                                'deviceBreakdown', device_breakdown,
                                'conversionRate', CASE
                                                      WHEN (metrics_sum->>'totalViews')::int > 0
                                                          THEN ((metrics_sum->>'phoneClicks')::int +
                                                                (metrics_sum->>'websiteClicks')::int +
                                                                (metrics_sum->>'bookingClicks')::int)::float /
                                                               (metrics_sum->>'totalViews')::int * 100
                                                      ELSE 0
                                    END,
                                'engagementRate', CASE
                                                      WHEN (metrics_sum->>'totalViews')::int > 0
                                                          THEN ((metrics_sum->>'phoneClicks')::int +
                                                                (metrics_sum->>'websiteClicks')::int +
                                                                (metrics_sum->>'bookingClicks')::int +
                                                                (metrics_sum->>'directionsClicks')::int +
                                                                (metrics_sum->>'emailClicks')::int +
                                                                (metrics_sum->>'hoursViews')::int +
                                                                (metrics_sum->>'servicesExpands')::int +
                                                                (metrics_sum->>'photoViews')::int)::float /
                                                               (metrics_sum->>'totalViews')::int * 100
                                                      ELSE 0
                                    END
                        )
                    FROM aggregated
                ),
                'dailyData', COALESCE((SELECT daily_data FROM aggregated), '[]'::jsonb)
        ) INTO result
    FROM aggregated;

    -- If no data found, return empty structure
    IF result IS NULL THEN
        result := jsonb_build_object(
                'businessId', business_id_param,
                'period', period_param,
                'startDate', start_date,
                'endDate', end_date,
                'metrics', jsonb_build_object(
                        'totalViews', 0,
                        'uniqueViews', 0,
                        'phoneClicks', 0,
                        'websiteClicks', 0,
                        'bookingClicks', 0,
                        'directionsClicks', 0,
                        'emailClicks', 0,
                        'hoursViews', 0,
                        'servicesExpands', 0,
                        'photoViews', 0,
                        'conversionRate', 0,
                        'engagementRate', 0,
                        'deviceBreakdown', jsonb_build_object(
                                'mobile', 0,
                                'tablet', 0,
                                'desktop', 0
                                           )
                           ),
                'dailyData', '[]'::jsonb
                  );
    END IF;

    RETURN result;
END;
$$;

alter function get_business_metrics(text, text, date, date) owner to postgres;

grant execute on function get_business_metrics(text, text, date, date) to anon;

grant execute on function get_business_metrics(text, text, date, date) to authenticated;

grant execute on function get_business_metrics(text, text, date, date) to service_role;

create function backfill_historical_metrics(start_date date, end_date date DEFAULT (CURRENT_DATE - '1 day'::interval))
    returns TABLE(processed_date date, status text)
    language plpgsql
as
$$
DECLARE
    current_day date;
    success boolean;
    error_message text;
    processed_count integer := 0;
BEGIN
    current_day := start_date;

    -- Process each day in the range
    WHILE current_day <= end_date LOOP
            -- Initialize status variables
            success := true;
            error_message := NULL;

            -- Try to aggregate metrics for the current day
            BEGIN
                PERFORM aggregate_daily_metrics(current_day);
                processed_count := processed_count + 1;
            EXCEPTION WHEN OTHERS THEN
                -- Capture any errors
                success := false;
                error_message := SQLERRM;
            END;

            -- Return the result for this day
            processed_date := current_day;
            status := CASE
                          WHEN success THEN 'Success: Metrics aggregated'
                          ELSE 'Error: ' || COALESCE(error_message, 'Unknown error')
                END;
            RETURN NEXT;

            -- Move to the next day
            current_day := current_day + interval '1 day';
        END LOOP;

    -- Add a summary row
    processed_date := NULL;
    status := 'Summary: Processed ' || processed_count || ' days successfully';
    RETURN NEXT;

    RETURN;
END;
$$;

comment on function backfill_historical_metrics(date, date) is 'Aggregates metrics for a date range with improved error handling and detailed reporting';

alter function backfill_historical_metrics(date, date) owner to postgres;

grant execute on function backfill_historical_metrics(date, date) to anon;

grant execute on function backfill_historical_metrics(date, date) to authenticated;

grant execute on function backfill_historical_metrics(date, date) to service_role;

create function update_admin_settings_updated_at() returns trigger
    language plpgsql
as
$$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

alter function update_admin_settings_updated_at() owner to postgres;

create trigger update_admin_settings_updated_at
    before update
    on admin_settings
    for each row
execute procedure update_admin_settings_updated_at();

grant execute on function update_admin_settings_updated_at() to anon;

grant execute on function update_admin_settings_updated_at() to authenticated;

grant execute on function update_admin_settings_updated_at() to service_role;

create function migrate_stripe_customers_to_business_profiles() returns void
    language plpgsql
as
$$
BEGIN
  UPDATE stripe_customers sc
  SET business_profile_id = bp.id
  FROM business_profiles bp
  WHERE sc.user_id = bp.user_id
  AND sc.business_profile_id IS NULL;
END;
$$;

alter function migrate_stripe_customers_to_business_profiles() owner to postgres;

grant execute on function migrate_stripe_customers_to_business_profiles() to anon;

grant execute on function migrate_stripe_customers_to_business_profiles() to authenticated;

grant execute on function migrate_stripe_customers_to_business_profiles() to service_role;

grant execute on function is_admin_user() to anon;

grant execute on function is_admin_user() to authenticated;

grant execute on function is_admin_user() to service_role;
