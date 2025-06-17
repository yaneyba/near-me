import { IDataProvider, Business } from '../types';
import businessesData from '../data/businesses.json';
import servicesData from '../data/services.json';
import neighborhoodsData from '../data/neighborhoods.json';

export class JsonDataProvider implements IDataProvider {
  private businesses: Business[] = businessesData;
  private services: Record<string, string[]> = servicesData;
  private neighborhoods: Record<string, string[]> = neighborhoodsData;

  async getBusinesses(category: string, city: string): Promise<Business[]> {
    // Convert display format back to kebab-case for filtering
    const categoryKey = category.toLowerCase().replace(/\s+/g, '-');
    const cityKey = city.toLowerCase().replace(/\s+/g, '-');
    
    return this.businesses.filter(
      business => business.category === categoryKey && business.city === cityKey
    );
  }

  async getServices(category: string): Promise<string[]> {
    const categoryKey = category.toLowerCase().replace(/\s+/g, '-');
    return this.services[categoryKey] || [];
  }

  async getNeighborhoods(city: string): Promise<string[]> {
    const cityKey = city.toLowerCase().replace(/\s+/g, '-');
    return this.neighborhoods[cityKey] || [];
  }
}