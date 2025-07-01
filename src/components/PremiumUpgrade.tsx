import React, { useState } from 'react';
import { Crown, X, Star, Zap, BarChart3, Calendar, Navigation, Camera, MessageSquare, Award, ArrowRight, CheckCircle, Mail, Phone } from 'lucide-react';
import { SITE_INFO } from '../siteInfo';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

interface PremiumUpgradeProps {
  businessName: string;
  onClose: () => void;
}

const PremiumUpgrade: React.FC<PremiumUpgradeProps> = ({ businessName, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const upgradeFeatures = [
    {
      icon: Crown,
      title: 'Premium Badge',
      description: 'Stand out with a premium crown badge that builds trust and credibility',
      benefit: 'Increase customer confidence'
    },
    {
      icon: Star,
      title: 'Priority Placement',
      description: 'Appear first in search results and category listings',
      benefit: 'Get more visibility'
    },
    {
      icon: Calendar,
      title: 'Online Booking Links',
      description: 'Direct booking buttons that capture customers instantly',
      benefit: 'Convert visitors to customers'
    },
    {
      icon: Navigation,
      title: 'GPS Directions',
      description: 'One-click directions to your business location',
      benefit: 'Make it easy to find you'
    },
    {
      icon: Camera,
      title: 'Enhanced Photos',
      description: 'Showcase multiple high-quality business photos',
      benefit: 'Show your best side'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Detailed insights on views, clicks, and customer engagement',
      benefit: 'Track your success'
    }
  ];

  const handleContactSales = () => {
    if (user) {
      // If user is logged in, navigate to the subscription tab in the business dashboard
      navigate('/business/dashboard', { state: { activeTab: 'subscription' } });
      onClose();
    } else {
      // If user is not logged in, redirect to login page with return destination
      navigate('/login', { 
        state: { 
          from: '/business/dashboard', 
          message: 'Please log in to upgrade your business listing' 
        } 
      });
      onClose();
    }
  };

  const handlePhoneCall = () => {
    window.location.href = `tel:${SITE_INFO.phone.replace(/[^\d+]/g, '')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Upgrade to Premium</h2>
              <p className="text-yellow-100">{businessName}</p>
            </div>
          </div>
          
          <p className="text-white/90 text-sm">
            Stand out from the competition and attract more customers with premium features
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Value Proposition */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Get 3x More Customer Engagement
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Premium businesses on our platform see significantly higher customer engagement, 
              more phone calls, and increased bookings compared to basic listings.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {upgradeFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                  <div className="flex items-center text-xs text-green-600 font-medium">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {feature.benefit}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Before/After Comparison */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-6 text-center">
              See the Difference Premium Makes
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Listing */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-center mb-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">Basic Listing</div>
                  <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Standard business card</span>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Basic business information</li>
                  <li>• Standard placement in results</li>
                  <li>• Contact information only</li>
                  <li>• Limited visibility</li>
                </ul>
              </div>

              {/* Premium Listing */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-300 relative">
                <div className="absolute -top-2 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  PREMIUM
                </div>
                <div className="text-center mb-4">
                  <div className="text-sm font-medium text-yellow-700 mb-2">Premium Listing</div>
                  <div className="w-full h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center border-2 border-yellow-200">
                    <Crown className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                <ul className="text-sm text-yellow-800 space-y-2">
                  <li className="flex items-center">
                    <Crown className="w-3 h-3 mr-2" />
                    Premium badge & priority placement
                  </li>
                  <li className="flex items-center">
                    <Calendar className="w-3 h-3 mr-2" />
                    Direct booking buttons
                  </li>
                  <li className="flex items-center">
                    <Navigation className="w-3 h-3 mr-2" />
                    GPS directions & enhanced photos
                  </li>
                  <li className="flex items-center">
                    <BarChart3 className="w-3 h-3 mr-2" />
                    Performance analytics
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">
                Join 200+ Premium Businesses
              </h4>
              <p className="text-blue-800 text-sm mb-4">
                "Since upgrading to premium, we've seen a 40% increase in customer calls and bookings. 
                The premium badge really builds trust with potential customers."
              </p>
              <div className="text-xs text-blue-600">
                - Sarah J., Elegant Nails Studio (Premium Member)
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              Ready to Upgrade {businessName}?
            </h4>
            <p className="text-gray-600 mb-6">
              Contact our team to learn about premium pricing and get your business featured today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleContactSales}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Sales Team
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              
              <button
                onClick={handlePhoneCall}
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call {SITE_INFO.phone}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              No commitment required. Get a custom quote for your business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumUpgrade;