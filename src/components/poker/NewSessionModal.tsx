import { X } from 'lucide-react';
import type { Language, Tournament } from '@/types/poker';
import { translations, variants, stakeOptions, locations } from '@/data/poker-data';

interface NewSessionModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  newSession: {
    date: string;
    variant: string;
    stakes: string;
    location: string;
    buyIn: number;
    cashOut: number;
    duration: number;
    notes: string;
    isTournament: boolean;
    position: number;
    entries: number;
  };
  setNewSession: (session: any) => void;
  selectedTournament: Tournament | null;
}

export function NewSessionModal({
  language,
  isOpen,
  onClose,
  onAdd,
  newSession,
  setNewSession,
  selectedTournament
}: NewSessionModalProps) {
  if (!isOpen) return null;

  const t = translations[language];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">{t.newSession}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {selectedTournament && (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium text-primary">{selectedTournament.name}</p>
              <p className="text-xs text-muted-foreground">{selectedTournament.location} • ${selectedTournament.buyIn}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === 'es' ? 'Fecha' : 'Date'}
              </label>
              <input
                type="date"
                value={newSession.date}
                onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                className="input-poker"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === 'es' ? 'Duración (horas)' : 'Duration (hours)'}
              </label>
              <input
                type="number"
                value={newSession.duration}
                onChange={(e) => setNewSession({ ...newSession, duration: Number(e.target.value) })}
                className="input-poker"
                min="0"
                step="0.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === 'es' ? 'Variante' : 'Variant'}
              </label>
              <select
                value={newSession.variant}
                onChange={(e) => setNewSession({ ...newSession, variant: e.target.value })}
                className="input-poker"
              >
                {variants.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Stakes</label>
              <select
                value={newSession.stakes}
                onChange={(e) => setNewSession({ ...newSession, stakes: e.target.value })}
                className="input-poker"
              >
                {stakeOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === 'es' ? 'Ubicación' : 'Location'}
            </label>
            <select
              value={newSession.location}
              onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
              className="input-poker"
            >
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Buy-in</label>
              <input
                type="number"
                value={newSession.buyIn}
                onChange={(e) => setNewSession({ ...newSession, buyIn: Number(e.target.value) })}
                className="input-poker"
                min="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Cash Out</label>
              <input
                type="number"
                value={newSession.cashOut}
                onChange={(e) => setNewSession({ ...newSession, cashOut: Number(e.target.value) })}
                className="input-poker"
                min="0"
              />
            </div>
          </div>

          {/* Profit Preview */}
          <div className="p-4 rounded-xl bg-secondary">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Profit</span>
              <span className={`text-xl font-bold font-mono ${newSession.cashOut - newSession.buyIn >= 0 ? 'text-success' : 'text-destructive'}`}>
                ${(newSession.cashOut - newSession.buyIn).toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === 'es' ? 'Notas' : 'Notes'}
            </label>
            <textarea
              value={newSession.notes}
              onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
              placeholder={language === 'es' ? 'Notas opcionales...' : 'Optional notes...'}
              className="input-poker h-24 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border">
          <button onClick={onClose} className="btn-secondary flex-1">
            {language === 'es' ? 'Cancelar' : 'Cancel'}
          </button>
          <button onClick={onAdd} className="btn-primary flex-1">
            {language === 'es' ? 'Agregar Sesión' : 'Add Session'}
          </button>
        </div>
      </div>
    </div>
  );
}
