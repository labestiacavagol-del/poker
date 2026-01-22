import { Calculator } from 'lucide-react';
import type { Language, EquityCalculation } from '@/types/poker';
import { translations } from '@/data/poker-data';

interface EquityViewProps {
  language: Language;
  equityHand1: string;
  equityHand2: string;
  equityBoard: string;
  equityResult: EquityCalculation | null;
  setEquityHand1: (v: string) => void;
  setEquityHand2: (v: string) => void;
  setEquityBoard: (v: string) => void;
  onCalculate: () => void;
}

export function EquityView({
  language,
  equityHand1,
  equityHand2,
  equityBoard,
  equityResult,
  setEquityHand1,
  setEquityHand2,
  setEquityBoard,
  onCalculate
}: EquityViewProps) {
  const t = translations[language];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="animate-fade-up opacity-0">
        <h2 className="text-3xl font-bold tracking-tight">{t.equity}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'es' ? 'Calcula equities en tiempo real' : 'Calculate equities in real-time'}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 animate-fade-up opacity-0" style={{ animationDelay: '0.1s' }}>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === 'es' ? 'Mano 1' : 'Hand 1'}
            </label>
            <input
              type="text"
              value={equityHand1}
              onChange={(e) => setEquityHand1(e.target.value)}
              placeholder="AKs, QQ, 72o..."
              className="input-poker"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === 'es' ? 'Mano 2' : 'Hand 2'}
            </label>
            <input
              type="text"
              value={equityHand2}
              onChange={(e) => setEquityHand2(e.target.value)}
              placeholder="JJ, AQo, T9s..."
              className="input-poker"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Board</label>
          <input
            type="text"
            value={equityBoard}
            onChange={(e) => setEquityBoard(e.target.value)}
            placeholder="Kh 7d 2c (opcional)"
            className="input-poker"
          />
        </div>

        <button onClick={onCalculate} className="btn-primary w-full">
          <Calculator className="w-5 h-5 inline mr-2" />
          {language === 'es' ? 'Calcular Equity' : 'Calculate Equity'}
        </button>

        {equityResult && (
          <div className="mt-8 space-y-4 animate-scale-in">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-6 rounded-xl bg-success/10 border border-success/20 text-center">
                <p className="text-sm text-muted-foreground mb-2">{equityResult.hand1}</p>
                <p className="text-4xl font-bold text-success">{equityResult.equity1}%</p>
              </div>
              <div className="p-6 rounded-xl bg-secondary border border-border text-center">
                <p className="text-sm text-muted-foreground mb-2">Tie</p>
                <p className="text-4xl font-bold text-muted-foreground">{equityResult.tie}%</p>
              </div>
              <div className="p-6 rounded-xl bg-poker-blue/10 border border-poker-blue/20 text-center">
                <p className="text-sm text-muted-foreground mb-2">{equityResult.hand2}</p>
                <p className="text-4xl font-bold text-poker-blue">{equityResult.equity2}%</p>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="mt-6">
              <div className="h-4 rounded-full bg-secondary overflow-hidden flex">
                <div 
                  className="h-full bg-success transition-all duration-500"
                  style={{ width: `${equityResult.equity1}%` }}
                />
                <div 
                  className="h-full bg-muted-foreground/30 transition-all duration-500"
                  style={{ width: `${equityResult.tie}%` }}
                />
                <div 
                  className="h-full bg-poker-blue transition-all duration-500"
                  style={{ width: `${equityResult.equity2}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Reference */}
      <div className="rounded-xl border border-border bg-card p-6 animate-fade-up opacity-0" style={{ animationDelay: '0.2s' }}>
        <h3 className="font-semibold mb-4">
          {language === 'es' ? 'Referencia Rápida' : 'Quick Reference'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-secondary">
            <p className="font-mono font-bold text-primary">AA vs KK</p>
            <p className="text-muted-foreground">~80% vs ~20%</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary">
            <p className="font-mono font-bold text-primary">AKs vs QQ</p>
            <p className="text-muted-foreground">~46% vs ~54%</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary">
            <p className="font-mono font-bold text-primary">Pair vs 2 Overs</p>
            <p className="text-muted-foreground">~55% vs ~45%</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary">
            <p className="font-mono font-bold text-primary">Set vs FD+SD</p>
            <p className="text-muted-foreground">~60% vs ~40%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
