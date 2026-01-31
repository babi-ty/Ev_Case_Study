import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface StrategyKPICardProps {
  title: string;
  current: string;
  focused: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  subtitle?: string;
}

export function StrategyKPICard({
  title,
  current,
  focused,
  delta,
  deltaType = 'neutral',
  icon,
  subtitle,
}: StrategyKPICardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-card/80 backdrop-blur-sm border border-border p-5 group hover:border-primary/50 transition-all duration-300">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        </div>

        {/* Values comparison */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current</p>
            <p className="text-xl font-bold font-display text-foreground/70">{current}</p>
          </div>
          <div>
            <p className="text-xs text-accent mb-1">Focused</p>
            <p className="text-xl font-bold font-display text-accent">{focused}</p>
          </div>
        </div>

        {/* Delta */}
        {delta && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            deltaType === 'positive' && "text-accent",
            deltaType === 'negative' && "text-destructive",
            deltaType === 'neutral' && "text-muted-foreground"
          )}>
            {deltaType === 'positive' && <ArrowUp className="w-4 h-4" />}
            {deltaType === 'negative' && <ArrowDown className="w-4 h-4" />}
            {deltaType === 'neutral' && <Minus className="w-4 h-4" />}
            <span>{delta}</span>
          </div>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
        )}
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 right-0 w-16 h-16">
        <div className="absolute top-2 right-2 w-2 h-2 bg-primary/50 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
