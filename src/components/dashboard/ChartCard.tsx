import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'wide' | 'tall';
}

export function ChartCard({ title, subtitle, children, className, variant = 'default' }: ChartCardProps) {
  return (
    <div className={cn(
      "chart-container relative group",
      variant === 'wide' && 'col-span-2',
      variant === 'tall' && 'row-span-2',
      className
    )}>
      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
      
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold font-display text-foreground tracking-wide">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Chart Content */}
      <div className="relative">
        {children}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary/50 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary/50 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary/50 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary/50 rounded-br-lg" />
    </div>
  );
}
