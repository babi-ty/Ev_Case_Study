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
import type { InfrastructureRecord } from '@/hooks/useEVData';

interface InfrastructureChartProps {
  data: InfrastructureRecord[];
}

export function InfrastructureChart({ data }: InfrastructureChartProps) {
  const chartData = data.slice(0, 8).map(d => ({
    state: d.state,
    stations: d.charging_stations,
    fastChargerPct: d.fast_charger_pct * 100,
    urbanCoverage: d.urban_coverage_pct * 100,
  }));

  return (
    <ChartCard
      title="Charging Infrastructure"
      subtitle="Stations by state (top 8)"
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(256, 50%, 30%)" opacity={0.3} />
            <XAxis
              dataKey="state"
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(252, 25%, 16%)',
                border: '1px solid hsl(207, 100%, 50%)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(72, 100%, 59%)', fontFamily: 'Orbitron' }}
              formatter={(value: number, name: string) => {
                if (name === 'stations') return [value.toLocaleString(), 'Charging Stations'];
                return [`${value.toFixed(0)}%`, name];
              }}
            />
            <Bar dataKey="stations" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(207, 100%, ${50 - index * 5}%)`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Infrastructure metrics */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Fast Charger</p>
          <p className="text-xl font-bold text-secondary font-display">
            {(chartData.reduce((sum, d) => sum + d.fastChargerPct, 0) / chartData.length).toFixed(0)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Urban Coverage</p>
          <p className="text-xl font-bold text-accent font-display">
            {(chartData.reduce((sum, d) => sum + d.urbanCoverage, 0) / chartData.length).toFixed(0)}%
          </p>
        </div>
      </div>
    </ChartCard>
  );
}
