import { ChartCard } from '../ChartCard';
import type { SlopeGraphData } from '@/hooks/useStrategyPredictor';
import { cn } from '@/lib/utils';

interface SlopeGraphProps {
  data: SlopeGraphData[];
}

export function SlopeGraph({ data }: SlopeGraphProps) {
  const maxRank = Math.max(...data.map(d => Math.max(d.rankBefore, d.rankAfter)));
  
  // Calculate positions
  const getY = (rank: number) => ((rank - 1) / (maxRank - 1)) * 100;

  return (
    <ChartCard
      title="State Ranking Shift: Before vs After"
      subtitle="How states move up/down in EV adoption ranking"
    >
      <div className="h-80 relative px-8">
        {/* Left column (Before) */}
        <div className="absolute left-0 top-0 bottom-8 w-24 flex flex-col justify-between">
          <p className="text-xs font-semibold text-muted-foreground text-center mb-2">Current</p>
          {data.slice(0, 10).map((item) => (
            <div
              key={`before-${item.state}`}
              className="absolute left-0 right-0 text-right pr-2"
              style={{ top: `${getY(item.rankBefore)}%` }}
            >
              <span className={cn(
                "text-xs font-medium",
                item.isTop10 ? "text-accent" : "text-muted-foreground"
              )}>
                {item.rankBefore}. {item.state.slice(0, 8)}
              </span>
            </div>
          ))}
        </div>

        {/* Right column (After) */}
        <div className="absolute right-0 top-0 bottom-8 w-24 flex flex-col justify-between">
          <p className="text-xs font-semibold text-muted-foreground text-center mb-2">Projected</p>
          {data.slice(0, 10).map((item) => (
            <div
              key={`after-${item.state}`}
              className="absolute left-0 right-0 text-left pl-2"
              style={{ top: `${getY(item.rankAfter)}%` }}
            >
              <span className={cn(
                "text-xs font-medium",
                item.isTop10 ? "text-accent" : "text-muted-foreground"
              )}>
                {item.state.slice(0, 8)} .{item.rankAfter}
              </span>
            </div>
          ))}
        </div>

        {/* SVG Lines */}
        <svg className="absolute inset-0 mx-24" style={{ left: '6rem', right: '6rem' }}>
          {data.slice(0, 10).map((item, index) => {
            const y1 = getY(item.rankBefore);
            const y2 = getY(item.rankAfter);
            const improved = item.rankAfter < item.rankBefore;
            const declined = item.rankAfter > item.rankBefore;

            return (
              <line
                key={`line-${item.state}`}
                x1="0%"
                y1={`${y1}%`}
                x2="100%"
                y2={`${y2}%`}
                stroke={
                  improved ? 'hsl(72, 100%, 59%)' :
                  declined ? 'hsl(0, 70%, 60%)' :
                  'hsl(252, 15%, 45%)'
                }
                strokeWidth={item.isTop10 ? 3 : 1.5}
                strokeOpacity={item.isTop10 ? 0.9 : 0.5}
                strokeLinecap="round"
              />
            );
          })}
          {/* Dots at endpoints */}
          {data.slice(0, 10).map((item) => (
            <>
              <circle
                key={`dot-before-${item.state}`}
                cx="0%"
                cy={`${getY(item.rankBefore)}%`}
                r={item.isTop10 ? 5 : 3}
                fill={item.isTop10 ? 'hsl(72, 100%, 59%)' : 'hsl(256, 100%, 57%)'}
              />
              <circle
                key={`dot-after-${item.state}`}
                cx="100%"
                cy={`${getY(item.rankAfter)}%`}
                r={item.isTop10 ? 5 : 3}
                fill={item.isTop10 ? 'hsl(72, 100%, 59%)' : 'hsl(256, 100%, 57%)'}
              />
            </>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-accent" />
          <span className="text-muted-foreground">Improved Rank</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-destructive" />
          <span className="text-muted-foreground">Declined Rank</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-muted-foreground" />
          <span className="text-muted-foreground">No Change</span>
        </div>
      </div>
    </ChartCard>
  );
}
