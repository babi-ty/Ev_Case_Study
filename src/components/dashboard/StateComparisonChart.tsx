import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartCard } from './ChartCard';
import type { StateStats } from '@/hooks/useEVData';

interface StateComparisonChartProps {
  data: StateStats[];
}

export function StateComparisonChart({ data }: StateComparisonChartProps) {
  const chartData = data.slice(0, 10).map(d => ({
    state: d.state,
    penetration: d.evPenetration,
    evCount: d.totalEV / 1000000,
  }));

  const colors = [
    'hsl(72, 100%, 59%)',
    'hsl(72, 100%, 55%)',
    'hsl(72, 100%, 50%)',
    'hsl(207, 100%, 50%)',
    'hsl(207, 100%, 45%)',
    'hsl(256, 100%, 57%)',
    'hsl(256, 100%, 52%)',
    'hsl(256, 100%, 47%)',
    'hsl(256, 100%, 42%)',
    'hsl(256, 100%, 37%)',
  ];

  return (
    <ChartCard
      title="Top 10 States by EV Penetration"
      subtitle="Market leaders in electric vehicle adoption"
      variant="wide"
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 80, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(256, 50%, 30%)" opacity={0.3} horizontal={true} vertical={false} />
            <XAxis
              type="number"
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              type="category"
              dataKey="state"
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 11 }}
              width={75}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(252, 25%, 16%)',
                border: '1px solid hsl(72, 100%, 59%)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(72, 100%, 59%)', fontFamily: 'Orbitron' }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'EV Penetration']}
            />
            <Bar dataKey="penetration" radius={[0, 4, 4, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
