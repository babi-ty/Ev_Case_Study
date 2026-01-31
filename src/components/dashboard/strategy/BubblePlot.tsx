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
import { ChartCard } from '../ChartCard';
import type { BubblePlotData } from '@/hooks/useStrategyPredictor';

interface BubblePlotProps {
  data: BubblePlotData[];
}

export function BubblePlot({ data }: BubblePlotProps) {
  const top10Data = data.filter(d => d.isTop10);
  const othersData = data.filter(d => !d.isTop10);

  return (
    <ChartCard
      title="Market Entry Sweet Spot Analysis"
      subtitle="Infrastructure Density vs Sales Growth (Bubble = Population)"
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(256, 50%, 30%)" opacity={0.3} />
            <XAxis
              type="number"
              dataKey="infraDensity"
              name="Infrastructure Density"
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 11 }}
              tickFormatter={(v) => v.toFixed(1)}
              label={{
                value: 'Infra Density',
                position: 'bottom',
                fill: 'hsl(252, 15%, 65%)',
                fontSize: 10,
              }}
            />
            <YAxis
              type="number"
              dataKey="salesGrowth"
              name="Sales Growth %"
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 11 }}
              tickFormatter={(v) => `${v.toFixed(0)}%`}
              label={{
                value: 'Growth %',
                angle: -90,
                position: 'insideLeft',
                fill: 'hsl(252, 15%, 65%)',
                fontSize: 10,
              }}
            />
            <ZAxis
              type="number"
              dataKey="population"
              range={[100, 1000]}
              name="Population"
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'hsl(252, 25%, 16%)',
                border: '1px solid hsl(72, 100%, 59%)',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'Infrastructure Density') return [value.toFixed(2), name];
                if (name === 'Sales Growth %') return [`${value.toFixed(1)}%`, name];
                if (name === 'Population') return [`${value}M`, name];
                return [value, name];
              }}
              labelFormatter={(_, payload) => {
                if (payload && payload[0]) {
                  return (payload[0].payload as BubblePlotData).state;
                }
                return '';
              }}
            />
            {/* Top 10 States */}
            <Scatter name="Top 10 States" data={top10Data}>
              {top10Data.map((entry, index) => (
                <Cell
                  key={`top10-${index}`}
                  fill="hsl(72, 100%, 59%)"
                  fillOpacity={0.8}
                  stroke="hsl(72, 100%, 70%)"
                  strokeWidth={2}
                />
              ))}
            </Scatter>
            {/* Other States */}
            <Scatter name="Other States" data={othersData}>
              {othersData.map((entry, index) => (
                <Cell
                  key={`others-${index}`}
                  fill="hsl(256, 100%, 57%)"
                  fillOpacity={0.5}
                  stroke="hsl(256, 100%, 67%)"
                  strokeWidth={1}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-accent" />
          <span className="text-muted-foreground">Top 10 Focus States</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-primary opacity-60" />
          <span className="text-muted-foreground">Other States</span>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-3 p-3 rounded-lg bg-secondary/10 border border-secondary/30">
        <p className="text-xs text-muted-foreground">
          <span className="text-secondary font-medium">Sweet Spot:</span> States in the 
          <span className="text-accent"> upper-right quadrant</span> have high infrastructure 
          density and strong growth potential — ideal for focused investment.
        </p>
      </div>
    </ChartCard>
  );
}
