import React from 'react';
import { Users, Target, Award } from 'lucide-react';

interface AboutSectionProps {
  category: string;
  city: string;
  state: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ category, city, state }) => {
  return (
    <div id="about" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            About {city} {category}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your trusted directory for finding quality {category.toLowerCase()} in {city}, {state}. 
            We connect customers with verified local businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Focus</h3>
            <p className="text-gray-600">
              We specialize in {city} businesses, providing detailed local information and reviews.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Listings</h3>
            <p className="text-gray-600">
              All business information is verified and regularly updated for accuracy.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Standards</h3>
            <p className="text-gray-600">
              We maintain high standards for business listings and customer service.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 mb-4">
                To help {city} residents find the best {category.toLowerCase()} in their area through 
                comprehensive listings, verified reviews, and detailed business information.
              </p>
              <p className="text-gray-600">
                We work directly with local businesses to ensure accurate information and help 
                customers make informed decisions.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Comprehensive local business directory</li>
                <li>• Verified contact information and hours</li>
                <li>• Real customer reviews and ratings</li>
                <li>• Easy-to-use search and filtering</li>
                <li>• Mobile-friendly platform</li>
                <li>• Regular updates and maintenance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;