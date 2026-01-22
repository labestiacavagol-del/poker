import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  className?: string;
  delay?: number;
}

export function MetricCard({ title, value, icon: Icon, className, delay = 0 }: MetricCardProps) {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-soft animate-fade-up opacity-0",
        className
      )}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
      
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
