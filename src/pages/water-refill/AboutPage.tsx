import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import { Home, ChevronRight, Droplets } from 'lucide-react';

interface WaterRefillAboutPageProps {
  subdomainInfo: SubdomainInfo;
}

const WaterRefillAboutPage: React.FC<WaterRefillAboutPageProps> = ({ subdomainInfo }) => {
  // Update document title
  useEffect(() => {
    document.title = 'About - Water Refill Station Finder';
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
              About
            </span>
          </nav>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">About Water Refill Station Finder</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-600 mb-6">
                Welcome to the most comprehensive directory of water refill stations across the United States. 
                Our mission is to help you find clean, affordable water while reducing plastic waste and supporting 
                your local community.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                We believe that access to clean, affordable water should be convenient for everyone. By connecting 
                you with verified water refill stations in your area, we're helping reduce single-use plastic bottles 
                while saving you money on your daily hydration needs.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Comprehensive directory of verified water refill stations</li>
                <li>Real-time information on hours, pricing, and availability</li>
                <li>User reviews and ratings for quality assurance</li>
                <li>Interactive maps with turn-by-turn directions</li>
                <li>Mobile-friendly platform for on-the-go access</li>
                <li>Support for local water refill businesses</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quality Standards</h2>
              <p className="text-gray-600 mb-6">
                All water refill stations in our directory are verified for quality and safety. We work with 
                businesses that maintain proper filtration systems, regular maintenance schedules, and comply 
                with local health regulations.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Environmental Impact</h2>
              <p className="text-gray-600 mb-6">
                By choosing water refill stations over single-use plastic bottles, you're making a positive 
                impact on the environment. Each refill helps reduce plastic waste, lower carbon emissions 
                from bottle production and transportation, and supports sustainable water consumption practices.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">For Business Owners</h2>
              <p className="text-gray-600 mb-4">
                If you own a water refill station or are interested in starting one, we'd love to help you 
                connect with customers in your area. Our platform helps local businesses:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Increase visibility and customer reach</li>
                <li>Showcase your services and amenities</li>
                <li>Receive customer feedback and reviews</li>
                <li>Update business information in real-time</li>
              </ul>

              <div className="bg-blue-50 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Get Started Today</h3>
                <p className="text-gray-600 mb-4">
                  Ready to find clean, affordable water near you? Start by searching for stations in your area 
                  or browse our comprehensive directory.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    to="/stations" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Find Stations
                  </Link>
                  <Link 
                    to="/for-business" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    List Your Business
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WaterRefillLayout>
  );
};

export default WaterRefillAboutPage;
