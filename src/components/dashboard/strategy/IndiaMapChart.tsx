import { ChartCard } from '../ChartCard';
import type { StateProjection } from '@/hooks/useStrategyPredictor';
import { TOP_10_STATES } from '@/hooks/useStrategyPredictor';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface IndiaMapChartProps {
  data: StateProjection[];
}

// Simplified state positions for a schematic map
const statePositions: Record<string, { x: number; y: number; size: 'lg' | 'md' | 'sm' }> = {
  'Maharashtra': { x: 25, y: 55, size: 'lg' },
  'Karnataka': { x: 30, y: 70, size: 'md' },
  'Tamil Nadu': { x: 38, y: 82, size: 'md' },
  'Delhi': { x: 40, y: 28, size: 'sm' },
  'Gujarat': { x: 15, y: 45, size: 'md' },
  'Uttar Pradesh': { x: 50, y: 32, size: 'lg' },
  'Rajasthan': { x: 25, y: 35, size: 'lg' },
  'Madhya Pradesh': { x: 40, y: 45, size: 'lg' },
  'Telangana': { x: 40, y: 60, size: 'md' },
  'Kerala': { x: 32, y: 88, size: 'sm' },
  'Punjab': { x: 35, y: 18, size: 'sm' },
  'Haryana': { x: 38, y: 25, size: 'sm' },
  'West Bengal': { x: 70, y: 45, size: 'md' },
  'Odisha': { x: 62, y: 55, size: 'md' },
  'Bihar': { x: 65, y: 38, size: 'md' },
  'Jharkhand': { x: 62, y: 45, size: 'sm' },
  'Chhattisgarh': { x: 55, y: 52, size: 'md' },
  'Assam': { x: 82, y: 35, size: 'sm' },
};

export function IndiaMapChart({ data }: IndiaMapChartProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Calculate heat intensity based on projected growth
  const maxGrowth = Math.max(...data.map(d => d.projectedGrowth));
  const getIntensity = (growth: number) => Math.min(1, growth / maxGrowth);

  const sizeClasses = {
    lg: 'w-12 h-12',
    md: 'w-10 h-10',
    sm: 'w-8 h-8',
  };

  return (
    <ChartCard
      title="India Focus Map: Top 10 States"
      subtitle="Heat map showing concentration areas for focused strategy"
      variant="wide"
    >
      <div className="relative h-96 bg-gradient-to-b from-card/50 to-card/30 rounded-lg overflow-hidden border border-border/50">
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Map outline (simplified) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {/* India outline - simplified path */}
          <path
            d="M 35 10 Q 45 8 55 12 L 70 20 Q 85 25 88 40 L 85 55 Q 80 70 70 80 L 55 90 Q 40 95 30 88 L 25 75 Q 20 60 15 50 L 10 35 Q 15 20 25 12 Z"
            fill="none"
            stroke="hsl(256, 50%, 35%)"
            strokeWidth="0.5"
            opacity="0.5"
          />
        </svg>

        {/* State markers */}
        {data.map((state) => {
          const pos = statePositions[state.state];
          if (!pos) return null;

          const intensity = getIntensity(state.projectedGrowth);
          const isTop10 = state.isTop10;

          return (
            <Tooltip key={state.state}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all duration-300",
                    sizeClasses[pos.size],
                    isTop10 
                      ? "border-2 border-accent shadow-[0_0_15px_rgba(228,255,48,0.5)]" 
                      : "border border-primary/50",
                    hoveredState === state.state && "scale-125 z-10"
                  )}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    backgroundColor: isTop10 
                      ? `hsla(72, 100%, 59%, ${0.3 + intensity * 0.7})`
                      : `hsla(256, 100%, 57%, ${0.2 + intensity * 0.5})`,
                  }}
                  onMouseEnter={() => setHoveredState(state.state)}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  {/* Pulse effect for top 10 */}
                  {isTop10 && (
                    <div className="absolute inset-0 rounded-full bg-accent/30 animate-ping" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white drop-shadow-lg">
                      {state.state.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-card border-accent p-3">
                <div className="space-y-1">
                  <p className="font-bold text-accent font-display">{state.state}</p>
                  <p className="text-xs text-muted-foreground">
                    Current: {(state.currentUnits / 1000000).toFixed(2)}M units
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Projected: {(state.projectedUnits / 1000000).toFixed(2)}M units
                  </p>
                  <p className="text-xs text-accent">
                    Growth: +{state.projectedGrowth.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Infra Density: {state.infraDensity.toFixed(2)}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-card/80 backdrop-blur-sm border border-border">
          <p className="text-xs font-semibold text-foreground mb-2">Concentration Level</p>
          <div className="flex items-center gap-2">
            <div className="w-20 h-3 rounded-full bg-gradient-to-r from-primary/30 via-accent/50 to-accent" />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Top 10 indicator */}
        <div className="absolute top-4 right-4 p-3 rounded-lg bg-accent/10 border border-accent/30">
          <p className="text-xs font-semibold text-accent">🎯 Focus States: {TOP_10_STATES.length}</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {TOP_10_STATES.slice(0, 3).join(', ')}...
          </p>
        </div>
      </div>
    </ChartCard>
  );
}
