import type { Language, HandHistory } from '@/types/poker';
import { translations } from '@/data/poker-data';

interface HandsViewProps {
  language: Language;
  handHistories: HandHistory[];
  uploadedHandText: string;
  setUploadedHandText: (v: string) => void;
  onParseHand: () => void;
}

export function HandsView({
  language,
  handHistories,
  uploadedHandText,
  setUploadedHandText,
  onParseHand
}: HandsViewProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="animate-fade-up opacity-0">
        <h2 className="text-3xl font-bold tracking-tight">Hand History Replayer</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'es' ? 'Analiza y reproduce tus manos' : 'Analyze and replay your hands'}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 animate-fade-up opacity-0" style={{ animationDelay: '0.1s' }}>
        <h3 className="font-semibold mb-4">
          {language === 'es' ? 'Subir Hand History' : 'Upload Hand History'}
        </h3>
        <textarea
          value={uploadedHandText}
          onChange={(e) => setUploadedHandText(e.target.value)}
          placeholder={language === 'es' 
            ? 'Pega aquí el texto de tu hand history...'
            : 'Paste your hand history text here...'}
          className="input-poker h-48 font-mono resize-none"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={onParseHand}
            disabled={!uploadedHandText.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {language === 'es' ? 'Analizar Mano' : 'Analyze Hand'}
          </button>
          <button
            onClick={() => setUploadedHandText('')}
            className="btn-secondary"
          >
            {language === 'es' ? 'Limpiar' : 'Clear'}
          </button>
        </div>
      </div>

      {handHistories.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 animate-fade-up opacity-0" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-semibold mb-4">
            {language === 'es' ? 'Manos Guardadas' : 'Saved Hands'} ({handHistories.length})
          </h3>
          <div className="space-y-3">
            {handHistories.slice(0, 10).map(hand => (
              <div key={hand.id} className="p-4 rounded-xl bg-secondary border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{hand.date}</span>
                    <span className="px-2 py-1 bg-background rounded text-xs font-mono">{hand.stakes}</span>
                    {hand.equity && (
                      <span className="px-2 py-1 bg-success/10 border border-success/20 rounded text-xs font-semibold text-success">
                        {hand.equity.toFixed(1)}% equity
                      </span>
                    )}
                    {hand.solverAction && (
                      <span className="px-2 py-1 bg-poker-blue/10 border border-poker-blue/20 rounded text-xs font-semibold text-poker-blue">
                        Solver: {hand.solverAction}
                      </span>
                    )}
                  </div>
                  <span className={`font-mono font-semibold ${hand.result >= 0 ? 'text-success' : 'text-destructive'}`}>
                    ${hand.result?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <details className="text-sm">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                    {language === 'es' ? 'Ver detalles' : 'View details'}
                  </summary>
                  <pre className="mt-3 text-xs text-muted-foreground whitespace-pre-wrap font-mono p-3 rounded-lg bg-background">
                    {hand.handText}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
