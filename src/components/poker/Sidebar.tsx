import { cn } from '@/lib/utils';
import { 
  Home, Calendar, Trophy, BarChart3, Calculator, 
  GraduationCap, Target, PlayCircle, Settings, 
  Plus, Cloud, Wifi, WifiOff, Loader2, Lightbulb,
  Sparkles
} from 'lucide-react';
import type { ViewType, CloudStatus, Language, AIRecommendation } from '@/types/poker';
import { translations } from '@/data/poker-data';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  language: Language;
  cloudStatus: CloudStatus;
  aiRecommendations: AIRecommendation[];
  onSync: () => void;
  onNewSession: () => void;
}

export function Sidebar({
  currentView,
  setCurrentView,
  language,
  cloudStatus,
  aiRecommendations,
  onSync,
  onNewSession
}: SidebarProps) {
  const t = translations[language];

  const navItems = [
    { id: 'dashboard' as ViewType, icon: Home, label: t.dashboard },
    { id: 'sessions' as ViewType, icon: Calendar, label: t.sessions },
    { id: 'tournaments' as ViewType, icon: Trophy, label: t.tournaments },
    { id: 'analytics' as ViewType, icon: BarChart3, label: t.analytics },
    { id: 'equity' as ViewType, icon: Calculator, label: t.equity },
    { id: 'trainer' as ViewType, icon: GraduationCap, label: t.trainer },
    { id: 'ranges' as ViewType, icon: Target, label: t.ranges },
    { id: 'hands' as ViewType, icon: PlayCircle, label: t.hands },
    { id: 'settings' as ViewType, icon: Settings, label: t.settings },
  ];

  const CloudIcon = cloudStatus === 'syncing' ? Loader2 : cloudStatus === 'synced' ? Wifi : WifiOff;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">Poker Pro</h1>
            <p className="text-xs text-muted-foreground">Session Tracker</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={cn(
              "nav-item w-full",
              currentView === item.id ? "nav-item-active" : "nav-item-inactive"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* AI Recommendations */}
      {aiRecommendations.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t.aiRecommendations}
            </span>
          </div>
          <div className="space-y-2">
            {aiRecommendations.slice(0, 2).map((rec, i) => (
              <div 
                key={i} 
                className="p-3 rounded-lg bg-accent/50 border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <rec.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-primary">{rec.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      {rec.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button
          onClick={onSync}
          disabled={cloudStatus === 'syncing'}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <CloudIcon className={cn(
            "w-4 h-4",
            cloudStatus === 'syncing' && "animate-spin",
            cloudStatus === 'synced' && "text-success"
          )} />
          <span className="text-sm">{t.cloudSync}</span>
        </button>
        
        <button
          onClick={onNewSession}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t.newSession}
        </button>
      </div>
    </aside>
  );
}
