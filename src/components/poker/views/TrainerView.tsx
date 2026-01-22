import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Language } from '@/types/poker';
import { TRAINING_SPOTS } from '@/data/poker-data';
import { cn } from '@/lib/utils';

interface TrainerViewProps {
  language: Language;
  currentSpotIndex: number;
  showAnswer: boolean;
  setCurrentSpotIndex: (v: number) => void;
  setShowAnswer: (v: boolean) => void;
}

export function TrainerView({
  language,
  currentSpotIndex,
  showAnswer,
  setCurrentSpotIndex,
  setShowAnswer
}: TrainerViewProps) {
  const spot = TRAINING_SPOTS[currentSpotIndex];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="animate-fade-up opacity-0">
        <h2 className="text-3xl font-bold tracking-tight">Training Spots</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'es' ? 'Practica situaciones comunes' : 'Practice common situations'}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 animate-fade-up opacity-0" style={{ animationDelay: '0.1s' }}>
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">
              Spot {currentSpotIndex + 1} {language === 'es' ? 'de' : 'of'} {TRAINING_SPOTS.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setCurrentSpotIndex(Math.max(0, currentSpotIndex - 1));
                  setShowAnswer(false);
                }}
                disabled={currentSpotIndex === 0}
                className="btn-secondary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCurrentSpotIndex(Math.min(TRAINING_SPOTS.length - 1, currentSpotIndex + 1));
                  setShowAnswer(false);
                }}
                disabled={currentSpotIndex === TRAINING_SPOTS.length - 1}
                className="btn-secondary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill"
              style={{ width: `${((currentSpotIndex + 1) / TRAINING_SPOTS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Spot Content */}
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">
                  {language === 'es' ? 'Situación' : 'Situation'}
                </label>
                <p className="text-xl font-semibold mt-1">{spot.situation}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">
                  {language === 'es' ? 'Tu Posición' : 'Your Position'}
                </label>
                <p className="text-lg font-semibold mt-1">{spot.position}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">
                  {language === 'es' ? 'Acción Preflop' : 'Preflop Action'}
                </label>
                <p className="text-sm mt-1 text-muted-foreground">{spot.action}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">
                  {language === 'es' ? 'Tu Mano' : 'Your Hand'}
                </label>
                <p className="text-2xl font-bold mt-1 text-primary">{spot.heroHand}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Board</label>
                <p className="text-2xl font-bold mt-1">{spot.board || '—'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide">Pot</label>
                  <p className="text-lg font-semibold mt-1">${spot.potSize}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide">Stack</label>
                  <p className="text-lg font-semibold mt-1">${spot.stackSize}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-lg font-semibold mb-4">
              {language === 'es' ? '¿Cuál es la mejor jugada?' : 'What is the best play?'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {['Fold', 'Check', 'Call', 'Bet/Raise'].map(action => (
                <button
                  key={action}
                  onClick={() => setShowAnswer(true)}
                  className={cn(
                    "px-4 py-3 rounded-xl font-medium transition-all",
                    showAnswer && spot.correctAction.toLowerCase().includes(action.toLowerCase().split('/')[0])
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-secondary hover:bg-secondary/80'
                  )}
                >
                  {action}
                </button>
              ))}
            </div>

            {showAnswer && (
              <div className="space-y-4 animate-fade-up">
                <div className="p-6 rounded-xl bg-success/10 border border-success/20">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-success mb-2">
                        {language === 'es' ? 'Acción Correcta' : 'Correct Action'}: {spot.correctAction}
                      </p>
                      <p className="text-sm text-muted-foreground">{spot.explanation}</p>
                    </div>
                  </div>
                </div>

                {spot.solverFrequencies && (
                  <div className="p-6 rounded-xl bg-secondary border border-border">
                    <h4 className="font-semibold mb-4">
                      {language === 'es' ? 'Frecuencias Solver' : 'Solver Frequencies'}
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(spot.solverFrequencies).map(([action, freq]) => (
                        <div key={action} className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground w-28">{action}</span>
                          <div className="flex-1 progress-bar">
                            <div 
                              className="progress-bar-fill"
                              style={{ width: `${freq}%` }}
                            />
                          </div>
                          <span className="text-sm font-mono font-semibold w-12 text-right">{freq}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
