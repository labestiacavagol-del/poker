import { Tournament, TrainingSpot } from '@/types/poker';

export const TOURNAMENT_DATABASE: Tournament[] = [
  { id: 'ps-sunday-million', name: 'Sunday Million', buyIn: 109, location: 'PokerStars', structure: 'Deep Stack', avgEntries: 5000 },
  { id: 'ps-sunday-warm-up', name: 'Sunday Warm-Up', buyIn: 109, location: 'PokerStars', structure: 'Standard', avgEntries: 1500 },
  { id: 'ps-bounty-builder', name: 'Bounty Builder', buyIn: 55, location: 'PokerStars', structure: 'PKO', avgEntries: 3000 },
  { id: 'ps-hot-55', name: 'Hot $55', buyIn: 55, location: 'PokerStars', structure: 'Turbo', avgEntries: 2000 },
  { id: 'ps-storm', name: 'The Storm', buyIn: 11, location: 'PokerStars', structure: 'Standard', avgEntries: 8000 },
  { id: 'gg-bounty-hunters', name: 'Bounty Hunters', buyIn: 52.50, location: 'GGPoker', structure: 'PKO', avgEntries: 4000 },
  { id: 'gg-zodiac', name: 'Zodiac', buyIn: 105, location: 'GGPoker', structure: 'Standard', avgEntries: 1000 },
  { id: 'gg-daily-main', name: 'Daily Main Event', buyIn: 25, location: 'GGPoker', structure: 'Deep Stack', avgEntries: 2500 },
  { id: '888-mega-deep', name: 'Mega Deep', buyIn: 109, location: '888poker', structure: 'Deep Stack', avgEntries: 800 },
  { id: '888-whale', name: 'The Whale', buyIn: 109, location: '888poker', structure: 'PKO', avgEntries: 1200 },
  { id: 'pp-powerfest', name: 'POWERFEST Main', buyIn: 109, location: 'PartyPoker', structure: 'Standard', avgEntries: 1500 },
  { id: 'pp-bounty-hunter', name: 'Bounty Hunter', buyIn: 55, location: 'PartyPoker', structure: 'PKO', avgEntries: 2000 },
];

export const RANGES = {
  EP_RFI: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', 'AKs', 'AQs', 'AJs', 'AKo'],
  MP_RFI: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', 'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'AKo', 'AQo'],
  CO_RFI: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'KQs', 'KJs', 'QJs', 'AKo', 'AQo', 'AJo'],
  BTN_RFI: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'KQs', 'KJs', 'KTs', 'QJs', 'JTs', 'AKo', 'AQo', 'AJo', 'KQo'],
  SB_RFI: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', 'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'AKo', 'AQo'],
  BB_DEFENSE: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'JTs', 'T9s', 'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo']
};

export const TRAINING_SPOTS: TrainingSpot[] = [
  {
    id: '1',
    situation: '3-Bet Pot OOP',
    position: 'BB',
    action: 'Facing BTN open',
    heroHand: 'AKo',
    board: 'K♥ 7♦ 2♣',
    potSize: 40,
    stackSize: 100,
    correctAction: 'Check-Raise',
    explanation: 'Top pair en board seco con initiative. Check-raise para value y protección.',
    solverFrequencies: { 'Check-Raise': 65, 'Bet': 25, 'Check-Call': 10 }
  },
  {
    id: '2',
    situation: 'Single Raised Pot IP',
    position: 'BTN',
    action: 'CO opens, you call',
    heroHand: 'T♠9♠',
    board: 'J♥ 8♦ 2♣',
    potSize: 15,
    stackSize: 100,
    correctAction: 'Call',
    explanation: 'OESD con posición. Óptimo para call y evaluar turn.',
    solverFrequencies: { 'Call': 70, 'Raise': 20, 'Fold': 10 }
  },
  {
    id: '3',
    situation: '4-Bet Pot',
    position: 'CO',
    action: 'You 4-bet, BTN calls',
    heroHand: 'QQ',
    board: 'A♥ 9♦ 3♣',
    potSize: 80,
    stackSize: 80,
    correctAction: 'Check-Call',
    explanation: 'Overpair medio en board con A. Check-call para pot control.',
    solverFrequencies: { 'Check-Call': 55, 'Check-Fold': 25, 'Bet': 20 }
  },
  {
    id: '4',
    situation: 'Multiway Pot',
    position: 'UTG',
    action: 'You open, 3 callers',
    heroHand: 'KK',
    board: 'T♥ 7♦ 4♣',
    potSize: 24,
    stackSize: 100,
    correctAction: 'Bet 75%',
    explanation: 'Overpair en board coordinado multiway. Bet for value y protección.',
    solverFrequencies: { 'Bet 75%': 60, 'Bet 50%': 30, 'Check': 10 }
  },
  {
    id: '5',
    situation: 'Squeeze Spot',
    position: 'BB',
    action: 'CO opens, BTN calls',
    heroHand: 'AQs',
    board: '',
    potSize: 7,
    stackSize: 100,
    correctAction: '3-Bet',
    explanation: 'Excelente mano para squeeze preflop contra rango amplio y caller.',
    solverFrequencies: { '3-Bet': 70, 'Call': 25, 'Fold': 5 }
  }
];

export const translations = {
  es: {
    dashboard: 'Dashboard',
    sessions: 'Sesiones',
    tournaments: 'Torneos',
    analytics: 'Analytics',
    trainer: 'Trainer',
    ranges: 'Rangos',
    hands: 'Hand History',
    equity: 'Calculadora',
    settings: 'Configuración',
    newSession: 'Nueva Sesión',
    exportAll: 'Exportar Todo',
    bankroll: 'Bankroll Actual',
    profit: 'Profit Total',
    hourlyRate: 'Hourly Rate',
    winRate: 'Win Rate',
    aiRecommendations: 'RECOMENDACIONES IA',
    darkMode: 'Modo Oscuro',
    language: 'Idioma',
    currency: 'Moneda',
    cloudSync: 'Sincronización',
    shareSession: 'Compartir',
  },
  en: {
    dashboard: 'Dashboard',
    sessions: 'Sessions',
    tournaments: 'Tournaments',
    analytics: 'Analytics',
    trainer: 'Trainer',
    ranges: 'Ranges',
    hands: 'Hand History',
    equity: 'Calculator',
    settings: 'Settings',
    newSession: 'New Session',
    exportAll: 'Export All',
    bankroll: 'Current Bankroll',
    profit: 'Total Profit',
    hourlyRate: 'Hourly Rate',
    winRate: 'Win Rate',
    aiRecommendations: 'AI RECOMMENDATIONS',
    darkMode: 'Dark Mode',
    language: 'Language',
    currency: 'Currency',
    cloudSync: 'Cloud Sync',
    shareSession: 'Share',
  }
};

export const variants = ['NLHE', 'PLO', 'PLO5', 'PLO6', 'Mixed', 'MTT', 'SNG', '8-Game'];
export const stakeOptions = ['0.25/0.50', '0.50/1', '1/2', '1/3', '2/5', '5/10', '10/20', '25/50', '50/100'];
export const locations = ['PokerStars', 'GGPoker', '888poker', 'PartyPoker', 'Winamax', 'ACR', 'Casino Local'];
export const currencies = ['USD', 'EUR', 'GBP', 'ARS', 'BRL', 'MXN'];
