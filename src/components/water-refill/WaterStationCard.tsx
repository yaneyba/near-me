import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star, MapPin, Clock, Phone, CreditCard, Droplets } from 'lucide-react';
import { WaterStation } from '@/components/water-refill/types';

interface WaterStationCardProps {
  station: WaterStation;
  isSelected?: boolean;
  onClick?: () => void;
  showImage?: boolean;
  compact?: boolean;
}

const WaterStationCard: React.FC<WaterStationCardProps> = ({ 
  station, 
  onClick,
  isSelected = false,
  showImage = true,
  compact = false
}) => {
  // Smart HomePage detection
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Smart address formatting - avoid duplication
  const formatAddress = (address: string, city: string, state: string): string => {
    if (!address) return [city, state].filter(Boolean).join(', ') || 'Address not available';
    
    const addressLower = address.toLowerCase();
    const cityLower = city?.toLowerCase() || '';
    const stateLower = state?.toLowerCase() || '';
    
    // Check if address already contains city and/or state
    const hasCity = cityLower && (
      addressLower.includes(cityLower) || 
      addressLower.includes(cityLower.replace('-', ' '))
    );
    const hasState = stateLower && (addressLower.includes(stateLower) || addressLower.includes(stateLower.substring(0, 2)));
    
    // Build address parts
    const parts = [address];
    if (!hasCity && city) parts.push(city);
    if (!hasState && state) parts.push(state);
    
    return parts.join(', ');
  };
  
  // Render original card layout ONLY on HomePage
  if (isHomePage) {
    return (
      <div 
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        onClick={onClick}
      >
        <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
          {station.image ? (
            <img 
              src={station.image} 
              alt={station.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
              <svg className="w-12 h-12 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <h3 className="font-bold text-xl text-gray-900 leading-tight">{station.name}</h3>
          
          <div className="flex items-start text-gray-600">
            <MapPin className="w-4 h-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
            <p className="text-sm leading-relaxed">
              {formatAddress(station.address, station.city, station.state)}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-semibold text-gray-900">{station.rating}</span>
              <span className="text-sm text-gray-500">(4.2k reviews)</span>
            </div>
            <div className="bg-blue-50 px-3 py-1 rounded-full">
              <span className="text-blue-700 font-bold text-lg">{station.priceRange || '$0.50/gal'}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {station.amenities?.slice(0, 3).map((service: string, index: number) => (
              <span key={index} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1.5 rounded-full border">
                {service}
              </span>
            )) || (
              <>
                <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1.5 rounded-full border border-blue-200">
                  Purified Water
                </span>
                <span className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1.5 rounded-full border border-green-200">
                  Quality Tested
                </span>
              </>
            )}
          </div>
          
          <Link 
            to={`/station/${station.id}`}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 block text-center shadow-sm hover:shadow-md"
          >
            View Details
          </Link>
        </div>
      </div>
    );
  }
  
  // Render compact/list layout for other pages (stations page, etc.)
  return (
    <div 
      className={`bg-white border rounded-lg p-4 cursor-pointer hover:shadow-lg active:scale-[0.98] transition-all duration-200 max-w-full ${
        isSelected ? 'border-blue-500 shadow-lg ring-2 ring-blue-100' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className={`flex ${showImage && station.image ? 'flex-col sm:flex-row sm:gap-4' : 'flex-col'}`}>
        
        {/* Station Image - Compact for listing pages */}
        {showImage && (
          <div className={`flex-shrink-0 ${compact ? 'w-full sm:w-20 h-16 sm:h-16' : 'w-full sm:w-24 h-20 sm:h-20'} mb-3 sm:mb-0 rounded-lg overflow-hidden bg-gray-100`}>
            {station.image ? (
              <img 
                src={station.image} 
                alt={station.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600">
                <Droplets className="w-6 h-6" />
              </div>
            )}
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start mb-2 gap-1">
            <h3 className={`font-semibold text-gray-900 ${compact ? 'text-base' : 'text-lg'} leading-tight truncate`}>
              {station.name}
            </h3>
            {station.rating > 0 && (
              <div className="flex items-center flex-shrink-0 xs:ml-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium text-gray-600">{station.rating}</span>
              </div>
            )}
          </div>
      
          <div className="flex items-start text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
            <span className="break-words leading-relaxed">
              {formatAddress(station.address, station.city, station.state)}
            </span>
          </div>
      
          {(station.hours || station.distance) && (
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between text-sm text-gray-600 mb-2 gap-2">
              <div className="flex items-center flex-wrap">
                <Clock className="w-4 h-4 mr-1 flex-shrink-0 text-gray-400" />
                <span className="text-gray-500">
                  {station.hours || 'Hours not available'}
                </span>
              </div>
              {station.distance && (
                <span className="text-blue-600 font-semibold text-sm">{station.distance}</span>
              )}
            </div>
          )}

          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-3 gap-2">
            {station.priceRange && (
              <div className="flex items-center">
                <Droplets className="w-4 h-4 text-blue-500 mr-2" />
                <span className="font-bold text-lg text-blue-600">{station.priceRange}</span>
              </div>
            )}
            {station.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-1 flex-shrink-0 text-gray-400" />
                <span className="truncate">{station.phone}</span>
              </div>
            )}
          </div>

          {station.amenities && station.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {station.amenities.map((amenity: string, index: number) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border"
                >
                  {amenity.includes('Credit Card') && <CreditCard className="w-3 h-3 mr-1" />}
                  {amenity}
                </span>
              ))}
            </div>
          )}

          <Link 
            to={`/station/${station.id}`}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors text-center font-semibold shadow-sm hover:shadow-md min-h-[44px] touch-manipulation flex items-center justify-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WaterStationCard;
