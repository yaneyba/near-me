import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import { MapPin, Phone, Globe, CheckCircle } from 'lucide-react';
import { DataProviderFactory } from '@/providers/DataProviderFactory';
import { Stars, WaterStationDetail, transformBusinessToWaterStationDetail, formatAddress } from '@/components/water-refill';

interface WaterRefillDetailPageProps {
  subdomainInfo: SubdomainInfo;
}

const WaterRefillDetailPage: React.FC<WaterRefillDetailPageProps> = ({ subdomainInfo }) => {
  const { stationId } = useParams<{ stationId: string }>();
  const [station, setStation] = useState<WaterStationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const dataProvider = DataProviderFactory.getProvider();

  useEffect(() => {
    const loadStationData = async () => {
      try {
        if (!stationId) {
          setLoading(false);
          return;
        }

        let businessData = null;
        
        if (subdomainInfo.city === 'All Cities') {
          // If no specific city, search across all cities
          const cities = await dataProvider.getCities();
          
          for (const city of cities) {
            try {
              const businesses = await dataProvider.getBusinesses('water-refill', city);
              businessData = businesses.find(b => b.id === stationId);
              if (businessData) break;
            } catch (error) {
              console.warn(`Failed to search in city ${city}:`, error);
            }
          }
        } else {
          // Get all water-refill businesses for the current city
          const businesses = await dataProvider.getBusinesses('water-refill', subdomainInfo.city);
          businessData = businesses.find(b => b.id === stationId);
        }
        
        if (businessData) {
          // Transform business data to station format - ONLY use real data
          const transformedStation = transformBusinessToWaterStationDetail(businessData);
          setStation(transformedStation);
        }
      } catch (error) {
        console.error('Error loading station data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStationData();
  }, [stationId, dataProvider]);

  if (loading) {
    return (
      <WaterRefillLayout subdomainInfo={subdomainInfo} showSearchBar={true}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading station details...</div>
        </div>
      </WaterRefillLayout>
    );
  }

  if (!station) {
    return (
      <WaterRefillLayout subdomainInfo={subdomainInfo} showSearchBar={true}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Station not found</div>
        </div>
      </WaterRefillLayout>
    );
  }

  return (
    <WaterRefillLayout subdomainInfo={subdomainInfo} showSearchBar={true}>
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex flex-wrap items-center text-sm text-gray-500 gap-1">
              <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span className="mx-1 sm:mx-2">/</span>
              <Link to="/stations" className="hover:text-blue-600 transition-colors">Find Stations</Link>
              <span className="mx-1 sm:mx-2">/</span>
              <span className="text-gray-900 truncate">{station.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Station Header */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">{station.name}</h1>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600">
                      <Stars 
                        rating={station.rating} 
                        showRating={true} 
                        reviewCount={station.reviewCount} 
                      />
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 break-words">
                  {formatAddress(station.address, station.city, station.state, station.zipCode)}
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mb-6">
                  {station.pricePerGallon && (
                    <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="text-lg sm:text-2xl font-bold text-blue-600">{station.pricePerGallon}</div>
                      <div className="text-xs sm:text-sm text-gray-600">per gallon</div>
                    </div>
                  )}
                  {station.waterTypes.length > 0 && (
                    <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="text-lg sm:text-2xl font-bold text-gray-900">{station.waterTypes.length}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Water Types</div>
                    </div>
                  )}
                  {station.rating > 0 && (
                    <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="text-lg sm:text-2xl font-bold text-yellow-600">{station.rating}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Rating</div>
                    </div>
                  )}
                </div>

                {station.description && (
                  <p className="text-gray-700 mb-6 leading-relaxed">{station.description}</p>
                )}

                <div className="flex flex-col xs:flex-row gap-3">
                  <button className="bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 font-medium min-h-[44px] touch-manipulation">
                    <MapPin className="w-4 h-4" />
                    Get Directions
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-3 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center gap-2 font-medium min-h-[44px] touch-manipulation">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-3 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center gap-2 font-medium min-h-[44px] touch-manipulation">
                    <Globe className="w-4 h-4" />
                    Website
                  </button>
                </div>
              </div>

              {/* Photos */}
              {station.photos.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">Photos</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {station.photos.map((photo, index) => (
                      <div key={index} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={photo} 
                          alt={`${station.name} - Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Hide the image container if image fails to load
                            (e.target as HTMLElement).parentElement!.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {station.reviewCount > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">
                    Reviews ({station.reviewCount})
                  </h2>
                  <div className="text-center py-8">
                    <div className="text-gray-500 mb-2">
                      This business has {station.reviewCount} review{station.reviewCount !== 1 ? 's' : ''} on Google
                    </div>
                    <div className="text-sm text-gray-400">
                      Individual reviews are not displayed to ensure authenticity
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Business Hours - Only show if we have real hours data */}
              {Object.values(station.hours).some(hour => hour.trim() !== '') && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
                  <div className="space-y-2">
                    {Object.entries(station.hours).map(([day, hours]) => 
                      hours.trim() !== '' && (
                        <div key={day} className="flex justify-between items-center text-sm py-1">
                          <span className="capitalize font-medium text-gray-900">{day}</span>
                          <span className="text-gray-600 text-right">{hours}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Water Types - Only show if we have real water types */}
              {station.waterTypes.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4">Water Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {station.waterTypes.map((type) => (
                      <span
                        key={type}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1.5 rounded-full font-medium border border-blue-200"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities - Only show if we have real amenities */}
              {station.amenities.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                  <div className="space-y-3">
                    {station.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact - Only show if we have real contact info */}
              {(station.phone || station.website) && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact</h3>
                  <div className="space-y-3">
                    {station.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                        <a 
                          href={`tel:${station.phone}`} 
                          className="text-blue-600 hover:text-blue-800 transition-colors break-all"
                        >
                          {station.phone}
                        </a>
                      </div>
                    )}
                    {station.website && (
                      <div className="flex items-center text-sm">
                        <Globe className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                        <a 
                          href={station.website} 
                          className="text-blue-600 hover:text-blue-800 transition-colors break-all"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </WaterRefillLayout>
  );
};

export default WaterRefillDetailPage;
