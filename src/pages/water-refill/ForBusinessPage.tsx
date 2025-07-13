import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import { 
  Home, 
  ChevronRight, 
  Droplets, 
  TrendingUp, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight,
  MapPin,
  Shield,
  Globe,
  BarChart3,
  DollarSign,
  Clock
} from 'lucide-react';
import { getStatistics } from '@/config/statistics';

interface WaterRefillForBusinessPageProps {
  subdomainInfo: SubdomainInfo;
}

const WaterRefillForBusinessPage: React.FC<WaterRefillForBusinessPageProps> = ({ subdomainInfo }) => {
  const stats = getStatistics();
  
  // Update document title
  useEffect(() => {
    document.title = 'For Business - Water Refill Station Finder';
  }, []);

  return (
    <WaterRefillLayout subdomainInfo={subdomainInfo} showSearchBar={true}>
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex flex-wrap items-center text-sm text-gray-500 gap-1">
            <Link to="/" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            <span className="flex items-center text-gray-900">
              <Droplets className="w-4 h-4 mr-1" />
              For Business
            </span>
          </nav>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Grow Your Water Refill Business</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Connect with thousands of customers looking for clean, affordable water. 
              List your water refill station and start growing your business today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                List Your Business
              </button>
              <Link 
                to="/contact" 
                className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors inline-block"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Benefits Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why List With Us?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join the largest network of water refill stations and connect with customers who value quality, 
                sustainability, and convenience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Reach More Customers</h3>
                <p className="text-gray-600">
                  Get discovered by thousands of people actively searching for water refill stations in your area.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Increase Revenue</h3>
                <p className="text-gray-600">
                  Drive more foot traffic to your location and increase sales with targeted customer acquisition.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Build Your Reputation</h3>
                <p className="text-gray-600">
                  Collect customer reviews and ratings to build trust and credibility in your community.
                </p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
              <p className="text-lg text-gray-600">
                Everything you need to manage your listing and grow your business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature 1 */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Interactive Maps & Directions</h3>
                  <p className="text-gray-600">
                    Customers can easily find your location with GPS navigation and turn-by-turn directions.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Real-Time Business Information</h3>
                  <p className="text-gray-600">
                    Update your hours, pricing, and availability in real-time to keep customers informed.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Analytics & Insights</h3>
                  <p className="text-gray-600">
                    Track views, customer interactions, and performance metrics to optimize your listing.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Quality Verification</h3>
                  <p className="text-gray-600">
                    Get verified status to build customer trust and demonstrate your commitment to quality.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Globe className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Mobile-Optimized Listings</h3>
                  <p className="text-gray-600">
                    Your business appears perfectly on all devices, ensuring maximum visibility.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Competitive Pricing</h3>
                  <p className="text-gray-600">
                    Affordable listing fees with transparent pricing and no hidden costs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Thousands of Successful Businesses</h2>
              <p className="text-lg text-gray-600">
                See why water refill station owners choose our platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.waterRefill.listedStations}+</div>
                <div className="text-gray-600">Listed Stations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.waterRefill.monthlySearches}</div>
                <div className="text-gray-600">Monthly Searches</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.waterRefill.averageRating}★</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.waterRefill.customerSatisfaction}%</div>
                <div className="text-gray-600">Customer Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-gray-600">
                Choose the plan that works best for your business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Listing</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  $29<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Basic business listing
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Contact information display
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Hours and pricing updates
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Basic analytics
                  </li>
                </ul>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Get Started
                </button>
              </div>

              {/* Professional Plan */}
              <div className="bg-white rounded-lg shadow-sm border-2 border-blue-500 p-6 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Professional</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  $59<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Everything in Basic
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Photo gallery (up to 10 photos)
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Customer reviews & ratings
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Priority support
                  </li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Get Started
                </button>
              </div>

              {/* Premium Plan */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  $99<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Everything in Professional
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Featured listing placement
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Unlimited photos
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Social media integration
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Dedicated account manager
                  </li>
                </ul>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of successful water refill businesses and start growing your customer base today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center">
                List Your Business
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <Link 
                to="/contact" 
                className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors inline-block"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </WaterRefillLayout>
  );
};

export default WaterRefillForBusinessPage;
