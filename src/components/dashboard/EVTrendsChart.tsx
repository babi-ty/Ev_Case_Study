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
import { ChartCard } from './ChartCard';
import type { YearlyStats } from '@/hooks/useEVData';

interface EVTrendsChartProps {
  data: YearlyStats[];
}

export function EVTrendsChart({ data }: EVTrendsChartProps) {
  const chartData = data.map(d => ({
    year: d.year,
    'EV Registrations': d.totalEV / 1000000,
    'ICE Registrations': d.totalICE / 1000000,
    'EV Penetration': d.evPenetration,
  }));

  return (
    <ChartCard
      title="EV vs ICE Adoption Trends"
      subtitle="Vehicle registrations over time (in millions)"
      variant="wide"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEV" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(72, 100%, 59%)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(72, 100%, 59%)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorICE" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(256, 100%, 57%)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="hsl(256, 100%, 57%)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(256, 50%, 30%)" opacity={0.3} />
            <XAxis
              dataKey="year"
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(256, 50%, 30%)' }}
            />
            <YAxis
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(256, 50%, 30%)' }}
              tickFormatter={(value) => `${value}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(252, 25%, 16%)',
                border: '1px solid hsl(256, 100%, 57%)',
                borderRadius: '8px',
                boxShadow: '0 0 20px hsl(256, 100%, 57%, 0.3)',
              }}
              labelStyle={{ color: 'hsl(72, 100%, 59%)', fontFamily: 'Orbitron' }}
              itemStyle={{ color: 'hsl(0, 0%, 100%)' }}
              formatter={(value: number) => [`${value.toFixed(2)}M`, '']}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span style={{ color: 'hsl(252, 15%, 65%)' }}>{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="ICE Registrations"
              stroke="hsl(256, 100%, 57%)"
              strokeWidth={2}
              fill="url(#colorICE)"
            />
            <Area
              type="monotone"
              dataKey="EV Registrations"
              stroke="hsl(72, 100%, 59%)"
              strokeWidth={2}
              fill="url(#colorEV)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
