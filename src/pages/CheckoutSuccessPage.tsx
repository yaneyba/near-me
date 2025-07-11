import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, Building } from 'lucide-react';
import { getCurrentSubscription } from '@/lib/stripe';
import { getProductByPriceId } from '@/stripe-config';

const CheckoutSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Payment Successful - Near Me Directory';
    
    // If no session ID, redirect to home
    if (!sessionId) {
      navigate('/');
      return;
    }

    // Fetch subscription details
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        // Wait a moment to allow webhook processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Get current subscription (will automatically find user's business profile)
        const subscriptionData = await getCurrentSubscription();
        setSubscription(subscriptionData);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [sessionId, navigate]);

  const productName = subscription?.price_id 
    ? getProductByPriceId(subscription.price_id)?.name
    : 'Business Listing';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          {loading ? (
            <div className="animate-pulse space-y-4 mb-8">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          ) : (
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your purchase! Your {productName} has been activated.
              You can now enjoy all the premium features and benefits.
            </p>
          )}
          
          {subscription && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Subscription Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Plan:</span> {productName}</p>
                <p><span className="font-medium">Status:</span> {subscription.subscription_status}</p>
                {subscription.current_period_end && (
                  <p>
                    <span className="font-medium">Current period ends:</span>{' '}
                    {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                  </p>
                )}
                {subscription.payment_method_brand && subscription.payment_method_last4 && (
                  <p>
                    <span className="font-medium">Payment method:</span>{' '}
                    {subscription.payment_method_brand.toUpperCase()} ending in {subscription.payment_method_last4}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/business/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Building className="w-5 h-5 mr-2" />
              Go to Dashboard
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;