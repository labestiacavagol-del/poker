import { Sun, Moon, Globe } from 'lucide-react';
import type { Language, Theme, BankrollSettings } from '@/types/poker';
import { translations, currencies } from '@/data/poker-data';
import { cn } from '@/lib/utils';

interface SettingsViewProps {
  language: Language;
  theme: Theme;
  bankrollSettings: BankrollSettings;
  setLanguage: (v: Language) => void;
  setTheme: (v: Theme) => void;
  setBankrollSettings: (v: BankrollSettings) => void;
}

export function SettingsView({
  language,
  theme,
  bankrollSettings,
  setLanguage,
  setTheme,
  setBankrollSettings
}: SettingsViewProps) {
  const t = translations[language];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="animate-fade-up opacity-0">
        <h2 className="text-3xl font-bold tracking-tight">{t.settings}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'es' ? 'Personaliza tu experiencia' : 'Personalize your experience'}
        </p>
      </div>

      {/* Appearance */}
      <div className="rounded-xl border border-border bg-card p-6 animate-fade-up opacity-0" style={{ animationDelay: '0.1s' }}>
        <h3 className="font-semibold mb-4">
          {language === 'es' ? 'Apariencia' : 'Appearance'}
        </h3>
        
        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span>{t.darkMode}</span>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors",
                theme === 'dark' ? 'bg-primary' : 'bg-secondary'
              )}
            >
              <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
              )} />
            </button>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5" />
              <span>{t.language}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('es')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  language === 'es' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                )}
              >
                ES
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  language === 'en' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                )}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bankroll Settings */}
      <div className="rounded-xl border border-border bg-card p-6 animate-fade-up opacity-0" style={{ animationDelay: '0.2s' }}>
        <h3 className="font-semibold mb-4">
          {language === 'es' ? 'Configuración de Bankroll' : 'Bankroll Settings'}
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              {t.currency}
            </label>
            <select
              value={bankrollSettings.currency}
              onChange={(e) => setBankrollSettings({ ...bankrollSettings, currency: e.target.value })}
              className="input-poker"
            >
              {currencies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              {t.bankroll}
            </label>
            <input
              type="number"
              value={bankrollSettings.currentBankroll}
              onChange={(e) => setBankrollSettings({ ...bankrollSettings, currentBankroll: Number(e.target.value) })}
              className="input-poker"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              {language === 'es' ? 'Meta Mensual' : 'Monthly Goal'}
            </label>
            <input
              type="number"
              value={bankrollSettings.monthlyGoal}
              onChange={(e) => setBankrollSettings({ ...bankrollSettings, monthlyGoal: Number(e.target.value) })}
              className="input-poker"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              {language === 'es' ? 'Max Buy-in %' : 'Max Buy-in %'}
            </label>
            <input
              type="number"
              value={bankrollSettings.maxBuyInPercent}
              onChange={(e) => setBankrollSettings({ ...bankrollSettings, maxBuyInPercent: Number(e.target.value) })}
              className="input-poker"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              {language === 'es' ? 'Stop Loss Diario' : 'Daily Stop Loss'}
            </label>
            <input
              type="number"
              value={bankrollSettings.stopLossDaily}
              onChange={(e) => setBankrollSettings({ ...bankrollSettings, stopLossDaily: Number(e.target.value) })}
              className="input-poker"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              {language === 'es' ? 'Stop Loss Semanal' : 'Weekly Stop Loss'}
            </label>
            <input
              type="number"
              value={bankrollSettings.stopLossWeekly}
              onChange={(e) => setBankrollSettings({ ...bankrollSettings, stopLossWeekly: Number(e.target.value) })}
              className="input-poker"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
