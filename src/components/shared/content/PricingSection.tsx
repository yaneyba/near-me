import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  CheckCircle, 
  Star, 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  Navigation, 
  Camera, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { STRIPE_PRODUCTS } from '@/stripe-config';
import { createCheckoutSession } from '@/lib/stripe';
import { useAuth } from '@/lib/auth';

const PricingSection: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = async (priceId: string, productName: string) => {
    try {
      if (!user) {
        navigate('/login', { state: { from: '/business-owners', message: 'Please log in to subscribe to a plan' } });
        return;
      }

      setLoading(priceId);
      setError(null);

      const { url } = await createCheckoutSession(priceId);
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An error occurred during checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Crown className="w-4 h-4 mr-2" />
            PREMIUM PLANS
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose the Right Plan for Your Business
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Upgrade your business listing to get more visibility, attract more customers, 
            and grow your business with our premium features.
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Premium Plan */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-yellow-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">{STRIPE_PRODUCTS.PREMIUM_BUSINESS.name}</h3>
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-white">$150</span>
                <span className="ml-1 text-xl text-yellow-100">/month</span>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                {STRIPE_PRODUCTS.PREMIUM_BUSINESS.description}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Premium Badge</div>
                    <div className="text-sm text-gray-500">Stand out with a premium badge on your listing</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Priority Placement</div>
                    <div className="text-sm text-gray-500">Appear higher in search results</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Photo Gallery</div>
                    <div className="text-sm text-gray-500">Showcase multiple business photos</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Online Booking</div>
                    <div className="text-sm text-gray-500">Allow customers to book directly</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Priority Support</div>
                    <div className="text-sm text-gray-500">Get faster responses to your inquiries</div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleSubscribe(STRIPE_PRODUCTS.PREMIUM_BUSINESS.priceId, STRIPE_PRODUCTS.PREMIUM_BUSINESS.name)}
                disabled={loading !== null}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading === STRIPE_PRODUCTS.PREMIUM_BUSINESS.priceId ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5 mr-2" />
                    Subscribe Now
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Featured Plan */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-purple-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">{STRIPE_PRODUCTS.FEATURED_BUSINESS.name}</h3>
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-white">$300</span>
                <span className="ml-1 text-xl text-purple-100">/month</span>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                {STRIPE_PRODUCTS.FEATURED_BUSINESS.description}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Top 3 Positioning</div>
                    <div className="text-sm text-gray-500">Guaranteed placement in top 3 results</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Highlighted Design</div>
                    <div className="text-sm text-gray-500">Special visual treatment to stand out</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Performance Reports</div>
                    <div className="text-sm text-gray-500">Monthly analytics and insights</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">All Premium Features</div>
                    <div className="text-sm text-gray-500">Includes all premium plan benefits</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Dedicated Account Manager</div>
                    <div className="text-sm text-gray-500">Personal support for your business</div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleSubscribe(STRIPE_PRODUCTS.FEATURED_BUSINESS.priceId, STRIPE_PRODUCTS.FEATURED_BUSINESS.name)}
                disabled={loading !== null}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading === STRIPE_PRODUCTS.FEATURED_BUSINESS.priceId ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Subscribe Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            All plans include a 14-day money-back guarantee. You can cancel your subscription at any time.
            For custom plans or special requirements, please <a href="/contact" className="text-blue-600 hover:text-blue-800 underline">contact us</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;