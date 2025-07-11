import React, { useState, useEffect } from 'react';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import { Star, MapPin, Clock, Phone, CreditCard, Droplets, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataProviderFactory } from '@/providers/DataProviderFactory';

interface WaterStation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone?: string;
  rating: number;
  priceRange: string;
  distance: string;
  isOpen: boolean;
  hours: string;
  amenities: string[];
  lat: number;
  lng: number;
}

interface WaterRefillStationsPageProps {
  subdomainInfo: SubdomainInfo;
}

const WaterRefillStationsPage: React.FC<WaterRefillStationsPageProps> = ({ subdomainInfo }) => {
  const [stations, setStations] = useState<WaterStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<WaterStation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMobileMap, setShowMobileMap] = useState(false);

  const dataProvider = DataProviderFactory.getProvider();

  useEffect(() => {
    const loadStations = async () => {
      try {
        // Get water-refill businesses from data provider
        const businesses = await dataProvider.getBusinesses('water-refill', 'san-francisco');
        
        // Transform business data to station format
        const transformedStations: WaterStation[] = businesses.map(business => ({
          id: business.id,
          name: business.name,
          address: business.address || 'Address not available',
          city: business.city || 'San Francisco',
          state: business.state || 'CA',
          phone: business.phone || undefined,
          rating: business.rating || 0,
          priceRange: '$', // Default price range for water refill
          distance: '0.5 mi', // This would be calculated based on user location
          isOpen: true, // This would be determined by current time vs business hours
          hours: '24/7 Access', // Simplified for now
          amenities: ['Credit Card Accepted', 'Quality Water'], // Default amenities
          lat: business.latitude || 37.7749,
          lng: business.longitude || -122.4194
        }));

        setStations(transformedStations);
      } catch (error) {
        console.error('Error loading water refill stations:', error);
        // Fallback to empty array
        setStations([]);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, [dataProvider]);

  if (loading) {
    return (
      <WaterRefillLayout subdomainInfo={subdomainInfo} showSearchBar={true}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading stations...</div>
        </div>
      </WaterRefillLayout>
    );
  }

  const renderStationCard = (station: WaterStation) => (
    <div 
      key={station.id}
      className={`bg-white border rounded-lg p-4 sm:p-6 cursor-pointer hover:shadow-lg active:scale-[0.98] transition-all duration-200 ${
        selectedStation?.id === station.id ? 'border-blue-500 shadow-lg ring-2 ring-blue-100' : 'border-gray-200'
      }`}
      onClick={() => setSelectedStation(station)}
    >
      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start mb-3 gap-2">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight">{station.name}</h3>
        <div className="flex items-center flex-shrink-0 xs:ml-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm font-medium text-gray-600">{station.rating}</span>
        </div>
      </div>
      
      <div className="flex items-start text-sm text-gray-600 mb-3">
        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
        <span className="break-words leading-relaxed">{station.address}, {station.city}, {station.state}</span>
      </div>
      
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between text-sm text-gray-600 mb-3 gap-2">
        <div className="flex items-center flex-wrap">
          <Clock className="w-4 h-4 mr-1 flex-shrink-0 text-gray-400" />
          <span className={`font-medium ${station.isOpen ? 'text-green-600' : 'text-red-600'}`}>
            {station.isOpen ? 'Open' : 'Closed'}
          </span>
          <span className="ml-1 text-gray-500">• {station.hours}</span>
        </div>
        <span className="text-blue-600 font-semibold text-sm">{station.distance}</span>
      </div>

      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-4 gap-2">
        <div className="flex items-center">
          <Droplets className="w-4 h-4 text-blue-500 mr-2" />
          <span className="font-bold text-lg text-blue-600">{station.priceRange}</span>
        </div>
        {station.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-1 flex-shrink-0 text-gray-400" />
            <span className="truncate">{station.phone}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {station.amenities.map((amenity, index) => (
          <span 
            key={index}
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border"
          >
            {amenity.includes('Credit Card') && <CreditCard className="w-3 h-3 mr-1" />}
            {amenity}
          </span>
        ))}
      </div>

      <Link 
        to={`/station/${station.id}`}
        className="w-full bg-blue-600 text-white py-3.5 px-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors text-center font-semibold shadow-sm hover:shadow-md min-h-[44px] touch-manipulation flex items-center justify-center"
      >
        View Details
      </Link>
    </div>
  );

  return (
    <WaterRefillLayout subdomainInfo={subdomainInfo} showSearchBar={true}>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
        {/* Station List - Full width on mobile, half on desktop */}
        <div className="w-full lg:w-1/2 bg-white border-b lg:border-r lg:border-b-0 border-gray-200 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Water Stations
                </h3>
                <p className="text-sm text-gray-600 mt-1">{stations.length} stations found</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <select className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white min-h-[44px] touch-manipulation">
                  <option>Sort by distance</option>
                  <option>Sort by price</option>
                  <option>Sort by rating</option>
                </select>
                <button 
                  className="lg:hidden bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
                  onClick={() => setShowMobileMap(true)}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Show Map</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {stations.length > 0 ? (
                stations.map(renderStationCard)
              ) : (
                <div className="text-center py-12">
                  <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No stations found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-blue-50 to-gray-100 relative min-h-[600px]">
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Map</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Explore water refill stations on an interactive map with real-time availability and directions.
              </p>
              <div className="space-y-3 text-sm text-gray-700 bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span>Click stations to see details</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span>Get turn-by-turn directions</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span>Real-time availability updates</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Map Legend */}
          <div className="absolute top-6 right-6 bg-white rounded-xl shadow-lg p-4 border">
            <div className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              Legend
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 shadow-sm"></div>
                <span className="text-gray-700">Open stations</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3 shadow-sm"></div>
                <span className="text-gray-700">Closed stations</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
                <span className="text-gray-700">Selected station</span>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button className="bg-white text-gray-700 p-3 rounded-lg shadow-lg hover:bg-gray-50 active:bg-gray-100 transition-colors border min-h-[44px] min-w-[44px] flex items-center justify-center">
              <span className="text-lg font-bold">+</span>
            </button>
            <button className="bg-white text-gray-700 p-3 rounded-lg shadow-lg hover:bg-gray-50 active:bg-gray-100 transition-colors border min-h-[44px] min-w-[44px] flex items-center justify-center">
              <span className="text-lg font-bold">-</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Map Modal */}
      {showMobileMap && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white">
              <h3 className="text-lg font-semibold text-gray-900">Station Map</h3>
              <button
                onClick={() => setShowMobileMap(false)}
                className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] touch-manipulation flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Map Content */}
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-gray-100 relative">
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="text-center max-w-sm">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MapPin className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Interactive Map</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    Explore water refill stations with real-time availability.
                  </p>
                  <div className="space-y-2 text-xs text-gray-700 bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Open stations</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span>Closed stations</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute bottom-20 right-4 flex flex-col gap-2">
                <button className="bg-white text-gray-700 p-3 rounded-lg shadow-lg hover:bg-gray-50 active:bg-gray-100 transition-colors border min-h-[44px] min-w-[44px] touch-manipulation flex items-center justify-center">
                  <span className="text-lg font-bold">+</span>
                </button>
                <button className="bg-white text-gray-700 p-3 rounded-lg shadow-lg hover:bg-gray-50 active:bg-gray-100 transition-colors border min-h-[44px] min-w-[44px] touch-manipulation flex items-center justify-center">
                  <span className="text-lg font-bold">-</span>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-white border-t">
              <button
                onClick={() => setShowMobileMap(false)}
                className="w-full bg-gray-100 text-gray-700 py-3.5 rounded-lg font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors min-h-[44px] touch-manipulation"
              >
                Back to Station List
              </button>
            </div>
          </div>
        </div>
      )}
    </WaterRefillLayout>
  );
};

export default WaterRefillStationsPage;
