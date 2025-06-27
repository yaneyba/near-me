import { StripeProduct, StripeCheckoutResult, StripeSubscription } from '../types';
import { supabase } from './supabase';
import { STRIPE_PRODUCTS, getProductByPriceId } from '../stripe-config';

/**
 * Create a checkout session for a business profile
 */
export const createCheckoutSession = async (
  priceId: string,
  businessProfileId: string
): Promise<StripeCheckoutResult> => {
  try {
    // Validate the price ID
    const product = getProductByPriceId(priceId);
    if (!product) {
      return {
        success: false,
        message: 'Invalid product selected',
        error: 'INVALID_PRODUCT'
      };
    }

    // Get the Supabase URL
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      return {
        success: false,
        message: 'Configuration error. Please contact support.',
        error: 'MISSING_CONFIG'
      };
    }

    // Create success and cancel URLs
    const origin = window.location.origin;
    const successUrl = `${origin}/business-dashboard?checkout=success`;
    const cancelUrl = `${origin}/business-dashboard?checkout=canceled`;

    // Call the Supabase Edge Function to create a checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        priceId,
        businessProfileId,
        successUrl,
        cancelUrl
      }
    });

    if (error) {
      console.error('Error creating checkout session:', error);
      return {
        success: false,
        message: 'Failed to create checkout session. Please try again later.',
        error: error.message
      };
    }

    if (!data.success || !data.url) {
      return {
        success: false,
        message: data.error || 'Failed to create checkout session',
        error: 'CHECKOUT_FAILED'
      };
    }

    return {
      success: true,
      message: 'Checkout session created successfully',
      url: data.url
    };
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      error: error.message
    };
  }
};

/**
 * Get the current subscription for a business profile
 */
export const getCurrentSubscription = async (businessProfileId: string): Promise<StripeSubscription | null> => {
  try {
    // Get the business profile with subscription info
    const { data: profile, error } = await supabase
      .from('business_profiles')
      .select('stripe_subscription_id, stripe_price_id, premium')
      .eq('id', businessProfileId)
      .single();

    if (error || !profile) {
      console.error('Error fetching business profile:', error);
      return null;
    }

    // If no subscription, return null
    if (!profile.stripe_subscription_id || !profile.stripe_price_id) {
      return null;
    }

    // Get the product details from our config
    const product = getProductByPriceId(profile.stripe_price_id);
    if (!product) {
      return null;
    }

    // Create a subscription object with the information we have
    // In a real implementation, you might call an Edge Function to get more details from Stripe
    const subscription: StripeSubscription = {
      id: profile.stripe_subscription_id,
      status: profile.premium ? 'active' : 'inactive',
      current_period_end: Date.now() + 30 * 24 * 60 * 60 * 1000, // Placeholder: 30 days from now
      product: {
        name: product.name,
        description: product.description
      },
      price: {
        unit_amount: product.price,
        currency: product.currency || 'usd',
        recurring: product.interval ? {
          interval: product.interval
        } : undefined
      },
      created: Date.now() - 24 * 60 * 60 * 1000 // Placeholder: 1 day ago
    };

    return subscription;
  } catch (error) {
    console.error('Error in getCurrentSubscription:', error);
    return null;
  }
};

/**
 * Get available products for subscription
 */
export const getAvailableProducts = (): StripeProduct[] => {
  return STRIPE_PRODUCTS;
};