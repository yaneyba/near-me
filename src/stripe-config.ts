// Stripe product configuration
export const PRODUCTS = {
  FEATURED_BUSINESS: {
    priceId: 'price_1Reci7Rm3Nqz0dttn41prphm',
    name: 'Featured Business Listing',
    description: 'Top-tier placement with guaranteed top 3 positioning, highlighted design, and monthly performance reports.',
    mode: 'subscription'
  },
  PREMIUM_BUSINESS: {
    priceId: 'price_1RecixRm3Nqz0dttwAZL9AJ7',
    name: 'Premium Business Listing',
    description: 'Featured placement with photo gallery, online booking integration, and priority support for maximum visibility.',
    mode: 'subscription'
  }
};

// Stripe API endpoints
export const STRIPE_API = {
  CHECKOUT: '/functions/v1/stripe-checkout',
  PORTAL: '/functions/v1/stripe-portal'
};