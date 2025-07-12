import React, { useState, useEffect } from 'react';
import { Star, Phone, MapPin, Clock, ExternalLink, Globe, Crown, Zap, ChevronDown, ChevronUp, Navigation } from 'lucide-react';
import { Business } from '@/types';
import { engagementTracker } from '@/utils/engagementTracker';

interface PremiumListingsProps {
  businesses: Business[];
  category: string;
  city: string;
}

const PremiumListings: React.FC<PremiumListingsProps> = ({ businesses, category, city }) => {
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  
  // Filter premium businesses
  const premiumBusinesses = businesses.filter(business => business.premium);

  // Track premium section views
  useEffect(() => {
    if (premiumBusinesses.length > 0) {
      premiumBusinesses.forEach(business => {
        engagementTracker.trackView(
          business.id, 
          business.name, 
          'premium', 
          undefined
        );
      });
    }
  }, [premiumBusinesses]);

  if (premiumBusinesses.length === 0) {
    return null;
  }

  const toggleServicesExpansion = (businessId: string, businessName: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(businessId)) {
      newExpanded.delete(businessId);
    } else {
      newExpanded.add(businessId);
      // Track services expand event
      engagementTracker.trackServicesExpand(businessId, businessName);
    }
    setExpandedServices(newExpanded);
  };

  const handlePhoneClick = (business: Business) => {
    engagementTracker.trackPhoneClick(business.id, business.name, business.phone || '');
  };

  const handleWebsiteClick = (business: Business) => {
    if (business.website) {
      engagementTracker.trackWebsiteClick(business.id, business.name, business.website);
    }
  };

  const handleBookingClick = (business: Business, bookingUrl: string) => {
    engagementTracker.trackBookingClick(business.id, business.name, bookingUrl);
  };

  const handleDirectionsClick = (business: Business, directionsUrl: string) => {
    engagementTracker.trackDirectionsClick(business.id, business.name, directionsUrl);
  };

  const handleHoursView = (business: Business) => {
    engagementTracker.trackHoursView(business.id, business.name);
  };

  const handlePhotoView = (business: Business) => {
    engagementTracker.trackPhotoView(business.id, business.name, business.image || '');
  };

  const renderStars = (rating: number, reviewCount: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : i < rating
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 font-medium">{rating}</span>
        <span className="ml-1 text-sm text-gray-500">({reviewCount} reviews)</span>
      </div>
    );
  };

  const renderServices = (business: Business) => {
    if (!business.services || business.services.length === 0) {
      return null;
    }
    
    const isExpanded = expandedServices.has(business.id);
    const displayServices = isExpanded ? business.services : business.services.slice(0, 4);
    const hasMoreServices = business.services.length > 4;

    return (
      <div className="mb-6">
        <div className="text-sm font-semibold text-gray-900 mb-3">Premium Services:</div>
        <div className="flex flex-wrap gap-2">
          {displayServices.map((service, index) => (
            <span
              key={index}
              className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium border border-yellow-200 transition-all duration-200"
            >
              {service}
            </span>
          ))}
          {hasMoreServices && (
            <button
              onClick={() => toggleServicesExpansion(business.id, business.name)}
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 px-3 py-1 text-sm font-medium transition-all duration-200 hover:bg-yellow-50 rounded-full"
            >
              {isExpanded ? (
                <>
                  Show less
                  <ChevronUp className="w-3 h-3 ml-1" />
                </>
              ) : (
                <>
                  +{business.services?.length! - 4} more
                  <ChevronDown className="w-3 h-3 ml-1" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderBookingLinks = (business: Business) => {
    const bookingLinks = (business as any).bookingLinks;
    
    if (bookingLinks?.length > 0) {
      return (
        <div className="mb-6">
          <div className="text-sm font-semibold text-gray-900 mb-3">Quick Booking:</div>
          <div className="flex flex-wrap gap-3">
            {bookingLinks.map((link: string, index: number) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleBookingClick(business, link)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Book Online
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <div className="text-sm font-semibold text-gray-900 mb-3">Quick Booking:</div>
        <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg border border-gray-200">
          Coming Soon
        </div>
      </div>
    );
  };

  const renderLocationInfo = (business: Business) => {
    // Show directions if coordinates are available
    if (business.latitude && business.longitude) {
      const googleMapsUrl = `https://www.google.com/maps?q=${business.latitude},${business.longitude}`;

      return (
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0" />
            <span className="font-medium">{business.address}</span>
          </div>
          <div className="flex items-center">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleDirectionsClick(business, googleMapsUrl)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Get Directions
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      );
    }

    // Show "Coming Soon" for premium businesses without coordinates
    return (
      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0" />
          <span className="font-medium">{business.address}</span>
        </div>
        <div className="flex items-center">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg border border-gray-200">
            <Navigation className="w-4 h-4 mr-2" />
            Directions Coming Soon
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Premium {category} in {city}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our hand-selected premium {category.toLowerCase()} offering exceptional service, 
            verified quality, and outstanding customer experiences.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1 text-yellow-500" />
              <span>Verified Quality</span>
            </div>
            <div className="flex items-center">
              <Crown className="w-4 h-4 mr-1 text-yellow-500" />
              <span>Premium Service</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
              <span>Top Rated</span>
            </div>
          </div>
        </div>

        {/* Premium Business Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {premiumBusinesses.map((business, index) => (
            <div
              key={business.id}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-yellow-200 overflow-hidden relative group"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              {/* Premium Badge */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                  <Crown className="w-3 h-3 mr-1" />
                  PREMIUM
                </div>
              </div>

              {/* Business Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={business.image || '/placeholder-business.jpg'}
                  alt={business.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onClick={() => handlePhotoView(business)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 border border-white/20">
                  {business.city || 'Premium'}
                </div>
              </div>

              {/* Business Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-yellow-600 transition-colors">
                    {business.name}
                  </h3>
                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleWebsiteClick(business)}
                      className="text-yellow-600 hover:text-yellow-700 transition-colors p-2 hover:bg-yellow-50 rounded-full"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>

                {/* Rating with enhanced styling */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  {renderStars(business.rating || 0, business.review_count || 0)}
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  {business.description}
                </p>

                {/* Business Details */}
                <div className="space-y-4 mb-6">
                  {renderLocationInfo(business)}
                  {business.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0" />
                      <a 
                        href={`tel:${business.phone}`}
                        onClick={() => handlePhoneClick(business)}
                        className="hover:text-yellow-600 transition-colors font-medium"
                      >
                        {business.phone}
                      </a>
                    </div>
                  )}
                  <div 
                    className="flex items-start text-gray-600"
                    onClick={() => handleHoursView(business)}
                  >
                    <Clock className="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">
                        Today: {business.hours?.Monday || 'Hours not available'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services */}
                {renderServices(business)}
                {renderBookingLinks(business)}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  {business.phone && (
                    <a
                      href={`tel:${business.phone}`}
                      onClick={() => handlePhoneClick(business)}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 px-6 rounded-xl font-semibold text-center transition-all duration-200 focus:ring-4 focus:ring-yellow-300/50 focus:outline-none shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Call Now
                    </a>
                  )}
                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleWebsiteClick(business)}
                      className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-200 focus:ring-4 focus:ring-gray-300/50 focus:outline-none shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Premium Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Premium Benefits */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-yellow-200 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Choose Premium {category}?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Verified Quality</h4>
              <p className="text-gray-600">
                All premium businesses are thoroughly vetted for quality, reliability, and customer satisfaction.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium Service</h4>
              <p className="text-gray-600">
                Experience exceptional service standards with priority booking and exclusive amenities.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="w-8 h-8 text-white fill-current" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Top Rated</h4>
              <p className="text-gray-600">
                Only the highest-rated businesses with consistently excellent customer reviews.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumListings;