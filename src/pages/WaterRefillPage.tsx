import React, { useState, useEffect } from 'react';
import { SubdomainInfo } from '../types';
import WaterRefillLayout from '../components/layouts/WaterRefillLayout';
import { Star, MapPin, Clock, Phone, CreditCard, Droplets } from 'lucide-react';

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
        id: '1',
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
        id: '2',
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
        id: '3',
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
      className={`bg-white border rounded-lg p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow ${
        selectedStation?.id === station.id ? 'border-blue-500 shadow-md' : 'border-gray-200'
      }`}
      onClick={() => setSelectedStation(station)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{station.name}</h3>
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm text-gray-600">{station.rating}</span>
        </div>
      </div>
      
      <div className="flex items-center text-sm text-gray-600 mb-1">
        <MapPin className="w-4 h-4 mr-1" />
        <span>{station.address}, {station.city}, {station.state}</span>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span className={station.isOpen ? 'text-green-600' : 'text-red-600'}>
            {station.isOpen ? 'Open' : 'Closed'}
          </span>
          <span className="ml-1">• {station.hours}</span>
        </div>
        <span className="text-blue-600 font-medium">{station.distance}</span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Droplets className="w-4 h-4 text-blue-500 mr-1" />
          <span className="font-semibold text-lg text-blue-600">{station.pricePerGallon}</span>
        </div>
        {station.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-1" />
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

      <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-md hover:bg-blue-100 transition-colors">
        View Details
      </button>
    </div>
  );

  return (
    <WaterRefillLayout subdomainInfo={subdomainInfo} showSearchBar={true}>
      <div className="flex h-screen">
        {/* Left Sidebar - Station List */}
        <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Water Stations ({stations.length})
              </h3>
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                <option>Sort by distance</option>
                <option>Sort by price</option>
                <option>Sort by rating</option>
              </select>
            </div>
            
            {stations.map(renderStationCard)}
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="w-1/2 bg-gray-100 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
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
      </div>
    </WaterRefillLayout>
  );
};

export default WaterRefillStationsPage;
