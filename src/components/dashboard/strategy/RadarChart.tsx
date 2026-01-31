import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { ChartCard } from '../ChartCard';
import type { StateRadarData } from '@/hooks/useStrategyPredictor';

interface RadarChartProps {
  data: StateRadarData[];
}

export function RadarChart({ data }: RadarChartProps) {
  // Transform data for radar chart
  const metrics = ['policy', 'infrastructure', 'demand', 'affordability', 'growth'] as const;
  const metricLabels: Record<string, string> = {
    policy: 'Policy',
    infrastructure: 'Infra',
    demand: 'Demand',
    affordability: 'Afford.',
    growth: 'Growth',
  };

  const radarData = metrics.map(metric => {
    const point: any = { metric: metricLabels[metric], fullMark: 100 };
    data.forEach(state => {
      point[state.state] = state[metric];
    });
    return point;
  });

  const colors = [
    'hsl(72, 100%, 59%)',
    'hsl(207, 100%, 50%)',
    'hsl(256, 100%, 57%)',
    'hsl(180, 70%, 50%)',
    'hsl(330, 70%, 60%)',
  ];

  return (
    <ChartCard
      title="Top 5 State Health Comparison"
      subtitle="Multi-dimensional analysis across key metrics"
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid stroke="hsl(256, 50%, 30%)" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: 'hsl(252, 15%, 55%)', fontSize: 9 }}
              tickCount={4}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(252, 25%, 16%)',
                border: '1px solid hsl(72, 100%, 59%)',
                borderRadius: '8px',
              }}
            />
            {data.map((state, index) => (
              <Radar
                key={state.state}
                name={state.state}
                dataKey={state.state}
                stroke={colors[index]}
                fill={colors[index]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => (
                <span style={{ color: 'hsl(252, 15%, 85%)', fontSize: '11px' }}>{value}</span>
              )}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>

      {/* Metrics explanation */}
      <div className="mt-3 grid grid-cols-5 gap-1 text-xs text-center">
        <div className="p-2 rounded bg-muted/10">
          <p className="text-muted-foreground">Policy</p>
          <p className="text-foreground/70">Subsidies & Waivers</p>
        </div>
        <div className="p-2 rounded bg-muted/10">
          <p className="text-muted-foreground">Infra</p>
          <p className="text-foreground/70">Charging Density</p>
        </div>
        <div className="p-2 rounded bg-muted/10">
          <p className="text-muted-foreground">Demand</p>
          <p className="text-foreground/70">Current Sales</p>
        </div>
        <div className="p-2 rounded bg-muted/10">
          <p className="text-muted-foreground">Afford.</p>
          <p className="text-foreground/70">Price Support</p>
        </div>
        <div className="p-2 rounded bg-muted/10">
          <p className="text-muted-foreground">Growth</p>
          <p className="text-foreground/70">Projected Rate</p>
        </div>
      </div>
    </ChartCard>
  );
}
