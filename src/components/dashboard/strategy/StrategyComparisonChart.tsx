import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Legend,
} from 'recharts';
import { ChartCard } from '../ChartCard';
import type { StrategyProjection } from '@/hooks/useStrategyPredictor';

interface StrategyComparisonChartProps {
  data: StrategyProjection[];
}

export function StrategyComparisonChart({ data }: StrategyComparisonChartProps) {
  // Format for display
  const chartData = data.filter((_, i) => i % 2 === 0 || i === data.length - 1);

  return (
    <ChartCard
      title="Strategy Comparison: 24-Month Projection"
      subtitle="Cumulative EV registrations under both strategies"
      variant="wide"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="focusedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(72, 100%, 59%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(72, 100%, 59%)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(252, 15%, 65%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(252, 15%, 65%)" stopOpacity={0.05} />
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
                name === 'focusedStrategy' ? 'Focused Strategy' : 'Current Strategy',
              ]}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span style={{ color: 'hsl(252, 15%, 85%)', fontSize: '12px' }}>
                  {value === 'focusedStrategy' ? '🎯 Focused Strategy' : '📊 Current Strategy'}
                </span>
              )}
            />
            <Area
              type="monotone"
              dataKey="currentStrategy"
              stroke="hsl(252, 15%, 55%)"
              strokeWidth={2}
              fill="url(#currentGradient)"
              strokeDasharray="5 5"
            />
            <Area
              type="monotone"
              dataKey="focusedStrategy"
              stroke="hsl(72, 100%, 59%)"
              strokeWidth={3}
              fill="url(#focusedGradient)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Delta indicator */}
      {data.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/30">
          <p className="text-sm">
            <span className="text-accent font-bold font-display">
              +{((data[data.length - 1].delta / data[data.length - 1].currentStrategy) * 100).toFixed(1)}% Growth Alpha
            </span>
            <span className="text-muted-foreground ml-2">
              ({(data[data.length - 1].delta / 1000000).toFixed(2)}M additional units by Month 24)
            </span>
          </p>
        </div>
      )}
    </ChartCard>
  );
}
