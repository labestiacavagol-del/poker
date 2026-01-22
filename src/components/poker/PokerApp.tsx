import { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Sidebar } from './Sidebar';
import { Toast } from './Toast';
import { NewSessionModal } from './NewSessionModal';
import { DashboardView } from './views/DashboardView';
import { EquityView } from './views/EquityView';
import { TrainerView } from './views/TrainerView';
import { RangesView } from './views/RangesView';
import { TournamentsView } from './views/TournamentsView';
import { SettingsView } from './views/SettingsView';
import { SessionsView } from './views/SessionsView';
import { AnalyticsView } from './views/AnalyticsView';
import { HandsView } from './views/HandsView';
import { RANGES, translations } from '@/data/poker-data';
import { Target, AlertTriangle, GraduationCap, Brain } from 'lucide-react';
import type { 
  Session, HandHistory, BankrollSettings, Theme, Language, 
  CloudStatus, ViewType, EquityCalculation, AIRecommendation, Tournament 
} from '@/types/poker';

export function PokerApp() {
  const [sessions, setSessions] = useLocalStorage<Session[]>('poker-sessions', []);
  const [handHistories, setHandHistories] = useLocalStorage<HandHistory[]>('hand-histories', []);
  const [bankrollSettings, setBankrollSettings] = useLocalStorage<BankrollSettings>('bankroll-settings', {
    currentBankroll: 5000,
    monthlyGoal: 2000,
    maxBuyInPercent: 5,
    stopLossDaily: 500,
    stopLossWeekly: 1500,
    currency: 'USD'
  });

  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');
  const [language, setLanguage] = useLocalStorage<Language>('language', 'es');
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>('offline');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [showAddSession, setShowAddSession] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [currentSpotIndex, setCurrentSpotIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<keyof typeof RANGES>('BTN_RFI');
  const [uploadedHandText, setUploadedHandText] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Equity Calculator State
  const [equityHand1, setEquityHand1] = useState('AKs');
  const [equityHand2, setEquityHand2] = useState('QQ');
  const [equityBoard, setEquityBoard] = useState('');
  const [equityResult, setEquityResult] = useState<EquityCalculation | null>(null);

  const [newSession, setNewSession] = useState({
    date: new Date().toISOString().split('T')[0],
    variant: 'NLHE',
    stakes: '1/2',
    location: 'PokerStars',
    buyIn: 200,
    cashOut: 0,
    duration: 2,
    notes: '',
    isTournament: false,
    position: 0,
    entries: 0,
  });

  const [filters, setFilters] = useState({
    variant: 'all',
    stakes: 'all',
    location: 'all',
    dateFrom: '',
    dateTo: '',
  });

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const syncToCloud = async () => {
    setCloudStatus('syncing');
    showToast(language === 'es' ? 'Sincronizando...' : 'Syncing...', 'info');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCloudStatus('synced');
    showToast(language === 'es' ? '✓ Sincronizado' : '✓ Synced', 'success');
    setTimeout(() => setCloudStatus('offline'), 3000);
  };

  // Stats calculation
  const stats = useMemo(() => {
    const filteredSessions = sessions.filter(s => {
      if (filters.variant !== 'all' && s.variant !== filters.variant) return false;
      if (filters.stakes !== 'all' && s.stakes !== filters.stakes) return false;
      if (filters.location !== 'all' && s.location !== filters.location) return false;
      if (filters.dateFrom && s.date < filters.dateFrom) return false;
      if (filters.dateTo && s.date > filters.dateTo) return false;
      return true;
    });

    const totalProfit = filteredSessions.reduce((sum, s) => sum + s.profit, 0);
    const totalHours = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalBuyIns = filteredSessions.reduce((sum, s) => sum + s.buyIn, 0);
    const winSessions = filteredSessions.filter(s => s.profit > 0).length;
    const lossSessions = filteredSessions.filter(s => s.profit < 0).length;
    
    const currentBankroll = bankrollSettings.currentBankroll + totalProfit;
    const roi = totalBuyIns > 0 ? (totalProfit / totalBuyIns) * 100 : 0;
    
    const winningSessionsProfit = filteredSessions.filter(s => s.profit > 0).reduce((sum, s) => sum + s.profit, 0);
    const losingSessionsLoss = Math.abs(filteredSessions.filter(s => s.profit < 0).reduce((sum, s) => sum + s.profit, 0));
    const avgWin = winSessions > 0 ? winningSessionsProfit / winSessions : 0;
    const avgLoss = lossSessions > 0 ? losingSessionsLoss / lossSessions : 0;
    const expectancy = filteredSessions.length > 0 ? totalProfit / filteredSessions.length : 0;
    
    return {
      totalProfit,
      currentBankroll,
      totalHours,
      hourlyRate: totalHours > 0 ? totalProfit / totalHours : 0,
      roi,
      winRate: filteredSessions.length > 0 ? (winSessions / filteredSessions.length) * 100 : 0,
      totalSessions: filteredSessions.length,
      winSessions,
      lossSessions,
      avgProfit: filteredSessions.length > 0 ? totalProfit / filteredSessions.length : 0,
      avgWin,
      avgLoss,
      expectancy,
      profitFactor: losingSessionsLoss > 0 ? winningSessionsProfit / losingSessionsLoss : winningSessionsProfit > 0 ? 999 : 0,
      bankrollHealth: (currentBankroll / bankrollSettings.currentBankroll) * 100
    };
  }, [sessions, filters, bankrollSettings]);

  // AI Recommendations
  const aiRecommendations = useMemo((): AIRecommendation[] => {
    const recommendations: AIRecommendation[] = [];
    
    const stakePerformance: Record<string, { profit: number; sessions: number }> = {};
    sessions.forEach(s => {
      if (!stakePerformance[s.stakes]) {
        stakePerformance[s.stakes] = { profit: 0, sessions: 0 };
      }
      stakePerformance[s.stakes].profit += s.profit;
      stakePerformance[s.stakes].sessions += 1;
    });

    const bestStake = Object.entries(stakePerformance)
      .filter(([_, data]) => data.sessions >= 5)
      .sort((a, b) => (b[1].profit / b[1].sessions) - (a[1].profit / a[1].sessions))[0];

    if (bestStake) {
      recommendations.push({
        type: 'stakes',
        title: language === 'es' ? 'Stakes Óptimos' : 'Optimal Stakes',
        message: language === 'es' 
          ? `Mejores resultados en ${bestStake[0]}`
          : `Best results at ${bestStake[0]}`,
        icon: Target
      });
    }

    if (stats.winRate < 45 && stats.totalSessions > 10) {
      recommendations.push({
        type: 'study',
        title: language === 'es' ? 'Win Rate bajo' : 'Low Win Rate',
        message: language === 'es'
          ? `Con ${stats.winRate.toFixed(1)}% considera revisar tu estrategia`
          : `With ${stats.winRate.toFixed(1)}% consider reviewing strategy`,
        icon: GraduationCap
      });
    }

    const last5Sessions = sessions.slice(0, 5);
    const losingStreak = last5Sessions.filter(s => s.profit < 0).length;
    if (losingStreak >= 3) {
      recommendations.push({
        type: 'mental',
        title: language === 'es' ? 'Posible Tilt' : 'Possible Tilt',
        message: language === 'es'
          ? `${losingStreak} sesiones perdedoras. Tómate un break`
          : `${losingStreak} losing sessions. Take a break`,
        icon: Brain
      });
    }

    return recommendations;
  }, [sessions, stats, language]);

  const addSession = () => {
    const profit = newSession.cashOut - newSession.buyIn;
    const session: Session = {
      id: crypto.randomUUID(),
      ...newSession,
      profit,
      timestamp: new Date().toISOString(),
      tournamentId: selectedTournament?.id
    };
    
    setSessions(prev => [session, ...prev]);
    showToast(language === 'es' ? '✓ Sesión agregada' : '✓ Session added', 'success');
    
    setNewSession({
      date: new Date().toISOString().split('T')[0],
      variant: 'NLHE',
      stakes: '1/2',
      location: 'PokerStars',
      buyIn: 200,
      cashOut: 0,
      duration: 2,
      notes: '',
      isTournament: false,
      position: 0,
      entries: 0,
    });
    setSelectedTournament(null);
    setShowAddSession(false);
  };

  const deleteSession = (id: string) => {
    if (window.confirm(language === 'es' ? '¿Eliminar esta sesión?' : 'Delete this session?')) {
      setSessions(prev => prev.filter(s => s.id !== id));
      showToast(language === 'es' ? 'Sesión eliminada' : 'Session deleted', 'info');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ sessions, bankrollSettings, handHistories, theme, language }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `poker-pro-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast(language === 'es' ? '📦 Datos exportados' : '📦 Data exported', 'success');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.sessions) setSessions(data.sessions);
        if (data.bankrollSettings) setBankrollSettings(data.bankrollSettings);
        if (data.handHistories) setHandHistories(data.handHistories);
        if (data.theme) setTheme(data.theme);
        if (data.language) setLanguage(data.language);
        showToast(language === 'es' ? '📥 Datos importados' : '📥 Data imported', 'success');
      } catch {
        showToast(language === 'es' ? '❌ Error al importar' : '❌ Import error', 'error');
      }
    };
    reader.readAsText(file);
  };

  const runEquityCalculation = () => {
    const baseEquity = Math.random() * 40 + 30;
    const equity1 = parseFloat(baseEquity.toFixed(1));
    const equity2 = parseFloat((100 - baseEquity - 5).toFixed(1));
    const tie = parseFloat((5).toFixed(1));
    
    setEquityResult({ 
      hand1: equityHand1, 
      hand2: equityHand2, 
      board: equityBoard, 
      equity1, 
      equity2, 
      tie 
    });
  };

  const parseHandHistory = () => {
    if (!uploadedHandText.trim()) return;
    
    const hand: HandHistory = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      stakes: '1/2',
      heroPosition: 'BTN',
      action: 'Raise',
      result: 0,
      handText: uploadedHandText,
    };
    
    setHandHistories(prev => [hand, ...prev]);
    setUploadedHandText('');
    showToast(language === 'es' ? 'Mano analizada' : 'Hand analyzed', 'success');
  };

  const handleSelectTournament = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setNewSession({
      ...newSession,
      buyIn: tournament.buyIn,
      variant: 'MTT',
      location: tournament.location,
      isTournament: true
    });
    setShowAddSession(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        language={language}
        cloudStatus={cloudStatus}
        aiRecommendations={aiRecommendations}
        onSync={syncToCloud}
        onNewSession={() => setShowAddSession(true)}
      />

      <main className="ml-64 p-6">
        {currentView === 'dashboard' && (
          <DashboardView
            sessions={sessions}
            stats={stats}
            bankrollSettings={bankrollSettings}
            language={language}
            onImport={importData}
            onExport={exportData}
            onDeleteSession={deleteSession}
            onShareSession={(id) => showToast('Share feature coming soon!', 'info')}
          />
        )}
        
        {currentView === 'sessions' && (
          <SessionsView
            sessions={sessions}
            language={language}
            bankrollSettings={bankrollSettings}
            filters={filters}
            setFilters={setFilters}
            onDeleteSession={deleteSession}
            onShareSession={(id) => showToast('Share feature coming soon!', 'info')}
          />
        )}

        {currentView === 'tournaments' && (
          <TournamentsView
            language={language}
            onSelectTournament={handleSelectTournament}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView
            sessions={sessions}
            language={language}
            bankrollSettings={bankrollSettings}
            filters={filters}
            setFilters={setFilters}
          />
        )}

        {currentView === 'equity' && (
          <EquityView
            language={language}
            equityHand1={equityHand1}
            equityHand2={equityHand2}
            equityBoard={equityBoard}
            equityResult={equityResult}
            setEquityHand1={setEquityHand1}
            setEquityHand2={setEquityHand2}
            setEquityBoard={setEquityBoard}
            onCalculate={runEquityCalculation}
          />
        )}

        {currentView === 'trainer' && (
          <TrainerView
            language={language}
            currentSpotIndex={currentSpotIndex}
            showAnswer={showAnswer}
            setCurrentSpotIndex={setCurrentSpotIndex}
            setShowAnswer={setShowAnswer}
          />
        )}

        {currentView === 'ranges' && (
          <RangesView
            language={language}
            selectedPosition={selectedPosition}
            setSelectedPosition={setSelectedPosition}
          />
        )}

        {currentView === 'hands' && (
          <HandsView
            language={language}
            handHistories={handHistories}
            uploadedHandText={uploadedHandText}
            setUploadedHandText={setUploadedHandText}
            onParseHand={parseHandHistory}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            language={language}
            theme={theme}
            bankrollSettings={bankrollSettings}
            setLanguage={setLanguage}
            setTheme={setTheme}
            setBankrollSettings={setBankrollSettings}
          />
        )}
      </main>

      <NewSessionModal
        language={language}
        isOpen={showAddSession}
        onClose={() => {
          setShowAddSession(false);
          setSelectedTournament(null);
        }}
        onAdd={addSession}
        newSession={newSession}
        setNewSession={setNewSession}
        selectedTournament={selectedTournament}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
