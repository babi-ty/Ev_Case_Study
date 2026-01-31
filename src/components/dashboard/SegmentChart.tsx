import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartCard } from './ChartCard';
import type { SegmentStats } from '@/hooks/useEVData';

interface SegmentChartProps {
  data: SegmentStats[];
}

const SEGMENT_NAMES: Record<string, string> = {
  '2W': 'Two-Wheeler',
  '3W': 'Three-Wheeler',
  '4W': 'Four-Wheeler',
};

const COLORS = [
  'hsl(72, 100%, 59%)',
  'hsl(207, 100%, 50%)',
  'hsl(256, 100%, 57%)',
  'hsl(280, 100%, 65%)',
];

export function SegmentChart({ data }: SegmentChartProps) {
  const chartData = data.map((d, i) => ({
    name: SEGMENT_NAMES[d.segment] || d.segment,
    value: d.totalEV,
    penetration: d.evPenetration,
    color: COLORS[i % COLORS.length],
  }));

  const totalEV = data.reduce((sum, d) => sum + d.totalEV, 0);

  return (
    <ChartCard
      title="EV Distribution by Segment"
      subtitle="Vehicle category breakdown"
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              strokeWidth={2}
              stroke="hsl(252, 25%, 12%)"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(252, 25%, 16%)',
                border: '1px solid hsl(256, 100%, 57%)',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [
                `${((value / totalEV) * 100).toFixed(1)}% of total EVs`,
                '',
              ]}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: 'hsl(252, 15%, 65%)' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Segment stats below chart */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
        {chartData.map((segment, i) => (
          <div key={segment.name} className="text-center">
            <div
              className="w-3 h-3 rounded-full mx-auto mb-1"
              style={{ backgroundColor: segment.color }}
            />
            <p className="text-xs text-muted-foreground">{segment.name}</p>
            <p className="text-sm font-semibold" style={{ color: segment.color }}>
              {segment.penetration.toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
