import { StripeProduct, StripeCheckoutResult, StripeSubscription } from '../types';
import { STRIPE_PRODUCTS, getProductByPriceId } from '../stripe-config';
import { DataProviderFactory } from '../providers';

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

    // Get data provider to check business profile
    const dataProvider = DataProviderFactory.getProvider();
    
    // Check if business is approved for subscriptions
    const businessProfiles = await dataProvider.getBusinessProfiles();
    const businessProfile = businessProfiles.find(profile => profile.id === businessProfileId);

    if (!businessProfile) {
      return {
        success: false,
        message: 'Business profile not found',
        error: 'BUSINESS_NOT_FOUND'
      };
    }

    // Only approved businesses with owner role can subscribe
    if (businessProfile.approval_status !== 'approved') {
      return {
        success: false,
        message: 'Your business registration is still pending approval. Please wait for admin approval before subscribing.',
        error: 'NOT_APPROVED'
      };
    }

    if (businessProfile.role !== 'owner') {
      return {
        success: false,
        message: 'Only business owners can manage subscriptions.',
        error: 'INSUFFICIENT_PERMISSIONS'
      };
    }

    // Payment processing is disabled
    console.log('Stripe checkout disabled');
    
    // Stripe checkout is disabled since Supabase is decommissioned
    return {
      success: false,
      message: 'Payment processing is currently disabled. Please contact support.',
      error: 'SERVICE_DISABLED'
    };    } catch (error) {
      console.error('Error in createCheckoutSession:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
};

/**
 * Get the current subscription for a business profile
 */
export const getCurrentSubscription = async (_businessProfileId?: string): Promise<StripeSubscription | null> => {
  // Subscriptions disabled since Supabase is decommissioned
  console.log('Subscription lookup requested but service is disabled');
  return null;
};

/**
 * Get available products for subscription
 */
export const getAvailableProducts = (): StripeProduct[] => {
  return STRIPE_PRODUCTS;
};