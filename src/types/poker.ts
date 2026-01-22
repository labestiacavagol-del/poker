export type Session = {
  id: string;
  date: string;
  variant: string;
  stakes: string;
  location: string;
  buyIn: number;
  cashOut: number;
  duration: number;
  profit: number;
  notes?: string;
  timestamp: string;
  tournamentId?: string;
  position?: number;
  entries?: number;
  tags?: string[];
};

export type Tournament = {
  id: string;
  name: string;
  buyIn: number;
  location: string;
  structure: string;
  avgEntries: number;
};

export type HandHistory = {
  id: string;
  date: string;
  stakes: string;
  heroPosition: string;
  action: string;
  result: number;
  handText: string;
  equity?: number;
  solverAction?: string;
};

export type BankrollSettings = {
  currentBankroll: number;
  monthlyGoal: number;
  maxBuyInPercent: number;
  stopLossDaily: number;
  stopLossWeekly: number;
  currency: string;
};

export type TrainingSpot = {
  id: string;
  situation: string;
  position: string;
  action: string;
  heroHand: string;
  board: string;
  potSize: number;
  stackSize: number;
  correctAction: string;
  explanation: string;
  solverFrequencies?: { [key: string]: number };
};

export type Theme = 'dark' | 'light';
export type Language = 'es' | 'en';
export type CloudStatus = 'synced' | 'syncing' | 'offline' | 'error';
export type ViewType = 'dashboard' | 'sessions' | 'tournaments' | 'trainer' | 'ranges' | 'hands' | 'analytics' | 'equity' | 'settings';

export type EquityCalculation = {
  hand1: string;
  hand2: string;
  board: string;
  equity1: number;
  equity2: number;
  tie: number;
};

export interface AIRecommendation {
  type: string;
  title: string;
  message: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Stats {
  totalProfit: number;
  currentBankroll: number;
  totalHours: number;
  hourlyRate: number;
  roi: number;
  winRate: number;
  totalSessions: number;
  winSessions: number;
  lossSessions: number;
  avgProfit: number;
  avgWin: number;
  avgLoss: number;
  expectancy: number;
  profitFactor: number;
  bankrollHealth: number;
}
