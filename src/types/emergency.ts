export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface MedicalCard {
  fullName: string;
  age: number | '';
  bloodGroup: BloodGroup;
  allergies: string;
  medications: string;
  chronicConditions: string;
  organDonor: boolean;
  contacts: EmergencyContact[];
}

export interface Helpline {
  id: string;
  nameKey: string;
  defaultName: string;
  number: string;
  category: 'national' | 'police' | 'fire' | 'medical' | 'women' | 'disaster';
  description: string;
  badge?: string;
  primary?: boolean;
}

export type HazardType = 
  | 'flooded_road' 
  | 'waterlogged_underpass' 
  | 'tree_fallen' 
  | 'bridge_submerged' 
  | 'landslide' 
  | 'gridlock';

export interface RoadHazard {
  id: string;
  type: HazardType;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  reportedAt: number; // timestamp
  expiresAt: number;  // timestamp
  confirmations: number;
  confirmedByMe?: boolean;
  severity: 'low' | 'moderate' | 'critical';
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RainfallForecastItem {
  time: string;
  precipitationMm: number;
  apparentTempC: number;
  weatherCode: number;
}

export interface ClimateRiskData {
  level: RiskLevel;
  currentPrecipitationMm: number;
  accumulatedRain24h: number;
  accumulatedRain72h: number;
  floodRiskScore: number; // 0-100
  riverDischargeM3s?: number;
  advisoryTitle: string;
  advisoryText: string;
  lastUpdated: number;
  forecast: RainfallForecastItem[];
}

export interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'shelter';
  lat: number;
  lng: number;
  address: string;
  city?: string;
  phone?: string;
  emergency24x7: boolean;
  distanceKm?: number;
  traumaCenter?: boolean;
  icuAvailable?: boolean;
}

export type NavigationTab = 'home' | 'map' | 'hospitals' | 'reports' | 'profile';
export type SupportedLanguage = 'en' | 'hi' | 'mr';
