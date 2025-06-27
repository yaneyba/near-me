import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Star, TrendingUp, ArrowRight } from 'lucide-react';
import { getUserSubscription, getProductNameFromPriceId } from '../lib/stripe';

interface SubscriptionBannerProps {
  className?: string;
}

const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ className = '' }) => {
  const [subscription, setSubscription] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const data = await getUserSubscription();
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  // If loading, show a subtle loading state
  if (loading) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  // If user has an active subscription, show subscription info
  if (subscription?.subscription_status === 'active' || subscription?.subscription_status === 'trialing') {
    const productName = subscription.price_id 
      ? getProductNameFromPriceId(subscription.price_id)
      : 'Premium Plan';

    const nextBillingDate = subscription.current_period_end 
      ? new Date(subscription.current_period_end * 1000).toLocaleDateString()
      : 'Unknown';

    return (
      <div className={`bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <div className="bg-purple-100 p-2 rounded-full mr-3">
            <Crown className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-purple-900">
              {productName} Active
            </h3>
            <p className="text-sm text-purple-700">
              Next billing date: {nextBillingDate}
            </p>
          </div>
          <Link
            to="/business-dashboard"
            className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
          >
            Manage
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    );
  }

  // Otherwise, show upgrade prompt
  return (
    <div className={`bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center">
        <div className="bg-yellow-100 p-2 rounded-full mr-3">
          <Star className="w-5 h-5 text-yellow-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900">
            Upgrade Your Business Listing
          </h3>
          <p className="text-sm text-yellow-700">
            Get more visibility and attract more customers
          </p>
        </div>
        <Link
          to="/business-owners#premium"
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors"
        >
          Upgrade Now
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionBanner;