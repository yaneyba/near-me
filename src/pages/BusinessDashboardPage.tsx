import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Phone, 
  Globe, 
  Calendar, 
  Navigation, 
  Clock, 
  Search, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Download, 
  Smartphone, 
  Tablet, 
  Monitor, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap,
  Crown,
  Star
} from 'lucide-react';
import { DataProviderFactory } from '../providers';
import { BusinessAnalytics } from '../types';

// This is a placeholder component for the business dashboard
// In a real implementation, this would be connected to authentication
// and would only show data for the logged-in business owner

const BusinessDashboardPage: React.FC = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [analytics, setAnalytics] = useState<BusinessAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessId] = useState('nail-salons-dallas-01'); // This would come from auth in real app
  const [businessName] = useState('Elegant Nails Studio'); // This would come from auth in real app
  const [isPremium] = useState(true); // This would come from business data in real app
  const [customDateRange, setCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const dataProvider = DataProviderFactory.getProvider();

  useEffect(() => {
    document.title = 'Business Dashboard - Near Me Directory';
    loadAnalytics();
  }, [period, customDateRange, startDate, endDate]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      let start: Date | undefined;
      let end: Date | undefined;
      
      if (customDateRange) {
        start = new Date(startDate);
        end = new Date(endDate);
      }
      
      const data = await dataProvider.getBusinessAnalytics(
        businessId,
        period,
        start,
        end
      );
      
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (num < 10) return num.toFixed(1);
    return Math.round(num).toString();
  };

  const getPercentChange = (current: number, previous: number): { value: number; isPositive: boolean } => {
    if (previous === 0) return { value: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(change), isPositive: change >= 0 };
  };

  // Generate some mock previous period data for comparison
  const getPreviousPeriodData = (metric: number): number => {
    // Randomize previous data within a reasonable range
    const factor = 0.7 + Math.random() * 0.6; // Between 70% and 130% of current
    return metric * factor;
  };

  const renderMetricCard = (
    title: string, 
    value: number, 
    icon: React.ReactNode, 
    color: string,
    previousValue?: number
  ) => {
    const formattedValue = formatNumber(value);
    let percentChange;
    let isPositive;
    
    if (previousValue !== undefined) {
      const change = getPercentChange(value, previousValue);
      percentChange = formatNumber(change.value);
      isPositive = change.isPositive;
    }

    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${color}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <div className="flex items-baseline">
              <h3 className="text-2xl font-bold text-gray-900">{formattedValue}</h3>
              {percentChange !== undefined && (
                <span className={`ml-2 text-sm font-medium flex items-center ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {percentChange}%
                </span>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${color.replace('border-', 'bg-').replace('-600', '-100')}`}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

  const renderHourlyChart = () => {
    if (!analytics || !analytics.hourlyDistribution) return null;
    
    const maxViews = Math.max(...analytics.hourlyDistribution.map(h => h.views));
    const maxInteractions = Math.max(...analytics.hourlyDistribution.map(h => h.interactions));
    const maxValue = Math.max(maxViews, maxInteractions, 1); // Avoid division by zero
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Activity</h3>
        <div className="h-64">
          <div className="flex h-full">
            {analytics.hourlyDistribution.map((hour) => (
              <div key={hour.hour} className="flex-1 flex flex-col justify-end items-center">
                <div className="relative w-full flex flex-col items-center">
                  {/* Views bar */}
                  <div 
                    className="w-4 bg-blue-400 rounded-t-sm" 
                    style={{ 
                      height: `${(hour.views / maxValue) * 100}%`,
                      minHeight: hour.views > 0 ? '4px' : '0'
                    }}
                    title={`${hour.views} views`}
                  ></div>
                  
                  {/* Interactions bar */}
                  <div 
                    className="w-4 bg-green-400 rounded-t-sm mt-1" 
                    style={{ 
                      height: `${(hour.interactions / maxValue) * 100}%`,
                      minHeight: hour.interactions > 0 ? '4px' : '0'
                    }}
                    title={`${hour.interactions} interactions`}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {hour.hour}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-400 rounded-sm mr-2"></div>
            <span className="text-xs text-gray-600">Views</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-sm mr-2"></div>
            <span className="text-xs text-gray-600">Interactions</span>
          </div>
        </div>
      </div>
    );
  };

  const renderDeviceBreakdown = () => {
    if (!analytics || !analytics.deviceBreakdown) return null;
    
    const { mobile, tablet, desktop } = analytics.deviceBreakdown;
    const total = mobile + tablet + desktop;
    
    if (total === 0) return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
        <div className="text-center text-gray-500 py-8">No device data available</div>
      </div>
    );
    
    const mobilePercent = (mobile / total) * 100;
    const tabletPercent = (tablet / total) * 100;
    const desktopPercent = (desktop / total) * 100;
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
        
        <div className="flex h-6 rounded-full overflow-hidden mb-6">
          <div 
            className="bg-blue-500 h-full flex items-center justify-center text-xs text-white font-medium"
            style={{ width: `${mobilePercent}%` }}
          >
            {mobilePercent > 10 ? `${Math.round(mobilePercent)}%` : ''}
          </div>
          <div 
            className="bg-purple-500 h-full flex items-center justify-center text-xs text-white font-medium"
            style={{ width: `${tabletPercent}%` }}
          >
            {tabletPercent > 10 ? `${Math.round(tabletPercent)}%` : ''}
          </div>
          <div 
            className="bg-green-500 h-full flex items-center justify-center text-xs text-white font-medium"
            style={{ width: `${desktopPercent}%` }}
          >
            {desktopPercent > 10 ? `${Math.round(desktopPercent)}%` : ''}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Smartphone className="w-5 h-5 text-blue-500 mr-2" />
              <span className="font-medium">Mobile</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{Math.round(mobilePercent)}%</div>
            <div className="text-sm text-gray-500">{mobile} views</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Tablet className="w-5 h-5 text-purple-500 mr-2" />
              <span className="font-medium">Tablet</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{Math.round(tabletPercent)}%</div>
            <div className="text-sm text-gray-500">{tablet} views</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Monitor className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-medium">Desktop</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{Math.round(desktopPercent)}%</div>
            <div className="text-sm text-gray-500">{desktop} views</div>
          </div>
        </div>
      </div>
    );
  };

  const renderTopSources = () => {
    if (!analytics || !analytics.topSources || analytics.topSources.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Traffic Sources</h3>
          <div className="text-center text-gray-500 py-8">No source data available</div>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Traffic Sources</h3>
        <div className="space-y-4">
          {analytics.topSources.slice(0, 5).map((source, index) => (
            <div key={index} className="flex items-center">
              <div className="w-32 text-sm text-gray-600">{source.source}</div>
              <div className="flex-1">
                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-right text-sm font-medium text-gray-900">
                {Math.round(source.percentage)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTopSearchQueries = () => {
    if (!analytics || !analytics.topSearchQueries || analytics.topSearchQueries.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Search Queries</h3>
          <div className="text-center text-gray-500 py-8">No search query data available</div>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Search Queries</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Search Term</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Views</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Clicks</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">CTR</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topSearchQueries.slice(0, 5).map((query, index) => {
                const ctr = query.views > 0 ? (query.clicks / query.views) * 100 : 0;
                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-900">{query.query}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">{query.views}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">{query.clicks}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">{ctr.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
              {isPremium && (
                <div className="ml-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                  <Crown className="w-3 h-3 mr-1" />
                  PREMIUM
                </div>
              )}
            </div>
            <p className="text-gray-600 mt-1">
              {businessName} • Performance Analytics
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            {/* Period selector */}
            <div className="flex items-center space-x-2">
              <select
                value={period}
                onChange={(e) => {
                  setPeriod(e.target.value as any);
                  setCustomDateRange(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={customDateRange}
              >
                <option value="day">Last 24 Hours</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last 12 Months</option>
              </select>
            </div>
            
            {/* Custom date range toggle */}
            <div className="flex items-center">
              <button
                onClick={() => setCustomDateRange(!customDateRange)}
                className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
                  customDateRange 
                    ? 'border-blue-500 bg-blue-50 text-blue-600' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Custom Range
                {customDateRange ? (
                  <ChevronUp className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2" />
                )}
              </button>
            </div>
            
            {/* Export button */}
            <button
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>
        
        {/* Custom date range inputs */}
        {customDateRange && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={loadAnalytics}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : !analytics ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">
              We don't have any analytics data for this time period yet. Check back later or try a different date range.
            </p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {renderMetricCard(
                'Total Views', 
                analytics.metrics.totalViews, 
                <Eye className="w-5 h-5 text-blue-600" />, 
                'border-blue-600',
                getPreviousPeriodData(analytics.metrics.totalViews)
              )}
              
              {renderMetricCard(
                'Phone Calls', 
                analytics.metrics.phoneClicks, 
                <Phone className="w-5 h-5 text-green-600" />, 
                'border-green-600',
                getPreviousPeriodData(analytics.metrics.phoneClicks)
              )}
              
              {renderMetricCard(
                'Website Clicks', 
                analytics.metrics.websiteClicks, 
                <Globe className="w-5 h-5 text-purple-600" />, 
                'border-purple-600',
                getPreviousPeriodData(analytics.metrics.websiteClicks)
              )}
              
              {renderMetricCard(
                'Conversion Rate', 
                analytics.metrics.conversionRate, 
                <Zap className="w-5 h-5 text-orange-600" />, 
                'border-orange-600',
                getPreviousPeriodData(analytics.metrics.conversionRate)
              )}
            </div>
            
            {/* Premium Metrics */}
            {isPremium && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200 mb-8">
                <div className="flex items-center mb-4">
                  <Crown className="w-5 h-5 text-yellow-600 mr-2" />
                  <h3 className="text-lg font-semibold text-yellow-800">Premium Insights</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {renderMetricCard(
                    'Booking Clicks', 
                    analytics.metrics.bookingClicks, 
                    <Calendar className="w-5 h-5 text-yellow-600" />, 
                    'border-yellow-600',
                    getPreviousPeriodData(analytics.metrics.bookingClicks)
                  )}
                  
                  {renderMetricCard(
                    'Directions Clicks', 
                    analytics.metrics.directionsClicks, 
                    <Navigation className="w-5 h-5 text-yellow-600" />, 
                    'border-yellow-600',
                    getPreviousPeriodData(analytics.metrics.directionsClicks)
                  )}
                  
                  {renderMetricCard(
                    'Services Viewed', 
                    analytics.metrics.servicesExpands, 
                    <Search className="w-5 h-5 text-yellow-600" />, 
                    'border-yellow-600',
                    getPreviousPeriodData(analytics.metrics.servicesExpands)
                  )}
                  
                  {renderMetricCard(
                    'Engagement Rate', 
                    analytics.metrics.engagementRate, 
                    <Star className="w-5 h-5 text-yellow-600" />, 
                    'border-yellow-600',
                    getPreviousPeriodData(analytics.metrics.engagementRate)
                  )}
                </div>
              </div>
            )}
            
            {/* Charts and Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {renderHourlyChart()}
              {renderDeviceBreakdown()}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {renderTopSources()}
              {renderTopSearchQueries()}
            </div>
            
            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Improve Your Conversion Rate</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your phone call conversion rate is {formatNumber(analytics.metrics.conversionRate)}%. 
                      Consider adding more detailed service information to encourage more calls.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900">Optimize for Mobile Users</h4>
                    <p className="text-sm text-green-700 mt-1">
                      {Math.round((analytics.deviceBreakdown.mobile / 
                        (analytics.deviceBreakdown.mobile + 
                         analytics.deviceBreakdown.tablet + 
                         analytics.deviceBreakdown.desktop)) * 100)}% 
                      of your visitors are on mobile devices. Ensure your business information is mobile-friendly.
                    </p>
                  </div>
                </div>
                
                {!isPremium && (
                  <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <Crown className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-900">Upgrade to Premium</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Premium businesses receive 3x more engagement. Upgrade to get priority placement, 
                        booking links, and detailed analytics.
                      </p>
                      <button className="mt-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboardPage;