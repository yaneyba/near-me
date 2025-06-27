// Stripe product configuration
import { StripeProduct } from './types';

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    priceId: 'price_featured_business',
    name: 'Featured Business Listing',
    description: 'Top-tier placement with guaranteed top 3 positioning, highlighted design, and monthly performance reports.',
    price: 30000, // $300.00 in cents
    mode: 'subscription',
    interval: 'month',
    currency: 'usd'
  },
  {
    priceId: 'price_premium_business',
    name: 'Premium Business Listing',
    description: 'Featured placement with photo gallery, online booking integration, and priority support for maximum visibility.',
    price: 15000, // $150.00 in cents
    mode: 'subscription',
    interval: 'month',
    currency: 'usd'
  }
];

// Helper function to get product by price ID
export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
};

// Helper function to format price for display
export const formatPrice = (price: number, currency: string = 'usd'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2
  }).format(price / 100);
};