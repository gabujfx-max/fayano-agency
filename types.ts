export enum ServiceCategory {
  PLUMBING = 'Plumbing',
  ELECTRICAL = 'Electrical',
  APPLIANCES = 'Appliances',
  HANDYMAN = 'Handyman',
  CCTV_SECURITY = 'CCTV & Security',
  GENERAL = 'General Inquiry'
}

export interface ServiceType {
  id: string;
  name: ServiceCategory;
  icon: string; // Lucide icon name
  description: string;
  basePrice: string;
}

export interface AIAnalysisResult {
  category: ServiceCategory;
  urgency: 'Low' | 'Medium' | 'Critical';
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  reasoning: string;
  suggestedAction: string;
}

export interface BookingDetails {
  service: ServiceCategory;
  description: string;
  date: string;
  time: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  estimatedCost: number;
}