import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
} from 'recharts';
import { ChartCard } from './ChartCard';

interface PolicyData {
  state: string;
  policyStartYear: number;
  subsidy: number;
  roadTaxExemption: boolean;
  registrationWaiver: boolean;
  evPenetration: number;
}

interface PolicyImpactChartProps {
  data: PolicyData[];
}

export function PolicyImpactChart({ data }: PolicyImpactChartProps) {
  const chartData = data.map(d => ({
    state: d.state,
    subsidy: d.subsidy / 1000, // Convert to thousands
    penetration: d.evPenetration,
    incentives: (d.roadTaxExemption ? 1 : 0) + (d.registrationWaiver ? 1 : 0) + (d.subsidy > 0 ? 1 : 0),
    policyYear: d.policyStartYear,
  }));

  return (
    <ChartCard
      title="Policy Impact Analysis"
      subtitle="Subsidy (₹K) vs EV Penetration (%)"
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(256, 50%, 30%)" opacity={0.3} />
            <XAxis
              dataKey="subsidy"
              type="number"
              name="Subsidy"
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 12 }}
              tickFormatter={(value) => `₹${value}K`}
              label={{
                value: 'Subsidy (₹ Thousands)',
                position: 'bottom',
                fill: 'hsl(252, 15%, 65%)',
                fontSize: 11,
              }}
            />
            <YAxis
              dataKey="penetration"
              type="number"
              name="Penetration"
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 12 }}
              tickFormatter={(value) => `${value.toFixed(0)}%`}
            />
            <ZAxis dataKey="incentives" range={[50, 200]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(252, 25%, 16%)',
                border: '1px solid hsl(256, 100%, 57%)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(72, 100%, 59%)', fontFamily: 'Orbitron' }}
              formatter={(value: number, name: string) => {
                if (name === 'Subsidy') return [`₹${value}K`, 'Subsidy'];
                if (name === 'Penetration') return [`${value.toFixed(2)}%`, 'EV Penetration'];
                return [value, name];
              }}
              labelFormatter={(label) => {
                const point = chartData.find(d => d.subsidy === label);
                return point?.state || '';
              }}
            />
            <Scatter name="States" data={chartData}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.penetration > 15
                      ? 'hsl(72, 100%, 59%)'
                      : entry.penetration > 12
                      ? 'hsl(207, 100%, 50%)'
                      : 'hsl(256, 100%, 57%)'
                  }
                  stroke="hsl(0, 0%, 100%)"
                  strokeWidth={1}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-xs text-muted-foreground">&gt;15% Penetration</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <span className="text-xs text-muted-foreground">12-15%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">&lt;12%</span>
        </div>
      </div>
    </ChartCard>
  );
}
