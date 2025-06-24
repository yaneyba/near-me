import { IDataProvider, Business, ContactSubmission, BusinessSubmission, SubmissionResult } from '../types';
import { JsonDataProvider } from './JsonDataProvider';
import { SupabaseDataProvider } from './SupabaseDataProvider';

/**
 * Hybrid data provider that uses JSON for business data and Supabase for form submissions
 */
export class HybridDataProvider implements IDataProvider {
  private jsonProvider: JsonDataProvider;
  private supabaseProvider: SupabaseDataProvider;

  constructor() {
    this.jsonProvider = new JsonDataProvider();
    this.supabaseProvider = new SupabaseDataProvider();
  }

  // Use JSON provider for business data (fast, static)
  async getBusinesses(category: string, city: string): Promise<Business[]> {
    return this.jsonProvider.getBusinesses(category, city);
  }

  async getServices(category: string): Promise<string[]> {
    return this.jsonProvider.getServices(category);
  }

  async getNeighborhoods(city: string): Promise<string[]> {
    return this.jsonProvider.getNeighborhoods(city);
  }

  // Use Supabase for form submissions (persistent, real data)
  async submitContact(contactData: ContactSubmission): Promise<SubmissionResult> {
    return this.supabaseProvider.submitContact(contactData);
  }

  async submitBusiness(businessData: BusinessSubmission): Promise<SubmissionResult> {
    return this.supabaseProvider.submitBusiness(businessData);
  }
}