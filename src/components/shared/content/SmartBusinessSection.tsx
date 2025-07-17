import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Star, Shield, MapPin, Users, BarChart } from 'lucide-react';
import { getPageConfig } from '@/config/pageConfigs';

interface SmartBusinessSectionProps {
  category: string;
  city: string;
  state: string;
}

const iconMap = {
  'TrendingUp': TrendingUp,
  'Star': Star,
  'Shield': Shield,
  'MapPin': MapPin,
  'Users': Users,
  'BarChart': BarChart
};

const SmartBusinessSection: React.FC<SmartBusinessSectionProps> = ({ category, city, state }) => {
  const config = getPageConfig(category);
  const businessConfig = config.business;

  if (!businessConfig) return null;

  const title = typeof businessConfig.title === 'function' 
    ? businessConfig.title(category, city) 
    : businessConfig.title;
    
  const subtitle = typeof businessConfig.subtitle === 'function' 
    ? businessConfig.subtitle(category, city, state) 
    : businessConfig.subtitle;

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {subtitle}
          </p>
          <Link 
            to="/submit-business"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            {businessConfig.ctaText || 'Get Started'}
          </Link>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {businessConfig.benefits.map((benefit, index) => {
              const IconComponent = iconMap[benefit.icon as keyof typeof iconMap] || TrendingUp;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your business profile in minutes with our easy setup process.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Verified</h3>
              <p className="text-gray-600">Our team verifies your business information to build customer trust.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Growing</h3>
              <p className="text-gray-600">Begin connecting with customers and growing your business immediately.</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Local Businesses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Cities Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600">Monthly Visitors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">4.8★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-xl text-blue-100 mb-6">
            Join hundreds of businesses already growing with our platform.
          </p>
          <Link 
            to="/submit-business"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            {businessConfig.ctaText || 'Get Started Today'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SmartBusinessSection;
