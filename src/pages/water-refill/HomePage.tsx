import React, { useState, useEffect } from 'react';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import { Link } from 'react-router-dom';
import { DataProviderFactory } from '@/providers/DataProviderFactory';
import { WaterStationCard, transformBusinessToWaterStation, WaterStation } from '@/components/water-refill';

interface WaterRefillHomePageProps {
  subdomainInfo: SubdomainInfo;
}

const WaterRefillHomePage: React.FC<WaterRefillHomePageProps> = ({ subdomainInfo }) => {
  const [featuredStations, setFeaturedStations] = useState<WaterStation[]>([]);
  const [loading, setLoading] = useState(true);

  const dataProvider = DataProviderFactory.getProvider();

  useEffect(() => {
    const loadFeaturedStations = async () => {
      try {
        // Handle case where no specific city is selected (All Cities)
        if (subdomainInfo.city === 'All Cities') {
          // Get all available cities and fetch from ALL cities
          const cities = await dataProvider.getCities();
          const allBusinesses: any[] = [];
          
          // Get businesses from ALL cities
          for (const city of cities) {
            try {
              const cityBusinesses = await dataProvider.getBusinesses('water-refill', city);
              allBusinesses.push(...cityBusinesses);
            } catch (error) {
              console.warn(`Failed to load businesses for ${city}:`, error);
            }
          }
          
          // Get top 3 highest rated from ALL cities
          const featured = allBusinesses
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3)
            .map(transformBusinessToWaterStation);
          
          setFeaturedStations(featured);
        } else {
          // Get water-refill businesses from data provider using dynamic city from subdomain
          const businesses = await dataProvider.getBusinesses('water-refill', subdomainInfo.city);
          
          // Take the top 3 highest-rated stations as featured and transform them
          const featured = businesses
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3)
            .map(transformBusinessToWaterStation);
          
          setFeaturedStations(featured);
        }
      } catch (error) {
        console.error('Error loading featured stations:', error);
        setFeaturedStations([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedStations();
  }, [dataProvider]);

  return (
    <WaterRefillLayout subdomainInfo={subdomainInfo}>
      {/* Featured Stations Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Water Stations</h2>
          <p className="text-lg text-gray-600 mb-8">Top-rated water refill stations trusted by thousands of customers</p>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="text-lg">Loading featured stations...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {featuredStations.map(station => (
                <WaterStationCard
                  key={station.id}
                  station={station}
                  compact={true}
                />
              ))}
            </div>
          )}
          
          <Link 
            to="/stations" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Stations →
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Find and refill in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Search & Find</h3>
              <p className="text-gray-600">Use our search tool to find water refill stations near your location or search by city.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.382v10.764a1 1 0 01-.553.894L15 18l-6-3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Get Directions</h3>
              <p className="text-gray-600">View detailed information including hours, prices, and get turn-by-turn directions.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Refill & Save</h3>
              <p className="text-gray-600">Enjoy clean, affordable water and help reduce plastic waste in the environment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Business CTA Section */}
      <section className="bg-gradient-to-r from-teal-500 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Own a Water Refill Business?</h2>
          <p className="text-xl text-blue-100 mb-8">
            List your water refill station and connect with thousands of customers looking for quality water sources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100">
              List Your Business
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </WaterRefillLayout>
  );
};

export default WaterRefillHomePage;
