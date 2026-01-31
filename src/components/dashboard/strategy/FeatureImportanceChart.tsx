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
import { ChartCard } from '../ChartCard';
import type { FeatureImportance } from '@/hooks/useStrategyPredictor';

interface FeatureImportanceChartProps {
  data: FeatureImportance[];
}

export function FeatureImportanceChart({ data }: FeatureImportanceChartProps) {
  const categoryColors: Record<string, string> = {
    Infrastructure: 'hsl(256, 100%, 57%)',
    Policy: 'hsl(207, 100%, 50%)',
    Economic: 'hsl(72, 100%, 59%)',
    Market: 'hsl(180, 70%, 50%)',
  };

  return (
    <ChartCard
      title="XGBoost Feature Importance"
      subtitle="Key drivers of EV adoption in Top 10 states"
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(256, 50%, 30%)" opacity={0.3} horizontal={true} vertical={false} />
            <XAxis
              type="number"
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 11 }}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              domain={[0, 0.35]}
            />
            <YAxis
              type="category"
              dataKey="feature"
              stroke="hsl(252, 15%, 65%)"
              tick={{ fill: 'hsl(252, 15%, 65%)', fontSize: 10 }}
              width={115}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(252, 25%, 16%)',
                border: '1px solid hsl(72, 100%, 59%)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(72, 100%, 59%)', fontFamily: 'Orbitron', fontSize: 12 }}
              formatter={(value: number, name: string, props: any) => [
                `${(value * 100).toFixed(1)}%`,
                `Importance (${props.payload.category})`,
              ]}
            />
            <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={categoryColors[entry.category]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
            <span className="text-muted-foreground">{category}</span>
          </div>
        ))}
      </div>

      {/* Insight */}
      <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-medium">Key Insight:</span> Infrastructure factors 
          (Charging Density + Fast Chargers) account for <span className="text-accent font-bold">46%</span> of 
          the model's predictive power for Top 10 state growth.
        </p>
      </div>
    </ChartCard>
  );
}
