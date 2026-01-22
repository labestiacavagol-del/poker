import { Trophy, MapPin } from 'lucide-react';
import type { Language, Tournament } from '@/types/poker';
import { TOURNAMENT_DATABASE } from '@/data/poker-data';
import { cn } from '@/lib/utils';

interface TournamentsViewProps {
  language: Language;
  onSelectTournament: (tournament: Tournament) => void;
}

export function TournamentsView({ language, onSelectTournament }: TournamentsViewProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="animate-fade-up opacity-0">
        <h2 className="text-3xl font-bold tracking-tight">
          {language === 'es' ? 'Base de Torneos' : 'Tournament Database'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'es' 
            ? 'Selecciona un torneo para registrar resultados' 
            : 'Select a tournament to log results'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOURNAMENT_DATABASE.map((tournament, i) => (
          <div
            key={tournament.id}
            onClick={() => onSelectTournament(tournament)}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-border bg-card p-5 cursor-pointer transition-all duration-300",
              "hover:border-primary/30 hover:shadow-lg animate-fade-up opacity-0"
            )}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {tournament.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {tournament.location}
                  </div>
                </div>
                <Trophy className="w-5 h-5 text-poker-gold opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buy-in</span>
                  <span className="font-mono font-semibold text-primary">${tournament.buyIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === 'es' ? 'Estructura' : 'Structure'}
                  </span>
                  <span className="font-medium">{tournament.structure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Entries</span>
                  <span className="font-mono">{tournament.avgEntries.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
