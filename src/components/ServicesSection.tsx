import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ServicesSectionProps {
  services: string[];
  category: string;
  city: string;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services, category, city }) => {
  if (services.length === 0) return null;

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular {category} Services in {city}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the specific services you need from top-rated {category.toLowerCase()} in {city}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
            >
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                <span className="text-gray-900 font-medium">{service}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;