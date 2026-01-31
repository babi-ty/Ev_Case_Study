import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { ChartCard } from '../ChartCard';
import type { WaterfallItem } from '@/hooks/useStrategyPredictor';

interface WaterfallChartProps {
  data: WaterfallItem[];
}

export function WaterfallChart({ data }: WaterfallChartProps) {
  // Transform data for waterfall effect
  const chartData = data.map((item, index) => {
    if (index === 0 || item.isTotal) {
      return {
        name: item.name,
        value: item.value,
        invisible: 0,
        displayValue: item.value,
        color: item.color,
        isTotal: item.isTotal,
      };
    }
    
    const prevCumulative = data[index - 1].cumulative;
    return {
      name: item.name,
      value: item.value,
      invisible: prevCumulative - item.value,
      displayValue: item.value,
      color: item.color,
      isTotal: false,
    };
  });

  const colors = {
    baseline: 'hsl(252, 25%, 35%)',
    infrastructure: 'hsl(256, 100%, 57%)',
    policy: 'hsl(207, 100%, 50%)',
    marketing: 'hsl(72, 100%, 59%)',
    demand: 'hsl(180, 70%, 50%)',
    total: 'hsl(72, 100%, 59%)',
  };

  return (
    <ChartCard
      title="Growth Alpha Breakdown"
      subtitle="Sources of additional growth from focused strategy"
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(256, 50%, 30%)" opacity={0.3} vertical={false} />
            <XAxis
              dataKey="name"
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 10 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
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
              formatter={(value: number, name: string) => {
                if (name === 'invisible') return [null, null];
                return [`${(value / 1000000).toFixed(2)}M units`, 'Contribution'];
              }}
            />
            {/* Invisible bar for stacking effect */}
            <Bar dataKey="invisible" stackId="stack" fill="transparent" />
            {/* Visible value bar */}
            <Bar dataKey="value" stackId="stack" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isTotal ? colors.total : entry.color}
                  opacity={entry.isTotal ? 1 : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.infrastructure }} />
          <span className="text-muted-foreground">Infrastructure</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.policy }} />
          <span className="text-muted-foreground">Policy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.marketing }} />
          <span className="text-muted-foreground">Marketing</span>
        </div>
      </div>
    </ChartCard>
  );
}
