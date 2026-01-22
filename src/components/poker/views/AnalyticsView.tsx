import { Filter } from 'lucide-react';
import { ChartCard } from '../ChartCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ComposedChart, Line } from 'recharts';
import type { Session, Language, BankrollSettings } from '@/types/poker';
import { translations, variants, stakeOptions, locations } from '@/data/poker-data';

interface AnalyticsViewProps {
  sessions: Session[];
  language: Language;
  bankrollSettings: BankrollSettings;
  filters: {
    variant: string;
    stakes: string;
    location: string;
    dateFrom: string;
    dateTo: string;
  };
  setFilters: (f: any) => void;
}

export function AnalyticsView({
  sessions,
  language,
  bankrollSettings,
  filters,
  setFilters
}: AnalyticsViewProps) {
  const t = translations[language];

  const filteredSessions = sessions.filter(s => {
    if (filters.variant !== 'all' && s.variant !== filters.variant) return false;
    if (filters.stakes !== 'all' && s.stakes !== filters.stakes) return false;
    if (filters.location !== 'all' && s.location !== filters.location) return false;
    if (filters.dateFrom && s.date < filters.dateFrom) return false;
    if (filters.dateTo && s.date > filters.dateTo) return false;
    return true;
  });

  // Data by variant
  const variantData = variants.map(v => {
    const variantSessions = filteredSessions.filter(s => s.variant === v);
    return {
      name: v,
      profit: variantSessions.reduce((sum, s) => sum + s.profit, 0),
      sessions: variantSessions.length
    };
  }).filter(d => d.sessions > 0);

  // Data by location
  const locationData = locations.map(l => {
    const locSessions = filteredSessions.filter(s => s.location === l);
    return {
      name: l,
      profit: locSessions.reduce((sum, s) => sum + s.profit, 0),
      sessions: locSessions.length
    };
  }).filter(d => d.sessions > 0);

  // Win/Loss distribution
  const winCount = filteredSessions.filter(s => s.profit > 0).length;
  const lossCount = filteredSessions.filter(s => s.profit < 0).length;
  const breakEven = filteredSessions.filter(s => s.profit === 0).length;
  
  const pieData = [
    { name: language === 'es' ? 'Ganadas' : 'Won', value: winCount, color: 'hsl(var(--success))' },
    { name: language === 'es' ? 'Perdidas' : 'Lost', value: lossCount, color: 'hsl(var(--destructive))' },
    { name: 'Break Even', value: breakEven, color: 'hsl(var(--muted-foreground))' },
  ].filter(d => d.value > 0);

  // Monthly trend
  const monthlyData: Record<string, { month: string; profit: number; sessions: number }> = {};
  filteredSessions.forEach(s => {
    const month = s.date.slice(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = { month, profit: 0, sessions: 0 };
    }
    monthlyData[month].profit += s.profit;
    monthlyData[month].sessions += 1;
  });
  const monthlyChartData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="animate-fade-up opacity-0">
        <h2 className="text-3xl font-bold tracking-tight">
          {language === 'es' ? 'Analytics Avanzado' : 'Advanced Analytics'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'es' ? 'Análisis profundo de tu juego' : 'Deep analysis of your game'}
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-4 animate-fade-up opacity-0" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">{language === 'es' ? 'Filtros' : 'Filters'}</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <select
            value={filters.variant}
            onChange={(e) => setFilters({ ...filters, variant: e.target.value })}
            className="input-poker text-sm"
          >
            <option value="all">{language === 'es' ? 'Todas las variantes' : 'All variants'}</option>
            {variants.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <select
            value={filters.stakes}
            onChange={(e) => setFilters({ ...filters, stakes: e.target.value })}
            className="input-poker text-sm"
          >
            <option value="all">{language === 'es' ? 'Todos los stakes' : 'All stakes'}</option>
            {stakeOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="input-poker text-sm"
          >
            <option value="all">{language === 'es' ? 'Todas las ubicaciones' : 'All locations'}</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            className="input-poker text-sm"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="input-poker text-sm"
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title={language === 'es' ? 'Profit por Variante' : 'Profit by Variant'}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={variantData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" style={{ fontSize: 11 }} />
              <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: '8px' 
                }} 
              />
              <Bar dataKey="profit" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={language === 'es' ? 'Distribución Win/Loss' : 'Win/Loss Distribution'}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: '8px' 
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={language === 'es' ? 'Profit por Ubicación' : 'Profit by Location'}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" style={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" style={{ fontSize: 11 }} width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: '8px' 
                }} 
              />
              <Bar dataKey="profit" fill="hsl(var(--poker-blue))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={language === 'es' ? 'Tendencia Mensual' : 'Monthly Trend'}>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" style={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" style={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" style={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: '8px' 
                }} 
              />
              <Bar yAxisId="left" dataKey="profit" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="sessions" stroke="hsl(var(--poker-gold))" strokeWidth={2} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
