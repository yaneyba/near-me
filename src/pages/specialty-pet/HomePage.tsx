/**
 * Specialty Pet Home Page
 * 
 * Feature-focused landing page for specialty pet products marketplace
 */

import React from 'react';
import { SpecialtyPetLayout, SpecialtyPetBreadcrumb } from '@/components/layouts/specialty-pet';
import { SubdomainInfo } from '@/types';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, Heart } from 'lucide-react';

interface SpecialtyPetHomePageProps {
  subdomainInfo: SubdomainInfo;
}

const SpecialtyPetHomePage: React.FC<SpecialtyPetHomePageProps> = ({ subdomainInfo }) => {
  const handleSearch = (query: string) => {
    // Navigate to list page with search
    const searchParams = new URLSearchParams({ q: query });
    window.location.href = `/products?${searchParams.toString()}`;
  };

  const handleClearSearch = () => {
    // Not used on homepage but required for layout
  };

  return (
    <SpecialtyPetLayout 
      subdomainInfo={subdomainInfo}
      showSearchBar={false}
      onSearch={handleSearch}
      onClearSearch={handleClearSearch}
      currentSearchQuery=""
    >
      <SpecialtyPetBreadcrumb />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose PetCare Pro?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your trusted marketplace for premium specialty pet products and services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Verified Vendors
              </h3>
              <p className="text-gray-600 text-sm">
                All our pet service providers are thoroughly vetted and highly rated
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quality Guaranteed
              </h3>
              <p className="text-gray-600 text-sm">
                Premium products and services with satisfaction guarantee
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600 text-sm">
                Quick and reliable delivery for all your pet care needs
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Pet-Focused Care
              </h3>
              <p className="text-gray-600 text-sm">
                Specialized in exotic and unique pet care requirements
              </p>
            </div>
          </div>
        </section>

        {/* Product Categories Preview */}
        <section className="py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-lg text-gray-600">
              Discover products and services for every type of pet
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🐾</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Exotic Veterinary</h3>
              <p className="text-gray-600 mb-4">Specialized care for reptiles, birds, and exotic pets</p>
              <div className="text-emerald-600 font-medium">15+ Providers</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">✂️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Grooming</h3>
              <p className="text-gray-600 mb-4">Expert grooming services for all pet types</p>
              <div className="text-emerald-600 font-medium">25+ Providers</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Training & Behavior</h3>
              <p className="text-gray-600 mb-4">Professional training for pets with special needs</p>
              <div className="text-emerald-600 font-medium">10+ Specialists</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Boarding & Sitting</h3>
              <p className="text-gray-600 mb-4">Trusted care when you're away from home</p>
              <div className="text-emerald-600 font-medium">20+ Facilities</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pet Photography</h3>
              <p className="text-gray-600 mb-4">Capture precious moments with your beloved pets</p>
              <div className="text-emerald-600 font-medium">8+ Photographers</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Specialty Products</h3>
              <p className="text-gray-600 mb-4">Unique products for exotic and special needs pets</p>
              <div className="text-emerald-600 font-medium">50+ Products</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link 
              to="/products"
              className="inline-flex items-center bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-lg gap-2"
            >
              View All Categories
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Pet Parents Say
            </h2>
            <p className="text-lg text-gray-600">
              Trusted by thousands of pet families
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Finally found a vet who understands my iguana's needs. The exotic animal care here is exceptional!"
              </p>
              <div className="font-semibold text-gray-900">Sarah M.</div>
              <div className="text-gray-500 text-sm">Iguana Owner</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The grooming service for my Persian cat was amazing. They really know how to handle long-haired breeds."
              </p>
              <div className="font-semibold text-gray-900">Michael R.</div>
              <div className="text-gray-500 text-sm">Cat Parent</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Great selection of specialty products for my bird. The staff is knowledgeable and helpful."
              </p>
              <div className="font-semibold text-gray-900">Lisa K.</div>
              <div className="text-gray-500 text-sm">Bird Enthusiast</div>
            </div>
          </div>
        </section>

      </div>
    </SpecialtyPetLayout>
  );
};

export default SpecialtyPetHomePage;
