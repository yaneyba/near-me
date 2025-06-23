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

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType: string;
  businessName?: string;
  preferredContact: string;
  urgency: string;
  category: string;
  city: string;
  state: string;
  submittedAt: Date;
}

export interface BusinessSubmission {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  category: string;
  website?: string;
  description: string;
  services: string[];
  customServices: string[];
  hours: {
    [key: string]: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  businessType: 'individual' | 'franchise' | 'chain';
  yearsInBusiness: string;
  employeeCount: string;
  specialOffers: string;
  submittedAt: Date;
}

export interface SubmissionResult {
  success: boolean;
  message: string;
  submissionId?: string;
  errors?: string[];
}

export interface IDataProvider {
  getBusinesses(category: string, city: string): Promise<Business[]>;
  getServices(category: string): Promise<string[]>;
  getNeighborhoods(city: string): Promise<string[]>;
  submitContact(contactData: ContactSubmission): Promise<SubmissionResult>;
  submitBusiness(businessData: BusinessSubmission): Promise<SubmissionResult>;
}

export interface SubdomainInfo {
  category: string;
  city: string;
  state: string;
}