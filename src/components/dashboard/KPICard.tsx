import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  delta: string;
  status: 'good' | 'bad' | 'neutral';
  insight: string;
  icon?: React.ReactNode;
}

export function KPICard({ title, value, delta, status, insight, icon }: KPICardProps) {
  const statusConfig = {
    good: {
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/50',
      icon: TrendingUp,
      glow: 'shadow-[0_0_20px_hsl(72_100%_59%/0.3)]',
    },
    bad: {
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/50',
      icon: TrendingDown,
      glow: 'shadow-[0_0_20px_hsl(0_84%_60%/0.3)]',
    },
    neutral: {
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/50',
      icon: Minus,
      glow: 'shadow-[0_0_20px_hsl(207_100%_50%/0.3)]',
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className={cn(
      "stat-card group relative",
      config.glow
    )}>
      {/* Top accent bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-1 rounded-t-xl", config.bgColor)} />
      
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 rounded-xl pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header with icon */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground font-display">
            {title}
          </span>
          {icon && (
            <div className={cn("p-2 rounded-lg", config.bgColor)}>
              {icon}
            </div>
          )}
        </div>

        {/* Main Value */}
        <div className="mb-3">
          <span className="text-4xl font-bold font-display text-foreground">
            {value}
          </span>
        </div>

        {/* Delta indicator */}
        <div className={cn("flex items-center gap-2 mb-3", config.color)}>
          <StatusIcon className="w-4 h-4" />
          <span className="text-sm font-semibold">{delta}</span>
        </div>

        {/* Insight */}
        <p className="text-sm text-muted-foreground italic">
          {insight}
        </p>
      </div>

      {/* Decorative corner */}
      <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute -bottom-8 -right-8 w-16 h-16 rotate-45",
          config.bgColor,
          "opacity-50"
        )} />
      </div>
    </div>
  );
}
