/**
 * Senior Care Home Page
 * 
 * Feature-focused landing page for senior care services directory
 */

import React from 'react';
import { Layout as SeniorCareLayout, SeniorCareBreadcrumb } from '@/components/layouts/senior-care';
import { SubdomainInfo } from '@/types';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield, Clock, Phone } from 'lucide-react';

interface SeniorCareHomePageProps {
  subdomainInfo: SubdomainInfo;
}

const SeniorCareHomePage: React.FC<SeniorCareHomePageProps> = ({ subdomainInfo }) => {
  const handleSearch = (query: string) => {
    // Navigate to list page with search
    const searchParams = new URLSearchParams({ q: query });
    window.location.href = `/services?${searchParams.toString()}`;
  };

  const handleClearSearch = () => {
    // Not used on homepage but required for layout
  };

  return (
    <SeniorCareLayout 
      subdomainInfo={subdomainInfo}
      showSearchBar={false}
      onSearch={handleSearch}
      onClearSearch={handleClearSearch}
      currentSearchQuery=""
    >
      <SeniorCareBreadcrumb />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose CareFinder?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your trusted directory for compassionate senior care services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Compassionate Care
              </h3>
              <p className="text-gray-600 text-sm">
                All our providers are vetted for quality and compassionate care
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Licensed & Insured
              </h3>
              <p className="text-gray-600 text-sm">
                All providers are properly licensed and carry full insurance
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                24/7 Availability
              </h3>
              <p className="text-gray-600 text-sm">
                Many providers offer round-the-clock care and emergency services
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Easy Contact
              </h3>
              <p className="text-gray-600 text-sm">
                Direct contact information for quick consultations and bookings
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Senior Care Services Near You
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Browse our comprehensive directory of trusted senior care providers in your area.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Browse All Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Service Categories */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Service Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive care services for every need
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                In-Home Care
              </h3>
              <p className="text-gray-600 mb-4">
                Personal care assistance in the comfort of your own home
              </p>
              <Link to="/services" className="text-blue-600 hover:text-blue-800 font-medium">
                Learn More →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Memory Care
              </h3>
              <p className="text-gray-600 mb-4">
                Specialized care for those with Alzheimer's and dementia
              </p>
              <Link to="/services" className="text-blue-600 hover:text-blue-800 font-medium">
                Learn More →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Assisted Living
              </h3>
              <p className="text-gray-600 mb-4">
                Community living with personalized care and support
              </p>
              <Link to="/services" className="text-blue-600 hover:text-blue-800 font-medium">
                Learn More →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Respite Care
              </h3>
              <p className="text-gray-600 mb-4">
                Temporary care to give family caregivers a break
              </p>
              <Link to="/services" className="text-blue-600 hover:text-blue-800 font-medium">
                Learn More →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Medical Services
              </h3>
              <p className="text-gray-600 mb-4">
                Nursing care and medical assistance at home
              </p>
              <Link to="/services" className="text-blue-600 hover:text-blue-800 font-medium">
                Learn More →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Transportation
              </h3>
              <p className="text-gray-600 mb-4">
                Safe transportation to appointments and activities
              </p>
              <Link to="/services" className="text-blue-600 hover:text-blue-800 font-medium">
                Learn More →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SeniorCareLayout>
  );
};

export default SeniorCareHomePage;
