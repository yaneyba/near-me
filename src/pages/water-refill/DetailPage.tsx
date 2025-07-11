import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SubdomainInfo } from '../../types';
import { Layout as WaterRefillLayout } from '../../components/layouts/water-refill';
import { Star, MapPin, Phone, Globe, CheckCircle } from 'lucide-react';
import { DataProviderFactory } from '../../providers/DataProviderFactory';

interface WaterStation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  website?: string;
  rating: number;
  reviewCount: number;
  pricePerGallon: string;
  isOpen: boolean;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  waterTypes: string[];
  amenities: string[];
  description: string;
  lat: number;
  lng: number;
  photos: string[];
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
}

interface WaterRefillDetailPageProps {
  subdomainInfo: SubdomainInfo;
}

const WaterRefillDetailPage: React.FC<WaterRefillDetailPageProps> = ({ subdomainInfo }) => {
  const { stationId } = useParams<{ stationId: string }>();
  const [station, setStation] = useState<WaterStation | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const dataProvider = DataProviderFactory.getProvider();

  useEffect(() => {
    const loadStationData = async () => {
      try {
        if (!stationId) {
          setLoading(false);
          return;
        }

        // Get all water-refill businesses from San Francisco
        const businesses = await dataProvider.getBusinesses('water-refill', 'san-francisco');
        
        // Find the specific station by ID
        const businessData = businesses.find(b => b.id === stationId);
        
        if (businessData) {
          // Transform business data to station format
          const transformedStation: WaterStation = {
            id: businessData.id,
            name: businessData.name,
            address: businessData.address || 'Address not available',
            city: businessData.city || 'San Francisco',
            state: businessData.state || 'CA',
            zipCode: '94102', // Default for San Francisco
            phone: businessData.phone || undefined,
            website: businessData.website || undefined,
            rating: businessData.rating || 0,
            reviewCount: businessData.review_count || 0,
            pricePerGallon: '$0.50/gal', // Default price
            isOpen: true, // This would be calculated based on current time
            hours: {
              monday: '6:00 AM - 10:00 PM',
              tuesday: '6:00 AM - 10:00 PM',
              wednesday: '6:00 AM - 10:00 PM',
              thursday: '6:00 AM - 10:00 PM',
              friday: '6:00 AM - 11:00 PM',
              saturday: '7:00 AM - 11:00 PM',
              sunday: '8:00 AM - 9:00 PM'
            },
            waterTypes: businessData.services || ['Purified', 'Reverse Osmosis', 'Spring'],
            amenities: ['24/7 Access', 'Credit Card Accepted', 'Free Parking', 'Indoor Location'],
            description: businessData.description || 'High-quality water refill station serving the community with premium filtered water.',
            lat: businessData.latitude || 37.7749,
            lng: businessData.longitude || -122.4194,
            photos: [] // Default to empty array for now
          };

          setStation(transformedStation);

          // Generate mock reviews based on review count
          const mockReviews: Review[] = Array.from({ length: Math.min(businessData.review_count || 0, 5) }, (_, i) => ({
            id: `${businessData.id}-review-${i + 1}`,
            userId: `user-${i + 1}`,
            userName: `Customer ${i + 1}`,
            rating: Math.floor(Math.random() * 2) + 4, // 4-5 star reviews
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            title: i === 0 ? 'Great water quality' : 'Convenient location',
            content: i === 0 ? 'The water here is excellent and the station is well-maintained.' : 'Easy to find and the access is convenient.',
            helpful: Math.floor(Math.random() * 5) + 1
          }));

          setReviews(mockReviews);
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <WaterRefillLayout subdomainInfo={subdomainInfo} showSearchBar={true}>
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm text-gray-500">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/stations" className="hover:text-blue-600">Find Stations</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{station.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Station Header */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{station.name}</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        {renderStars(station.rating)}
                        <span className="ml-2 font-medium">{station.rating}</span>
                        <span className="ml-1">({station.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{station.address}, {station.city}, {station.state} {station.zipCode}</p>
                
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{station.pricePerGallon}</div>
                    <div className="text-sm text-gray-600">per gallon</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {station.isOpen ? 'Open' : 'Closed'}
                    </div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{station.waterTypes.length}</div>
                    <div className="text-sm text-gray-600">Water Types</div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{station.description}</p>

                <div className="flex flex-wrap gap-3">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </button>
                </div>
              </div>

              {/* Photos */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Photos</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-video bg-gray-200 rounded-lg"></div>
                  <div className="aspect-video bg-gray-200 rounded-lg"></div>
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Reviews ({station.reviewCount})</h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {review.userName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{review.userName}</span>
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                          <p className="text-gray-700 mb-2">{review.content}</p>
                          <button className="text-sm text-gray-500 hover:text-gray-700">
                            {review.helpful} people found this helpful
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Business Hours */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2">
                  {Object.entries(station.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="capitalize font-medium">{day}</span>
                      <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Water Types */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Water Types</h3>
                <div className="flex flex-wrap gap-2">
                  {station.waterTypes.map((type) => (
                    <span
                      key={type}
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                <div className="space-y-2">
                  {station.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 text-gray-400 mr-3" />
                    <a href={`tel:${station.phone}`} className="text-blue-600 hover:text-blue-800">
                      {station.phone}
                    </a>
                  </div>
                  <div className="flex items-center text-sm">
                    <Globe className="w-4 h-4 text-gray-400 mr-3" />
                    <a href={station.website} className="text-blue-600 hover:text-blue-800">
                      Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WaterRefillLayout>
  );
};

export default WaterRefillDetailPage;
