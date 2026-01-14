
export interface CompetitorMove {
  id: string;
  company: string;
  link: string;
  summary: string;
  date: string;
  sector: 'Marketing' | 'Sales' | 'Digital' | 'Other';
}

export interface GroundingLink {
  uri: string;
  title: string;
}

export interface StrategicInsight {
  title: string;
  description: string;
  type: 'Opportunity' | 'Threat' | 'Strategic Question';
}

export interface RadarData {
  company: string;
  innovation: number; // 0-100
  impact: number; // 0-100
  risk: number; // 0-100 (size of bubble)
}

export interface PESTELData {
  political: string[];
  economic: string[];
  social: string[];
  technological: string[];
  environmental: string[];
  legal: string[];
}

export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface DashboardData {
  moves: CompetitorMove[];
  links: GroundingLink[];
  insights: StrategicInsight[];
  radar: RadarData[];
  pestel: PESTELData;
  swot: Record<string, SWOTData>; // Keyed by company
}

export enum AppStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}
