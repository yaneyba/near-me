export interface Business {
  id: string;
  name: string;
  category: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  website?: string;
  rating: number;
  reviewCount: number;
  description: string;
  services: string[];
  neighborhood: string;
  hours: {
    [key: string]: string;
  };
  image: string;
  premium: boolean; // New premium field
}

export interface IDataProvider {
  getBusinesses(category: string, city: string): Promise<Business[]>;
  getServices(category: string): Promise<string[]>;
  getNeighborhoods(city: string): Promise<string[]>;
}

export interface SubdomainInfo {
  category: string;
  city: string;
  state: string;
}