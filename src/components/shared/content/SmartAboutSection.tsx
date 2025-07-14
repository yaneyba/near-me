import React from 'react';
import { Users, Target, Award, Droplets, DollarSign, Recycle } from 'lucide-react';
import { getPageConfig } from '@/config/pageConfigs';

interface SmartAboutSectionProps {
  category: string;
  city: string;
  state: string;
}

const iconMap = {
  'Users': Users,
  'Target': Target,
  'Award': Award,
  'Droplets': Droplets,
  'DollarSign': DollarSign,
  'Recycle': Recycle
};

const SmartAboutSection: React.FC<SmartAboutSectionProps> = ({ category, city, state }) => {
  const config = getPageConfig(category);
  const aboutConfig = config.about;

  if (!aboutConfig) return null;

  const title = typeof aboutConfig.title === 'function' 
    ? aboutConfig.title(category, city) 
    : aboutConfig.title;
    
  const description = typeof aboutConfig.description === 'function' 
    ? aboutConfig.description(category, city, state) 
    : aboutConfig.description;

  return (
    <div id="about" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {aboutConfig.features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || Users;
            return (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {aboutConfig.showTestimonials && (
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">What Our Users Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "This directory made it so easy to find exactly what I was looking for. The businesses listed are top quality and the reviews are honest."
                </p>
                <p className="font-semibold text-gray-900">- Sarah M.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Great resource for local businesses. I've discovered several new places that I wouldn't have found otherwise."
                </p>
                <p className="font-semibold text-gray-900">- Mike D.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartAboutSection;
