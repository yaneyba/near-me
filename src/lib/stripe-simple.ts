// Simple Stripe integration for React app
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (you'll need to add your publishable key to .env)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export interface StripeCheckoutOptions {
  priceId: string;
  businessName: string;
  businessEmail: string;
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * Simple Stripe checkout - redirects to Stripe's hosted checkout
 * No complex Edge Functions needed!
 */
export async function createStripeCheckout(options: StripeCheckoutOptions) {
  const stripe = await stripePromise;
  
  if (!stripe) {
    throw new Error('Stripe failed to load');
  }

  const { priceId, businessEmail, successUrl, cancelUrl } = options;

  // Redirect to Stripe Checkout (hosted by Stripe - no backend needed!)
  const result = await stripe.redirectToCheckout({
    lineItems: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    successUrl: successUrl || `${window.location.origin}/success`,
    cancelUrl: cancelUrl || `${window.location.origin}/cancel`,
    customerEmail: businessEmail,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result;
}

/**
 * Even simpler - just create a Stripe payment link
 * Stripe handles everything for you
 */
export function createStripePaymentLink(priceId: string) {
  // Just redirect to a Stripe payment link (easiest way)
  const paymentUrl = `https://buy.stripe.com/test_${priceId}`; // Replace with your actual payment link
  window.open(paymentUrl, '_blank');
}
