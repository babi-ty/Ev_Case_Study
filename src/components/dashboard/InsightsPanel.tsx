import { Lightbulb, TrendingUp, AlertTriangle, Target, Zap } from 'lucide-react';
import { ChartCard } from './ChartCard';
import type { KPIs, StateStats, SegmentStats } from '@/hooks/useEVData';
import { cn } from '@/lib/utils';

interface InsightsPanelProps {
  kpis: KPIs;
  stateStats: StateStats[];
  segmentStats: SegmentStats[];
}

interface InsightItem {
  icon: React.ElementType;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'insight';
}

export function InsightsPanel({ kpis, stateStats, segmentStats }: InsightsPanelProps) {
  const topState = stateStats[0];
  const bottomState = stateStats[stateStats.length - 1];
  const topSegment = segmentStats[0];

  const insights: InsightItem[] = [
    {
      icon: Target,
      title: 'Market Position',
      description: `National EV penetration stands at ${kpis.nationalPenetration.toFixed(1)}%, ${kpis.nationalPenetration > 15 ? 'exceeding' : 'approaching'} the 15% mainstream adoption threshold.`,
      type: kpis.nationalPenetration > 15 ? 'positive' : 'insight',
    },
    {
      icon: TrendingUp,
      title: 'Leading State',
      description: `${topState?.state || 'N/A'} leads with ${topState?.evPenetration.toFixed(1) || 0}% EV penetration, serving as a model for other states.`,
      type: 'positive',
    },
    {
      icon: Zap,
      title: 'Segment Dominance',
      description: `${topSegment?.segment === '2W' ? 'Two-wheelers' : topSegment?.segment === '3W' ? 'Three-wheelers' : 'Four-wheelers'} dominate EV adoption at ${topSegment?.evPenetration.toFixed(1) || 0}% penetration rate.`,
      type: 'insight',
    },
    {
      icon: AlertTriangle,
      title: 'Growth Opportunity',
      description: `${bottomState?.state || 'N/A'} at ${bottomState?.evPenetration.toFixed(1) || 0}% represents significant untapped potential for EV expansion.`,
      type: 'warning',
    },
    {
      icon: Lightbulb,
      title: 'Displacement Ratio',
      description: `Current ICE:EV ratio of ${kpis.displacementRatio.toFixed(1)}:1 indicates ${kpis.displacementRatio > 10 ? 'high resistance' : 'moderate acceptance'} to EV transition.`,
      type: kpis.displacementRatio > 10 ? 'warning' : 'positive',
    },
  ];

  const typeConfig = {
    positive: {
      bg: 'bg-accent/10',
      border: 'border-accent/30',
      iconColor: 'text-accent',
    },
    warning: {
      bg: 'bg-destructive/10',
      border: 'border-destructive/30',
      iconColor: 'text-destructive',
    },
    insight: {
      bg: 'bg-secondary/10',
      border: 'border-secondary/30',
      iconColor: 'text-secondary',
    },
  };

  return (
    <ChartCard
      title="Key Insights & Interpretation"
      subtitle="AI-driven analysis of EV adoption patterns"
      variant="tall"
    >
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const config = typeConfig[insight.type];
          const Icon = insight.icon;
          
          return (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02]",
                config.bg,
                config.border
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg", config.bg)}>
                  <Icon className={cn("w-4 h-4", config.iconColor)} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground mb-1 font-display">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3 font-display">
          Quick Stats
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-xs text-muted-foreground">Total EV Registrations</p>
            <p className="text-lg font-bold text-primary font-display">
              {(kpis.totalEVRegistrations / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30">
            <p className="text-xs text-muted-foreground">Charging Stations</p>
            <p className="text-lg font-bold text-secondary font-display">
              {kpis.totalChargingStations.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
