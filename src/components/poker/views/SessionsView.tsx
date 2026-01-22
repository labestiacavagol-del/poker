import { Share2, Trash2, Filter } from 'lucide-react';
import type { Session, Language, BankrollSettings } from '@/types/poker';
import { translations, variants, stakeOptions, locations } from '@/data/poker-data';
import { cn } from '@/lib/utils';

interface SessionsViewProps {
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
  onDeleteSession: (id: string) => void;
  onShareSession: (id: string) => void;
}

export function SessionsView({
  sessions,
  language,
  bankrollSettings,
  filters,
  setFilters,
  onDeleteSession,
  onShareSession
}: SessionsViewProps) {
  const t = translations[language];

  const filteredSessions = sessions.filter(s => {
    if (filters.variant !== 'all' && s.variant !== filters.variant) return false;
    if (filters.stakes !== 'all' && s.stakes !== filters.stakes) return false;
    if (filters.location !== 'all' && s.location !== filters.location) return false;
    if (filters.dateFrom && s.date < filters.dateFrom) return false;
    if (filters.dateTo && s.date > filters.dateTo) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="animate-fade-up opacity-0">
        <h2 className="text-3xl font-bold tracking-tight">{t.sessions}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'es' ? 'Historial completo de sesiones' : 'Complete session history'}
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-4 animate-fade-up opacity-0" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">
            {language === 'es' ? 'Filtros' : 'Filters'}
          </h3>
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
            placeholder="From"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="input-poker text-sm"
            placeholder="To"
          />
        </div>
      </div>

      {/* Sessions Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-up opacity-0" style={{ animationDelay: '0.2s' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">{language === 'es' ? 'Fecha' : 'Date'}</th>
                <th className="px-4 py-3 font-medium">{language === 'es' ? 'Variante' : 'Variant'}</th>
                <th className="px-4 py-3 font-medium">Stakes</th>
                <th className="px-4 py-3 font-medium">{language === 'es' ? 'Ubicación' : 'Location'}</th>
                <th className="px-4 py-3 text-right font-medium">Buy-in</th>
                <th className="px-4 py-3 text-right font-medium">Cash Out</th>
                <th className="px-4 py-3 text-right font-medium">Profit</th>
                <th className="px-4 py-3 text-right font-medium">{language === 'es' ? 'Horas' : 'Hours'}</th>
                <th className="px-4 py-3 text-right font-medium">$/hr</th>
                <th className="px-4 py-3 text-center font-medium">{language === 'es' ? 'Acción' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map(s => (
                <tr key={s.id} className="table-row">
                  <td className="px-4 py-3 text-sm">{s.date}</td>
                  <td className="px-4 py-3 text-sm">{s.variant}</td>
                  <td className="px-4 py-3 text-sm font-mono">{s.stakes}</td>
                  <td className="px-4 py-3 text-sm">{s.location}</td>
                  <td className="px-4 py-3 text-sm text-right font-mono">{bankrollSettings.currency}{s.buyIn.toFixed(0)}</td>
                  <td className="px-4 py-3 text-sm text-right font-mono">{bankrollSettings.currency}{s.cashOut.toFixed(0)}</td>
                  <td className="px-4 py-3 text-sm text-right font-mono font-semibold">
                    <span className={s.profit >= 0 ? 'badge-profit' : 'badge-loss'}>
                      {bankrollSettings.currency}{s.profit.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{s.duration}h</td>
                  <td className={cn(
                    "px-4 py-3 text-sm text-right font-mono",
                    s.duration > 0 && s.profit / s.duration >= 0 ? 'text-success' : 'text-destructive'
                  )}>
                    {bankrollSettings.currency}{s.duration > 0 ? (s.profit / s.duration).toFixed(2) : '0.00'}
                  </td>
                  <td className="px-4 py-3 text-center">
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
              {filteredSessions.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                    {language === 'es' ? 'No hay sesiones que coincidan' : 'No matching sessions'}
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
