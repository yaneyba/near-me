import React, { useState, useEffect } from 'react';
import { SubdomainInfo } from '../../types';
import { Layout as WaterRefillLayout } from '../../components/layouts/water-refill';
import { Star, MapPin, Clock, Phone, CreditCard, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WaterStation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  rating: number;
  pricePerGallon: string;
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

  // Mock data for water refill stations
  useEffect(() => {
    const mockStations: WaterStation[] = [
      {
        id: 'aquapure-station-san-francisco',
        name: 'AquaPure Station - San Francisco',
        address: '100 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        phone: '(415) 555-0123',
        rating: 4.6,
        pricePerGallon: '$0.25/gal',
        distance: '0.2 mi',
        isOpen: true,
        hours: '24/7 Access',
        amenities: ['Credit Card Accepted', 'Maintenance', '1 more'],
        lat: 37.7749,
        lng: -122.4194
      },
      {
        id: 'crystal-clear-refill-san-francisco',
        name: 'Crystal Clear Refill - San Francisco',
        address: '101 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        phone: '(415) 555-0124',
        rating: 4.5,
        pricePerGallon: '$0.5/gal',
        distance: '0.3 mi',
        isOpen: true,
        hours: '24/7 Access',
        amenities: ['Credit Card Accepted', '2 more'],
        lat: 37.7849,
        lng: -122.4094
      },
      {
        id: 'blue-drop-water-san-francisco',
        name: 'Blue Drop Water - San Francisco',
        address: '102 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        phone: '(415) 555-0125',
        rating: 4.0,
        pricePerGallon: '$0.75/gal',
        distance: '0.4 mi',
        isOpen: false,
        hours: '24/7 Access',
        amenities: ['Credit Card Accepted', '3 more'],
        lat: 37.7649,
        lng: -122.4294
      }
    ];
    setStations(mockStations);
  }, []);

  const renderStationCard = (station: WaterStation) => (
    <div 
      key={station.id}
      className={`bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${
        selectedStation?.id === station.id ? 'border-blue-500 shadow-md' : 'border-gray-200'
      }`}
      onClick={() => setSelectedStation(station)}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
        <h3 className="font-semibold text-gray-900 text-lg">{station.name}</h3>
        <div className="flex items-center flex-shrink-0">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm text-gray-600">{station.rating}</span>
        </div>
      </div>
      
      <div className="flex items-start text-sm text-gray-600 mb-3">
        <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
        <span className="break-words">{station.address}, {station.city}, {station.state}</span>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 mb-3 gap-2">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className={station.isOpen ? 'text-green-600' : 'text-red-600'}>
            {station.isOpen ? 'Open' : 'Closed'}
          </span>
          <span className="ml-1">• {station.hours}</span>
        </div>
        <span className="text-blue-600 font-medium">{station.distance}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
        <div className="flex items-center">
          <Droplets className="w-4 h-4 text-blue-500 mr-1" />
          <span className="font-semibold text-lg text-blue-600">{station.pricePerGallon}</span>
        </div>
        {station.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>{station.phone}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {station.amenities.map((amenity, index) => (
          <span 
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
          >
            {amenity.includes('Credit Card') && <CreditCard className="w-3 h-3 mr-1" />}
            {amenity}
          </span>
        ))}
      </div>

      <Link 
        to={`/station/${station.id}`}
        className="w-full bg-blue-50 text-blue-600 py-3 rounded-md hover:bg-blue-100 transition-colors text-center block font-medium"
      >
        View Details
      </Link>
    </div>
  );

  return (
    <WaterRefillLayout subdomainInfo={subdomainInfo} showSearchBar={true}>
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Station List - Full width on mobile, half on desktop */}
        <div className="w-full lg:w-1/2 bg-white border-b lg:border-r lg:border-b-0 border-gray-200 overflow-y-auto">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Water Stations ({stations.length})
              </h3>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto">
                <option>Sort by distance</option>
                <option>Sort by price</option>
                <option>Sort by rating</option>
              </select>
            </div>
            
            <div className="space-y-4">
              {stations.map(renderStationCard)}
            </div>
          </div>
        </div>

        {/* Map - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block w-full lg:w-1/2 bg-gray-100 relative min-h-[600px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map</h3>
              <p className="text-gray-600 mb-4">Map showing water refill station locations</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Click stations on the left to see them on the map</p>
                <p>• Get directions to any station</p>
                <p>• Real-time availability updates</p>
              </div>
            </div>
          </div>
          
          {/* Map placeholder - you can integrate Google Maps, Mapbox, etc. */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3">
            <div className="text-sm font-medium text-gray-900 mb-2">Legend</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Open stations</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Closed stations</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>Selected station</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Map Toggle Button */}
        <div className="lg:hidden fixed bottom-4 right-4 z-10">
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            onClick={() => {
              // TODO: Implement mobile map modal/overlay
              alert('Map view coming soon for mobile!');
            }}
          >
            <MapPin className="w-4 h-4" />
            <span>Map</span>
          </button>
        </div>
      </div>
    </WaterRefillLayout>
  );
};

export default WaterRefillStationsPage;
