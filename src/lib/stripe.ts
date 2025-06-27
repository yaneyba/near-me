import { PRODUCTS, STRIPE_API } from '../stripe-config';
import { supabase } from './supabase';

/**
 * Create a Stripe checkout session
 */
export async function createCheckoutSession(priceId: string, mode: 'subscription' | 'payment' = 'subscription') {
  try {
    // Get the current URL for success and cancel redirects
    const origin = window.location.origin;
    const successUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/checkout/cancel`;

    // Get the Supabase URL and anon key from environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('Supabase URL not found');
    }

    // Get the current user's JWT token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }

    // Create the checkout session
    const response = await fetch(`${supabaseUrl}${STRIPE_API.CHECKOUT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        price_id: priceId,
        success_url: successUrl,
        cancel_url: cancelUrl,
        mode
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Get the current user's subscription
 */
export async function getUserSubscription() {
  try {
    const { data, error } = await supabase
      .from('stripe_user_subscriptions')
      .select('*')
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return null;
  }
}

/**
 * Get the product name from a price ID
 */
export function getProductNameFromPriceId(priceId: string): string {
  for (const [key, product] of Object.entries(PRODUCTS)) {
    if (product.priceId === priceId) {
      return product.name;
    }
  }
  return 'Unknown Product';
}

/**
 * Format currency amount from cents to dollars
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

/**
 * Check if a user has an active subscription
 */
export async function hasActiveSubscription(): Promise<boolean> {
  try {
    const subscription = await getUserSubscription();
    return subscription?.subscription_status === 'active' || subscription?.subscription_status === 'trialing';
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}