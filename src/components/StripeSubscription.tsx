// Simple Stripe subscription component
import { createStripeCheckout } from '../lib/stripe-simple';

interface StripeSubscriptionProps {
  businessName: string;
  businessEmail: string;
  priceId: string; // Get this from your Stripe dashboard
}

export function StripeSubscription({ businessName, businessEmail, priceId }: StripeSubscriptionProps) {
  const handleSubscribe = async () => {
    try {
      await createStripeCheckout({
        priceId,
        businessName,
        businessEmail,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      });
    } catch (error) {
      console.error('Stripe error:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Premium Business Listing</h3>
      <p className="text-gray-600 mb-4">
        Upgrade to premium for better visibility and more features.
      </p>
      <button
        onClick={handleSubscribe}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Subscribe Now - $29/month
      </button>
    </div>
  );
}
