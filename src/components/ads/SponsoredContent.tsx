import React from 'react';
import { Star, ExternalLink, Crown } from 'lucide-react';

interface SponsoredContentProps {
  className?: string;
  category: string;
  city: string;
}

const SponsoredContent: React.FC<SponsoredContentProps> = ({ 
  className = '', 
  category, 
  city 
}) => {
  // Check if ads are enabled
  const adsEnabled = import.meta.env.VITE_ENABLE_ADS === 'true';

  if (!adsEnabled) return null;

  // Sample sponsored content - in production this would come from your ad server
  const sponsoredBusinesses = [
    {
      id: 'sponsored-1',
      name: `Premium ${category} Service`,
      description: `Top-rated ${category.toLowerCase()} serving ${city} and surrounding areas. Professional service with satisfaction guarantee.`,
      rating: 4.9,
      reviewCount: 250,
      phone: '(555) 123-SPONSOR',
      website: 'https://example.com',
      specialOffer: '20% off first service',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'
    }
  ];

  return (
    <div className={`bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 ${className}`}>
      {/* Sponsored Label */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Crown className="w-4 h-4 text-yellow-600" />
          <span className="text-xs font-bold text-yellow-700 uppercase tracking-wide">
            Sponsored
          </span>
        </div>
        <span className="text-xs text-gray-500">Advertisement</span>
      </div>

      {/* Sponsored Business */}
      {sponsoredBusinesses.map((business) => (
        <div key={business.id} className="space-y-4">
          <div className="flex items-start space-x-4">
            <img
              src={business.image}
              alt={business.name}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {business.name}
              </h3>
              <div className="flex items-center mt-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(business.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {business.rating}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">
                    ({business.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {business.description}
              </p>
            </div>
          </div>

          {/* Special Offer */}
          {business.specialOffer && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-800">
                  Special Offer: {business.specialOffer}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${business.phone}`}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-semibold text-center transition-colors"
            >
              Call {business.phone}
            </a>
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-white border-2 border-yellow-600 text-yellow-700 hover:bg-yellow-50 py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Website
            </a>
          </div>
        </div>
      ))}

      {/* Disclaimer */}
      <div className="mt-4 pt-4 border-t border-yellow-200">
        <p className="text-xs text-gray-500 text-center">
          This is a paid advertisement. Advertiser is responsible for content.
        </p>
      </div>
    </div>
  );
};

export default SponsoredContent;