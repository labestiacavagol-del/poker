import { Download, Upload, AlertTriangle, DollarSign, TrendingUp, Clock, Target, Award, Zap, Trophy, Share2, Trash2 } from 'lucide-react';
import { StatCard } from '../StatCard';
import { MetricCard } from '../MetricCard';
import { ChartCard } from '../ChartCard';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import type { Session, Stats, Language, BankrollSettings } from '@/types/poker';
import { translations } from '@/data/poker-data';
import { cn } from '@/lib/utils';

interface DashboardViewProps {
  sessions: Session[];
  stats: Stats;
  bankrollSettings: BankrollSettings;
  language: Language;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  onDeleteSession: (id: string) => void;
  onShareSession: (id: string) => void;
}

export function DashboardView({
  sessions,
  stats,
  bankrollSettings,
  language,
  onImport,
  onExport,
  onDeleteSession,
  onShareSession
}: DashboardViewProps) {
  const t = translations[language];

  const chartData = sessions.slice(0, 30).reverse().map((s, i, arr) => ({
    date: s.date.slice(5),
    profit: arr.slice(0, i + 1).reduce((sum, sess) => sum + sess.profit, 0)
  }));

  const radarData = [
    { metric: 'Win Rate', value: stats.winRate, fullMark: 100 },
    { metric: 'ROI', value: Math.min(stats.roi, 100), fullMark: 100 },
    { metric: 'Volume', value: Math.min((stats.totalSessions / 100) * 100, 100), fullMark: 100 },
    { metric: 'Consistency', value: Math.min((stats.winRate / 70) * 100, 100), fullMark: 100 },
    { metric: 'BRM', value: Math.min(stats.bankrollHealth, 100), fullMark: 100 },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up opacity-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t.dashboard}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {language === 'es' ? 'Visión completa de tu rendimiento' : 'Complete overview of your performance'}
          </p>
        </div>
        <div className="flex gap-2">
          <label className="btn-secondary flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{language === 'es' ? 'Importar' : 'Import'}</span>
            <input type="file" accept=".json" onChange={onImport} className="hidden" />
          </label>
          <button onClick={onExport} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            {t.exportAll}
          </button>
        </div>
      </div>

      {/* Bankroll Alert */}
      {stats.bankrollHealth < 70 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-up opacity-0" style={{ animationDelay: '0.1s' }}>
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
          <div>
            <p className="font-semibold text-destructive">
              {language === 'es' ? '⚠️ Alerta de Bankroll' : '⚠️ Bankroll Alert'} ({stats.bankrollHealth.toFixed(1)}%)
            </p>
            <p className="text-sm text-muted-foreground">
              {language === 'es' 
                ? 'Tu bankroll está bajo. Considera bajar de stakes.' 
                : 'Your bankroll is low. Consider moving down in stakes.'}
            </p>
          </div>
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.bankroll}
          value={`${bankrollSettings.currency} ${stats.currentBankroll.toFixed(2)}`}
          icon={<DollarSign className="w-5 h-5" />}
          trend={stats.currentBankroll >= bankrollSettings.currentBankroll ? 'up' : 'down'}
          subtitle={`${language === 'es' ? 'Inicial' : 'Initial'}: ${bankrollSettings.currency}${bankrollSettings.currentBankroll}`}
          color={stats.bankrollHealth >= 100 ? 'emerald' : stats.bankrollHealth >= 70 ? 'yellow' : 'red'}
          delay={1}
        />
        <StatCard
          title={t.profit}
          value={`${bankrollSettings.currency} ${stats.totalProfit.toFixed(2)}`}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={stats.totalProfit >= 0 ? 'up' : 'down'}
          subtitle={`${stats.totalSessions} ${language === 'es' ? 'sesiones' : 'sessions'}`}
          color={stats.totalProfit >= 0 ? 'emerald' : 'red'}
          delay={2}
        />
        <StatCard
          title={t.hourlyRate}
          value={`${bankrollSettings.currency} ${stats.hourlyRate.toFixed(2)}/hr`}
          icon={<Clock className="w-5 h-5" />}
          trend={stats.hourlyRate >= 0 ? 'up' : 'down'}
          subtitle={`${stats.totalHours.toFixed(1)} ${language === 'es' ? 'horas' : 'hours'}`}
          color={stats.hourlyRate >= 0 ? 'emerald' : 'red'}
          delay={3}
        />
        <StatCard
          title={t.winRate}
          value={`${stats.winRate.toFixed(1)}%`}
          icon={<Target className="w-5 h-5" />}
          trend={stats.winRate >= 50 ? 'up' : 'down'}
          subtitle={`${stats.winSessions}W / ${stats.lossSessions}L`}
          color={stats.winRate >= 50 ? 'emerald' : 'red'}
          delay={4}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="ROI" value={`${stats.roi.toFixed(1)}%`} icon={Award} delay={5} />
        <MetricCard title="Profit Factor" value={stats.profitFactor === 999 ? '∞' : stats.profitFactor.toFixed(2)} icon={Zap} delay={6} />
        <MetricCard title="Expectancy" value={`${bankrollSettings.currency}${stats.expectancy.toFixed(2)}`} icon={Trophy} delay={7} />
        <MetricCard title="Avg Win" value={`${stats.avgWin.toFixed(2)}`} icon={TrendingUp} delay={8} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title={language === 'es' ? 'Evolución del Bankroll' : 'Bankroll Evolution'}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" style={{ fontSize: 11 }} />
              <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Area type="monotone" dataKey="profit" stroke="hsl(var(--primary))" fill="url(#profitGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Performance Radar">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" style={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
              <Radar name="Performance" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Sessions Table */}
      <div className="rounded-xl border border-border bg-card p-6 animate-fade-up opacity-0" style={{ animationDelay: '0.5s' }}>
        <h3 className="font-semibold mb-4">
          {language === 'es' ? 'Últimas 10 Sesiones' : 'Last 10 Sessions'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="pb-3 font-medium">{language === 'es' ? 'Fecha' : 'Date'}</th>
                <th className="pb-3 font-medium">{language === 'es' ? 'Variante' : 'Variant'}</th>
                <th className="pb-3 font-medium">Stakes</th>
                <th className="pb-3 font-medium">{language === 'es' ? 'Ubicación' : 'Location'}</th>
                <th className="pb-3 text-right font-medium">Buy-in</th>
                <th className="pb-3 text-right font-medium">Cash Out</th>
                <th className="pb-3 text-right font-medium">Profit</th>
                <th className="pb-3 text-right font-medium">{language === 'es' ? 'Horas' : 'Hours'}</th>
                <th className="pb-3 text-right font-medium">$/hr</th>
                <th className="pb-3 text-center font-medium">{language === 'es' ? 'Acción' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {sessions.slice(0, 10).map(s => (
                <tr key={s.id} className="table-row">
                  <td className="py-3 text-sm">{s.date}</td>
                  <td className="py-3 text-sm">{s.variant}</td>
                  <td className="py-3 text-sm font-mono">{s.stakes}</td>
                  <td className="py-3 text-sm">{s.location}</td>
                  <td className="py-3 text-sm text-right font-mono">{bankrollSettings.currency}{s.buyIn.toFixed(0)}</td>
                  <td className="py-3 text-sm text-right font-mono">{bankrollSettings.currency}{s.cashOut.toFixed(0)}</td>
                  <td className="py-3 text-sm text-right font-mono font-semibold">
                    <span className={s.profit >= 0 ? 'badge-profit' : 'badge-loss'}>
                      {bankrollSettings.currency}{s.profit.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-right">{s.duration}h</td>
                  <td className={cn(
                    "py-3 text-sm text-right font-mono",
                    s.duration > 0 && s.profit / s.duration >= 0 ? 'text-success' : 'text-destructive'
                  )}>
                    {bankrollSettings.currency}{s.duration > 0 ? (s.profit / s.duration).toFixed(2) : '0.00'}
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onShareSession(s.id)}
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteSession(s.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-muted-foreground">
                    {language === 'es' ? 'No hay sesiones registradas' : 'No sessions recorded'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
