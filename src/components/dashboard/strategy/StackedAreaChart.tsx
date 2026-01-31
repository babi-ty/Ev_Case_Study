import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartCard } from '../ChartCard';
import type { StackedAreaData } from '@/hooks/useStrategyPredictor';

interface StackedAreaChartProps {
  data: StackedAreaData[];
}

export function StackedAreaChart({ data }: StackedAreaChartProps) {
  const chartData = data.filter((_, i) => i % 2 === 0 || i === data.length - 1);

  // Calculate final contribution percentages
  const finalData = data[data.length - 1];
  const totalFinal = finalData?.top10Volume + finalData?.othersVolume || 1;
  const top10Pct = ((finalData?.top10Volume || 0) / totalFinal * 100).toFixed(1);

  return (
    <ChartCard
      title="Volume Contribution: Top 10 vs Others"
      subtitle="Stacked volume over 24-month projection"
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="top10Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(72, 100%, 59%)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(72, 100%, 59%)" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="othersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(256, 100%, 57%)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="hsl(256, 100%, 57%)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(256, 50%, 30%)" opacity={0.3} />
            <XAxis
              dataKey="monthLabel"
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 11 }}
              interval={1}
            />
            <YAxis
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 11 }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(252, 25%, 16%)',
                border: '1px solid hsl(72, 100%, 59%)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(72, 100%, 59%)', fontFamily: 'Orbitron' }}
              formatter={(value: number, name: string) => [
                `${(value / 1000000).toFixed(2)}M units`,
                name === 'top10Volume' ? 'Top 10 States' : 'Other States',
              ]}
            />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => (
                <span style={{ color: 'hsl(252, 15%, 85%)', fontSize: '12px' }}>
                  {value === 'top10Volume' ? '🎯 Top 10 States' : '📍 Other States'}
                </span>
              )}
            />
            <Area
              type="monotone"
              dataKey="othersVolume"
              stackId="1"
              stroke="hsl(256, 100%, 57%)"
              fill="url(#othersGradient)"
            />
            <Area
              type="monotone"
              dataKey="top10Volume"
              stackId="1"
              stroke="hsl(72, 100%, 59%)"
              fill="url(#top10Gradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 text-center">
          <p className="text-2xl font-bold text-accent font-display">{top10Pct}%</p>
          <p className="text-xs text-muted-foreground">Top 10 Share (Month 24)</p>
        </div>
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
          <p className="text-2xl font-bold text-primary font-display">
            {(100 - parseFloat(top10Pct)).toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">Others Share (Month 24)</p>
        </div>
      </div>
    </ChartCard>
  );
}
