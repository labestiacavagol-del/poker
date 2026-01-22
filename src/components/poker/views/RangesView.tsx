import { BookOpen } from 'lucide-react';
import type { Language } from '@/types/poker';
import { RANGES } from '@/data/poker-data';
import { cn } from '@/lib/utils';

interface RangesViewProps {
  language: Language;
  selectedPosition: keyof typeof RANGES;
  setSelectedPosition: (v: keyof typeof RANGES) => void;
}

export function RangesView({ language, selectedPosition, setSelectedPosition }: RangesViewProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="animate-fade-up opacity-0">
        <h2 className="text-3xl font-bold tracking-tight">
          {language === 'es' ? 'Rangos GTO' : 'GTO Ranges'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'es' ? 'Rangos óptimos por posición' : 'Optimal ranges by position'}
        </p>
      </div>

      {/* Position Selector */}
      <div className="flex gap-2 flex-wrap animate-fade-up opacity-0" style={{ animationDelay: '0.1s' }}>
        {(Object.keys(RANGES) as Array<keyof typeof RANGES>).map(position => (
          <button
            key={position}
            onClick={() => setSelectedPosition(position)}
            className={cn(
              "px-4 py-2 rounded-xl font-medium transition-all",
              selectedPosition === position
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-secondary hover:bg-secondary/80'
            )}
          >
            {position.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Range Display */}
      <div className="rounded-xl border border-border bg-card p-6 animate-fade-up opacity-0" style={{ animationDelay: '0.2s' }}>
        <h3 className="font-semibold mb-4">
          {selectedPosition.replace('_', ' ')} — {RANGES[selectedPosition].length} combos
        </h3>
        <div className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-13 gap-2">
          {RANGES[selectedPosition].map(hand => (
            <div
              key={hand}
              className="hand-display hand-display-active hover:scale-110 transition-transform cursor-pointer"
            >
              {hand}
            </div>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="p-4 rounded-xl bg-poker-blue/10 border border-poker-blue/20 animate-fade-up opacity-0" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-poker-blue flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-poker-blue mb-1">
              {language === 'es' ? 'Nota Importante' : 'Important Note'}
            </p>
            <p className="text-sm text-muted-foreground">
              {language === 'es' 
                ? 'Estos rangos son aproximaciones GTO para 6-max. Ajústalos según dinámica de mesa.'
                : 'These ranges are GTO approximations for 6-max. Adjust based on table dynamics.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
