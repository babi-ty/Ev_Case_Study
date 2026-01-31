import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { ChartCard } from './ChartCard';
import type { YearlyStats } from '@/hooks/useEVData';

interface PenetrationChartProps {
  data: YearlyStats[];
}

export function PenetrationChart({ data }: PenetrationChartProps) {
  const chartData = data.map(d => ({
    year: d.year,
    penetration: d.evPenetration,
    growth: d.evGrowth,
  }));

  return (
    <ChartCard
      title="EV Penetration Rate"
      subtitle="Market share percentage over time"
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(256, 50%, 30%)" opacity={0.3} />
            <XAxis
              dataKey="year"
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 12 }}
            />
            <YAxis
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(252, 25%, 16%)',
                border: '1px solid hsl(207, 100%, 50%)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(72, 100%, 59%)', fontFamily: 'Orbitron' }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'Penetration']}
            />
            <ReferenceLine
              y={15}
              stroke="hsl(72, 100%, 59%)"
              strokeDasharray="5 5"
              label={{
                value: 'Target 15%',
                position: 'right',
                fill: 'hsl(72, 100%, 59%)',
                fontSize: 10,
              }}
            />
            <Line
              type="monotone"
              dataKey="penetration"
              stroke="hsl(207, 100%, 50%)"
              strokeWidth={3}
              dot={{ fill: 'hsl(207, 100%, 50%)', strokeWidth: 2, r: 4 }}
              activeDot={{
                r: 6,
                fill: 'hsl(72, 100%, 59%)',
                stroke: 'hsl(72, 100%, 59%)',
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
