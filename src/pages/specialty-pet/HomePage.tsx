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

        {/* Shop Premium Pet Supplies By Category */}
        <section className="py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop Premium Pet Supplies By Category
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Food & Treats */}
            <div className="relative overflow-hidden rounded-xl h-48" style={{ background: 'linear-gradient(135deg, #FFA726 0%, #FF7043 100%)' }}>
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative h-full flex flex-col justify-center items-center text-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Food & Treats</h3>
                <p className="text-sm mb-4 opacity-90">Premium pet food and delicious treats for all types of pets</p>
                <Link 
                  to="/products?category=food-treats"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium backdrop-blur-sm"
                >
                  Explore
                </Link>
              </div>
            </div>

            {/* Accessories */}
            <div className="relative overflow-hidden rounded-xl h-48" style={{ background: 'linear-gradient(135deg, #5C6BC0 0%, #3F51B5 100%)' }}>
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative h-full flex flex-col justify-center items-center text-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Accessories</h3>
                <p className="text-sm mb-4 opacity-90">Essential and unique pet accessories for your beloved companions</p>
                <Link 
                  to="/products?category=accessories"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium backdrop-blur-sm"
                >
                  Explore
                </Link>
              </div>
            </div>

            {/* Health & Wellness */}
            <div className="relative overflow-hidden rounded-xl h-48" style={{ background: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)' }}>
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative h-full flex flex-col justify-center items-center text-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Health & Wellness</h3>
                <p className="text-sm mb-4 opacity-90">Natural pet supplements and wellness products to keep your pets healthy</p>
                <Link 
                  to="/products?category=health-wellness"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium backdrop-blur-sm"
                >
                  Explore
                </Link>
              </div>
            </div>

            {/* Grooming */}
            <div className="relative overflow-hidden rounded-xl h-48" style={{ background: 'linear-gradient(135deg, #AB47BC 0%, #8E24AA 100%)' }}>
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative h-full flex flex-col justify-center items-center text-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Grooming</h3>
                <p className="text-sm mb-4 opacity-90">Professional pet grooming products and premium supplies</p>
                <Link 
                  to="/products?category=grooming"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium backdrop-blur-sm"
                >
                  Explore
                </Link>
              </div>
            </div>

            {/* Training */}
            <div className="relative overflow-hidden rounded-xl h-48" style={{ background: 'linear-gradient(135deg, #FF7043 0%, #FF5722 100%)' }}>
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative h-full flex flex-col justify-center items-center text-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Training</h3>
                <p className="text-sm mb-4 opacity-90">Advanced dog training equipment and educational resources</p>
                <Link 
                  to="/products?category=training"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium backdrop-blur-sm"
                >
                  Explore
                </Link>
              </div>
            </div>

            {/* Travel */}
            <div className="relative overflow-hidden rounded-xl h-48" style={{ background: 'linear-gradient(135deg, #26A69A 0%, #00897B 100%)' }}>
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative h-full flex flex-col justify-center items-center text-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Travel</h3>
                <p className="text-sm mb-4 opacity-90">Luxury pet travel accessories and gear for pets on the go</p>
                <Link 
                  to="/products?category=travel"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium backdrop-blur-sm"
                >
                  Explore
                </Link>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link 
              to="/products"
              className="inline-flex items-center bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-lg gap-2"
            >
              View All Products
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
