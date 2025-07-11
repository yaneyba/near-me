import { UserEngagementEvent } from '@/types';
import { DataProviderFactory } from '@/providers';

// Read tracking configuration from environment variables
const TRACKING_ENABLED = import.meta.env.VITE_SETTINGS_ENABLE_TRACKING === 'true';

// Declare gtag function for TypeScript
declare global {
  function gtag(...args: any[]): void;
}

class EngagementTracker {
  private sessionId: string;
  private dataProvider = DataProviderFactory.getProvider();

  constructor() {
    this.sessionId = this.generateSessionId();
    
    // Log tracking status on initialization
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Engagement Tracker initialized - Tracking ${TRACKING_ENABLED ? 'ENABLED' : 'DISABLED'}`);
      console.log(`📊 Environment variable VITE_SETTINGS_ENABLE_TRACKING: ${import.meta.env.VITE_SETTINGS_ENABLE_TRACKING}`);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private async getLocationData() {
    try {
      // Try to get location from IP (in production, you'd use a geolocation service)
      // For now, we'll extract from subdomain or use a default
      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      
      if (parts.length >= 4 && parts[2] === 'near-me' && parts[3] === 'us') {
        const citySlug = parts[1];
        const cityName = citySlug.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        // City-state mapping (you could expand this)
        const cityStateMap: Record<string, string> = {
          'dallas': 'Texas',
          'denver': 'Colorado',
          'austin': 'Texas',
          'houston': 'Texas',
          'frisco': 'Texas',
          'phoenix': 'Arizona',
          'chicago': 'Illinois',
          'atlanta': 'Georgia'
        };
        
        return {
          city: cityName,
          state: cityStateMap[citySlug] || 'Unknown',
          country: 'United States'
        };
      }
    } catch (error) {
      console.warn('Could not determine location:', error);
    }
    
    return {
      city: 'Unknown',
      state: 'Unknown',
      country: 'Unknown'
    };
  }

  async trackEvent(
    businessId: string,
    businessName: string,
    eventType: UserEngagementEvent['eventType'],
    eventData?: UserEngagementEvent['eventData']
  ): Promise<void> {
    try {
      // Check if tracking is enabled - early return if disabled
      if (!TRACKING_ENABLED) {
        // Skip all tracking if disabled - no database inserts, no analytics
        if (process.env.NODE_ENV === 'development') {
          console.log('📊 Tracking disabled, event not recorded:', {
            business: businessName,
            event: eventType,
            TRACKING_ENABLED
          });
        }
        return;
      }

      const location = await this.getLocationData();
      
      const event: UserEngagementEvent = {
        businessId,
        businessName,
        eventType,
        eventData: {
          ...eventData,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          sessionId: this.sessionId,
          deviceType: this.getDeviceType(),
          location
        },
        timestamp: new Date(),
        userSessionId: this.sessionId
      };

      // Track the event
      await this.dataProvider.trackEngagement(event);

      // Also send to Google Analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', eventType, {
          business_id: businessId,
          business_name: businessName,
          event_category: 'Business Engagement',
          event_label: businessName,
          custom_map: {
            business_id: businessId,
            device_type: this.getDeviceType(),
            source: eventData?.source || 'unknown'
          }
        });
      }

      // Console log for development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Engagement tracked:', {
          business: businessName,
          event: eventType,
          data: eventData
        });
      }
    } catch (error) {
      console.error('Failed to track engagement:', error);
      // Don't throw error to avoid disrupting user experience
    }
  }

  // Convenience methods for common tracking events
  async trackView(_businessId: string, _businessName: string, _source?: string, _searchQuery?: string): Promise<void> {
    // CLICK EVENTS ONLY - View events are no longer tracked
    // This method exists for backward compatibility but does nothing
    return;
  }

  async trackPhoneClick(businessId: string, businessName: string, phoneNumber: string): Promise<void> {
    // Tracking is always enabled in production
    if (!TRACKING_ENABLED) return;
    
    return this.trackEvent(businessId, businessName, 'phone_click', {
      clickedUrl: `tel:${phoneNumber}`
    });
  }

  async trackWebsiteClick(businessId: string, businessName: string, websiteUrl: string): Promise<void> {
    // Tracking is always enabled in production
    if (!TRACKING_ENABLED) return;
    
    return this.trackEvent(businessId, businessName, 'website_click', {
      clickedUrl: websiteUrl
    });
  }

  async trackBookingClick(businessId: string, businessName: string, bookingUrl: string): Promise<void> {
    // Tracking is always enabled in production
    if (!TRACKING_ENABLED) return;
    
    return this.trackEvent(businessId, businessName, 'booking_click', {
      clickedUrl: bookingUrl
    });
  }

  async trackDirectionsClick(businessId: string, businessName: string, directionsUrl: string): Promise<void> {
    // Tracking is always enabled in production
    if (!TRACKING_ENABLED) return;
    
    return this.trackEvent(businessId, businessName, 'directions_click', {
      clickedUrl: directionsUrl
    });
  }

  async trackEmailClick(businessId: string, businessName: string, emailAddress: string): Promise<void> {
    // Tracking is always enabled in production
    if (!TRACKING_ENABLED) return;
    
    return this.trackEvent(businessId, businessName, 'email_click', {
      clickedUrl: `mailto:${emailAddress}`
    });
  }

  async trackHoursView(_businessId: string, _businessName: string): Promise<void> {
    // CLICK EVENTS ONLY - Hours view events are no longer tracked
    // This method exists for backward compatibility but does nothing
    return;
  }

  async trackServicesExpand(_businessId: string, _businessName: string): Promise<void> {
    // CLICK EVENTS ONLY - Services expand events are no longer tracked
    // This method exists for backward compatibility but does nothing
    return;
  }

  async trackPhotoView(_businessId: string, _businessName: string, _photoUrl: string): Promise<void> {
    // CLICK EVENTS ONLY - Photo view events are no longer tracked
    // This method exists for backward compatibility but does nothing
    return;
  }
}

// Export singleton instance
export const engagementTracker = new EngagementTracker();