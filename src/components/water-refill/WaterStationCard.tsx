import React from 'react';
import { Link } from 'react-router-dom';
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
  isSelected = false, 
  onClick, 
  showImage = true,
  compact = false 
}) => {
  return (
    <div 
      className={`bg-white border rounded-lg p-4 cursor-pointer hover:shadow-lg active:scale-[0.98] transition-all duration-200 max-w-full ${
        isSelected ? 'border-blue-500 shadow-lg ring-2 ring-blue-100' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      {/* Optimized layout with image and content side by side on larger screens */}
      <div className={`flex ${showImage && station.image ? 'flex-col sm:flex-row sm:gap-4' : 'flex-col'}`}>
        
        {/* Station Image - Smaller and more compact */}
        {showImage && station.image && (
          <div className={`flex-shrink-0 ${compact ? 'w-full sm:w-20 h-16 sm:h-16' : 'w-full sm:w-24 h-20 sm:h-20'} mb-3 sm:mb-0 rounded-lg overflow-hidden bg-gray-100`}>
            <img 
              src={station.image} 
              alt={station.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Hide the image container if image fails to load
                (e.target as HTMLElement).parentElement!.style.display = 'none';
              }}
            />
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
              {(() => {
                // If address already contains city/state info, just use the address
                if (station.address && (
                  station.address.toLowerCase().includes('san francisco') ||
                  station.address.toLowerCase().includes('california') ||
                  station.address.toLowerCase().includes('ca ')
                )) {
                  return station.address;
                }
                // Otherwise, combine address with city/state
                return [station.address, station.city, station.state].filter(Boolean).join(', ') || 'Address not available';
              })()}
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
