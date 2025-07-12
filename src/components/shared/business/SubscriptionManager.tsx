import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Loader2,
  Star,
  Shield,
  Zap,
  Award
} from 'lucide-react';
import { StripeProduct, StripeSubscription } from '@/types';
import { createCheckoutSession, getCurrentSubscription, getAvailableProducts } from '@/lib/stripe';
import { formatPrice } from '@/stripe-config';

interface SubscriptionManagerProps {
  businessProfileId?: string;
  onSubscriptionChange?: (hasSubscription: boolean) => void;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ 
  businessProfileId,
  onSubscriptionChange 
}) => {
  const [subscription, setSubscription] = useState<StripeSubscription | null>(null);
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check for checkout status in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutStatus = params.get('checkout');
    
    if (checkoutStatus === 'success') {
      setSuccess('Your subscription has been activated successfully!');
      // Remove the query parameter from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (checkoutStatus === 'canceled') {
      setError('Checkout was canceled. Your subscription has not been changed.');
      // Remove the query parameter from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Load subscription and products
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get current subscription (businessProfileId is optional now)
        const currentSubscription = await getCurrentSubscription(businessProfileId);
        setSubscription(currentSubscription);
        
        // Notify parent component about subscription status
        if (onSubscriptionChange) {
          onSubscriptionChange(!!currentSubscription);
        }
        
        // Get available products
        const availableProducts = getAvailableProducts();
        setProducts(availableProducts);
        
        // Set default selected product
        if (availableProducts.length > 0 && !selectedProductId) {
          setSelectedProductId(availableProducts[0].priceId);
        }
      } catch (error) {
        console.error('Error loading subscription data:', error);
        setError('Failed to load subscription information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    // Always load data, businessProfileId is now optional
    loadData();
  }, [businessProfileId, onSubscriptionChange]);

  const handleProductSelect = (priceId: string) => {
    setSelectedProductId(priceId);
  };

  const handleCheckout = async () => {
    if (!selectedProductId) {
      setError('Please select a subscription plan');
      return;
    }

    if (!businessProfileId) {
      setError('Business profile not found. Please try logging out and back in.');
      return;
    }
    
    setCheckoutLoading(true);
    setError(null);
    
    try {
      const result = await createCheckoutSession(selectedProductId, businessProfileId);
      
      if (result.success && result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      } else {
        setError(result.message || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading subscription information...</p>
      </div>
    );
  }

  // Show current subscription
  if (subscription) {
    const isActive = subscription.status === 'active' || subscription.status === 'trialing';
    
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center">
            <Crown className="w-8 h-8 mr-3" />
            <div>
              <h3 className="text-xl font-bold">Current Subscription</h3>
              <p className="text-blue-100">{subscription.product.name}</p>
            </div>
            <div className="ml-auto">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isActive ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
              }`}>
                {isActive ? (
                  <><CheckCircle className="w-4 h-4 mr-1" /> Active</>
                ) : (
                  <><Clock className="w-4 h-4 mr-1" /> Inactive</>
                )}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-green-700">{success}</div>
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-red-700">{error}</div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-gray-700 font-medium">Plan</div>
              <div className="text-gray-900 font-semibold">{subscription.product.name}</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-gray-700 font-medium">Price</div>
              <div className="text-gray-900 font-semibold">
                {formatPrice(subscription.price.unit_amount, subscription.price.currency)}
                {subscription.price.recurring && (
                  <span className="text-gray-500 text-sm ml-1">
                    /{subscription.price.recurring.interval}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-gray-700 font-medium">Status</div>
              <div className="text-gray-900 font-semibold capitalize">{subscription.status}</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-gray-700 font-medium">Current Period Ends</div>
              <div className="text-gray-900 font-semibold">{formatDate(subscription.current_period_end)}</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-gray-700 font-medium">Started On</div>
              <div className="text-gray-900 font-semibold">{formatDate(subscription.created)}</div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Subscription Benefits</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-gray-700">Premium badge and highlighted listing</div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-gray-700">Priority placement in search results</div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-gray-700">Enhanced analytics and performance reports</div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-gray-700">Booking and directions integration</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Need to manage your subscription? You can update your payment method, 
                cancel, or change your plan through your Stripe customer portal.
              </p>
              <button
                onClick={() => {
                  // In a real implementation, this would open the Stripe customer portal
                  alert('This would open the Stripe customer portal in a production environment');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show subscription options
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <div className="flex items-center">
          <Crown className="w-8 h-8 mr-3" />
          <div>
            <h3 className="text-xl font-bold">Upgrade Your Business</h3>
            <p className="text-blue-100">Choose a subscription plan to enhance your visibility</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-green-700">{success}</div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-red-700">{error}</div>
          </div>
        )}
        
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-900">Select a Subscription Plan</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.priceId}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedProductId === product.priceId
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
                onClick={() => handleProductSelect(product.priceId)}
              >
                <div className="flex items-start">
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${
                    selectedProductId === product.priceId
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedProductId === product.priceId && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-lg font-semibold text-gray-900">{product.name}</h5>
                      <div className="text-lg font-bold text-blue-600">
                        {formatPrice(product.price, product.currency)}
                        <span className="text-sm text-gray-500 font-normal">/{product.interval}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-1">{product.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Premium Benefits
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Crown className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Premium Badge</h5>
                  <p className="text-sm text-gray-600">Stand out with a premium badge on your listing</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Priority Placement</h5>
                  <p className="text-sm text-gray-600">Appear at the top of search results</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <Shield className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Verified Status</h5>
                  <p className="text-sm text-gray-600">Build trust with verified business status</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <Award className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Performance Reports</h5>
                  <p className="text-sm text-gray-600">Get detailed analytics and insights</p>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading || !selectedProductId}
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {checkoutLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Subscribe Now
              </>
            )}
          </button>
          
          <div className="text-center text-sm text-gray-500">
            <p>Secure payment processing by Stripe</p>
            <p className="mt-1">You can cancel your subscription at any time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;