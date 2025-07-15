import {
  IDataProvider,
  Business,
  ContactSubmission,
  BusinessSubmission,
  SubmissionResult,
  UserEngagementEventDB,
  BusinessAnalytics
} from '@/types';
import { ApiEndpoints, EndpointBuilder } from '@/config/endpoints';

export class D1DataProvider implements IDataProvider {
  private readonly apiBaseUrl: string;
  private readonly apiKey: string;
  private readonly defaultHeaders: HeadersInit;

  constructor() {
    this.apiBaseUrl = import.meta.env.DEV ? '' : this.getRequiredEnvVar('VITE_API_BASE_URL');
    this.apiKey = this.getRequiredEnvVar('VITE_D1_API_KEY');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };
  }

  private getRequiredEnvVar(name: string): string {
    const value = import.meta.env[name];
    if (!value) throw new Error(`Missing env var: ${name}`);
    return value;
  }

  private async apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const hostname = window.location.hostname;
    const isSubdomain = hostname.includes('.near-me.us') && !hostname.startsWith('near-me.us');
    const url = (isSubdomain || import.meta.env.DEV) ? endpoint : `${this.apiBaseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: this.defaultHeaders,
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  async getBusinesses(category: string, city: string): Promise<Business[]> {
    return this.apiRequest<Business[]>(EndpointBuilder.businessesWithParams(category, city));
  }

  async getBusinessesByCategory(category: string): Promise<Business[]> {
    return this.apiRequest<Business[]>(EndpointBuilder.businessesWithParams(category));
  }

  async getServices(category: string): Promise<string[]> {
    return this.apiRequest<string[]>(EndpointBuilder.servicesWithCategory(category));
  }

  async getNeighborhoods(city: string): Promise<string[]> {
    return this.apiRequest<string[]>(EndpointBuilder.neighborhoodsWithCity(city));
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.apiRequest<Array<{ category: string; count: number }>>(
      '/api/admin/stats/categories'
    );
    return categories.map(cat => cat.category);
  }

  async getCities(): Promise<string[]> {
    const cities = await this.apiRequest<Array<{ name: string }>>(ApiEndpoints.CITIES);
    return cities.map(city => city.name);
  }

  async getCityStateMap(): Promise<Record<string, string>> {
    const cities = await this.apiRequest<Array<{ name: string; state: string }>>(
      EndpointBuilder.citiesWithState(true)
    );

    const map: Record<string, string> = {};
    cities.forEach(city => {
      map[city.name] = city.state;
    });
    return map;
  }

  async getKnownCombinations(): Promise<Array<{ category: string; city: string }>> {
    const [categories, cities] = await Promise.all([this.getCategories(), this.getCities()]);
    return categories.flatMap(category =>
      cities.map(city => ({ category, city }))
    );
  }

  async getBusinessById(id: string): Promise<Business | null> {
    return this.apiRequest<Business>(EndpointBuilder.businessById(id));
  }

  async getWaterStationById(stationId: string): Promise<Business | null> {
    return this.apiRequest<Business>(EndpointBuilder.waterStationById(stationId));
  }

  async submitContact(contactData: ContactSubmission): Promise<SubmissionResult> {
    return this.apiRequest<SubmissionResult>(ApiEndpoints.CONTACT, {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  async submitBusiness(businessData: BusinessSubmission): Promise<SubmissionResult> {
    return this.apiRequest<SubmissionResult>(ApiEndpoints.SUBMIT_BUSINESS, {
      method: 'POST',
      body: JSON.stringify(businessData),
    });
  }

  async trackEngagement(event: UserEngagementEventDB): Promise<void> {
    await this.apiRequest(ApiEndpoints.TRACK_ENGAGEMENT, {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  async getBusinessAnalytics(
    businessId: string,
    period: 'day' | 'week' | 'month' | 'year',
    startDate?: Date,
    endDate?: Date
  ): Promise<BusinessAnalytics> {
    return this.apiRequest<BusinessAnalytics>(
      EndpointBuilder.businessAnalytics(businessId, period, startDate, endDate)
    );
  }

  async getOverallAnalytics(
    period: 'day' | 'week' | 'month' | 'year' = 'week',
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    return this.apiRequest<any>(
      EndpointBuilder.overallAnalytics(period, startDate, endDate)
    );
  }

  async getBusinessSubmissions(): Promise<any[]> {
    return this.apiRequest<any[]>(ApiEndpoints.ADMIN_BUSINESS_SUBMISSIONS);
  }

  async getBusinessProfiles(): Promise<any[]> {
    return this.apiRequest<any[]>(ApiEndpoints.ADMIN_BUSINESS_PROFILES);
  }

  async getContactMessages(): Promise<any[]> {
    return this.apiRequest<any[]>(ApiEndpoints.ADMIN_CONTACT_MESSAGES);
  }

  async getAllBusinesses(): Promise<any[]> {
    return this.apiRequest<any[]>(EndpointBuilder.adminBusinessesWithType('all'));
  }

  async getAdminStats(): Promise<{
    pendingBusinesses: number;
    totalBusinesses: number;
    newMessages: number;
    totalUsers: number;
    premiumBusinesses: number;
  }> {
    return this.apiRequest(ApiEndpoints.ADMIN_STATS);
  }

  async approveBusinessSubmission(id: string, reviewerNotes?: string): Promise<void> {
    await this.apiRequest(ApiEndpoints.ADMIN_BUSINESS_SUBMISSIONS, {
      method: 'POST',
      body: JSON.stringify({ action: 'approve', submissionId: id, reviewerNotes }),
    });
  }

  async rejectBusinessSubmission(id: string, reviewerNotes?: string): Promise<void> {
    await this.apiRequest(ApiEndpoints.ADMIN_BUSINESS_SUBMISSIONS, {
      method: 'POST',
      body: JSON.stringify({ action: 'reject', submissionId: id, reviewerNotes }),
    });
  }

  async resolveContactMessage(id: string, resolvedBy?: string, adminNotes?: string): Promise<void> {
    await this.apiRequest(ApiEndpoints.ADMIN_CONTACT_MESSAGES, {
      method: 'POST',
      body: JSON.stringify({ action: 'resolve', messageId: id, resolvedBy, adminNotes }),
    });
  }

  async clearSampleEngagementData(sampleDataIdentifier: string): Promise<void> {
    await this.apiRequest(ApiEndpoints.ADMIN_ENGAGEMENT, {
      method: 'DELETE',
      body: JSON.stringify({ action: 'clear-sample', identifier: sampleDataIdentifier }),
    });
  }

  async getStatistics(): Promise<{
    totalBusinesses: number;
    totalCategories: number;
    totalCities: number;
    premiumBusinesses: number;
    averageRating: string;
  }> {
    return this.apiRequest(ApiEndpoints.ADMIN_STATS);
  }
}
