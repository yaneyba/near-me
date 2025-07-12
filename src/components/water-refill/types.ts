export interface WaterStation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone?: string;
  rating: number;
  priceRange: string;
  distance: string;
  isOpen: boolean;
  hours: string;
  amenities: string[];
  lat: number;
  lng: number;
  image?: string;
}

export interface WaterStationDetail {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  website?: string;
  rating: number;
  reviewCount: number;
  pricePerGallon: string;
  isOpen: boolean;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  waterTypes: string[];
  amenities: string[];
  description: string;
  lat: number;
  lng: number;
  photos: string[];
  image?: string;
}
