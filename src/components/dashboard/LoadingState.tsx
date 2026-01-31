import { Zap } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        {/* Animated logo */}
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary p-4 animate-glow-pulse">
            <Zap className="w-full h-full text-white" />
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary opacity-50 blur-xl" />
        </div>

        {/* Loading text */}
        <h2 className="text-xl font-bold font-display text-foreground mb-2">
          Loading EV Analytics
        </h2>
        <p className="text-muted-foreground text-sm">
          Processing 120,000+ data points...
        </p>

        {/* Progress bar */}
        <div className="mt-6 w-64 mx-auto">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent animate-pulse rounded-full" 
                 style={{ width: '60%', animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
