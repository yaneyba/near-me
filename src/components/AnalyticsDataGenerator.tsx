import React, { useState } from 'react';
import { DataProviderFactory } from '../providers/DataProviderFactory';
import { UserEngagementEvent } from '../types';
import { Zap, Check, AlertCircle, Trash2 } from 'lucide-react';

const AnalyticsDataGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dataProvider = DataProviderFactory.getProvider();

  // Unique identifier for generated sample data
  const SAMPLE_DATA_IDENTIFIER = 'ANALYTICS_SAMPLE_DATA_GENERATOR';

  const generateSampleData = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setResult(null);

      // Get some businesses to generate data for
      const businesses = await dataProvider.getAllBusinesses();
      
      if (businesses.length === 0) {
        setError('No businesses found in database');
        return;
      }

      const sampleEvents: UserEngagementEvent[] = [];
      const eventTypes = ['phone_click', 'website_click', 'booking_click', 'directions_click', 'email_click'] as const;
      const sources = ['search', 'category', 'premium', 'related'];
      const devices = ['mobile', 'tablet', 'desktop'] as const;

      // Safety cap to prevent infinite generation
      const MAX_EVENTS = 200;
      let eventCount = 0;

      // Generate events for the last 7 days
      const now = new Date();
      const daysBack = 7;

      for (let day = 0; day < daysBack; day++) {
        const eventDate = new Date(now);
        eventDate.setDate(eventDate.getDate() - day);

        // Generate 5-20 events per day per business (randomly)
        const selectedBusinesses = businesses.slice(0, Math.min(5, businesses.length)); // Limit to first 5 businesses

        for (const business of selectedBusinesses) {
          const eventsPerDay = Math.floor(Math.random() * 16) + 5; // 5-20 events

          for (let i = 0; i < eventsPerDay; i++) {
            // Stop if we've reached the maximum number of events
            if (eventCount >= MAX_EVENTS) {
              break;
            }

            const eventTime = new Date(eventDate);
            eventTime.setHours(Math.floor(Math.random() * 24));
            eventTime.setMinutes(Math.floor(Math.random() * 60));

            const event: UserEngagementEvent = {
              businessId: business.business_id,
              businessName: business.name,
              eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
              eventData: {
                source: sources[Math.floor(Math.random() * sources.length)],
                deviceType: devices[Math.floor(Math.random() * devices.length)],
                searchQuery: Math.random() > 0.7 ? `${business.category} near me` : undefined,
                userAgent: `Analytics Data Generator - ${SAMPLE_DATA_IDENTIFIER}`,
                sampleDataId: SAMPLE_DATA_IDENTIFIER, // Mark as sample data for easy cleanup
                location: {
                  city: business.city,
                  state: business.state,
                  country: 'US'
                }
              },
              timestamp: eventTime,
              userSessionId: `session_${day}_${business.business_id}_${i}_${Date.now()}`,
              ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`
            };

            sampleEvents.push(event);
            eventCount++;
          }
          
          // Break out of business loop if we've reached max events
          if (eventCount >= MAX_EVENTS) {
            break;
          }
        }
        
        // Break out of day loop if we've reached max events
        if (eventCount >= MAX_EVENTS) {
          break;
        }
      }

      // Track all events
      let successCount = 0;
      let errorCount = 0;

      for (const event of sampleEvents) {
        try {
          await dataProvider.trackEngagement(event);
          successCount++;
        } catch (err) {
          console.error('Error tracking event:', err);
          errorCount++;
        }
      }

      setResult(`Successfully generated ${successCount} engagement events for ${businesses.slice(0, 5).length} businesses over ${daysBack} days. ${errorCount > 0 ? `${errorCount} events failed.` : ''}`);

    } catch (err) {
      console.error('Error generating analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate sample data');
    } finally {
      setIsGenerating(false);
    }
  };

  const clearSampleData = async () => {
    try {
      setIsClearing(true);
      setError(null);
      setResult(null);

      // Check if the provider has a method to clear sample data
      if ('clearSampleEngagementData' in dataProvider && typeof dataProvider.clearSampleEngagementData === 'function') {
        await dataProvider.clearSampleEngagementData(SAMPLE_DATA_IDENTIFIER);
        setResult('Successfully cleared all sample data from the database.');
      } else {
        setError('Clear sample data functionality is not available with the current data provider.');
      }

    } catch (err) {
      console.error('Error clearing sample data:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear sample data');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Analytics Data Generator</h3>
          <p className="text-sm text-gray-600">Generate sample engagement data for testing the analytics dashboard</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generateSampleData}
            disabled={isGenerating || isClearing}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 flex items-center"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Sample Data
              </>
            )}
          </button>
          
          <button
            onClick={clearSampleData}
            disabled={isGenerating || isClearing}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300 flex items-center"
          >
            {isClearing ? (
              <>
                <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                Clearing...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Sample Data
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-start">
          <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-green-800">{result}</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDataGenerator;
