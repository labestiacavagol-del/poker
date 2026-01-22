import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className }: ChartCardProps) {
  return (
    <div className={cn(
      "rounded-xl border border-border bg-card p-6 animate-fade-up opacity-0",
      className
    )}
    style={{ animationDelay: '0.3s' }}
    >
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}
