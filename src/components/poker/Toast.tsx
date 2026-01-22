import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const icons = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
  };

  const Icon = icons[type];

  return (
    <div 
      className={cn(
        "fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-slide-in",
        type === 'success' && "bg-success/10 border-success/20 text-success",
        type === 'error' && "bg-destructive/10 border-destructive/20 text-destructive",
        type === 'info' && "bg-primary/10 border-primary/20 text-primary"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-background/50 rounded-full transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
