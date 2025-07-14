import React from 'react';
import { 
  Crown, 
  CheckCircle
} from 'lucide-react';
import { getPageConfig } from '@/config/pageConfigs';

interface SmartPricingSectionProps {
  category: string;
}

interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  priceId?: string;
}

const SmartPricingSection: React.FC<SmartPricingSectionProps> = ({ category }) => {
  const config = getPageConfig(category);
  const pricingConfig = config.pricing;

  if (!pricingConfig) return null;

  // Use custom plans if available, otherwise use default plans
  const plans: PricingPlan[] = pricingConfig.customPlans || [
    {
      name: 'Basic Listing',
      price: 'Free',
      features: ['Basic business information', 'Location on map', 'Contact details', 'Operating hours'],
      highlighted: false
    },
    {
      name: 'Premium Business',
      price: '$29/month',
      features: ['Everything in Basic', 'Featured placement', 'Photo gallery', 'Customer reviews', 'Priority support'],
      highlighted: true,
      priceId: 'premium'
    },
    {
      name: 'Featured Business',
      price: '$49/month',
      features: ['Everything in Premium', 'Top placement', 'Enhanced listing', 'Analytics dashboard', 'Custom branding'],
      highlighted: false,
      priceId: 'featured'
    }
  ];

  const handleGetStarted = (plan: PricingPlan) => {
    if (plan.price === 'Free') {
      // Navigate to signup
      window.location.href = '/signup';
    } else {
      // Navigate to business owners login/signup
      window.location.href = '/login';
    }
  };

  return (
    <div id="pricing" className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {pricingConfig.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {pricingConfig.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-sm p-8 relative ${
                plan.highlighted ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">{plan.price}</div>
                {plan.price !== 'Free' && (
                  <div className="text-gray-500">per month</div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleGetStarted(plan)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                } flex items-center justify-center`}
              >
                {plan.price === 'Free' ? 'Get Started' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            All plans include a 14-day free trial. Cancel anytime.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              No setup fees
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Cancel anytime
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              24/7 support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartPricingSection;
