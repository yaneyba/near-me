import React, { useState, useEffect } from 'react';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import { MapPin, Droplets, X } from 'lucide-react';
import { DataProviderFactory } from '@/providers/DataProviderFactory';
import { 
  WaterStationCard, 
  WaterStation as WaterStationType, 
  transformBusinessToWaterStation,
  Pagination
} from '@/components/water-refill';

interface WaterRefillStationsPageProps {
  subdomainInfo: SubdomainInfo;
}

const WaterRefillStationsPage: React.FC<WaterRefillStationsPageProps> = ({ subdomainInfo }) => {
  const [stations, setStations] = useState<WaterStationType[]>([]);
  const [selectedStation, setSelectedStation] = useState<WaterStationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMobileMap, setShowMobileMap] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default 10 stations per page

  const dataProvider = DataProviderFactory.getProvider();

  useEffect(() => {
    const loadStations = async () => {
      try {
        // Get water-refill businesses from data provider
        const businesses = await dataProvider.getBusinesses('water-refill', 'san-francisco');
        
        // Transform business data to station format - ONLY use real data
        const transformedStations: WaterStationType[] = businesses.map(transformBusinessToWaterStation);

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

  // Calculate pagination
  const totalPages = Math.ceil(stations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStations = stations.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Check if selected station exists on the new page, if not clear selection
    const newStartIndex = (page - 1) * itemsPerPage;
    const newEndIndex = newStartIndex + itemsPerPage;
    const newPageStations = stations.slice(newStartIndex, newEndIndex);
    
    if (selectedStation && !newPageStations.find(s => s.id === selectedStation.id)) {
      setSelectedStation(null);
    }
    
    // Scroll to top of station list
    const stationList = document.querySelector('[data-station-list]');
    if (stationList) {
      stationList.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
    setSelectedStation(null);
  };

  if (loading) {
    return (
      <WaterRefillLayout subdomainInfo={subdomainInfo} showSearchBar={true}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading stations...</div>
        </div>
      </WaterRefillLayout>
    );
  }

  return (
    <WaterRefillLayout subdomainInfo={subdomainInfo} showSearchBar={true}>
      {/* Main container with max-width constraint for optimal readability */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
          {/* Station List - Constrained width with optimal spacing */}
          <div className="w-full lg:w-1/2 bg-white border-b lg:border-r lg:border-b-0 border-gray-200 overflow-y-auto" data-station-list>
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Water Stations
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {stations.length} station{stations.length !== 1 ? 's' : ''} found
                  {stations.length > itemsPerPage && (
                    <span className="ml-1">
                      (showing {startIndex + 1}-{Math.min(endIndex, stations.length)})
                    </span>
                  )}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <select className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white min-h-[44px] touch-manipulation">
                  <option>Sort by distance</option>
                  <option>Sort by price</option>
                  <option>Sort by rating</option>
                </select>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white min-h-[44px] touch-manipulation"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
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
              {currentStations.length > 0 ? (
                currentStations.map(station => (
                  <WaterStationCard
                    key={station.id}
                    station={station}
                    isSelected={selectedStation?.id === station.id}
                    onClick={() => setSelectedStation(station)}
                  />
                ))
              ) : stations.length === 0 ? (
                <div className="text-center py-12">
                  <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No stations found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
                </div>
              ) : null}
            </div>

            {/* Pagination */}
            {stations.length > itemsPerPage && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={stations.length}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}
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
      </div>
    </WaterRefillLayout>
  );
};

export default WaterRefillStationsPage;
