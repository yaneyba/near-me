import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Mouse, 
  Phone, 
  Globe, 
  MapPin, 
  Mail, 
  Users, 
  Calendar,
  Activity,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { DataProviderFactory } from '@/providers/DataProviderFactory';
import AnalyticsDataGenerator from '@/components/shared/analytics/AnalyticsDataGenerator';

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [overallAnalytics, setOverallAnalytics] = useState<any>(null);

  const dataProvider = DataProviderFactory.getProvider();

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get overall analytics from user_engagement_events table
      const analytics = await dataProvider.getOverallAnalytics(selectedPeriod);
      setOverallAnalytics(analytics);

    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };



  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadAnalyticsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const avgConversionRate = overallAnalytics?.averageConversionRate || 0;

  const totalDeviceBreakdown = overallAnalytics?.deviceBreakdown || { mobile: 0, tablet: 0, desktop: 0 };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {/* Development Data Generator */}
      {process.env.NODE_ENV === 'development' && (
        <AnalyticsDataGenerator />
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Analytics Dashboard</h2>
        
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          {(['day', 'week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              {period === 'day' ? 'Today' : `Last ${period === 'week' ? '7 Days' : period === 'month' ? '30 Days' : 'Year'}`}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">Total Click Events</div>
            <Mouse className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(overallAnalytics?.totalClickEvents || 0)}
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Phone, Website, Booking, Directions, Email clicks
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">Unique Visitors</div>
            <Users className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(overallAnalytics?.totalUniqueVisitors || 0)}
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Based on unique sessions with click events
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">Avg Conversion Rate</div>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {avgConversionRate.toFixed(1)}%
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Phone + Website + Booking clicks / Total clicks
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">Active Businesses</div>
            <BarChart3 className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {overallAnalytics?.activeBusinesses || 0}
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Businesses with engagement data
          </div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Performing Businesses */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Businesses</h3>
          <div className="space-y-3">
            {overallAnalytics?.topPerformingBusinesses.slice(0, 5).map((business: any, index: number) => (
              <div key={business.businessId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {business.businessName.length > 30 
                        ? business.businessName.substring(0, 30) + '...' 
                        : business.businessName
                      }
                    </div>
                    <div className="text-xs text-gray-600">
                      {business.phoneClicks} phone • {business.websiteClicks} website
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{business.totalClicks} clicks</div>
                  <div className="text-xs text-gray-600">{business.conversionRate.toFixed(1)}% conv.</div>
                </div>
              </div>
            ))}
            {(!overallAnalytics?.topPerformingBusinesses.length) && (
              <div className="text-center py-8 text-gray-500">
                No engagement data available yet
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
          <div className="space-y-3">
            {overallAnalytics?.categoryBreakdown.map((category: any) => {
              const total = overallAnalytics.totalClickEvents;
              const percentage = total > 0 ? (category.totalClicks / total) * 100 : 0;
              
              return (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {category.category.replace('-', ' ')}
                    </span>
                    <span className="text-sm text-gray-600">
                      {category.totalClicks} clicks • {category.uniqueVisitors} visitors
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">{percentage.toFixed(1)}% of total clicks</div>
                </div>
              );
            })}
            {(!overallAnalytics?.categoryBreakdown.length) && (
              <div className="text-center py-8 text-gray-500">
                No category data available yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Mobile</span>
              </div>
              <span className="text-sm text-gray-600">{totalDeviceBreakdown.mobile}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Desktop</span>
              </div>
              <span className="text-sm text-gray-600">{totalDeviceBreakdown.desktop}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Tablet className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">Tablet</span>
              </div>
              <span className="text-sm text-gray-600">{totalDeviceBreakdown.tablet}</span>
            </div>
          </div>
        </div>

        {/* Click Types Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Click Types</h3>
          <div className="space-y-4">
            {(() => {
              const clickTypes = overallAnalytics?.clickTypeBreakdown || {
                phone: 0,
                website: 0,
                directions: 0,
                booking: 0,
                email: 0
              };
              
              return (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Phone</span>
                    </div>
                    <span className="text-sm text-gray-600">{clickTypes.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">Website</span>
                    </div>
                    <span className="text-sm text-gray-600">{clickTypes.website}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-gray-900">Directions</span>
                    </div>
                    <span className="text-sm text-gray-600">{clickTypes.directions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">Booking</span>
                    </div>
                    <span className="text-sm text-gray-600">{clickTypes.booking}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-gray-900">Email</span>
                    </div>
                    <span className="text-sm text-gray-600">{clickTypes.email}</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours</h3>
          <div className="space-y-2">
            {(() => {
              const peakHours = overallAnalytics?.peakHours || [];
              
              return peakHours.slice(0, 5).map((hourData: { hour: number; totalClicks: number }) => (
                <div key={hourData.hour} className="flex items-center space-x-3">
                  <div className="w-12 text-sm text-gray-600">
                    {hourData.hour === 0 ? '12 AM' : 
                     hourData.hour < 12 ? `${hourData.hour} AM` : 
                     hourData.hour === 12 ? '12 PM' : 
                     `${hourData.hour - 12} PM`}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min((hourData.totalClicks / (peakHours[0]?.totalClicks || 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-900 text-right">
                    {hourData.totalClicks}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
