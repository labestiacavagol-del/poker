import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  subtitle?: string;
  color?: 'emerald' | 'red' | 'yellow' | 'blue';
  className?: string;
  delay?: number;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  subtitle, 
  color = 'emerald',
  className,
  delay = 0
}: StatCardProps) {
  const colorClasses = {
    emerald: 'text-success',
    red: 'text-destructive',
    yellow: 'text-warning',
    blue: 'text-poker-blue',
  };

  const bgClasses = {
    emerald: 'bg-success/10',
    red: 'bg-destructive/10',
    yellow: 'bg-warning/10',
    blue: 'bg-poker-blue/10',
  };

  return (
    <div 
      className={cn(
        "stat-card animate-fade-up opacity-0",
        className
      )}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-2.5 rounded-xl transition-transform hover:scale-110",
          bgClasses[color]
        )}>
          <div className={colorClasses[color]}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            trend === 'up' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          )}>
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend === 'up' ? '+' : '-'}
          </div>
        )}
      </div>
      
      <p className="text-xs font-medium text-muted-foreground mb-1">{title}</p>
      <p className={cn("text-2xl font-bold tracking-tight", colorClasses[color])}>
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
      )}
    </div>
  );
}
